/** Run only against the disposable local server. */
import {chromium} from 'playwright';import fs from 'node:fs';import assert from 'node:assert/strict';
const browser=await chromium.launch();const base='http://127.0.0.1:5173';const report={};
try{
 const c=await browser.newContext({viewport:{width:393,height:852}});const pins=JSON.parse(fs.readFileSync('docs/marketing/.local-auth/pins.json'));
 assert.equal((await c.request.post(base+'/api/auth/login',{data:{profileId:'e4',mode:'staff',pin:pins.e4}})).status(),200);
 const p=await c.newPage();await p.goto(base+'/m/');await p.waitForFunction(()=>typeof window.runDomainOperation==='function');await p.waitForTimeout(1200);
 await p.evaluate(async()=>{closeSheet();await pullShared({force:true});state.tab='pocket';state.pocketKidId=DB.children[0].id;render();});
 // Delay the actual command so a second tap reaches the in-flight guard.
 await p.route('**/api/operations',async route=>{await new Promise(r=>setTimeout(r,200));await route.continue();});
 report.repeatedTap=await p.evaluate(async()=>{
  const kidId=DB.children[0].id,before=DB.pocketMoneyTxns.length,old=pocketBalance(kidId);
  const input={kidId,amount:0.13,note:'QA delayed entry'};
  const [first,second]=await Promise.all([postPocketCommand(input),postPocketCommand(input)]);
  return {first,second,added:DB.pocketMoneyTxns.length-before,delta:Math.round((pocketBalance(kidId)-old)*100)};
 });
 assert.deepEqual(report.repeatedTap,{first:true,second:false,added:1,delta:13});
 await p.unroute('**/api/operations');
 report.reversal=await p.evaluate(async()=>{
   const row=DB.pocketMoneyTxns.at(-1),before=DB.pocketMoneyTxns.length;
   const ok=await runDomainOperation('pocket.reverse',{transactionId:row.id,reason:'QA correction'});
   return {ok,added:DB.pocketMoneyTxns.length-before,originalPresent:DB.pocketMoneyTxns.some(r=>r.id===row.id)};
 });assert.deepEqual(report.reversal,{ok:true,added:1,originalPresent:true});
 report.offline=await p.evaluate(async()=>{state.pocketCompose={kind:'in'};render();document.querySelector('#pocketAmt').value='4.50';return DB.pocketMoneyTxns.length;});
 await c.setOffline(true);await p.locator('#pocketSave').click();
 assert.equal(await p.locator('#pocketAmt').inputValue(),'4.50');assert.equal(await p.evaluate(()=>DB.pocketMoneyTxns.length),report.offline);
 await c.setOffline(false);
 report.offline={draftPreserved:true,noOptimisticTransaction:true};
 report.stockAndReceipt=await p.evaluate(async()=>{
   closePocketCompose();const houseId=DB.houses[0].id,product=PRODUCTS()[0],key=stockKey(houseId,product.id);
   if(!Number.isFinite(DB.stock[key])){
     if(!await runDomainOperation('stock.record',{changes:[{houseId,productId:product.id,quantity:0,reason:'QA initial count'}]}))throw new Error('Initial count failed');
   }
   const before=DB.stock[key];
   if(!await runDomainOperation('stock.adjust',{changes:[{houseId,productId:product.id,delta:2,reason:'QA delivery'}]}))throw new Error('Stock adjustment failed');
   const entryId=crypto.randomUUID();
   DB.listEntries.push({id:entryId,houseId,productId:product.id,name:L(product),qty:1,unit:product.unit,status:'pending',decision:'bought'});save();
   const tripCount=DB.shoppingTrips.length;
   const confirmed=await runDomainOperation('shopping.confirm',{houseId,fridayDate:fridayFor(),items:[{entryId,outcome:'bought'}]});
   return {confirmed,stockDelta:DB.stock[key]-before,newTrips:DB.shoppingTrips.length-tripCount,status:DB.listEntries.find(r=>r.id===entryId).status};
 });assert.deepEqual(report.stockAndReceipt,{confirmed:true,stockDelta:3,newTrips:1,status:'bought'});
 // An HTTP replay uses the persisted receipt, independently of client guards.
 const data=await (await c.request.get(base+'/api/ops')).json();
 const command={operationId:crypto.randomUUID(),action:'pocket.post',expectedRevision:data.revision,payload:{changes:[{kidId:data.children[0].id,amountMinor:7,note:'QA replay'}]}};
 const first=await (await c.request.post(base+'/api/operations',{data:command})).json();const replay=await (await c.request.post(base+'/api/operations',{data:command})).json();
 assert.equal(first.durable,true);assert.equal(replay.replayed,true);assert.equal(first.revision,replay.revision);
 report.httpReplay={durable:true,replayed:true,unchangedRevision:true};
 report.attendance=await p.evaluate(async()=>{
  await pullShared({force:true});
  state.tab='kids';state.kidsPane='attendance';state.date='2026-09-07';closeSheet();render();
  const ids=DB.children.slice(0,2).map(k=>k.id);
  const ok=await runDomainOperation('attendance.set',{changes:ids.map(kidId=>({kidId,date:state.date,status:'present'}))});
  return {ok,recorded:ids.filter(id=>attendanceFor(id,state.date)?.status==='present').length};
 });assert.deepEqual(report.attendance,{ok:true,recorded:2});
 await p.evaluate(()=>{state.tab='kids';state.kidsPane='attendance';render();});
 await p.locator('#attSelectionToggle').click();
 await p.locator('[data-att-select]').nth(0).check();await p.locator('[data-att-select]').nth(1).check();
 await p.locator('#attBulkStatus').selectOption('absent');await p.locator('#attBulkPreview').click();
 assert.equal(await p.locator('#sheet li').count(),2);
 await p.screenshot({path:'.qa-screens/implementation-baseline/attendance-bulk-preview.png',fullPage:true});
 await p.locator('#attBulkConfirm').click();await p.waitForFunction(()=>state.attSelectionMode===false);
 report.attendanceBulkUi=await p.evaluate(()=>({selectionCleared:state.attSelected.length===0,absent:DB.children.slice(0,2).every(k=>attendanceFor(k.id,state.date)?.status==='absent')}));
 assert.deepEqual(report.attendanceBulkUi,{selectionCleared:true,absent:true});
 // Seed another child's record to make the privacy assertion non-vacuous.
 await p.evaluate(async()=>{const other=DB.children.find(k=>k.id!=='k1');if(!other)throw new Error('Other child fixture missing');if(!await postPocketCommand({kidId:other.id,amount:0.09,note:'QA private other ledger'}))throw new Error('Other ledger fixture failed');});
 await c.request.post(base+'/api/auth/logout',{data:{}});
 assert.equal((await c.request.post(base+'/api/auth/login',{data:{mode:'child',profileId:'k1',pin:pins.k1}})).status(),200);
 await p.goto(base+'/m/');await p.waitForFunction(()=>typeof window.renderChild==='function'&&document.body.classList.contains('mode-child'));await p.waitForTimeout(300);
 const childPayload=await (await c.request.get(base+'/api/ops')).json();
 assert.equal(childPayload.pocketMoneyTxns.some(r=>r.kidId!=='k1'),false);assert.deepEqual(childPayload.stock,{});assert.deepEqual(childPayload.schoolLessonNotes,[]);
 report.accountSwitch=await p.evaluate(()=>({owner:localStorage.getItem('paidia.cacheOwner'),privateRatings:DB.staffKidRatings.length,otherLedgers:DB.pocketMoneyTxns.filter(r=>r.kidId!==state.child.id).length,staffSession:!!state.user}));
 assert.deepEqual(report.accountSwitch,{owner:'child:k1',privateRatings:0,otherLedgers:0,staffSession:false});
 console.log(JSON.stringify(report));
 fs.writeFileSync('.qa-screens/implementation-baseline/domain-workflows.json',JSON.stringify(report,null,2));
}catch(e){console.log('Workflow test failed:',e.message.split('\n')[0]);if(e.code==='ERR_ASSERTION')console.log(JSON.stringify({actual:e.actual,expected:e.expected}));process.exitCode=1;}finally{await browser.close();}
