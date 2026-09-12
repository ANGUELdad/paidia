/** Static inventory, not a claim that every action has been tested. */
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const functions=[...source.matchAll(/^(?:async )?function ((?:view|sheet|wire|render|confirm|commit|apply|delete|save|start|leave)[A-Z]\w*)\s*\(/gm)].map(m=>({name:m[1],line:source.slice(0,m.index).split('\n').length,coverage:'unreviewed'}));
const staff=['home','schedule','stock','shop','book','kids','pocket','talk','gallery','rules','admin'];
const child=['today','plan','aufgaben','rewards','learn','games','rate','pocket','bonus','notes','events','gallery','rules'];
const output={generatedFrom:'app.js',scope:'Static entry points only; dynamic actions and embedded games require runtime coverage.',routes:{staff,child},functions};
fs.mkdirSync(new URL('../docs/agents/redesign/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('../docs/agents/redesign/inventory.json',import.meta.url),JSON.stringify(output,null,2)+'\n');
console.log(`Inventoried ${functions.length} named entry points; runtime coverage remains explicit.`);
