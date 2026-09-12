/** Local role/language/viewport render matrix. Does not certify all actions. */
import {chromium,firefox,webkit} from 'playwright';import fs from 'node:fs';
const base='http://127.0.0.1:5173';const pins=JSON.parse(fs.readFileSync('docs/marketing/.local-auth/pins.json'));
const widths=[320,360,393,430,768,834,1024,1280,1440,1920];
const staff=['home','schedule/day','schedule/week','schedule/calendar','stock','shop/plan','shop/take','shop/requests','book','kids','kids/attendance','kids/homework','kids/materials','pocket','talk','gallery/feed','gallery/people','gallery/compose','rules','admin/ops','admin/team','admin/supplies','admin/school','admin/review','admin/communications','admin/automations','admin/finance','admin/audit','admin/system','account/overview','account/devices','account/notifications','account/pin','account/session','school/lessons','school/subjects','school/kids','personnel'];
const child=['today','plan','aufgaben','rewards','learn','games','rate','pocket','bonus','notes','events','gallery','rules'];
const report={build:JSON.parse(fs.readFileSync('build.json')).version,rows:[],errors:[]};
for(const [engine,type] of Object.entries({chromium,firefox,webkit})){
 const browser=await type.launch();
 try{for(const width of widths)for(const lang of ['de','el'])for(const mode of ['staff','child']){
 const context=await browser.newContext({viewport:{width,height:900},hasTouch:width<1024,reducedMotion:'reduce'});
 const profileId=mode==='staff'?'e4':'k1';
 try{
  const login=await context.request.post(base+'/api/auth/login',{data:{profileId,mode,pin:pins[profileId]}});if(!login.ok())throw new Error('Login '+login.status());
  await context.addInitScript(({lang,profileId,mode})=>{localStorage.setItem('paidia.lang',lang);localStorage.setItem('paidia.uiMode','pro');localStorage.setItem('paidia.kidGuideSeen','1');localStorage.setItem(`paidia.tourSeen:${profileId}:${mode}:3`,JSON.stringify({done:true,version:3,index:99}));},{lang,profileId,mode});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push({engine,width,lang,mode,error:e.message}));
  await page.goto(base+(width<1024?'/m/':'/desk/'));await page.waitForFunction(()=>typeof window.render==='function');await page.waitForTimeout(250);
  for(const route of mode==='staff'?staff:child){
   await page.evaluate(({route,mode})=>{closeSheet();if(mode==='child'){state.childView=route;renderChild();}else{location.hash=route;applyRouteFromHash();render();}scrollTo(0,0);},{route,mode});
   await page.waitForTimeout(20);
   report.rows.push(await page.evaluate(({engine,width,lang,mode,route})=>({engine,width,lang,mode,route,overflow:document.documentElement.scrollWidth>innerWidth+2,fallback:!!document.querySelector('#pageRenderRetry'),content:document.querySelector('#view')?.innerText.length||0}),{engine,width,lang,mode,route}));
  }
 }catch(e){report.errors.push({engine,width,lang,mode,error:e.message.split('\n')[0]});}finally{await context.close();}
 if(mode==='child')console.log(engine,width,lang);
 }}finally{await browser.close();}
 fs.writeFileSync('.qa-screens/implementation-baseline/route-matrix.json',JSON.stringify(report,null,2));
}
const failures=report.rows.filter(r=>r.overflow||r.fallback||r.content<10);
console.log(JSON.stringify({build:report.build,pages:report.rows.length,errors:report.errors,failures}));if(failures.length||report.errors.length)process.exitCode=1;
