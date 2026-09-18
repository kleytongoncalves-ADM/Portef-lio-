# Estacionamento — Google Sheets template package

This package retains the supplied workbook layouts, monthly matrices, formulas, validation rules and dashboards, with 8 fictional contracts. XLSX files are transport files for Google Sheets; they are not standalone Excel systems. Follow **INSTALLATION-EN.md** and use **manifesto-modelos.json**.

The installer keys are `extra` (monthly source entries), `op` (operational contracts and amendments), `aux` (normalization and calculation), and `dash` (dashboards). Connect in this order: **EXTRA → OP → AUX → DASH**. Authorize each IMPORTRANGE prompt in your own copies. Do not edit calculated ranges.

The package preserves 7 operational sheets, 56 auxiliary sheets, 14 dashboard sheets, 14 dashboard charts with native specifications restored by the installer, and 3 contributing sheets from the supplementary workbook. Unrelated source records and private caches, notes, bank details and external source URLs were removed. Shared technical sheets remain; property-only views are hidden and empty. The source's static contract validity layer is reconnected to the package operational workbook. Source-specific issue examples were removed and the risk table now handles an empty result.

The fictional entries keep contract identities distinct, including two parking contracts from the same fictional company. Payments posted are not proof of settlement. Documentary approval of the sample amendment remains pending.

Native Google Sheets spot checks confirmed original contract amount BRL 105,600.00, amended amount BRL 106,800.00, combined current balance BRL 54,000.00 and six-month service entries BRL 52,800.00. The first contract's service balance is BRL 3,600.00; its projected balance is positive BRL 1,200.00.

These engine checks used temporary, controlled fictional inputs between components. Live import authorization and full recalculation in your copies remain installation steps. Bound source Apps Script, triggers, sharing permissions and preauthorized connections are not transported. See **VERIFICACAO.md** for scope and limits.

After authorizing the connections and loading data, run `restaurarGraficos()` to reapply the native chart formatting. Google may omit some series formatting while source ranges still contain import errors.
