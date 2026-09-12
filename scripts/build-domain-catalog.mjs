/** Export trusted operational references from the existing client seed. */
import fs from 'node:fs';import vm from 'node:vm';
const source=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const match=source.match(/const SEED = (\{[\s\S]*?\n\});/);
if(!match)throw new Error('SEED not found');
const seed=vm.runInNewContext('('+match[1]+')',{}, {timeout:1000});
fs.writeFileSync(new URL('../domain-catalog.json',import.meta.url),JSON.stringify({houses:seed.houses,products:seed.products},null,2)+'\n');
console.log('Updated domain-catalog.json');
