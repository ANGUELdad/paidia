/* Shared interaction and command primitives. No page-specific layout rules. */
(function(global){
 'use strict';
 const copy={
  de:{saving:'Wird gespeichert …',saved:'Gespeichert',failed:'Nicht gespeichert. Bitte erneut versuchen.',conflict:'Die Daten wurden inzwischen geändert. Prüfe die aktuellen Werte.',offline:'Offline. Änderungen sind noch nicht gespeichert.',retry:'Erneut versuchen',selected:'ausgewählt',clear:'Auswahl aufheben',all:'Alle angezeigten auswählen',working:'Wird ausgeführt …'},
  el:{saving:'Αποθήκευση …',saved:'Αποθηκεύτηκε',failed:'Δεν αποθηκεύτηκε. Δοκίμασε ξανά.',conflict:'Τα δεδομένα έχουν αλλάξει. Έλεγξε τις τρέχουσες τιμές.',offline:'Χωρίς σύνδεση. Οι αλλαγές δεν έχουν αποθηκευτεί ακόμη.',retry:'Δοκίμασε ξανά',selected:'επιλεγμένα',clear:'Καθαρισμός επιλογής',all:'Επιλογή όλων των εμφανιζόμενων',working:'Εκτέλεση …'}
 };
 const text=key=>{
  const lang=(global.state&&global.state.lang)
    || localStorage.getItem('paidia.lang')
    || document.documentElement.lang
    || 'de';
  return (copy[lang==='el'?'el':'de'][key]||key);
 };
 let requestCounter=0;
 const latestRequests=new Map();
 async function search(key,url){
  latestRequests.get(key)?.abort();const controller=new AbortController();latestRequests.set(key,controller);
  try{const response=await fetch(url,{credentials:'same-origin',signal:controller.signal});if(!response.ok)throw new Error('request_failed');return await response.json();}
  finally{if(latestRequests.get(key)===controller)latestRequests.delete(key);}
 }
 function status(kind,retry){
  let bar=document.getElementById('workspaceSaveStatus');
  if(!bar){bar=document.createElement('div');bar.id='workspaceSaveStatus';bar.className='workspace-status';bar.setAttribute('role','status');bar.setAttribute('aria-live','polite');document.getElementById('app')?.append(bar);}
  bar.dataset.status=kind;bar.replaceChildren();
  const label=document.createElement('span');label.textContent=text(kind);bar.append(label);
  if(retry){const button=document.createElement('button');button.type='button';button.textContent=text('retry');button.onclick=retry;bar.append(button);}
  clearTimeout(status.timer);
  if(kind==='saved')status.timer=setTimeout(()=>bar.remove(),3500);
 }
 async function command(action,payload,revision,operationId){
  const id=operationId||global.crypto?.randomUUID?.()||('op-'+Date.now()+'-'+(++requestCounter));
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
  try{
   const response=await fetch('/api/operations',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({operationId:id,action,expectedRevision:revision,payload})});
   const data=await response.json();
   if(!response.ok){const error=new Error(data.error||'Operation failed');error.status=response.status;error.data=data;error.operationId=id;throw error;}
   return data;
  }finally{clearTimeout(timer);}
 }
 function captureFocus(){
  const el=document.activeElement;
  if(!el?.id||!el.closest('#view')||!el.matches('input,textarea,select'))return null;
  return {id:el.id,value:el.value,start:el.selectionStart,end:el.selectionEnd,x:scrollX,y:scrollY};
 }
 function restoreFocus(snapshot){
  if(!snapshot)return;const el=document.getElementById(snapshot.id);if(!el)return;
  el.value=snapshot.value;el.focus({preventScroll:true});
  try{el.setSelectionRange(snapshot.start,snapshot.end);}catch{}
  scrollTo(snapshot.x,snapshot.y);
 }
 const stateKeys=['tab','childView','date','house','scheduleView','calendarMonth','shopPanel','shopFriday','kidsPane','kidId','pocketKidId','adminSection','adminPane','adminWorkerId','adminAuditQuery','adminAuditLimit','stockQuery','stockFilter','stockDraft','stockDraftReason','stockOpenCategories','selectMode','selectedIds','bookDraft','bookDate','bookHouse','pocketCompose','attSelectionMode','attSelected','attBulkStatus'];
 function stash(state){
  const owner=state.user?.id||state.child?.id;if(!owner)return;
  const snapshot={owner,mode:state.mode,at:Date.now(),state:{},fields:[]};
  stateKeys.forEach(key=>{if(state[key]!==undefined)snapshot.state[key]=state[key];});
  document.querySelectorAll('#view input[id],#view textarea[id],#view select[id]').forEach(el=>{
   if(!['password','file','hidden'].includes(el.type))snapshot.fields.push({id:el.id,value:el.value,checked:el.checked});
  });
  try{sessionStorage.setItem('paidia.workspaceSwitch',JSON.stringify(snapshot));}catch{}
 }
 function restore(state){
  let snapshot;try{snapshot=JSON.parse(sessionStorage.getItem('paidia.workspaceSwitch')||'null');}catch{return false;}
  if(!snapshot)return false;
  const owner=state.user?.id||state.child?.id;if(!owner)return false;
  sessionStorage.removeItem('paidia.workspaceSwitch');
  if(snapshot.owner!==owner||snapshot.mode!==state.mode||Date.now()-snapshot.at>3600000)return false;
  Object.assign(state,snapshot.state);
  requestAnimationFrame(()=>snapshot.fields.forEach(field=>{const el=document.getElementById(field.id);if(el){el.value=field.value;if(el.type==='checkbox')el.checked=field.checked;}}));
  return true;
 }
 class Selection{
  constructor(){this.ids=new Set();this.scope='';this.anchor=null;}
  toggle(id,visible,{range=false}={}){const index=visible.indexOf(id);if(range&&this.anchor!==null){visible.slice(Math.min(index,this.anchor),Math.max(index,this.anchor)+1).forEach(x=>this.ids.add(x));}else if(this.ids.has(id))this.ids.delete(id);else this.ids.add(id);this.anchor=index;}
  selectVisible(ids,scope){this.ids=new Set(ids);this.scope=scope;}
  clear(){this.ids.clear();this.scope='';this.anchor=null;}
  snapshot(){return Object.freeze([...this.ids]);}
 }
 function reconcile(base,mine,theirs){
  const conflicts=[];
  const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
  const keyed=x=>Array.isArray(x)&&x.every(r=>object(r)&&typeof r.id==='string')&&new Set(x.map(r=>r.id)).size===x.length;
  function merge(a,b,c,path){
   if(equal(b,c))return b;
   if(equal(a,b))return c;
   if(equal(a,c))return b;
   if(object(a)&&object(b)&&object(c)){
    const out={};for(const key of new Set([...Object.keys(a),...Object.keys(b),...Object.keys(c)])){const v=merge(a[key],b[key],c[key],[...path,key]);if(v!==undefined)out[key]=v;}return out;
   }
   if(keyed(a)&&keyed(b)&&keyed(c)){
    const maps=[a,b,c].map(rows=>Object.fromEntries(rows.map(r=>[r.id,r])));
    const out=[];for(const id of new Set([...c.map(r=>r.id),...b.map(r=>r.id),...a.map(r=>r.id)])){const v=merge(maps[0][id],maps[1][id],maps[2][id],[...path,{id}]);if(v!==undefined)out.push(v);}return out;
   }
   conflicts.push({path,before:a,mine:b,theirs:c});return c;
  }
  return {value:merge(base,mine,theirs,[]),conflicts};
 }
 function chooseConflict(value,path,replacement){
  if(!path.length)return replacement;
  let target=value;
  for(const part of path.slice(0,-1)){target=typeof part==='object'?target.find(row=>row.id===part.id):target[part];if(target==null)return value;}
  const last=path.at(-1);
  if(typeof last==='object'){
   const index=target.findIndex(row=>row.id===last.id);
   if(replacement===undefined){if(index>=0)target.splice(index,1);}else if(index>=0)target[index]=replacement;else target.push(replacement);
  }else if(replacement===undefined)delete target[last];else target[last]=replacement;
  return value;
 }
 global.PaidiaWorkspace={text,search,status,command,reconcile,chooseConflict,captureFocus,restoreFocus,stash,restore,Selection};
})(window);
