(function(root){
'use strict';
// Bank adapters return normalized drafts. No adapter is allowed to commit to storage.
const adapters=new Map();
function register(id,adapter){if(!adapter.detect||!adapter.parse)throw Error('Adapter vyžaduje detect a parse');adapters.set(id,adapter)}
async function stagePDF(file){if(file.size>20*1024*1024)throw Error('Maximální velikost PDF je 20 MB.');const header=new TextDecoder().decode((await file.arrayBuffer()).slice(0,5));if(header!=='%PDF-')throw Error('Soubor není PDF.');return {id:crypto.randomUUID(),name:file.name,status:'needs-adapter',count:0,date:new Date().toISOString().slice(0,10),message:'PDF přijato do fronty. V1 nemá obecný parser PDF ani OCR. Nahrajte normalizovaný JSON transakcí, nebo zadejte transakce ručně.'}}
async function parseText(text,context){for(const [id,a] of adapters)if(a.detect(text))return {adapter:id,rows:await a.parse(text,context),status:'review'};throw Error('Formát výpisu nemá parser. Nic nebylo importováno.')}
root.WealthImport={register,stagePDF,parseText,adapters};
})(window);
