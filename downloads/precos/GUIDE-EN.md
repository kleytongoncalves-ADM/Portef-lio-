# Price Comparison — user guide

This package contains a sanitized public copy of the original workbook for market-source research and comparison with three suppliers. Its structure has been preserved. The file remains `.xlsm`; this copy contains no VBA project.

**Read the limitations before using the results. Original formulas alternate between unit prices and total prices, and empty quotations produce errors. Sanitization did not change those formulas.**

## Included files

- `mapa-preco-modelo-publico.xlsm`: standalone workbook, with one `PESQUISA DE PREÇO` worksheet and 13 item positions.
- `GUIA-PT.md` and `GUIDE-EN.md`: instructions and limitations in Portuguese and English.
- `VERIFICACAO.md` and `verificacao.json`: preservation and privacy checks.
- `previa-modelo-publico.png`: layout preview of the public copy. The renderer uses its own calculation engine; error messages and empty-input results may differ from workbook caches and Excel.

No supporting workbook or separate dashboard file is required. The original summary is on the same worksheet. The website's interactive dashboard is a separate demonstration with fictitious records and does not synchronize with this file.

## Getting started

1. Download and extract the ZIP, or download the XLSM and guides individually.
2. Open a copy in Excel and retain the `.xlsm` format when saving. No account, private spreadsheet or external service connection is needed. This copy does not require macros to be enabled because it contains no VBA.
3. Enter the process identifier in B4, the research scope in C4 and the research date in heading E4. Adjust the parts and services headings in M4 and M35.
4. Identify each item beside its number, in column C, and enter its quantity in column D. Each item occupies two rows, starting at row 7, then 9, through 31. There is no unambiguous standalone unit column; include the unit in the description and use the same unit across comparable quotations.
5. On even rows 8, 10, 12 through 32, enter unit/total prices in E/F, G/H and I/J for the three market sources. These total prices are inputs: there is no quantity × unit-price formula in those columns. Check the multiplication before entering the totals.
6. Identify the three supplier quotations in their headings and enter item totals in areas M/N, O/P and Q/R. Respect merged cells and enter values into their top-left cell.
7. Enter service amounts in N37, P37 and R37. Formulas B39, D39 and F39 add each service amount to its supplier's parts total.
8. Check statistical references, scope, unit, quantity and quotation completeness before comparing totals. Keep the research evidence with your own working copy.

## Existing calculations

| Cells | Original calculation |
|---|---|
| K/L on even rows 8–32 | Mean and median of three market-source prices |
| K34/L34 | Sum of the means and medians |
| M34/O34/Q34 | Parts total for each supplier |
| B37/D37/F37 | Linked parts totals for comparison |
| B39/D39/F39 | Parts + services for each supplier |

Conditional formatting in B37/D37/F37 compares each parts total with L34: green if lower or equal, red if higher. It does not select a winner or assess quality, eligibility, scope or quotation compliance.

## Specific limitations retained

**Mixed statistical bases.** Rows 8, 18, 20, 22 and 28 calculate mean and median from F/H/J, the total-price columns. Rows 10, 12, 14, 16, 24, 26, 30 and 32 use E/G/I, the unit-price columns. Quantities other than 1 can therefore make the summary add unlike measures. For example, unit prices of 100/120/140 and totals of 200/240/280 produce a mean of 240 on row 8 and 120 on row 10. This behavior was retained to avoid silently modifying the original work. A functional review is needed before using these summaries for a real decision.

**Empty inputs.** The supplied file already contains 28 cached error results: empty means, empty medians and the two aggregate totals. Opening the file in a spreadsheet application may recalculate them and change the messages. An error is neither a zero price nor a valid result.

**Incomplete quotations.** SUM yields zero when a supplier has no amounts and produces partial totals when items are missing. A displayed zero does not mean a free quotation. Compare only quotations containing every required item and service with matching scope, unit and quantity. Missing quotations should remain missing; entering zeros would make an incomplete quotation appear cheaper.

**Absent features.** This workbook has no input validation, active sheet protection, filters, charts, external connections or lowest-price/ranking calculation. It has no automated source history. Formula cells are editable, so avoid overwriting them.

## Preservation, privacy and compatibility

All 40 formulas, 167 merged ranges, two conditional rules, styles, widths, rows and print settings were retained. Six identifying headings were replaced, and the institutional image and personal metadata were removed. The public workbook does not retain the actual vehicle plate, process identifier, research scope or third-party creator name.

Checks compared the internal contents of the source and public packages. A calculation check with fictitious inputs ran in a disposable copy and was not saved as the template. Microsoft Excel execution and Google Sheets import were not validated. Importing the XLSM into Google Sheets may alter layout, formulas or formatting; that conversion is not the faithful version provided in this package.

