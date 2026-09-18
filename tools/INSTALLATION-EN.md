# Install the package in Google Sheets

The XLSX files transport the original models. Import every component into Google Sheets, then restore the native formulas and connections with the included installer. Opening an XLSX in Excel does not reproduce Google-only functions such as `IMPORTRANGE`.

The installer reads the included `manifesto-*.json` to restore the recorded worksheet names, grid sizes, time zone, locale, formulas and validation rules. It uses the structure and formatting transported in the XLSX files.

## 1. Import your copies

1. Extract the ZIP and upload every XLSX plus `manifesto-*.json` to your Google Drive.
2. Open each XLSX with Google Sheets. Choose **File → Save as Google Sheets**. Editing the Excel file directly is not sufficient.
3. Keep each file name identical to the XLSX name, minus `.xlsx`. Do not rename worksheets or enter data before installation finishes.
4. Copy each new spreadsheet ID from `https://docs.google.com/spreadsheets/d/ID/edit`.
5. Copy the JSON file ID from its Drive sharing link, `https://drive.google.com/file/d/ID/view`. The JSON can remain private.

Use only new copies of the package files. The installer rejects unexpected file names or worksheet counts, and stops if restoring a smaller grid would remove populated cells.

## 2. Set up Apps Script

1. Create a new project in [Google Apps Script](https://script.google.com/).
2. Open the package's `ConfigurarModelos.gs` in a text editor and paste its entire contents into the project's `Code.gs`, replacing the default code.
3. In **Project settings**, enable the option to show `appsscript.json` in the editor.
4. Replace that file's contents with the package's `appsscript.json`. This enables the advanced Google Sheets v4 service and declares the required scopes.
5. Set `CONFIG_MODELOS.MANIFESTO_ID` to the Drive ID of the package JSON.
6. Run `listarComponentes` and authorize the project in your Google account. The execution log lists the required component keys and file names.
7. Fill `CONFIG_MODELOS.IDS` with those exact keys and the IDs of your imported Google Sheets copies. Leave `CONFIRMACAO: ''` for now.

For example, a fleet package uses `operacional`, `auxiliares` and `paineis`. Other packages may use different keys: follow `listarComponentes`, not this example.

The project requests read-only Drive access to read the JSON and check files, plus spreadsheet editing access to restore the supplied copies. It does not share files, send data to external services or request email access. If you use your own Google Cloud project, enable the Google Sheets API there as well.

## 3. Review and run

1. Run `prepararInstalacao`. This read-only function checks all copies and prints their links.
2. Check the links, then copy the displayed `INSTALAR-...` code into `CONFIG_MODELOS.CONFIRMACAO`.
3. Run `executarInstalacao`.
4. If the result says `complete: false`, run **the same function again**, keeping the same JSON, IDs and confirmation. It resumes after completed batches.
5. Continue until `complete: true`. Run `consultarInstalacao` for a read-only progress check.

Large packages may require several runs. A pause does not discard progress. If a network response is lost after a batch was applied, its atomic marker prevents the installer from replaying that batch. Temporary worksheet names and a temporary locale may be visible during an incomplete installation. Finish before using the spreadsheets.

If you change an ID or the JSON, run `prepararInstalacao` again. Do not reuse an old confirmation. If worksheets were added, removed or edited, import fresh copies.


After the data has loaded, return to Apps Script and run **`restaurarGraficos`**. Google may discard chart colors, labels and axes when their source data is still unavailable. This function reapplies only the original chart definitions in the manifest; it does not rewrite cell formulas, inputs or grid dimensions. If source cells still show `#REF!`, wait for the data and run the function again.

## 4. Allow connections and verify results

1. Open the files in the order described in the module guide, normally operational data, auxiliary base and dashboards.
2. Select `IMPORTRANGE` cells showing `#REF!` and click **Allow access** when Google offers it. A file may require access to several sources.
3. Wait for recalculation. Check indicators, lists and charts. Change a sample input and verify its dependent result updates, then restore the example or start entering your own data.
4. Check selectors and validation rules. Formula issues documented in the module's verification report may be inherited from the original model.

`complete: true` means all restoration batches were applied. **It does not confirm that connections are authorized or calculated results have been validated.** Those checks depend on your copies. The installer does not grant `IMPORTRANGE` access automatically.

After verification you may rename the files. Do not rerun the installer after entering production data. Keep the original ZIP for future new copies.

## Preservation and limits

- Formula entries in the manifest are restored as formulas, never replaced by cached results. Other formulas remain in the XLSX transport.
- The installer applies the sheet properties and requests explicitly present in the manifest. Charts and formatting not listed rely on XLSX import preservation; see the module's verification report.
- Original bound scripts, triggers, permissions and authorized connections are not carried by XLSX.
- Public packages use fictional data. The original institutional sources are not needed to install them.

Technical references: [advanced Google Sheets service](https://developers.google.com/apps-script/advanced/sheets), [Sheets API requests](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request), [Sheets API limits](https://developers.google.com/workspace/sheets/api/limits), and [Apps Script limits](https://developers.google.com/apps-script/guides/services/quotas).
