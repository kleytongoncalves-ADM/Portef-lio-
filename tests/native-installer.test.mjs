import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';

const code = fs.readFileSync(new URL('../tools/ConfigurarModelos.gs', import.meta.url), 'utf8');
const api = vm.createContext({ console });
vm.runInContext(code, api);
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const plain = value => JSON.parse(JSON.stringify(value));

test('post-connection chart refresh never replays formulas, cell clearing or grid changes', () => {
  const component = {batches: [{requests: [
    {updateCells:{fields:'userEnteredValue',rows:[]}},
    {updateChartSpec:{chartId:17,spec:{title:'Teste'}}},
    {updateSheetProperties:{properties:{sheetId:7,gridProperties:{rowCount:100}}}},
    {updateEmbeddedObjectPosition:{objectId:17,newPosition:{},fields:'*'}},
    {updateEmbeddedObjectBorder:{objectId:17,border:{},fields:'*'}}
  ]}]};
  const selected = plain(api.pmChartRefreshRequests_(component));
  assert.deepEqual(selected.map(request => Object.keys(request)[0]), ['updateChartSpec','updateEmbeddedObjectPosition','updateEmbeddedObjectBorder']);
  selected[0].updateChartSpec.spec.title = 'Modified';
  assert.equal(component.batches[0].requests[1].updateChartSpec.spec.title,'Teste');
});

test('chart refresh requires completed restoration in every copy before writing', () => {
  const f = fixture(), plan = build(f);
  assert.throws(() => api.pmRequireInstalled_(plan,f.copies), /Conclua executarInstalacao/);
  f.copies.base.spreadsheet.developerMetadata = plan.components[0].batches.map(batch => ({metadataKey:plan.markerKey,metadataValue:batch.index+':'+batch.checksum}));
  assert.doesNotThrow(() => api.pmRequireInstalled_(plan,f.copies));
});
function fixture() {
  const manifest = {
    schemaVersion: 1, moduleId: 'teste', tokens: { __MODELO_BASE__: 'base' },
    components: [{ key: 'base', filename: 'MODELO-PUBLICO-BASE.xlsx',
      spreadsheetProperties: {locale: 'pt_BR', timeZone: 'America/Sao_Paulo'},
      sheets: [{sourceSheetId: 9, title: 'BASE ORIGINAL COM NOME LONGO PRESERVADO', importTitle: 'BASE IMPORTADA', index: 0, gridProperties: {rowCount: 100, columnCount: 5}}],
      requests: [{updateCells: {start: {sheetId: 9, rowIndex: 1, columnIndex: 0}, rows: [{values: [{userEnteredValue: {formulaValue: '=IMPORTRANGE("__MODELO_BASE__";"A1:B2")'}}]}], fields: 'userEnteredValue'}}]
    }]
  };
  const ids = {base: 'TEST_ONLY_SPREADSHEET_123456789'};
  const copies = {base: {mimeType: 'application/vnd.google-apps.spreadsheet', name: 'MODELO-PUBLICO-BASE', trashed: false, overflowChecked: true,
    spreadsheet: {spreadsheetId: ids.base, properties: {title: 'MODELO-PUBLICO-BASE'}, sheets: [{properties: {sheetId: 707, title: 'BASE IMPORTADA', sheetType: 'GRID', gridProperties: {rowCount: 1000, columnCount: 26}}}]}
  }};
  return {manifest, ids, copies};
}
function build(f = fixture()) { return api.pmBuildPlan_(f.manifest, f.ids, f.copies, hash); }
function fakeRuntime() {
  let clock = 0;
  const metadata = new Map();
  const calls = [];
  return {metadata, calls,
    now: () => clock, startedAt: 0, budgetMs: 100,
    advance: ms => {clock += ms;},
    prepareRequests: (id, requests, batch) => batch.kind === 'grid-reduction'
      ? api.pmShrinkGridRequests_(requests, [{properties:{sheetId:707,gridProperties:{rowCount:1000,columnCount:26}}}]) : requests,
    readMarkers: id => metadata.get(id) || [],
    commit: (id, requests) => {
      calls.push({id, requests: plain(requests)});
      const existing = metadata.get(id) || [];
      for (const request of requests) if (request.createDeveloperMetadata) existing.push(plain(request.createDeveloperMetadata.developerMetadata));
      metadata.set(id, existing);
    }, checkpoint: () => {}
  };
}

