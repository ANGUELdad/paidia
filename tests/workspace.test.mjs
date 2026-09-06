import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const context={window:{},Map,Set,Object,JSON};vm.runInNewContext(fs.readFileSync(new URL('../shared/workspace.js',import.meta.url),'utf8'),context);
const {reconcile,chooseConflict,Selection}=context.window.PaidiaWorkspace;
const plain=x=>JSON.parse(JSON.stringify(x));
test('independent concurrent records merge without losing either edit',()=>{
 const base={rows:[{id:'a',value:1},{id:'b',value:1}]};
 const result=reconcile(base,{rows:[{id:'a',value:2},{id:'b',value:1}]},{rows:[{id:'a',value:1},{id:'b',value:3}]});
 assert.equal(result.conflicts.length,0);assert.deepEqual(plain(result.value),{rows:[{id:'a',value:2},{id:'b',value:3}]});
});
test('same-field concurrent edit requires explicit resolution',()=>{
 const result=reconcile({stock:{a:5}},{stock:{a:6}},{stock:{a:7}});
 assert.equal(result.conflicts.length,1);assert.equal(result.value.stock.a,7);
 assert.equal(chooseConflict(result.value,result.conflicts[0].path,6).stock.a,6);
});
test('new local work survives an earlier save response',()=>{
 const base={rows:[{id:'a',text:'submitted'}]};
 const result=reconcile(base,{rows:[{id:'a',text:'newer draft'}]},base);
 assert.equal(result.value.rows[0].text,'newer draft');
});
test('delete versus changed record is a conflict',()=>{
 const result=reconcile([{id:'a',v:1}],[],[{id:'a',v:2}]);
 assert.equal(result.conflicts.length,1);
 assert.deepEqual(plain(chooseConflict(result.value,result.conflicts[0].path,undefined)),[]);
});
test('selection scope survives filtering and snapshot cannot be changed',()=>{
 const selection=new Selection();selection.selectVisible(['a','b'],'house-one');
 const snapshot=selection.snapshot();assert.throws(()=>snapshot.push('c'));assert.equal(selection.scope,'house-one');selection.clear();assert.equal(snapshot.length,2);
});
