# Changelog

Semantic Versioning: MAJOR = incompatible data/API changes, MINOR = compatible features, PATCH = fixes. Data schema versions are independent of app versions.

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