test('planner remaps internal IDs, tokens, long names and native metadata', () => {
  const plan = build();
  const requests = plain(plan.components[0].batches.filter(batch => batch.kind === 'restore').flatMap(batch => batch.requests));
  const value = requests.find(request => request.updateCells).updateCells;
  assert.equal(value.start.sheetId, 707);
  assert.match(value.rows[0].values[0].userEnteredValue.formulaValue, /TEST_ONLY_SPREADSHEET_123456789/);
  assert.equal(requests[1].updateSheetProperties.properties.title, 'BASE ORIGINAL COM NOME LONGO PRESERVADO');
  assert.equal(requests[1].updateSheetProperties.properties.gridProperties.rowCount, 100);
  assert.equal(requests[2].updateSpreadsheetProperties.properties.timeZone, 'America/Sao_Paulo');
});

test('preflight rejects wrong file, duplicate IDs, unresolved tokens and destructive requests before writes', () => {
  let f = fixture(); f.copies.base.name = 'ORIGINAL-PRODUCAO';
  assert.throws(() => build(f), /Nome da cópia incorreto/);
  f = fixture(); f.manifest.components.push({...f.manifest.components[0], key:'other'}); f.ids.other = f.ids.base;
  assert.throws(() => build(f), /ID duplicado/);
  f = fixture(); f.manifest.components[0].requests[0].updateCells.rows[0].values[0].userEnteredValue.formulaValue = '=IMPORTRANGE("__DESCONHECIDO__";"A1")';
  assert.throws(() => build(f), /Token não definido/);
  f = fixture(); f.manifest.components[0].requests.push({deleteSheet: {sheetId: 9}});
  assert.throws(() => build(f), /Request não suportado/);
});

test('preflight catches external source IDs, missing sheets and unverified shrinking', () => {
  let f = fixture(); f.manifest.components[0].requests[0].updateCells.rows[0].values[0].userEnteredValue.formulaValue = '=IMPORTRANGE("a-real-external-id";"A1")';
  assert.throws(() => build(f), /literal deve usar token/);
  f = fixture(); f.copies.base.spreadsheet.sheets[0].properties.title = 'outra';
  assert.throws(() => build(f), /ausente ou ambígua/);
  f = fixture(); f.copies.base.overflowChecked = false;
  assert.throws(() => build(f), /fora da grade precisam ser verificadas/);
});

test('confirmation binds both manifest content and destination IDs', () => {
  const original = build();
  assert.throws(() => api.pmAssertConfirmation_(original, ''), /Confirmação/);
  api.pmAssertConfirmation_(original, original.nonce);
  const f = fixture(); f.ids.base += '2'; f.copies.base.spreadsheet.spreadsheetId = f.ids.base;
  assert.notEqual(build(f).nonce, original.nonce);
  assert.throws(() => api.pmAssertConfirmation_(build(f), original.nonce), /Confirmação/);
  const modified = fixture(); modified.manifest.components[0].sheets[0].gridProperties.rowCount++;
  assert.notEqual(build(modified).nonce, original.nonce);
});

test('title restoration can be resumed even after temporary title phase', () => {
  const f = fixture(), original = build(f);
  f.copies.base.spreadsheet.sheets[0].properties.title = original.components[0].batches.find(batch => batch.kind === 'restore').requests[0].updateSheetProperties.properties.title;
  assert.equal(build(f).nonce, original.nonce);
  f.copies.base.spreadsheet.sheets[0].properties.title = f.manifest.components[0].sheets[0].title;
  assert.equal(build(f).nonce, original.nonce);
});

test('execution is idempotent and leaves connections explicitly pending', () => {
  const plan = build(), runtime = fakeRuntime();
  const first = api.pmRunPlan_(plan, runtime);
  assert.equal(first.complete, true);
  assert.match(first.connections, /PENDENTE/);
  const count = runtime.calls.length;
  const second = api.pmRunPlan_(plan, runtime);
  assert.equal(second.appliedThisRun, 0);
  assert.equal(runtime.calls.length, count);
  assert.ok(runtime.calls.every(call => call.requests.at(-1).createDeveloperMetadata));
});

test('atomic marker handles a network failure after server commit without duplicate replay', () => {
  const plan = build(), runtime = fakeRuntime(), commit = runtime.commit;
  runtime.commit = (...args) => {commit(...args); throw new Error('network response lost');};
  const recovered = api.pmRunPlan_(plan, runtime);
  assert.equal(recovered.complete, true);
  runtime.commit = commit;
  const resumed = api.pmRunPlan_(plan, runtime);
  assert.equal(resumed.complete, true);
  assert.equal(resumed.appliedThisRun, 0);
  assert.equal(runtime.calls.length, plan.components[0].batches.length);
});

