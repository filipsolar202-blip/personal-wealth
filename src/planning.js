(function(root){
'use strict';
const W=root.Wealth;
function validDate(d){return /^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d}
function positions(s){return ['assets','liabilities','accounts'].flatMap(collection=>s[collection].filter(x=>!x.closed&&(collection!=='accounts'||x.included)).map(x=>({collection,id:x.id,name:x.name,amount:x.amount,date:x.date}))) }
function sumSnapshot(h){h.assets=h.positions.filter(x=>x.collection!=='liabilities').reduce((n,x)=>n+(x.amount||0),0);h.liabilities=h.positions.filter(x=>x.collection==='liabilities').reduce((n,x)=>n+(x.amount||0),0);h.net=h.assets-h.liabilities;h.partial=h.positions.some(x=>x.amount===null);return h}
function monthly(s,date,values){
 if(!validDate(date))throw Error('Vyberte platné datum.');
 const rows=positions(s);if(!rows.length)throw Error('Nejprve přidejte majetek nebo účet.');
 if(rows.some(x=>x.date>date))throw Error('Datum musí být alespoň tak nové jako poslední ocenění otevřených položek. Pro starší období upravte historický stav.');
 const snapshot={id:'monthly:'+date,date,source:'monthly',note:'Měsíční aktualizace majetku',positions:rows.map(x=>{const amount=values[x.collection+':'+x.id];if(amount!==null&&(!Number.isSafeInteger(amount)||amount<0&&x.collection!=='accounts'))throw Error('Vyplňte platné nezáporné hodnoty; účty mohou být přečerpané.');return {...x,amount,date}})};
 for(const row of snapshot.positions){const current=s[row.collection].find(x=>x.id===row.id);current.amount=row.amount;current.date=date}
 // A date represents one balance sheet. Explicit UI confirmation precedes replacement.
 s.history=s.history.filter(h=>h.date!==date);s.history.push(sumSnapshot(snapshot));return snapshot;
}
function refreshAccountSnapshot(s,accountId,date,amount){for(const h of s.history.filter(h=>h.source==='monthly'&&h.date===date)){const row=h.positions.find(x=>x.collection==='accounts'&&x.id===accountId);if(row){row.amount=amount;sumSnapshot(h)}}}
function monthsBetween(start,end){const a=new Date(start+'T12:00:00Z'),b=new Date(end+'T12:00:00Z');return (b.getUTCFullYear()-a.getUTCFullYear())*12+b.getUTCMonth()-a.getUTCMonth()+(b.getUTCDate()-a.getUTCDate())/30.4375}
function forecast(s){
 if(W.totals(s).partial)return {reason:'Doplňte neznámé aktuální hodnoty, aby byl historický odhad srovnatelný.'};
 const rows=s.history.filter(h=>h.source==='monthly').sort((a,b)=>a.date.localeCompare(b.date));
 if(rows.length<3)return {reason:'Pro historický odhad uložte alespoň 3 měsíční aktualizace.'};
 const latest=rows.at(-1),scope=h=>h.positions.map(x=>x.collection+':'+x.id).sort().join('|'),signature=scope(latest);
 const comparable=[];for(const h of rows.toReversed?rows.toReversed():[...rows].reverse()){if(h.partial||scope(h)!==signature)break;comparable.unshift(h);if(comparable.length===12)break}
 const live=positions(s).map(x=>x.collection+':'+x.id).sort().join('|');
 if(live!==signature||comparable.length<3||monthsBetween(comparable[0].date,latest.date)<2)return {reason:'Odhad potřebuje alespoň 3 úplné stavy stejného portfolia za nejméně 2 měsíce. Neúplné stavy ani změny seznamu pozic nesrovnáváme.'};
 const xs=comparable.map(h=>monthsBetween(comparable[0].date,h.date)),mean=xs.reduce((a,b)=>a+b)/xs.length,den=xs.reduce((a,x)=>a+(x-mean)**2,0);
 const slope=k=>{const avg=comparable.reduce((a,h)=>a+h[k],0)/comparable.length;return comparable.reduce((a,h,i)=>a+(xs[i]-mean)*(h[k]-avg),0)/den};
 return {assetMonthly:slope('assets'),debtMonthly:slope('liabilities'),count:comparable.length,from:comparable[0].date,to:latest.date};
}
function plan(s,p,today){if(!validDate(p.date)||p.date<=today)throw Error('Cílové datum musí být v budoucnosti.');for(const k of ['assets','debt','assetMonthly','debtMonthly'])if(!Number.isSafeInteger(p[k])||p[k]<0)throw Error('Plán vyžaduje nezáporné částky.');const t=W.totals(s),months=monthsBetween(today,p.date);return {months,assetRequired:Math.max(0,(p.assets-t.assets)/months),debtRequired:Math.max(0,(t.debt-p.debt)/months),projectedAssets:Math.round(t.assets+p.assetMonthly*months),projectedDebt:Math.round(Math.max(0,t.debt-p.debtMonthly*months)),history:forecast(s)}}
const previousMonth=m=>{const [y,n]=m.split('-').map(Number);return new Date(Date.UTC(y,n-2,1)).toISOString().slice(0,7)};
function expenseTrend(s,month){const prev=previousMonth(month),flags=W.transfers(s),amount=m=>s.transactions.filter(t=>t.date.startsWith(m)&&t.amount<0&&!flags.get(t.id).internal&&!['Investice','Splátky'].includes(W.classify(t,s.rules))).reduce((n,t)=>n-t.amount,0);const observed=m=>s.transactions.some(t=>t.date.startsWith(m))||s.imports.some(i=>i.status==='reconciled'&&i.date?.startsWith(m));return {month,prev,current:amount(month),previous:amount(prev),available:observed(month)&&observed(prev)}}
function wealthTrend(s){const current=W.totals(s),asOf=positions(s).map(x=>x.date).sort().at(-1),previous=[...s.history].filter(h=>h.source==='monthly'&&h.date<asOf).sort((a,b)=>a.date.localeCompare(b.date)).at(-1),scope=xs=>xs.map(x=>x.collection+':'+x.id).sort().join('|');return {current,asOf,previous,comparable:!!previous&&!previous.partial&&!current.partial&&scope(previous.positions)===scope(positions(s))}}
Object.assign(W,{wealthTrend,validDate,positions,monthly,refreshAccountSnapshot,monthsBetween,forecast,plan,expenseTrend});
})(typeof window==='undefined'?globalThis:window);
