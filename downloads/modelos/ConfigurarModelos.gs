/**
 * Instalador dos modelos públicos GEIN, versão 1.
 * Só altera as cópias importadas indicadas abaixo. Leia INSTALACAO-PT.md.
 * Serviços: Google Sheets API v4; DriveApp somente para leitura.
 */
var CONFIG_MODELOS = {
  MANIFESTO_ID: 'COLE_O_ID_DO_ARQUIVO_manifesto.json_NO_DRIVE',
  IDS: {
    // Use exatamente as chaves listadas pelo manifesto do seu pacote.
    // operacional: 'ID_DA_COPIA_GOOGLE_SHEETS'
  },
  CONFIRMACAO: '' // Execute prepararInstalacao e cole aqui o código exibido.
};

var PM_VERSION = 1;
var PM_BUDGET_MS = 150000;
var PM_MAX_REQUESTS = 200;
var PM_MAX_BATCH_CHARS = 350000;
var PM_NATIVE_MIME = 'application/vnd.google-apps.spreadsheet';
var PM_ALLOWED_REQUESTS = [
  'updateCells', 'repeatCell', 'setDataValidation', 'updateBorders',
  'updateDimensionProperties', 'setBasicFilter', 'clearBasicFilter',
  'autoResizeDimensions', 'updateSheetProperties', 'updateSpreadsheetProperties',
  'mergeCells', 'unmergeCells', 'updateConditionalFormatRule',
  'updateChartSpec', 'updateEmbeddedObjectBorder', 'updateEmbeddedObjectPosition', 'addChart'
];

/** Mostra as chaves e os nomes exigidos pelo pacote, antes de preencher IDS. */
function listarComponentes() {
  var manifest = JSON.parse(DriveApp.getFileById(CONFIG_MODELOS.MANIFESTO_ID).getBlob().getDataAsString('UTF-8'));
  pmValidateManifest_(manifest);
  var ids = {};
  manifest.components.forEach(function (component) { ids[component.key] = 'COLE_O_ID_DA_COPIA'; });
  var result = {moduleId: manifest.moduleId, IDS: ids, files: manifest.components.map(function (component) { return component.filename; })};
  console.log(JSON.stringify(result, null, 2));
  return result;
}

/** Somente leitura: valida TODAS as cópias e mostra o código de confirmação. */
function prepararInstalacao() {
  var context = pmLoadContext_();
  var plan = pmBuildPlan_(context.manifest, CONFIG_MODELOS.IDS, context.copies, pmHash_);
  var summary = pmSummary_(plan);
  console.log(JSON.stringify(summary, null, 2));
  console.log('Copie para CONFIG_MODELOS.CONFIRMACAO: ' + plan.nonce);
  return summary;
}

/** Executa ou retoma. Pode ser repetida até todas as etapas terminarem. */
function executarInstalacao() {
  var startedAt = Date.now();
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) throw new Error('Outra instalação está em execução. Aguarde.');
  try {
    var context = pmLoadContext_();
    var plan = pmBuildPlan_(context.manifest, CONFIG_MODELOS.IDS, context.copies, pmHash_);
    pmAssertConfirmation_(plan, CONFIG_MODELOS.CONFIRMACAO);
    var properties = PropertiesService.getScriptProperties();
    var result = pmRunPlan_(plan, {
      now: function () { return Date.now(); },
      startedAt: startedAt,
      budgetMs: PM_BUDGET_MS,
      minIntervalMs: 1100,
      wait: function (milliseconds) { Utilities.sleep(milliseconds); },
      readMarkers: function (id) {
        var current = Sheets.Spreadsheets.get(id, {fields: 'developerMetadata'});
        return current.developerMetadata || [];
      },
      commit: function (id, requests) {
        return Sheets.Spreadsheets.batchUpdate({requests: requests}, id);
      },
      prepareRequests: function (id, requests, batch) {
        if (batch.kind === 'grid-reduction') {
          var snapshot = Sheets.Spreadsheets.get(id, {fields: 'sheets(properties(sheetId,gridProperties))'});
          return pmShrinkGridRequests_(requests, snapshot.sheets || []);
        }
        if (requests.some(function (request) { return !!request.addChart; })) {
          var chartSnapshot = Sheets.Spreadsheets.get(id, {fields: 'sheets(charts(chartId,spec(title)))'});
          return pmRestoreMissingCharts_(requests, chartSnapshot.sheets || []);
        }
        return requests;
      },
      checkpoint: function (checkpoint) {
        properties.setProperty('PM_' + plan.runId, JSON.stringify(checkpoint));
      }
    });
    console.log(JSON.stringify(result, null, 2));
    if (!result.complete) console.log('Execute executarInstalacao novamente para continuar. Não altere os IDs nem o manifesto.');
    if (result.complete) console.log('Estrutura e fórmulas restauradas. Abra as cópias e autorize cada IMPORTRANGE. A instalação não confirma recálculo nem acesso às conexões.');
    return result;
  } finally {
    lock.releaseLock();
  }
}

