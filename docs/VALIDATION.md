# Validation · 1.1.0

Verified on 2026-10-12.

- 27 Node tests cover finance logic and import behavior: bank reconciliation, amount/date errors, unsupported currency, fees, Excel history/nulls, merge ordering, duplicates, manual edits, old statement protection, legacy source IDs and version consistency.
- Actual supplied files imported through browser file controls: Excel → 22 positions and 15 dated snapshots; Air Bank → 74 transactions; ČSOB → 13 transactions. Both statements match opening + income − expenses = closing balance.
- All 87 parsed transaction amounts and posting dates also match the independently extracted 1.0 bootstrap. Import into existing 1.0 data adds no duplicates; original state, IDs and edits remain usable.
- Chrome end-to-end test exercised Excel preview and commit, both PDFs selected together, own-account confirmation, balance updates, manually edited transaction re-import, repeated Excel import, invalid PDF rollback, reload persistence and 390px viewport overflow checks. Repeated on standalone file:// HTML with embedded libraries.
- No requests to external hosts during local file import tests. Public assets include no private source documents or financial account identifiers.
- Desktop import and preview screenshots visually inspected. Mobile viewport checks include form usability and contained horizontal table scrolling.

Supported: text-based CZK Air Bank and ČSOB templates represented by the supplied files, and the supplied Excel portfolio layout. OCR, other bank templates, FX accounting and CRM sync are not implemented.
