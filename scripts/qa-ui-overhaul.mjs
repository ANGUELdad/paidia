/** Local-only UI audit. Requires the disposable auth server from the QA runbook.
 * PAIDIA_QA_BASE and PAIDIA_QA_PINS may override local defaults.
 * Never point this script at a production account or print authentication data.
 */
import {chromium} from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const base=process.env.PAIDIA_QA_BASE||'http://127.0.0.1:5173';
if(!['127.0.0.1','localhost'].includes(new URL(base).hostname))throw new Error('Use a disposable local server.');
const pins=JSON.parse(fs.readFileSync(process.env.PAIDIA_QA_PINS||path.join(root,'docs/marketing/.local-auth/pins.json'),'utf8'));
const out=path.join(root,'.qa-screens/v212');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch();const pages=[];const findings=[];
const childRoutes=['today','plan','aufgaben','rewards','learn','games','rate','pocket','bonus','notes','events','gallery','rules'];
const staffRoutes=['admin','stock','book','kids','home','schedule','shop','pocket','rules','talk','gallery'];
try{
for(const width of [320,393,834,1440])for(const lang of ['de','el']){
 for(const [profileId,mode] of [['e4','staff'],['k1','child']]){
  const context=await browser.newContext({viewport:{width,height:900},hasTouch:width<1000,reducedMotion:'reduce'});
  try{
   const response=await context.request.post(base+'/api/auth/login',{data:{profileId,mode,pin:pins[profileId],remember:false}});
   if(!response.ok())throw new Error(`Local QA login failed: ${response.status()}`);
   await context.request.post(base+'/api/auth/onboarding/complete',{data:{version:3}});
   await context.addInitScript(({profileId,mode,lang})=>{
    localStorage.setItem('paidia.lang',lang);localStorage.setItem('paidia.uiMode','pro');
    localStorage.setItem('paidia.kidGuideSeen','1');
    localStorage.setItem(`paidia.tourSeen:${profileId}:${mode}:3`,JSON.stringify({done:true,version:3,index:99}));
    localStorage.setItem(`paidia-contact:${profileId}:${mode}`,JSON.stringify({email:'qa@armonia.test',phone:'+306912345678',at:Date.now()}));
   },{profileId,mode,lang});
   const page=await context.newPage();
   page.on('pageerror',error=>findings.push({width,lang,mode,error:error.message}));
   await page.goto(base,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>typeof window.render==='function'&&!document.body.classList.contains('auth-pending'));
   await page.evaluate(()=>{setUiMode('pro',{scope:'global'});});
   await page.waitForTimeout(1400);
   for(const route of mode==='child'?childRoutes:staffRoutes){
    await page.evaluate(({route,mode})=>{closeSheet();if(mode==='child'){state.childView=route;renderChild();}else{state.tab=route;render();}scrollTo(0,0);},{route,mode});
    await page.waitForTimeout(120);
    const info=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth+2,content:document.querySelector('#view')?.innerText.length||0,fallback:!!document.querySelector('#pageRenderRetry')}));
    pages.push({width,lang,mode,route,...info});
    if(info.overflow||info.fallback||info.content<10)findings.push({width,lang,mode,route,...info});
    if(route==='admin'){
     await page.locator('#adminLegoDay').fill('2026-09-06');await page.locator('#adminLegoRun').click();await page.locator('#adminLegoClear').click();
     if(await page.locator('#adminLegoDay').inputValue())findings.push({width,lang,error:'Date reset failed'});
    }
    if([393,1440].includes(width)&&['admin','stock','today'].includes(route)){
     await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,`audit-${mode}-${route}-${width}-${lang}.png`)});
    }
   }
  }finally{await context.close();}
 }
 console.log(`Checked ${width}px / ${lang}`);
}
}finally{await browser.close();}
fs.writeFileSync(path.join(out,'page-audit.json'),JSON.stringify({build:JSON.parse(fs.readFileSync(path.join(root,'build.json'))).label,pages,findings},null,2));
console.log(JSON.stringify({pages:pages.length,findings}));
if(findings.length)process.exitCode=1;
