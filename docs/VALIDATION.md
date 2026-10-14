# Validation · 1.2.0

Verified on 2026-10-14.

- 36 automated tests pass: existing reconciliation/import/domain suite plus atomic monthly updates, duplicate dates, backdating, unknown values, closed positions, exact-date bank snapshot updates, five-year target arithmetic, comparable-history safeguards, expense exclusions, backup validation and wealth delta baselines.
- Isolated Chrome: monthly updates on two dates, historical persistence, saved plan and live scenario, closing/reopening positions, mobile editor, no browser errors.
- Original private Excel and both PDF statements imported through browser controls: 22 records, 15 history points and 87 transactions. Repeated import preserves manual edits; invalid PDF makes no changes. No external uploads.
- Desktop dashboard and mobile monthly editor screenshots inspected. Public build contains application assets only, never financial source files.

Supported import formats remain electronic CZK Air Bank and ČSOB templates represented by supplied files and the supplied portfolio Excel layout. OCR, other banks' PDF templates, FX and CRM sync are not implemented. Trend calculations compare imported records; completeness of account/month coverage must be checked by the user.
