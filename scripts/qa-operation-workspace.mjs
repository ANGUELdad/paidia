/** Disposable local accounts only. Logs no request headers or credentials. */
import {chromium,firefox,webkit} from 'playwright';
import fs from 'node:fs';
const base='http://127.0.0.1:5173';
const pins=JSON.parse(fs.readFileSync('docs/marketing/.local-auth/pins.json'));
const results=[];
for(const [engine,type] of Object.entries({chromium,firefox,webkit})){
 let browser;
 try{browser=await type.launch();}catch{results.push({engine,unavailable:true});continue;}
 try{for(const width of [320,393,834,1440])for(const shell of ['m','desk']){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 try{
 await context.request.post(base+'/api/auth/login',{data:{profileId:'e4',mode:'staff',pin:pins.e4}});
 await context.addInitScript(()=>{localStorage.setItem('paidia.uiMode','pro');localStorage.setItem('paidia.tourSeen:e4:staff:3',JSON.stringify({done:true,version:3,index:99}));});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/'+shell+'/#admin/system');await page.waitForFunction(()=>typeof window.render==='function'&&!!window.PaidiaWorkspace);await page.waitForTimeout(1200);
 const boot=await page.evaluate(()=>({path:location.pathname,shell:document.documentElement.dataset.shell}));
 await page.evaluate(()=>{closeSheet();state.tab='admin';state.adminPane='system';render();});
 const sections=[];
 for(const section of ['ops','team','supplies','school','review','finance','audit','communications','automations','system']){
 await page.evaluate(section=>{state.adminPane=section;render();},section);
 sections.push(await page.evaluate(()=>({pane:state.adminPane,overflow:document.documentElement.scrollWidth>innerWidth+2,fallback:!!document.querySelector('#pageRenderRetry'),content:document.querySelector('#view').innerText.length})));
 }
 await page.evaluate(()=>openSheet('<h2>Dialog</h2><input id="qaField"><button id="qaAction">Save</button>'));
 await page.keyboard.press('Tab');const focused=await page.evaluate(()=>document.activeElement.closest('#sheet')!==null);
 await page.keyboard.press('Escape');const closed=await page.evaluate(()=>!document.body.classList.contains('sheet-open')&&!document.getElementById('app').inert);
 results.push({engine,width,shell,boot,sections,focused,closed,errors});
 if(width===393&&shell==='m')await page.screenshot({path:'.qa-screens/implementation-baseline/admin-'+engine+'.png',fullPage:true});
 }finally{await context.close();}
 } }catch(e){results.push({engine,error:e.message.split('\n')[0]});}finally{await browser.close();}
}
fs.writeFileSync('.qa-screens/implementation-baseline/workspace-audit.json',JSON.stringify(results,null,2));
const failures=results.filter(r=>r.error||r.errors?.length||r.focused===false||r.closed===false||r.boot?.shell!==r.shell&&r.boot||r.sections?.some(s=>s.overflow||s.fallback||s.content<20));
console.log(JSON.stringify({checks:results.length,unavailable:results.filter(r=>r.unavailable).map(r=>r.engine),failures},null,2));
if(failures.length)process.exitCode=1;