test('timeout yields progress and resumes remaining batches', () => {
  const f = fixture();
  for (let i = 0; i < 480; i++) f.manifest.components[0].requests.push({repeatCell: {range:{sheetId:9,startRowIndex:0,endRowIndex:1},cell:{},fields:'note'}});
  const plan = build(f), runtime = fakeRuntime(), commit = runtime.commit;
  runtime.commit = (...args) => {commit(...args); runtime.advance(101);};
  const first = api.pmRunPlan_(plan, runtime);
  assert.equal(first.complete, false);
  assert.equal(first.appliedThisRun, 1);
  runtime.startedAt = 101; runtime.budgetMs = 10000;
  const resumed = api.pmRunPlan_(plan, runtime);
  assert.equal(resumed.complete, true);
  assert.equal(runtime.calls.length, plan.components[0].batches.length);
});

test('429 responses retry with backoff only after checking committed markers', () => {
  const plan = build(), runtime = fakeRuntime(), commit = runtime.commit;
  let attempts=0, waits=0;
  runtime.budgetMs=10000;
  runtime.wait=ms=>{waits++;runtime.advance(ms);};
  runtime.commit=(...args)=>{if(attempts++===0)throw new Error('429 too many requests');return commit(...args);};
  const result=api.pmRunPlan_(plan,runtime);
  assert.equal(result.complete,true);
  assert.equal(waits,1);
  assert.equal(runtime.calls.length,plan.components[0].batches.length);
});

test('unconfirmed ambiguous network failure never retries writes automatically', () => {
  const plan=build(),runtime=fakeRuntime();let attempts=0;
  runtime.commit=()=>{attempts++;throw new Error('network timeout');};
  assert.throws(()=>api.pmRunPlan_(plan,runtime),/network timeout/);
  assert.equal(attempts,1);
});

test('overflow read ranges protect populated cells before grid size restoration', () => {
  const f = fixture();
  const ranges = plain(api.pmOverflowRanges_(f.manifest.components[0], f.copies.base.spreadsheet, hash(JSON.stringify(f.manifest))));
  assert.deepEqual(ranges, ["'BASE IMPORTADA'!A101:Z1000", "'BASE IMPORTADA'!F1:Z100"]);
});

test('formulaLocale is temporary and is restored only after formula requests', () => {
  const f = fixture(); f.manifest.components[0].formulaLocale = 'en_US';
  const requests = plain(build(f).components[0].batches.filter(batch => batch.kind === 'restore').flatMap(batch => batch.requests));
  assert.equal(requests[2].updateSpreadsheetProperties.properties.locale, 'en_US');
  assert.equal(requests.at(-1).updateSpreadsheetProperties.properties.locale, 'pt_BR');
});

test('locale changes finish in separate API calls before and after native formula parsing', () => {
  const f = fixture(); f.manifest.components[0].formulaLocale = 'en_US';
  const batches = plain(build(f).components[0].batches);
  const locales = batches.map((batch, i) => ({batch, i})).filter(({batch}) => batch.requests.some(r => r.updateSpreadsheetProperties?.properties?.locale));
  assert.equal(locales.length, 2);
  for (const {batch} of locales) assert.equal(batch.requests.length, 1);
  const formulaBatches = batches.map((batch, i) => ({batch, i})).filter(({batch}) => JSON.stringify(batch.requests).includes('formulaValue'));
  assert.ok(formulaBatches.length > 0);
  assert.ok(formulaBatches.every(({i}) => i > locales[0].i && i < locales[1].i));
});

test('marker mismatch stops instead of replaying changed requests', () => {
  const plan = build(), runtime = fakeRuntime();
  runtime.metadata.set(plan.components[0].id, [{metadataKey:plan.markerKey, metadataValue:'0:wrong-checksum'}]);
  assert.throws(() => api.pmRunPlan_(plan,runtime), /manifesto mudou/);
  assert.equal(runtime.calls.length,0);
});

