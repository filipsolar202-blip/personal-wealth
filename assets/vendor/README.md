# Vendored dependencies

No financial document is sent to these providers. The application serves its own copy of each library.

- **PDF.js 5.6.205**, Mozilla Foundation. `pdf.min.mjs` and `pdf.worker.min.mjs`, legacy distribution, copied from the installed Codex dependency runtime. Apache-2.0; see `PDFJS-LICENSE.txt`. Source: https://github.com/mozilla/pdf.js / https://mozilla.github.io/pdf.js/
- **SheetJS Community Edition 0.20.3**, SheetJS LLC. Official standalone browser distribution: https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js . Apache-2.0; see `SHEETJS-LICENSE.txt`. Integration documentation: https://docs.sheetjs.com/docs/getting-started/installation/standalone/

The standalone HTML build embeds both PDF modules and the Excel library, including license texts. The source app loads PDF modules from this same directory on demand. Updating dependencies requires repeating actual-file import and standalone-browser checks.