/** Lê o progresso real registrado nas próprias cópias. Não escreve. */
function consultarInstalacao() {
  var context = pmLoadContext_();
  var plan = pmBuildPlan_(context.manifest, CONFIG_MODELOS.IDS, context.copies, pmHash_);
  var completed = 0;
  plan.components.forEach(function (component) {
    var markers = pmMarkerMap_(context.copies[component.key].spreadsheet.developerMetadata || [], plan.markerKey);
    component.batches.forEach(function (batch) {
      if (pmBatchDone_(markers, batch)) completed++;
    });
  });
  var summary = pmSummary_(plan);
  summary.completedBatches = completed;
  summary.complete = completed === summary.totalBatches;
  summary.connections = 'PENDENTE: autorizar IMPORTRANGE e conferir o recálculo nas cópias.';
  console.log(JSON.stringify(summary, null, 2));
  return summary;
}

/** Após autorizar IMPORTRANGE e aguardar os dados: reaplica somente os gráficos. */
function restaurarGraficos() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) throw new Error('Outra instalação está em execução. Aguarde.');
  try {
    var context = pmLoadContext_();
    var plan = pmBuildPlan_(context.manifest, CONFIG_MODELOS.IDS, context.copies, pmHash_);
    pmAssertConfirmation_(plan, CONFIG_MODELOS.CONFIRMACAO);
    pmRequireInstalled_(plan, context.copies);
    var applied = 0;
    plan.components.forEach(function (component) {
      pmBatch_(pmChartRefreshRequests_(component)).forEach(function (requests) {
        // Relê IDs antes de cada lote: addChart vira atualização se já existir.
        var snapshot = Sheets.Spreadsheets.get(component.id, {fields: 'sheets(charts(chartId,spec(title)))'});
        requests = pmRestoreMissingCharts_(requests, snapshot.sheets || []);
        Sheets.Spreadsheets.batchUpdate({requests: requests}, component.id);
        applied += requests.length;
        Utilities.sleep(1100);
      });
    });
    var result = {chartRequestsApplied: applied, notice: 'Confira os gráficos com os dados carregados. Se ainda houver #REF! nas fontes, autorize as conexões, aguarde e execute restaurarGraficos novamente.'};
    console.log(JSON.stringify(result, null, 2));
    return result;
  } finally { lock.releaseLock(); }
}

function pmRequireInstalled_(plan, copies) {
  plan.components.forEach(function (component) {
    var markers = pmMarkerMap_(copies[component.key].spreadsheet.developerMetadata || [], plan.markerKey);
    if (!component.batches.every(function (batch) { return pmBatchDone_(markers, batch); })) throw new Error('Conclua executarInstalacao em todos os componentes antes de restaurar os gráficos.');
  });
}

function pmChartRefreshRequests_(component) {
  var kinds = ['addChart', 'updateChartSpec', 'updateEmbeddedObjectPosition', 'updateEmbeddedObjectBorder'];
  var requests = [];
  component.batches.forEach(function (batch) {
    batch.requests.forEach(function (request) {
      if (kinds.indexOf(Object.keys(request)[0]) !== -1) requests.push(JSON.parse(JSON.stringify(request)));
    });
  });
  return requests;
}

