import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../app.js',import.meta.url),'utf8');
const start=source.indexOf('function adminOpsFilterRows(){');
const end=source.indexOf('\nfunction operationsOverviewHtml',start);
function filter(q,DB){
 const context={DB,adminOpsLegoState:()=>q,iso:d=>d.toISOString().slice(0,10),typeLabel:x=>x,t:x=>x};
 return vm.runInNewContext(source.slice(start,end)+';adminOpsFilterRows()',context);
}
test('operational records sort chronologically across transaction types',()=>{
 const rows=filter({}, {log:[{ts:1000,type:'IN',text:'earlier'}],pocketMoneyTxns:[{ts:3000,amount:2}],children:[]});
 assert.equal(rows[0].kind,'pocket');assert.equal(rows[1].kind,'log');
});
test('house filters exclude unrelated and unattributed records',()=>{
 const rows=filter({houseId:'h1'}, {log:[{ts:1000,houseId:'h2'},{ts:2000},{ts:3000,houseId:'h1'}],pocketMoneyTxns:[{ts:4000,houseId:'h2'}]});
 assert.equal(rows.length,1);assert.equal(rows[0].ts,3000);
});
test('unknown children cannot match arbitrary log records',()=>{
 assert.equal(filter({kidId:'unknown'},{log:[{ts:1000,text:'Unrelated'}],children:[]}).length,0);
});
test('results remain capped after chronological ordering',()=>{
 const rows=filter({}, {log:Array.from({length:100},(_,i)=>({ts:i+1,text:String(i)}))});
 assert.equal(rows.length,80);assert.equal(rows[0].ts,100);assert.equal(rows[79].ts,21);
});
