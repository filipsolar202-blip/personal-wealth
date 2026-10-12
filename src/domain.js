(function(root){
'use strict';
const VERSION='1.1.0';
const categories=['Nezařazeno','Provize','Domácnost','Restaurace a káva','Doprava','Pojištění','Investice','Software','Předplatné','Sport a volný čas','Cestování','Kancelář','Splátky','Ostatní'];
function empty(){return {schemaVersion:1,appVersion:VERSION,accounts:[],assets:[],liabilities:[],transactions:[],history:[],rules:[],imports:[],issues:[],crm:{enabled:false,externalRefs:[],aumSnapshots:[],expectedCommissions:[]}}}
function normalize(s){return String(s||'').replace(/\s/g,'').toUpperCase().replace(/^0+(?=\d)/,'')}
function classify(t,rules=[]){if(t.category)return t.category;const s=t.description.toLocaleLowerCase('cs');for(const r of rules)if(s.includes(r.match.toLocaleLowerCase('cs')))return r.category;for(const [p,c] of [['broker trust|fair.life','Provize'],['edward|investown','Investice'],['kooperativa|uniqa|pojišť','Pojištění'],['openai|google one','Software'],['netflix|spotify|apple.com','Předplatné'],['ugo|cafe|caffe|coffee|restaura|pho-|wok|vapiano|basta|mcd|burger|svetozor|cake','Restaurace a káva'],['sport|multisport|mulitsport|goout','Sport a volný čas'],['mol |omv|parking|parkovani|cs prim','Doprava'],['hotel|letuska','Cestování'],['kancelář','Kancelář'],['billa|ikea','Domácnost']])if(new RegExp(p).test(s))return c;return 'Nezařazeno'}
function transfers(state){
 const result=new Map(),accounts=new Map(state.accounts.map(a=>[a.id,a]));
 for(const t of state.transactions){
  if(t.transferOverride==='external'){result.set(t.id,{internal:false,reason:'Ruční: běžná platba'});continue}
  if(t.transferOverride==='internal'){result.set(t.id,{internal:true,reason:'Ruční: interní převod'});continue}
  const target=state.accounts.find(a=>a.id!==t.accountId&&a.number&&normalize(a.number)===normalize(t.counterparty));
  if(target){const pair=state.transactions.filter(o=>o.id!==t.id&&o.accountId===target.id&&o.transferOverride!=='external'&&o.currency===t.currency&&o.amount===-t.amount&&Math.abs(Date.parse(o.date)-Date.parse(t.date))<=3*864e5&&(!o.counterparty||normalize(o.counterparty)===normalize(accounts.get(t.accountId)?.number)));
   result.set(t.id,{internal:true,reason:pair.length===1?'Vlastní účet · spárováno':'Vlastní účet · protistrana výpisu chybí / souhrnný převod',pairId:pair.length===1?pair[0].id:null});
  }else result.set(t.id,{internal:false,reason:''});
 }
 // A unique, account-evidenced match also identifies its counter-entry. Equal amounts alone never suffice.
 for(const [id,r] of result)if(r.pairId&&result.get(r.pairId)&&state.transactions.find(t=>t.id===r.pairId).transferOverride==='auto')result.set(r.pairId,{internal:true,reason:'Spárovaná protistrana vlastního převodu',pairId:id});
 return result;
}
function totals(s){const sum=xs=>xs.reduce((n,x)=>n+(x.amount||0),0),acc=s.accounts.filter(a=>a.included);const assets=sum(s.assets)+sum(acc),debt=sum(s.liabilities);return {assets,debt,net:assets-debt,liquidity:sum(acc),investments:sum(s.assets.filter(a=>a.kind==='Investice')),partial:[...s.assets,...s.liabilities,...acc].some(x=>x.amount===null)}}
function cashflow(s,month){const flags=transfers(s);let income=0,expense=0,internal=0;for(const t of s.transactions.filter(t=>!month||t.date.startsWith(month))){if(flags.get(t.id).internal){internal++;continue}if(t.amount>0)income+=t.amount;else expense-=t.amount}return {income,expense,net:income-expense,internal}}
function validate(s){
 if(!s||s.schemaVersion!==1)throw Error('Nepodporovaná verze dat.');
 for(const k of ['accounts','assets','liabilities','transactions','history','rules','imports','issues'])if(!Array.isArray(s[k]))throw Error('Chybí seznam '+k);
 const ids=new Set();for(const x of [...s.accounts,...s.assets,...s.liabilities,...s.transactions,...s.history]){if(!x||!x.id||typeof x.id!=='string'||ids.has(x.id))throw Error('Chybné nebo duplicitní ID.');ids.add(x.id);if(!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||!Number.isFinite(Date.parse(x.date))||new Date(x.date).toISOString().slice(0,10)!==x.date)throw Error('Neplatné datum.');}
 for(const x of [...s.accounts,...s.assets,...s.liabilities,...s.transactions])if(x.amount!==null&&!Number.isSafeInteger(x.amount))throw Error('Částky musí být celé haléře.');
 for(const a of s.accounts)if(a.currency!=='CZK'||typeof a.included!=='boolean'||typeof a.number!=='string')throw Error('V1 podporuje účty v CZK.');
 for(const x of [...s.accounts,...s.assets,...s.liabilities])if(typeof x.name!=='string'||!x.name.trim())throw Error('Chybí název.');
 for(const t of s.transactions)if(!s.accounts.some(a=>a.id===t.accountId)||t.currency!=='CZK'||!Number.isSafeInteger(t.amount)||typeof t.description!=='string'||!['auto','internal','external'].includes(t.transferOverride))throw Error('Neplatná transakce nebo účet.');
 for(const h of s.history)if(![h.assets,h.liabilities,h.net].every(Number.isSafeInteger)||h.net!==h.assets-h.liabilities)throw Error('Neplatný historický stav.');
 for(const r of s.rules)if(typeof r.match!=='string'||!r.match.trim()||typeof r.category!=='string')throw Error('Neplatné pravidlo.');
 for(const t of s.transactions)if(typeof t.counterparty!=='string'||typeof t.category!=='string'||(t.note!==undefined&&typeof t.note!=='string'))throw Error('Neplatný text transakce.');
 for(const a of [...s.assets,...s.liabilities])if(typeof a.kind!=='string')throw Error('Chybí typ položky.');
 for(const h of s.history)if(typeof h.partial!=='boolean')throw Error('Chybí příznak úplnosti historie.');
 for(const i of s.imports){if(!i||typeof i.name!=='string'||!Number.isSafeInteger(i.count)||i.count<0||!['reconciled','needs-adapter','portfolio'].includes(i.status))throw Error('Neplatný záznam importu.');if(i.status==='reconciled'&&(![i.opening,i.closing,i.income,i.expense].every(Number.isSafeInteger)||i.opening+i.income-i.expense!==i.closing))throw Error('Import nemá platné kontrolní součty.');}
 if(s.issues.some(i=>typeof i!=='string'))throw Error('Neplatné poznámky ke zdrojům.');
 return s;
}
function mergeTransactions(s,rows){const existing=new Set(s.transactions.map(t=>t.id));let count=0;for(const t of rows)if(!existing.has(t.id)){s.transactions.push(t);existing.add(t.id);count++}return count}
const api={VERSION,categories,empty,normalize,classify,transfers,totals,cashflow,validate,mergeTransactions};root.Wealth=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window==='undefined'?globalThis:window);
