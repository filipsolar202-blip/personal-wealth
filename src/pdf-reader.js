(function(root){
'use strict';
const base=new URL('../assets/vendor/',document.currentScript.src||location.href);
let library;
async function load(){if(!library)library=(async()=>{if(root.PW_PDF_SOURCES){const blob=s=>URL.createObjectURL(new Blob([Uint8Array.from(atob(s),c=>c.charCodeAt(0))],{type:'text/javascript'}));const core=blob(root.PW_PDF_SOURCES.core),worker=blob(root.PW_PDF_SOURCES.worker);const pdf=await import(core);pdf.GlobalWorkerOptions.workerSrc=worker;return pdf}const pdf=await import(new URL('pdf.min.mjs',base).href);pdf.GlobalWorkerOptions.workerSrc=new URL('pdf.worker.min.mjs',base).href;return pdf})();return library;}
async function extract(data,progress=()=>{}){let task;try{const pdf=await load();task=pdf.getDocument({data,useSystemFonts:true,isEvalSupported:false,stopAtErrors:true});const doc=await task.promise;if(doc.numPages>100)throw Error('Výpis má více než 100 stran. Rozdělte ho na měsíční výpisy.');const pages=[];for(let i=1;i<=doc.numPages;i++){progress(`Čtu stranu ${i} z ${doc.numPages}…`);const page=await doc.getPage(i),content=await page.getTextContent();pages.push(content.items.filter(x=>typeof x.str==='string').map(x=>({s:x.str,x:x.transform[4],y:x.transform[5],w:x.width})));page.cleanup()}return pages}catch(e){if(e.name==='PasswordException')throw Error('PDF je chráněné heslem. Nahrajte odemčenou kopii výpisu.');if(e.name==='InvalidPDFException')throw Error('PDF je poškozené nebo neplatné.');throw e}finally{if(task)await task.destroy()}}
root.WealthPDF={extract};
})(window);
