# Public model manifest v1

The installer is deliberately declarative. It applies only the supported Sheets requests supplied by the package. It does not synthesize a replacement model.

```json
{
  "schemaVersion": 1,
  "moduleId": "frota",
  "tokens": {"__MODELO_OPERACIONAL__": "operacional"},
  "components": [{
    "key": "operacional",
    "filename": "MODELO-PUBLICO-FROTA-OPERACIONAL.xlsx",
    "spreadsheetProperties": {"locale": "pt_BR", "timeZone": "America/Sao_Paulo"},
    "sheets": [{
      "sourceSheetId": 0,
      "title": "NOME ORIGINAL COMPLETO",
      "importTitle": "NOME IMPORTADO DO XLSX",
      "index": 0,
      "hidden": false,
      "gridProperties": {"rowCount": 1000, "columnCount": 26, "frozenRowCount": 1}
    }],
    "requests": [{
      "updateCells": {
        "start": {"sheetId": 0, "rowIndex": 1, "columnIndex": 0},
        "rows": [{"values": [{"userEnteredValue": {"formulaValue": "=1+1"}}]}],
        "fields": "userEnteredValue"
      }
    }]
  }]
}
```

`expectedTitle` optionally overrides the imported file title expected by preflight. Otherwise the filename without `.xlsx` is used. Package titles must clearly distinguish public imports from source originals.

`formulaLocale` optionally specifies the locale used while writing formula requests; the final `spreadsheetProperties.locale` is restored after those requests. Use only when transport formulas require a different parser locale. Native formula strings normally use their source locale unchanged.

`sourceSheetId` is the original sheet's numeric internal ID, not the private spreadsheet ID. It is mapped to the imported worksheet by `title`/`importTitle`. All worksheet counts and titles must match unambiguously. All `sheetId` and `sourceSheetId` fields, plus values inside `sheetIds`, are remapped recursively in requests.

Tokens in formula strings and other request strings resolve to the user-provided component IDs. Tokenized full `https://docs.google.com/spreadsheets/d/__TOKEN__/edit` URLs are accepted. Literal `IMPORTRANGE` source IDs and non-tokenized spreadsheet URLs are rejected. Source-private identifiers must never be included in the package.

Supported request types: `updateCells`, `repeatCell`, `setDataValidation`, `updateBorders`, `updateDimensionProperties`, `setBasicFilter`, `clearBasicFilter`, `autoResizeDimensions`, constrained `updateSheetProperties`, constrained `updateSpreadsheetProperties`, `mergeCells`, `unmergeCells`, `updateConditionalFormatRule`, `updateChartSpec`, `updateEmbeddedObjectBorder`, `updateEmbeddedObjectPosition`, and guarded `addChart`. Sheet names, order, visibility and grid properties belong in `sheets`. Locale, time zone, recalc and iterative calculation settings belong in `spreadsheetProperties`. Structural deletions, additions of rules or other collections, data sources, and unknown request types fail preflight. Imported objects not explicitly covered by requests must be verified separately.

To restore an existing chart, declare it in its owning `sheets[]` entry as `charts:[{sourceChartId:123,title:"Chart title",importTitle:"Imported title"}]`. `importTitle` is optional. The title must uniquely identify a chart in that sheet. For repeated/empty titles, add a zero-based `chartIndex`; the installer also verifies the title at that index. `chartId` and `objectId` fields in chart update requests map to these declared imported objects. Snapshot inputs to the local compiler must include `sheets[].charts[].chartId` and `spec.title`.

When an engine round trip demonstrates a missing original chart, its declaration may include `createIfMissing:true` and a unique nonempty `title`, paired with `addChart` containing its original `spec`, `position`, optional `border`, and original numeric `chartId`. If absent, the numeric source chart ID is reused after checking there is no collision. If already present by title, it maps to the existing chart ID; immediately before writing, the adapter converts `addChart` into chart updates instead of adding a duplicate. A checkpoint prevents a completed batch from replaying. This exception restores an evidenced missing chart, not a new design.

Local native menu links, including formula strings `HYPERLINK("#gid=123",...)` and link URIs starting with `#gid=123`, remap through the component's sheet map. Absolute remote URLs are not rewritten as local links. Undeclared internal targets fail preflight so a broken menu cannot be silently delivered.

Requests retain their order. Package authors must explicitly clear any stale imported spill values before restoring their anchors, using `repeatCell` with `cell: {}` and `fields: "userEnteredValue"` over the exact intended output range. Never clear the input region.

Each individual request must serialize to at most 350,000 characters. Split large `updateCells` bodies into consecutive row blocks. The installer groups at most 200 requests and 350,000 serialized characters per batch. Calls are paced at least 1.1 seconds apart. A transactional `createDeveloperMetadata` marker is appended internally, so that replay after an interrupted response cannot repeat a completed batch. Resume state is discoverable from the copies, even when the optional ScriptProperties checkpoint is stale. On a failed response, it reads the marker before any retry. Only explicit rate-limit responses are retried automatically, with bounded exponential backoff; unconfirmed ambiguous network failures stop the run.

The preflight reads potentially truncated grid tails and refuses to reduce a populated tail. Empty imported extra rows/columns may be reduced to restore exact native dimensions. It verifies all components before the first write. The preview confirmation binds the full manifest, destination spreadsheet IDs and mapped sheet IDs. This is a review guard, not a cryptographic authentication mechanism or proof of model provenance.

Before any expansion, a separate marked phase reduces every empty oversized grid dimension. Each reduction uses the smaller of the live dimension and its target. The following restoration phase grows grids to their exact original size. This avoids a transient 10-million-cell overflow when several imported grids are oversized in one dimension and undersized in another. Batch checksums use stable target requests; the reduction adapter reads current dimensions immediately before applying that phase.

`export-native-plan.mjs` loads the actual `.gs` planner and compiles its exact request batches for engine validation in disposable imported copies. The input snapshots must identify package-named native files and carry evidence that tails have been checked. Its output contains private destination IDs and belongs only in scratch. This compiler does not itself call Google or establish recalculation success.

Tests use mocked Google service responses and execute the actual `.gs` planner/runtime under Node. They do not establish successful authorization or recalculation in the user's Apps Script account. Native engine validation is recorded separately by each module.
