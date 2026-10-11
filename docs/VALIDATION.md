# Validation · 1.0.0

Verified locally on 2026-10-11.

- 10 Node tests: own-account matching, manual overrides, intermediary/split movements, ambiguous matches, date boundaries, aggregation, unknown balances, categorization, deduplication, schema rejection and version consistency.
- Headless Google Chrome: clean start → private JSON preview/restore → dashboard; create bank account; create/edit transaction; internal override; reload persistence; edit asset; create category rule; add historical snapshot; PDF queue; backup download; 390px mobile layout without page overflow.
- Desktop 1440px and mobile 390px screenshots visually inspected.
- Both original statements reconciled independently to credits, debits and closing balances during private conversion. 87 transactions (74 + 13). No account numbers or amounts from the original statements are stored in this public repository.
- Public build created from an explicit file allowlist. No external dependencies required for app execution or domain tests.

GitHub Actions deployment itself has not been executed for this local release. Generic PDF parsing, OCR, foreign currency accounting and CRM sync are explicitly outside implemented v1 functionality.
