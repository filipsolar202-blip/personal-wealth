const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),out=path.join(root,'dist');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
// Explicit allowlist: private data and source statements cannot enter the Pages artifact.
for(const name of ['index.html','assets','src'])fs.cpSync(path.join(root,name),path.join(out,name),{recursive:true});
fs.writeFileSync(path.join(out,'.nojekyll'),'');
let html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const font=fs.readFileSync(path.join(root,'assets/fustat.ttf')).toString('base64');
const css=fs.readFileSync(path.join(root,'assets/style.css'),'utf8').replace('url(fustat.ttf)',`url(data:font/ttf;base64,${font})`);
html=html.replace('<link rel="stylesheet" href="assets/style.css">',`<style>${css}</style>`);
for(const name of ['domain','importers','app'])html=html.replace(`<script src="src/${name}.js"></script>`,`<script>${fs.readFileSync(path.join(root,`src/${name}.js`),'utf8')}</script>`);
html+='\n<!-- Fustat license:\n'+fs.readFileSync(path.join(root,'assets/Fustat-OFL.txt'),'utf8')+'\n-->\n';
fs.writeFileSync(path.join(out,`Personal-Wealth-v${require('../package.json').version}.html`),html);
console.log('Built public app without personal data.');
