# Architecture and extension contracts

## Boundaries

- `src/domain.js`: pure money aggregation (integer CZK minor units), validation, category inference, account identity, transfer derivation, deduplication.
- `src/app.js`: Czech UI and dialogs, immutable edit-before-commit, localStorage persistence, JSON review/restore. Storage is written before replacing live state; failures preserve existing in-memory data and report the error. Corrupt storage is not overwritten automatically.
- `src/pdf-reader.js`: local PDF.js text extraction with coordinates and worker. Browser loads vendored modules; standalone release embeds those modules as Blob URLs. No document upload. Password-protected, invalid, scanned and over-limit PDFs fail explicitly.
- `src/importers.js`: Air Bank / ČSOB spatial parsers, SheetJS portfolio parser, pure merge functions. Pipeline: local extraction → bank/template detection → integer-money draft → source reconciliation → preview → validated atomic commit. A statement must match credits, debits and closing balance; ČSOB item count is checked as well. Fees attached to payments get a separate row, preserving gross income/expenses.
- `src/source-ui.js`: multi-file PDF queue, Excel preview, explicit commit, ownership confirmation, balance-update and merge choices. Pending drafts live only in memory; failed/cancelled imports never mutate stored state. Legacy metadata-only PDF rows are replaced after a successful re-upload.
- `scripts/build.cjs`: public asset allowlist.

## Data schema 1

`accounts`: `{id,name,number,currency:'CZK',amount:number|null,date,included,note}`. The own-account registry includes accounts excluded from valuation totals. Numbers/IBANs are normalized for whitespace/case. Domestic prefix/IBAN cross-equivalence is not implemented; record the matching format. Foreign currency handling requires a future explicit FX model; never sum different currencies.

`assets`, `liabilities`: `{id,name,kind,amount:number|null,date,note}`. Current balance snapshots; transactions do not mutate them.

`transactions`: `{id,accountId,date,amount,currency:'CZK',description,counterparty,category,transferOverride:'auto'|'internal'|'external',note,source?,sourceId?}`. Bank stable IDs must be namespaced by bank/account/period. When a bank lacks stable IDs, the future adapter must provide a documented collision-resistant identity that retains legitimate repeated payments. UI renders all source content escaped.

`history`: `{id,date,assets,liabilities,net,partial,note}`. Monetary values in integer minor units; `net = assets - liabilities`. Unknown values must keep `partial:true`. Historical records are explicit snapshots, never retroactively changed when editing assets.

`rules`: ordered `{match,category}`; manual transaction category precedes rules. Derived categories are recomputed, not persisted over user values.

`imports`: audit metadata, source reconciliation totals and pipeline state. PDFs are not embedded or uploaded.

`issues`: source caveats visible in UI. The private bootstrap retains provenance in notes and source fields.

Schema 1 remains compatible with 1.0 backups. Optional account fields `bank`, `aggregate`, `parentAggregateId`, `identityOnly` and record `sourceKey` describe import provenance and prevent double-counting. `imports.status` additionally accepts `portfolio`. Successful commits update `appVersion`; old records are never reset.

## Idempotency and merges

Bank IDs are namespaced by bank, account and bank source ID (ČSOB includes year/month). Legacy v1 records are matched by resolved account plus source ID. Existing transactions, including manually changed dates, values, categories and overrides, remain untouched. Preview reports conflicts. Repeated statements do not reset balances by default; newer balances are always preserved.

Excel identity uses sheet, collection, normalized label and occurrence index; legacy names are matched only when they lack import identity. Default merge adds missing items and dates, preserving existing valuations. Explicit update can replace same/older valuations but never newer ones. Historical records with matching dates are kept unless explicitly updating an Excel-origin snapshot. Empty cells stay null; source totals are compared with item sums and mismatches shown. Unknown years, non-money BJ rows and nonnumeric cells are reported. No arbitrary date correction is applied.

The Air Bank aggregate from the supplied spreadsheet is a valuation group. Statement subaccounts beneath it are excluded from totals regardless of import order. After complete individual balances are available, users can disable the aggregate and include the components.

## Transfer logic

An explicit manual choice wins. Otherwise a counterparty number matching a different registered own account establishes an internal transfer even when the second statement is missing or the flow is split through an intermediary. Such rows are excluded from both income and expenses. A unique equal/opposite amount in the same currency, within three days and in that target account may be paired. Equal amount alone never establishes ownership. Ambiguous matches remain unpaired. Derived results are rebuilt after every account/transaction edit, so no stale pair links survive.

For the supplied data the intermediary own account is known from both statements. Shared household accounts are not automatically classified as personal accounts merely because the holder's name matches; ownership changes must be explicit in the own-account registry.

## JSON transaction batch

The import screen supports full schema-1 backups or `{ "type":"transactions", "rows":[...] }` using the transaction shape above. The batch is reviewed and validated against known accounts before commit. Existing IDs are skipped, preserving manual corrections. Full backup restore replaces rather than merges state after confirmation. Backups with unsupported schema versions are rejected without modifying current data.

## Future CRM contract (inactive)

`crm.enabled = false`; `crm.externalRefs`, `crm.aumSnapshots`, `crm.expectedCommissions` are reserved arrays. A future adapter should return:

```ts
type ExternalRef = { provider: string; entity: string; externalId: string; localId: string; updatedAt: string };
type AumSnapshot = { id: string; asOf: string; currency: string; amountMinor: number; scope: 'client-assets'; source: ExternalRef };
type Commission = { id: string; expectedDate: string; amountMinor: number; currency: string; status: 'expected'|'received'|'cancelled'; receivedTransactionId?: string; source: ExternalRef };
```

Use idempotent upsert, sync cursors, source timestamps and conflict review. Expected commission is a forecast, not cash received. Link receipts to actual bank transactions to avoid duplicate income. Client AUM never contributes to personal net worth. Reconcile imported legacy commission receivables with future CRM records before adding anything to totals. Never embed CRM credentials in a static Pages app.

## Release and privacy

App SemVer is independent from data schema. Schema changes require migration functions and fixture tests; unsupported versions fail closed. Deploy updates at the same origin/path and preserve the storage key. Moving between local files, browsers and GitHub Pages requires backup/restore. No private financial data is committed or included in the build.
