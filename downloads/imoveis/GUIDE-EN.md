# Properties — original model for Google Sheets

This package contains three components derived from native copies of the reference model, with fictional data: **Operational (6 tabs), Base (56 tabs), and Dashboards (14 tabs)**. It preserves the original organization of property records, lease periods, rent, condominium charges, property tax, other fees, and reports. Shared technical tabs for the Contracts module remain; their inputs are empty and unrelated dashboards are hidden.

The XLSX files are **transport files for importing into Google Sheets and restoring with the installer**. They are not an Excel-compatible edition. Before installation, Google-specific formulas and connections may show errors or blank results. Workbook labels remain in Portuguese to preserve the reference model.

## Install

Follow **INSTALLATION-EN.md** in the ZIP. Import all three XLSX files as native Google Sheets, upload `manifesto-imoveis.json` to Drive, and retain each component's filename without `.xlsx` while installing. Use these installer keys:

```javascript
IDS: {
  operacional: 'YOUR_OPERATIONAL_COPY_ID',
  base: 'YOUR_BASE_COPY_ID',
  paineis: 'YOUR_DASHBOARD_COPY_ID'
}
```

Run `prepararInstalacao`, review the three destinations, enter the displayed confirmation, and run `executarInstalacao` until it reports `complete: true`. More than one execution may be needed. The manifest restores native formulas, full tab names, grid sizes, time zones, merges, conditional rules, filters, selectors, charts, and internal navigation links.

## Authorize connections

Data flows **Operational → Base → Dashboards**. You must authorize `IMPORTRANGE` in your Google account.

1. In Base, use `CFG PARÂMETROS!E4` or an import cell in a `RAW I` tab to allow access to Operational.
2. In Dashboards, allow access to Base. The property contracts dashboard (`PAINEL DE CONTRATOS - IMÓVEIS`) imports at `AB1` in its helper area.
3. If a nested formula does not display the **Allow access** button, add a temporary tab in the destination file and enter `=IMPORTRANGE("SOURCE_ID";"A1")` in A1. Use Operational's ID inside Base, and Base's ID inside Dashboards. Allow access, then delete the temporary tab.
4. Wait for recalculation. Use your package copies as the sources.

## Check the sample

The fictional example has three properties, two leases, and transactions from January through August 2026:

| Check | Expected result |
|---|---:|
| Transaction rows, including one entry without an amount | 34 |
| Rent | BRL 19,600 |
| Condominium charges | BRL 6,000 |
| Property tax | BRL 2,700 |
| Other fees | BRL 420 |
| Total | BRL 28,720 |
| Missing due-date anomaly | 1, associated with BRL 450 |

One June rent entry has no amount to demonstrate overdue-entry tracking. Overdue days, lease status, and renewals depend on the reference date. The September 2026 check found one overdue entry. Select **2026** for the annual summary; its total should be BRL 28,720. The average for eight completed months with entries was BRL 3,590.

For a simple connection check, temporarily change Local Alfa's January rent from 1,200 to 1,300. The overall total should increase by 100 after recalculation. Restore 1,200 afterward. Edit Operational inputs; Base and dashboard helper areas contain formulas.

## Changes and limits

Real names, addresses, bank details, identifiers, annotations, comments, private source links, and snapshots were removed. Inputs and relationships use consistent fictional examples. Legacy checks referring to real records now use example labels. This module does not need the additional Contracts source.

One source defect was corrected: the property monthly summary's 60 formulas in B19:F30 tested empty Q19:Q30 cells. They now use the existing transaction counts in R19:R30, enabling monthly totals without changing the calculation rule.

Native Google import and restoration requests were tested on disposable copies. Account-specific connection authorization and the interactive Apps Script installation remain setup steps. Original bound scripts, triggers, permissions, and authorizations are not included. The only bundled code is the installer. See **VERIFICACAO.md** for validation scope.

## Final chart styling

After authorizing connections and waiting for the data, run `restaurarGraficos` in Apps Script. This reapplies only the original chart definitions, preserving inputs and cell formulas. Google may discard colors and labels when charts are configured while their data sources still show `#REF!`.