function pmLoadContext_() {
  if (!/^[A-Za-z0-9_-]{15,}$/.test(CONFIG_MODELOS.MANIFESTO_ID)) throw new Error('Preencha MANIFESTO_ID com o ID do JSON enviado ao Drive.');
  var manifestFile = DriveApp.getFileById(CONFIG_MODELOS.MANIFESTO_ID);
  var manifest = JSON.parse(manifestFile.getBlob().getDataAsString('UTF-8'));
  pmValidateManifest_(manifest);
  pmValidateIds_(manifest, CONFIG_MODELOS.IDS);
  var copies = {};
  manifest.components.forEach(function (component) {
    var id = CONFIG_MODELOS.IDS[component.key];
    var file = DriveApp.getFileById(id);
    copies[component.key] = {
      mimeType: file.getMimeType(),
      name: file.getName(),
      trashed: file.isTrashed(),
      spreadsheet: Sheets.Spreadsheets.get(id, {
        fields: 'spreadsheetId,properties(title,locale,timeZone),sheets(properties,charts(chartId,spec(title))),developerMetadata'
      })
    };
    var overflowRanges = pmOverflowRanges_(component, copies[component.key].spreadsheet, pmHash_(JSON.stringify(manifest)));
    if (overflowRanges.length) {
      var overflow = Sheets.Spreadsheets.Values.batchGet(id, {ranges: overflowRanges, valueRenderOption: 'FORMULA', fields: 'valueRanges(values)'});
      var occupied = (overflow.valueRanges || []).some(function (range) {
        return (range.values || []).some(function (row) { return row.some(function (value) { return value !== '' && value !== null; }); });
      });
      if (occupied) throw new Error('Há conteúdo fora das dimensões do modelo em ' + component.key + '. Nada foi alterado. Reimporte uma cópia nova.');
    }
    copies[component.key].overflowChecked = true;
  });
  return {manifest: manifest, copies: copies};
}

function pmValidateManifest_(manifest) {
  if (!manifest || manifest.schemaVersion !== PM_VERSION) throw new Error('Versão de manifesto não suportada.');
  if (!/^[a-z0-9_-]+$/i.test(manifest.moduleId || '')) throw new Error('moduleId inválido.');
  if (!Array.isArray(manifest.components) || !manifest.components.length) throw new Error('O manifesto não contém componentes.');
  var keys = {};
  manifest.components.forEach(function (component) {
    if (!/^[a-z0-9_-]+$/i.test(component.key || '') || keys[component.key]) throw new Error('Chave de componente inválida ou duplicada.');
    keys[component.key] = true;
    if (!component.filename || !/\.xlsx$/i.test(component.filename)) throw new Error('filename precisa identificar o XLSX do pacote.');
    if (!Array.isArray(component.sheets) || !component.sheets.length) throw new Error('Componente sem abas: ' + component.key);
    var sheetIds = {}, titles = {}, indexes = {};
    component.sheets.forEach(function (sheet) {
      if (!Number.isInteger(sheet.sourceSheetId) || sheet.sourceSheetId < 0 || sheetIds[sheet.sourceSheetId]) throw new Error('sourceSheetId inválido ou duplicado.');
      sheetIds[sheet.sourceSheetId] = true;
      if (!sheet.title || sheet.title.length > 100 || titles[sheet.title]) throw new Error('Título de aba inválido ou duplicado.');
      titles[sheet.title] = true;
      if (sheet.index !== undefined && (!Number.isInteger(sheet.index) || sheet.index < 0 || sheet.index >= component.sheets.length || indexes[sheet.index])) throw new Error('Índice de aba inválido ou duplicado.');
      if (sheet.index !== undefined) indexes[sheet.index] = true;
      var grid = sheet.gridProperties || {};
      ['rowCount', 'columnCount'].forEach(function (field) {
        if (!Number.isInteger(grid[field]) || grid[field] < 1) throw new Error('Dimensão ausente ou inválida: ' + component.key + '/' + sheet.title + '/' + field);
      });
    });
    if (component.sheets.every(function (sheet) { return sheet.hidden === true; })) throw new Error('Todas as abas não podem estar ocultas.');
    (component.requests || []).forEach(pmValidateRequest_);
  });
  Object.keys(manifest.tokens || {}).forEach(function (token) {
    if (!/^__[A-Z0-9_]+__$/.test(token) || !keys[manifest.tokens[token]]) throw new Error('Token inválido ou componente desconhecido: ' + token);
  });
}

