# Changelog

## 1.2.0 · 2026-10-14

- Hromadná měsíční aktualizace otevřených aktiv, dluhů a zahrnutých účtů jedním datem, s náhledem součtů a zachováním historie.
- Výpis se stejným koncovým datem zpřesní účet i v odpovídajícím měsíčním snímku. Dílčí výpisy nepřepisují bankovní souhrny.
- Graf celkového majetku, dluhů a čistého jmění; přehled změny jmění a měsíční spotřeby.
- Plánování cílového majetku a zbývající jistiny: potřebné měsíční tempo, vlastní scénář a podmíněný lineární trend z úplných srovnatelných stavů.
- Možnost uzavřít a znovu otevřít pozici bez smazání historie. Kompaktní řádky transakcí.
- Zachována kompatibilita záloh a úložiště schématu 1; soukromé údaje nejsou součástí vydání.


Semantic Versioning: MAJOR = incompatible data/API changes, MINOR = compatible features, PATCH = fixes. Data schema versions are independent of app versions.

## [1.1.0] - 2026-10-12

- Implemented actual browser-local PDF import for Air Bank and ČSOB electronic CZK statements, replacing the metadata-only queue.
- Added direct Excel portfolio and historical net-worth import, with source warnings and explicit non-destructive merge choices.
- Added preview and confirmation, multi-PDF selection, gross statement reconciliation, own-account suggestions, statement balances and duplicate detection compatible with 1.0 data.
- Re-import preserves manual transaction changes and newer balance snapshots. Air Bank aggregate and component balances are not counted twice.
- Bundled PDF.js 5.6.205 and SheetJS CE 0.20.3 with licenses; no third-party document uploads or CDN dependencies. Standalone HTML supports both import types offline.
- Added 17 importer tests (27 total) and verified the supplied files end-to-end in Chrome through both hosted-style and standalone entry points.
- Same storage key/schema retained; asset URLs versioned to avoid stale application scripts after deployment.

Limitations: scanned PDFs/OCR, other-bank PDF templates and non-CZK statements remain unsupported. CRM sync remains inactive.

## [1.0.0] - 2026-10-11

- Czech dashboard, Fustat typography and glass cards based on local FILIP CRM.
- Editable assets, debts, own bank accounts and transactions; nullable valuations and valuation dates.
- Own-account transfer detection with explicit manual overrides and explained matching.
- Categories, persistent merchant rules and cashflow filters.
- Dated net-worth history, editable snapshots, local storage, validated JSON backup/restore and deduplicated transaction imports.
- PDF staging pipeline and bank adapter interface. Generic PDF extraction/OCR is **not implemented**.
- GitHub Pages deployment workflow with allowlisted public files; private initial data delivered separately.
- Reserved, inactive CRM synchronization model for client AUM and expected commissions.

### Known limitations
- CZK only; no foreign currency conversion.
- Statement balances are snapshots, not automatically recalculated from edited transactions.
- Browser storage is not an encrypted vault and is not a backup; export JSON regularly.
- Generic PDF import and CRM synchronization require future releases.
