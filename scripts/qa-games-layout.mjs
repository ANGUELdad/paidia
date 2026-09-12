import {chromium} from 'playwright';import fs from 'node:fs';
const browser=await chromium.launch();const rows=[];const errors=[];const base='http://127.0.0.1:5173';
try{for(const width of [320,393,834,1440])for(const lang of ['de','el']){
 const c=await browser.newContext({viewport:{width,height:900},hasTouch:width<1000});
 try{const pins=JSON.parse(fs.readFileSync('docs/marketing/.local-auth/pins.json'));const response=await c.request.post(base+'/api/auth/login',{data:{mode:'child',profileId:'k1',pin:pins.k1}});if(!response.ok())throw new Error('Disposable child login failed');
 await c.addInitScript(lang=>{localStorage.setItem('paidia.lang',lang);localStorage.setItem('paidia.kidGuideSeen','1');},lang);
 const p=await c.newPage();p.on('pageerror',e=>errors.push({width,lang,error:e.message}));await p.goto(base+(width<1000?'/m/':'/desk/'));await p.waitForFunction(()=>typeof window.startChildGame==='function');await p.waitForTimeout(1000);
 const ids=await p.evaluate(()=>CHILD_GAMES.map(g=>g.id));
 for(const id of ids){await p.evaluate(id=>{closeSheet();state.childView='games';startChildGame(id);renderChild();},id);await p.waitForTimeout(80);
 rows.push(await p.evaluate(({id,width,lang})=>({id,width,lang,overflow:document.documentElement.scrollWidth>innerWidth+2,fallback:!!document.querySelector('#pageRenderRetry'),content:document.querySelector('#view')?.innerText.length,exit:!!document.querySelector('#gameBack,[data-game-exit]')}),{id,width,lang}));
 await p.locator('#gameBack').click();
 if(await p.evaluate(()=>!!state.gameId))throw new Error('Game exit did not clear session: '+id);
 }
 }finally{await c.close();}
 console.log('Checked games',width,lang);
}}catch(e){errors.push({error:e.message.split('\n')[0]});}finally{await browser.close();}
const failures=rows.filter(r=>r.overflow||r.fallback||r.content<10);
fs.writeFileSync('.qa-screens/implementation-baseline/games-audit.json',JSON.stringify({rows,errors,failures},null,2));console.log(JSON.stringify({pages:rows.length,errors,failures}));if(errors.length||failures.length)process.exitCode=1;