function pmValidateRequest_(request) {
  var keys = Object.keys(request || {});
  if (keys.length !== 1 || PM_ALLOWED_REQUESTS.indexOf(keys[0]) === -1) throw new Error('Request não suportado: ' + keys.join(','));
  var name = keys[0], body = request[name];
  if (!body || typeof body !== 'object') throw new Error('Request inválido: ' + name);
  if (name === 'updateSheetProperties') {
    var properties = body.properties || {};
    if ('title' in properties || 'index' in properties || 'hidden' in properties || 'gridProperties' in properties) throw new Error('Título, ordem, dimensões e visibilidade devem ser definidos em sheets, não em requests.');
    if (!body.fields || body.fields === '*' || /(^|,)\s*sheetId\s*(,|$)/.test(body.fields)) throw new Error('Máscara updateSheetProperties inválida.');
  }
  if (name === 'updateSpreadsheetProperties') {
    Object.keys(body.properties || {}).forEach(function (field) {
      if (['locale', 'timeZone', 'autoRecalc', 'iterativeCalculationSettings'].indexOf(field) === -1) throw new Error('Propriedade de planilha não suportada: ' + field);
    });
  }
  if (name === 'addChart' && (!body.chart || !Number.isInteger(body.chart.chartId))) throw new Error('addChart exige chartId explicitamente declarado em sheets[].charts.');
  pmWalk_(request, function (value, key) {
    if (key === 'spreadsheetId' || key === 'dataSourceId') throw new Error('Request referencia recurso externo não permitido.');
    if (typeof value === 'string') {
      if (/docs\.google\.com\/spreadsheets\/d\/(?!__)/i.test(value)) throw new Error('Manifesto contém URL de planilha que não foi substituída por token.');
      var re = /IMPORTRANGE\s*\(\s*"([^"]+)"/ig, match;
      while ((match = re.exec(value))) {
        if (!/^(?:https:\/\/docs\.google\.com\/spreadsheets\/d\/)?__[A-Z0-9_]+__(?:\/edit(?:[?#].*)?)?$/.test(match[1])) throw new Error('IMPORTRANGE literal deve usar token do pacote.');
      }
    }
  });
}

function pmValidateIds_(manifest, ids) {
  var seen = {}, allowed = {};
  manifest.components.forEach(function (component) {
    allowed[component.key] = true;
    var id = ids[component.key];
    if (typeof id !== 'string' || !/^[A-Za-z0-9_-]{15,}$/.test(id) || /COLE_|ID_DA_/.test(id)) throw new Error('Informe ID da cópia Google Sheets para: ' + component.key);
    if (seen[id]) throw new Error('Cada componente precisa de uma cópia diferente: ID duplicado.');
    seen[id] = true;
  });
  Object.keys(ids).forEach(function (key) { if (!allowed[key]) throw new Error('Chave IDS não pertence ao pacote: ' + key); });
}

function pmBuildPlan_(manifest, ids, copies, hash) {
  pmValidateManifest_(manifest);
  pmValidateIds_(manifest, ids);
  var manifestHash = hash(JSON.stringify(manifest));
  var maps = {}, chartMaps = {}, signature = [];
  manifest.components.forEach(function (component) {
    var copy = copies[component.key];
    if (!copy || copy.trashed || copy.mimeType !== PM_NATIVE_MIME) throw new Error('Importe e salve como Google Planilhas: ' + component.filename);
    var expectedTitle = component.expectedTitle || component.filename.replace(/\.xlsx$/i, '');
    if (copy.name !== expectedTitle || copy.spreadsheet.properties.title !== expectedTitle) throw new Error('Nome da cópia incorreto em ' + component.key + '. Esperado: ' + expectedTitle + '. Use uma cópia nova do arquivo do pacote.');
    if (copy.spreadsheet.spreadsheetId !== ids[component.key]) throw new Error('ID retornado não corresponde à cópia solicitada.');
    var actualSheets = copy.spreadsheet.sheets || [];
    if (actualSheets.length !== component.sheets.length) throw new Error('Quantidade de abas difere do pacote em ' + component.key + '. Use uma importação nova sem adicionar ou remover abas.');
    var map = {}, chartMap = {}, used = {}, usedCharts = {}, totalCells = 0;
    component.sheets.forEach(function (sheet) {
      var tempTitle = pmTempTitle_(manifestHash, sheet.sourceSheetId);
      var names = [sheet.title, sheet.importTitle || sheet.title, tempTitle];
      var candidates = actualSheets.filter(function (actual) { return names.indexOf(actual.properties.title) !== -1; });
      if (candidates.length !== 1 || used[candidates[0].properties.sheetId]) throw new Error('Aba ausente ou ambígua em ' + component.key + ': ' + sheet.title + '. Confirme importTitle no manifesto.');
      var actual = candidates[0].properties;
      if (actual.sheetType && actual.sheetType !== 'GRID') throw new Error('Tipo de aba não suportado: ' + sheet.title);
      used[actual.sheetId] = true;
      map[sheet.sourceSheetId] = actual.sheetId;
      (sheet.charts || []).forEach(function (chart) {
        if (!Number.isInteger(chart.sourceChartId) || Object.prototype.hasOwnProperty.call(chartMap, chart.sourceChartId)) throw new Error('sourceChartId inválido ou duplicado.');
        var available = candidates[0].charts || [];
        var matches = Number.isInteger(chart.chartIndex) && !chart.createIfMissing ? [available[chart.chartIndex]].filter(Boolean)
          : available.filter(function (candidate) { return [chart.title, chart.importTitle || chart.title].indexOf((candidate.spec || {}).title || '') !== -1; });
        if (!matches.length && chart.createIfMissing === true && chart.title) {
          var collision = actualSheets.some(function (actualSheet) { return (actualSheet.charts || []).some(function (existing) { return existing.chartId === chart.sourceChartId; }); });
          if (collision || usedCharts[chart.sourceChartId]) throw new Error('ID do gráfico a restaurar já existe: ' + chart.sourceChartId);
          chartMap[chart.sourceChartId] = chart.sourceChartId;
          usedCharts[chart.sourceChartId] = true;
          return;
        }
        if (matches.length !== 1 || [chart.title, chart.importTitle || chart.title].indexOf((matches[0].spec || {}).title || '') === -1 || usedCharts[matches[0].chartId]) throw new Error('Gráfico ausente ou ambíguo em ' + sheet.title + ': ' + chart.title);
        chartMap[chart.sourceChartId] = matches[0].chartId;
        usedCharts[matches[0].chartId] = true;
      });
      var grid = sheet.gridProperties;
      if ((grid.rowCount < actual.gridProperties.rowCount || grid.columnCount < actual.gridProperties.columnCount) && !copy.overflowChecked) throw new Error('As células fora da grade precisam ser verificadas antes da restauração.');
      totalCells += grid.rowCount * grid.columnCount;
    });
    if (totalCells > 10000000) throw new Error('A restauração excederia 10 milhões de células em ' + component.key + '. Reimporte o arquivo e tente novamente.');
    maps[component.key] = map;
    chartMaps[component.key] = chartMap;
    signature.push({key: component.key, id: ids[component.key], sheetIds: map, chartIds: chartMap});
  });
  var runId = hash(manifestHash + JSON.stringify(signature)).slice(0, 24);
  var plan = {moduleId: manifest.moduleId, runId: runId, nonce: 'INSTALAR-' + runId.toUpperCase(), markerKey: 'portfolio-package-' + runId, components: []};
  manifest.components.forEach(function (component) {
    var requests = [], reductions = [], map = maps[component.key];
    component.sheets.forEach(function (sheet) {
      reductions.push({updateSheetProperties: {properties: {
        sheetId: map[sheet.sourceSheetId], gridProperties: {rowCount: sheet.gridProperties.rowCount, columnCount: sheet.gridProperties.columnCount}
      }, fields: 'gridProperties.rowCount,gridProperties.columnCount'}});
    });
    // Renomear primeiro evita colisões e restaura nomes truncados pelo formato XLSX.
    component.sheets.forEach(function (sheet) {
      requests.push({updateSheetProperties: {properties: {sheetId: map[sheet.sourceSheetId], title: pmTempTitle_(manifestHash, sheet.sourceSheetId)}, fields: 'title'}});
    });
    component.sheets.forEach(function (sheet, i) {
      var originalGrid = sheet.gridProperties;
      var grid = {};
      ['rowCount', 'columnCount', 'frozenRowCount', 'frozenColumnCount', 'hideGridlines', 'rowGroupControlAfter', 'columnGroupControlAfter'].forEach(function (field) {
        if (originalGrid[field] !== undefined) grid[field] = originalGrid[field];
      });
      requests.push({updateSheetProperties: {
        properties: {sheetId: map[sheet.sourceSheetId], title: sheet.title, index: sheet.index === undefined ? i : sheet.index, hidden: sheet.hidden === true, gridProperties: grid},
        fields: 'title,index,hidden,' + Object.keys(grid).map(function (field) { return 'gridProperties.' + field; }).join(',')
      }});
    });
    var spreadsheetProperties = {};
    ['locale', 'timeZone', 'autoRecalc', 'iterativeCalculationSettings'].forEach(function (field) {
      if (component.spreadsheetProperties && component.spreadsheetProperties[field] !== undefined) spreadsheetProperties[field] = component.spreadsheetProperties[field];
    });
    if (Object.keys(spreadsheetProperties).length) {
      var initialProperties = JSON.parse(JSON.stringify(spreadsheetProperties));
      if (component.formulaLocale) initialProperties.locale = component.formulaLocale;
      requests.push({updateSpreadsheetProperties: {properties: initialProperties, fields: Object.keys(initialProperties).join(',')}});
    }
    (component.requests || []).forEach(function (request) {
      if (request.addChart) {
        var declared = component.sheets.some(function (sheet) { return (sheet.charts || []).some(function (chart) { return chart.sourceChartId === request.addChart.chart.chartId && chart.createIfMissing === true; }); });
        if (!declared) throw new Error('addChart só é permitido para um gráfico declarado createIfMissing:true.');
      }
      requests.push(pmRemap_(request, map, manifest.tokens || {}, ids, undefined, chartMaps[component.key]));
    });
    if (component.formulaLocale && spreadsheetProperties.locale) requests.push({updateSpreadsheetProperties: {properties: {locale: spreadsheetProperties.locale}, fields: 'locale'}});
    var batches = pmBatch_(reductions).map(function (batch) { return {kind:'grid-reduction', requests:batch}; })
      .concat(pmBatch_(requests).map(function (batch) { return {kind:'restore', requests:batch}; }))
      .map(function (batch, index) {
      return {index: index, kind:batch.kind, checksum: hash(batch.kind + JSON.stringify(batch.requests)).slice(0, 24), requests: batch.requests};
    });
    plan.components.push({key: component.key, id: ids[component.key], filename: component.filename, batches: batches, sheetMap: map});
  });
  return plan;
}

function pmTempTitle_(manifestHash, sourceSheetId) { return '__PKG_' + manifestHash.slice(0, 8) + '_' + sourceSheetId + '__'; }

function pmOverflowRanges_(component, spreadsheet, manifestHash) {
  var ranges = [];
  component.sheets.forEach(function (sheet) {
    var names = [sheet.title, sheet.importTitle || sheet.title, pmTempTitle_(manifestHash, sheet.sourceSheetId)];
    var matches = (spreadsheet.sheets || []).filter(function (actual) { return names.indexOf(actual.properties.title) !== -1; });
    if (matches.length !== 1) return; // pmBuildPlan_ apresenta o diagnóstico preciso.
    var actual = matches[0].properties, grid = actual.gridProperties || {}, wanted = sheet.gridProperties;
    var title = "'" + actual.title.replace(/'/g, "''") + "'!";
    if (grid.rowCount > wanted.rowCount) ranges.push(title + 'A' + (wanted.rowCount + 1) + ':' + pmColumn_(grid.columnCount) + grid.rowCount);
    if (grid.columnCount > wanted.columnCount) ranges.push(title + pmColumn_(wanted.columnCount + 1) + '1:' + pmColumn_(grid.columnCount) + Math.min(wanted.rowCount, grid.rowCount));
  });
  return ranges;
}

function pmColumn_(oneBased) {
  var name = '';
  for (var n = oneBased; n > 0; n = Math.floor((n - 1) / 26)) name = String.fromCharCode(65 + (n - 1) % 26) + name;
  return name;
}

function pmShrinkGridRequests_(requests, actualSheets) {
  var grids = {};
  actualSheets.forEach(function (sheet) { grids[sheet.properties.sheetId] = sheet.properties.gridProperties; });
  return requests.map(function (request) {
    var result = JSON.parse(JSON.stringify(request));
    var properties = result.updateSheetProperties.properties;
    var current = grids[properties.sheetId];
    if (!current) throw new Error('Aba desapareceu antes da redução da grade.');
    var grid = properties.gridProperties;
    grid.rowCount = Math.min(grid.rowCount, current.rowCount);
    grid.columnCount = Math.min(grid.columnCount, current.columnCount);
    grid.frozenRowCount = Math.min(current.frozenRowCount || 0, grid.rowCount - 1);
    grid.frozenColumnCount = Math.min(current.frozenColumnCount || 0, grid.columnCount - 1);
    result.updateSheetProperties.fields += ',gridProperties.frozenRowCount,gridProperties.frozenColumnCount';
    return result;
  });
}

function pmRestoreMissingCharts_(requests, actualSheets) {
  var existing = {};
  actualSheets.forEach(function (sheet) { (sheet.charts || []).forEach(function (chart) { existing[chart.chartId] = chart; }); });
  var result = [];
  requests.forEach(function (request) {
    if (!request.addChart) { result.push(request); return; }
    var chart = request.addChart.chart, present = existing[chart.chartId];
    if (!present) { result.push(request); return; }
    if ((present.spec || {}).title !== (chart.spec || {}).title) throw new Error('Colisão de ID em gráfico existente. Nada será sobrescrito.');
    result.push({updateChartSpec: {chartId:chart.chartId,spec:chart.spec}});
    if (chart.position) result.push({updateEmbeddedObjectPosition: {objectId:chart.chartId,newPosition:chart.position,fields:'*'}});
    if (chart.border) result.push({updateEmbeddedObjectBorder: {objectId:chart.chartId,border:chart.border,fields:'*'}});
  });
  return result;
}

function pmRemap_(value, sheetMap, tokens, ids, key, chartMap) {
  if (Array.isArray(value)) return value.map(function (item) { return pmRemap_(item, sheetMap, tokens, ids, key === 'sheetIds' ? 'sheetId' : undefined, chartMap); });
  if (value && typeof value === 'object') {
    var result = {};
    Object.keys(value).forEach(function (field) { result[field] = pmRemap_(value[field], sheetMap, tokens, ids, field, chartMap); });
    return result;
  }
  if (key === 'sheetId' || key === 'sourceSheetId') {
    if (!Object.prototype.hasOwnProperty.call(sheetMap, value)) throw new Error('Request usa aba ausente: ' + value);
    return sheetMap[value];
  }
  if (key === 'chartId' || key === 'objectId') {
    if (!chartMap || !Object.prototype.hasOwnProperty.call(chartMap, value)) throw new Error('Request usa gráfico não declarado: ' + value);
    return chartMap[value];
  }
  if (typeof value === 'string') {
    var tokenized = value.replace(/__[A-Z0-9_]+__/g, function (token) {
      if (!Object.prototype.hasOwnProperty.call(tokens, token)) throw new Error('Token não definido: ' + token);
      return ids[tokens[token]];
    });
    return tokenized.replace(/(^|["'])#gid=(\d+)/g, function (match, prefix, sourceId) {
      if (!Object.prototype.hasOwnProperty.call(sheetMap, sourceId)) throw new Error('Link interno aponta para aba não declarada: ' + sourceId);
      return prefix + '#gid=' + sheetMap[sourceId];
    });
  }
  return value;
}

function pmBatch_(requests) {
  var batches = [], current = [], chars = 0;
  requests.forEach(function (request) {
    var size = JSON.stringify(request).length;
    if (size > PM_MAX_BATCH_CHARS) throw new Error('Request grande demais. Divida updateCells em blocos no manifesto.');
    // O parser pode usar a localidade anterior durante toda uma chamada.
    // Aplicar e restaurar a localidade em chamadas separadas das fórmulas.
    if (request.updateSpreadsheetProperties && Object.prototype.hasOwnProperty.call(request.updateSpreadsheetProperties.properties || {}, 'locale')) {
      if (current.length) { batches.push(current); current = []; chars = 0; }
      batches.push([request]);
      return;
    }
    if (current.length && (current.length >= PM_MAX_REQUESTS || chars + size > PM_MAX_BATCH_CHARS)) {
      batches.push(current); current = []; chars = 0;
    }
    current.push(request); chars += size;
  });
  if (current.length) batches.push(current);
  return batches;
}

function pmAssertConfirmation_(plan, confirmation) {
  if (confirmation !== plan.nonce) throw new Error('Confirmação não corresponde às cópias e ao manifesto. Execute prepararInstalacao, confira os arquivos e copie o código exibido.');
}

function pmRunPlan_(plan, runtime) {
  var total = plan.components.reduce(function (sum, component) { return sum + component.batches.length; }, 0);
  var completed = 0, applied = 0, lastRequestAt = -Infinity;
  for (var ci = 0; ci < plan.components.length; ci++) {
    var component = plan.components[ci];
    var markers = pmMarkerMap_(runtime.readMarkers(component.id), plan.markerKey);
    for (var bi = 0; bi < component.batches.length; bi++) {
      var batch = component.batches[bi];
      if (pmBatchDone_(markers, batch)) { completed++; continue; }
      if (runtime.now() - runtime.startedAt > runtime.budgetMs) {
        var paused = {complete: false, completedBatches: completed, totalBatches: total, appliedThisRun: applied, nextComponent: component.key, nextBatch: batch.index};
        runtime.checkpoint(paused); return paused;
      }
      var pacing = (runtime.minIntervalMs || 0) - (runtime.now() - lastRequestAt);
      if (pacing > 0 && runtime.wait) runtime.wait(pacing);
      var requests = JSON.parse(JSON.stringify(batch.requests));
      if (runtime.prepareRequests) requests = runtime.prepareRequests(component.id, requests, batch);
      else if (batch.kind === 'grid-reduction') throw new Error('Adapter precisa preparar a fase de redução usando as grades atuais.');
      requests.push({createDeveloperMetadata: {developerMetadata: {
        metadataKey: plan.markerKey, metadataValue: batch.index + ':' + batch.checksum,
        location: {spreadsheet: true}, visibility: 'DOCUMENT'
      }}});
      // A marca e as escritas são atômicas: se a conexão cair após aplicar o lote,
      // a próxima execução encontra a marca e não limpa ou reaplica esse lote.
      lastRequestAt = runtime.now();
      var committed = pmCommitRecover_(runtime, component.id, requests, batch, plan.markerKey);
      if (!committed) {
        var throttled = {complete: false, completedBatches: completed, totalBatches: total, appliedThisRun: applied, nextComponent: component.key, nextBatch: batch.index, reason:'Limite temporário da API: execute novamente para continuar.'};
        runtime.checkpoint(throttled); return throttled;
      }
      completed++; applied++;
      runtime.checkpoint({complete: false, completedBatches: completed, totalBatches: total, component: component.key, batch: batch.index});
    }
  }
  var finished = {complete: true, completedBatches: completed, totalBatches: total, appliedThisRun: applied, connections: 'PENDENTE: autorizar IMPORTRANGE e verificar o recálculo nas cópias.'};
  runtime.checkpoint(finished); return finished;
}

function pmCommitRecover_(runtime, id, requests, batch, markerKey) {
  for (var attempt = 0; attempt < 4; attempt++) {
    try { runtime.commit(id, requests); return true; }
    catch (error) {
      // Uma resposta perdida pode ter aplicado o lote. Ler a marca antes de
      // qualquer nova tentativa evita repetir escritas já confirmadas no Google.
      var markers;
      try { markers = pmMarkerMap_(runtime.readMarkers(id), markerKey); }
      catch (readError) { throw error; }
      if (pmBatchDone_(markers, batch)) return true;
      var rateLimited = /\b429\b|rate.?limit|quota.*per.*minute|too many requests/i.test(String(error && error.message || error));
      if (!rateLimited) throw error; // Não reenviar falhas de rede ambíguas.
      var delay = 1200 * Math.pow(2, attempt);
      if (attempt === 3 || !runtime.wait || runtime.now() - runtime.startedAt + delay > runtime.budgetMs) return false;
      runtime.wait(delay);
    }
  }
  return false;
}

function pmMarkerMap_(metadata, key) {
  var result = {};
  (metadata || []).forEach(function (item) {
    if (item.metadataKey !== key) return;
    var parts = String(item.metadataValue).split(':');
    if (parts.length !== 2 || !/^\d+$/.test(parts[0])) throw new Error('Marcador de instalação inválido. Interrompido para não repetir escritas.');
    if (result[parts[0]] && result[parts[0]] !== parts[1]) throw new Error('Marcadores de instalação conflitantes.');
    result[parts[0]] = parts[1];
  });
  return result;
}

function pmBatchDone_(markers, batch) {
  if (!Object.prototype.hasOwnProperty.call(markers, batch.index)) return false;
  if (markers[batch.index] !== batch.checksum) throw new Error('O manifesto mudou durante a instalação. Use a versão original ou reimporte cópias novas.');
  return true;
}

function pmSummary_(plan) {
  return {moduleId: plan.moduleId, confirmation: plan.nonce,
    copies: plan.components.map(function (component) { return {key: component.key, file: component.filename, url: 'https://docs.google.com/spreadsheets/d/' + component.id, batches: component.batches.length}; }),
    totalBatches: plan.components.reduce(function (sum, component) { return sum + component.batches.length; }, 0)
  };
}

function pmWalk_(value, visit, key) {
  visit(value, key);
  if (Array.isArray(value)) value.forEach(function (item) { pmWalk_(item, visit); });
  else if (value && typeof value === 'object') Object.keys(value).forEach(function (field) { pmWalk_(value[field], visit, field); });
}

function pmHash_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8)
    .map(function (byte) { return ('0' + ((byte + 256) % 256).toString(16)).slice(-2); }).join('');
}