test('all empty-grid reductions precede growth and reduce without transient expansion', () => {
  const plan = build();
  assert.equal(plan.components[0].batches[0].kind, 'grid-reduction');
  assert.equal(plan.components[0].batches[1].kind, 'restore');
  const requests = [{updateSheetProperties:{properties:{sheetId:707,gridProperties:{rowCount:50000,columnCount:5}},fields:'gridProperties.rowCount,gridProperties.columnCount'}}];
  const shrunk = plain(api.pmShrinkGridRequests_(requests,[{properties:{sheetId:707,gridProperties:{rowCount:1000,columnCount:26,frozenRowCount:1}}}]));
  assert.equal(shrunk[0].updateSheetProperties.properties.gridProperties.rowCount,1000);
  assert.equal(shrunk[0].updateSheetProperties.properties.gridProperties.columnCount,5);
  const f = fixture(); const before=build(f);
  f.copies.base.spreadsheet.sheets[0].properties.gridProperties={rowCount:100,columnCount:5};
  const after=build(f);
  assert.deepEqual(plain(before),plain(after));
});

test('chart and conditional-format restoration remap exact existing objects', () => {
  const f=fixture();
  f.manifest.components[0].sheets[0].charts=[{sourceChartId:31,title:'Despesas'}];
  f.copies.base.spreadsheet.sheets[0].charts=[{chartId:919,spec:{title:'Despesas'}}];
  f.manifest.components[0].requests.push({updateChartSpec:{chartId:31,spec:{title:'Despesas',fontName:'Arial',basicChart:{domains:[{domain:{sourceRange:{sources:[{sheetId:9,startRowIndex:0,endRowIndex:2}]}}}]}}}});
  f.manifest.components[0].requests.push({updateEmbeddedObjectBorder:{objectId:31,border:{color:{red:1}},fields:'color'}});
  f.manifest.components[0].requests.push({updateConditionalFormatRule:{sheetId:9,index:0,rule:{ranges:[{sheetId:9,startRowIndex:0,endRowIndex:2}],booleanRule:{condition:{type:'NOT_BLANK'}}}}});
  const requests=plain(build(f).components[0].batches.flatMap(b=>b.requests));
  assert.equal(requests.find(r=>r.updateChartSpec).updateChartSpec.chartId,919);
  assert.equal(requests.find(r=>r.updateEmbeddedObjectBorder).updateEmbeddedObjectBorder.objectId,919);
  assert.equal(requests.find(r=>r.updateConditionalFormatRule).updateConditionalFormatRule.rule.ranges[0].sheetId,707);
  f.copies.base.spreadsheet.sheets[0].charts=[];
  assert.throws(()=>build(f),/Gráfico ausente ou ambíguo/);
});

test('missing declared chart is recreated once and already-present charts become updates', () => {
  const f=fixture();
  f.manifest.components[0].sheets[0].charts=[{sourceChartId:31,title:'Evolução',createIfMissing:true}];
  f.manifest.components[0].requests.push({addChart:{chart:{chartId:31,spec:{title:'Evolução'},position:{overlayPosition:{anchorCell:{sheetId:9,rowIndex:1,columnIndex:1}}}}}});
  const first=build(f);
  const requests=plain(first.components[0].batches.filter(b=>b.kind==='restore').flatMap(b=>b.requests));
  assert.equal(requests.find(r=>r.addChart).addChart.chart.chartId,31);
  assert.equal(requests.find(r=>r.addChart).addChart.chart.position.overlayPosition.anchorCell.sheetId,707);
  const noChart=plain(api.pmRestoreMissingCharts_(requests,f.copies.base.spreadsheet.sheets));
  assert.equal(noChart.filter(r=>r.addChart).length,1);
  f.copies.base.spreadsheet.sheets[0].charts=[{chartId:31,spec:{title:'Evolução'}}];
  assert.deepEqual(plain(first),plain(build(f)));
  const after=plain(api.pmRestoreMissingCharts_(requests,f.copies.base.spreadsheet.sheets));
  assert.equal(after.filter(r=>r.addChart).length,0);
  assert.equal(after.filter(r=>r.updateChartSpec).length,1);
  f.copies.base.spreadsheet.sheets[0].charts[0].spec.title='Outro gráfico';
  assert.throws(()=>build(f),/ID do gráfico a restaurar já existe/);
});

test('native menu hyperlinks remap local gids without changing remote URLs', () => {
  assert.equal(api.pmRemap_('=HYPERLINK("#gid=9";"Abrir")',{9:707},{},{},undefined,{}),'=HYPERLINK("#gid=707";"Abrir")');
  assert.equal(api.pmRemap_('#gid=9&range=A1',{9:707},{},{},undefined,{}),'#gid=707&range=A1');
  assert.equal(api.pmRemap_('https://example.test/edit#gid=9',{9:707},{},{},undefined,{}),'https://example.test/edit#gid=9');
});
