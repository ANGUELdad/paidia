/* ── Staff school / kids (v103–v104) ─────────────────────────────────── */
const DEFAULT_SUBJECTS = [
  {id:'sub-math', de:'Mathe', el:'Μαθηματικά', active:true},
  {id:'sub-de', de:'Deutsch', el:'Γερμανικά', active:true},
  {id:'sub-el', de:'Griechisch', el:'Ελληνικά', active:true},
  {id:'sub-en', de:'Englisch', el:'Αγγλικά', active:true},
  {id:'sub-sport', de:'Sport', el:'Αθλητισμός', active:true},
];

function ensureSchoolDb(){
  if(!Array.isArray(DB.subjects) || !DB.subjects.length) DB.subjects = structuredClone(DEFAULT_SUBJECTS);
  ['subjectGrades','attendance','homework','schoolTimetable','kidRatings','kidNotes'].forEach(k=>{
    if(!Array.isArray(DB[k])) DB[k] = [];
  });
}

function activeSubjects(){
  ensureSchoolDb();
  return (DB.subjects||[]).filter(s=>s && s.active!==false);
}

function subjectById(id){ return (DB.subjects||[]).find(s=>s.id===id); }

function subjectLabel(s){
  if(!s) return '?';
  return state.lang==='el' ? (s.el||s.de||s.id) : (s.de||s.el||s.id);
}

function matchKid(query){
  const q = norm(String(query||''));
  if(!q) return null;
  return (DB.children||[]).find(k=>norm(k.name)===q || norm(k.name).includes(q) || q.includes(norm(k.name)))
    || (DB.children||[]).find(k=>k.id===query);
}

function matchSubject(query){
  const q = norm(String(query||''));
  if(!q) return null;
  return activeSubjects().find(s=>norm(s.de)===q || norm(s.el)===q || s.id===query)
    || activeSubjects().find(s=>norm(s.de).includes(q) || norm(s.el).includes(q) || q.includes(norm(s.de)));
}

function subjectGradeFor(kidId, subjectId, week){
  const wk = week || kidWeekKey();
  const hit = (DB.subjectGrades||[]).find(g=>g.kidId===kidId && g.subjectId===subjectId && g.week===wk);
  return hit ? Number(hit.score)||0 : 0;
}

function setSubjectGrade(kidId, subjectId, score, note){
  ensureSchoolDb();
  const wk = kidWeekKey();
  const sc = Math.max(1, Math.min(5, Math.round(Number(score)||0)));
  if(!(sc>=1)) return false;
  const hit = DB.subjectGrades.find(g=>g.kidId===kidId && g.subjectId===subjectId && g.week===wk);
  if(hit){ hit.score=sc; hit.ts=Date.now(); if(note!=null) hit.note=String(note).slice(0,200); }
  else DB.subjectGrades.push({id:uid(), kidId, subjectId, score:sc, note:note?String(note).slice(0,200):'', week:wk, ts:Date.now()});
  return true;
}

function attendanceFor(kidId, dateStr){
  return (DB.attendance||[]).find(a=>a.kidId===kidId && a.date===dateStr);
}

function setAttendance(kidId, dateStr, status){
  ensureSchoolDb();
  const st = ['present','absent','excused'].includes(status) ? status : 'present';
  const hit = DB.attendance.find(a=>a.kidId===kidId && a.date===dateStr);
  if(hit){ hit.status=st; hit.ts=Date.now(); }
  else DB.attendance.push({id:uid(), kidId, date:dateStr, status:st, ts:Date.now()});
  return true;
}

function starsHtml(score, {interactive=false, kidId='', subjectId=''}={}){
  const s = Math.max(0, Math.min(5, Number(score)||0));
  const cells=[];
  for(let i=1;i<=5;i++){
    const on = i<=s;
    if(interactive){
      cells.push(`<button type="button" class="school-star ${on?'on':''}" data-grade-kid="${esc(kidId)}" data-grade-sub="${esc(subjectId)}" data-grade-val="${i}" aria-label="${i}">★</button>`);
    }else{
      cells.push(`<span class="school-star ${on?'on':''}" aria-hidden="true">★</span>`);
    }
  }
  return `<span class="school-stars" role="img" aria-label="${s}/5">${cells.join('')}</span>`;
}

function homeShiftCompletionPct(user){
  if(!user) return 0;
  const today=iso(new Date());
  const assign=dashboardAssignments(today,user.id);
  if(!assign.length) return 100;
  const done=assign.filter(e=>completionFor(today,e.id,user.id)).length;
  return Math.round((done/assign.length)*100);
}

function homeTaskDoneSpark7(user){
  if(!user) return [];
  const out=[];
  for(let i=6;i>=0;i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    const ds=iso(d);
    const assign=dashboardAssignments(ds,user.id);
    out.push(assign.filter(e=>completionFor(ds,e.id,user.id)).length);
  }
  return out;
}

function planDayLoadPct(dateStr){
  const all=entriesFor(dateStr).filter(e=>!e.cancelled);
  const cap=Math.max(6, BLOCKS.length*2);
  return Math.min(100, Math.round((all.length/cap)*100));
}

function stockQtySparkHistory(hid){
  /* Optional: derive from recent OUT/IN log counts per day — omit if empty. */
  const days=[];
  for(let i=6;i>=0;i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    const ds=iso(d);
    const n=(DB.log||[]).filter(L=>{
      if(!L || (L.type!=='IN' && L.type!=='OUT')) return false;
      const t=L.ts?iso(new Date(L.ts)): '';
      return t===ds && (!hid || hid==='all' || L.houseId===hid);
    }).length;
    days.push(n);
  }
  return days.some(n=>n>0) ? days : [];
}

function viewKids(){
  ensureSchoolDb();
  if(state.staffKidId) return viewKidProfile(state.staffKidId);
  const pane=state.kidsPane||'directory';
  const kids=(DB.children||[]).filter(k=>!k.temporary || true);
  const dir=kids.map(k=>{
    const xp=kidXp(k.id);
    const lv=kidLevel(xp);
    const att=attendanceFor(k.id, state.date||iso(new Date()));
    const attLbl=att?t('att_'+att.status):'·';
    return `<button type="button" class="kid-dir-card pine-settle" data-open-kid="${k.id}">
      <span class="kid-dir-av" style="background:${esc(k.color||'#c7d2fe')}">${esc((k.name||'?')[0]||'?')}</span>
      <span class="grow"><b>${esc(k.name)}</b><small>Lv ${lv} · ${xp} XP · ${esc(attLbl)}</small></span>
      ${ui('u-person','sm')}
    </button>`;
  }).join('');
  const tabs=`<div class="kids-pane-tabs" role="tablist">
    <button type="button" class="chip ${pane==='directory'?'on':''}" data-kids-pane="directory">${esc(t('navKids'))}</button>
    <button type="button" class="chip ${pane==='attendance'?'on':''}" data-kids-pane="attendance">${esc(t('schoolAttendance'))}</button>
    <button type="button" class="chip ${pane==='homework'?'on':''}" data-kids-pane="homework">${esc(t('schoolHomework'))}</button>
    <button type="button" class="chip ${pane==='timetable'?'on':''}" data-kids-pane="timetable">${esc(t('schoolTimetable'))}</button>
    ${isAdminUser()?`<button type="button" class="chip ${pane==='subjects'?'on':''}" data-kids-pane="subjects">${esc(t('schoolSubjects'))}</button>`:''}
  </div>`;
  let body='';
  if(pane==='directory') body=`<div class="kid-dir-list">${dir||emptyState(ui('u-person'), t('kidsEmpty'))}</div>`;
  else if(pane==='attendance') body=viewAttendanceGrid();
  else if(pane==='homework') body=viewHomeworkStaff();
  else if(pane==='timetable') body=viewSchoolTimetable();
  else if(pane==='subjects' && isAdminUser()) body=viewSubjectsAdmin();
  else body=`<div class="kid-dir-list">${dir}</div>`;
  return `<div class="kids-shell">
    <header class="ops-hero kids-hero hero-texture">
      <p class="brand-kicker">Armonia</p>
      <h2>${esc(t('titleKids'))}</h2>
      <p>${esc(t('kidsHeroHint'))}</p>
    </header>
    ${tabs}
    ${body}
  </div>`;
}

function viewKidProfile(kidId){
  ensureSchoolDb();
  const k=kid(kidId); if(!k){ state.staffKidId=null; return viewKids(); }
  const xp=kidXp(k.id), lv=kidLevel(xp), pct=Math.min(100, Math.round((xp%100)));
  const wk=kidWeekKey();
  const subs=activeSubjects().map(s=>{
    const sc=subjectGradeFor(k.id, s.id, wk);
    return `<div class="school-sub-row">
      <span class="grow">${esc(subjectLabel(s))}</span>
      ${starsHtml(sc,{interactive:true,kidId:k.id,subjectId:s.id})}
    </div>`;
  }).join('');
  const rates=KID_RATE_AREAS.map(a=>{
    const v=kidRating(k.id,a.id,wk);
    return `<div class="school-sub-row"><span class="grow">${esc(t(a.key))}</span>${starsHtml(v)}</div>`;
  }).join('');
  const notes=(DB.kidNotes||[]).filter(n=>n.kidId===k.id).sort((a,b)=>b.ts-a.ts).slice(0,5)
    .map(n=>`<li><small>${esc(new Date(n.ts).toLocaleDateString())}</small> ${esc(n.text||'')}</li>`).join('')
    || `<li class="muted">${esc(t('kidNotesEmpty'))}</li>`;
  const recent=entriesFor(state.date||iso(new Date())).filter(e=>(e.childIds||[]).includes(k.id)).slice(0,6)
    .map(e=>`<li>${esc(actLabel(e.activityId))}</li>`).join('') || `<li class="muted">${esc(t('noTasks'))}</li>`;
  const attWeek=[];
  for(let i=0;i<7;i++){
    const d=new Date(); d.setDate(d.getDate()-((d.getDay()+6)%7)+i);
    const ds=iso(d);
    const a=attendanceFor(k.id,ds);
    attWeek.push(`<button type="button" class="att-chip ${a?a.status:''}" data-att-kid="${k.id}" data-att-date="${ds}" data-att-cycle="1">${DAY_NAMES[state.lang][(d.getDay()+6)%7]} ${a?t('att_'+a.status):'—'}</button>`);
  }
  const hw=(DB.homework||[]).filter(h=>!h.kidId || h.kidId===k.id).slice(0,8)
    .map(h=>`<label class="hw-row"><input type="checkbox" data-hw-toggle="${h.id}" ${h.done?'checked':''}/> <span>${esc(h.title||'')}</span></label>`).join('')
    || `<p class="muted">${esc(t('hwEmpty'))}</p>`;
  return `<div class="kids-shell kid-profile">
    <button type="button" class="btn ghost sm" id="kidProfileBack">← ${esc(t('navKids'))}</button>
    <header class="kid-profile-mast hero-texture">
      <span class="kid-dir-av lg" style="background:${esc(k.color||'#c7d2fe')}">${esc((k.name||'?')[0])}</span>
      <div><p class="brand-kicker">Armonia</p><h2>${esc(k.name)}</h2>
        <div class="row" style="gap:12px;align-items:center;margin-top:8px">
          ${ringHtml(pct, 'Lv '+lv, 'pine')}
          ${kidStreakHtml(k.id)}
        </div>
      </div>
    </header>
    <section class="card pine-settle"><div class="block-h"><span class="t">${esc(t('schoolSubjects'))}</span><span class="hrs">${esc(t('thisWeek'))}</span></div>${subs}</section>
    <section class="card pine-settle"><div class="block-h"><span class="t">${esc(t('kidNavRate'))}</span></div>${rates}</section>
    <section class="card pine-settle"><div class="block-h"><span class="t">${esc(t('schoolAttendance'))}</span></div><div class="att-week">${attWeek.join('')}</div></section>
    <section class="card pine-settle"><div class="block-h"><span class="t">${esc(t('schoolHomework'))}</span></div>${hw}</section>
    <section class="card pine-settle"><div class="block-h"><span class="t">${esc(t('kidNotesTitle'))}</span></div>
      <div class="row" style="gap:8px;margin-bottom:8px">
        <input id="staffKidNote" class="inp grow" placeholder="${esc(t('kidNotesPlaceholder'))}"/>
        <button type="button" class="btn sm" id="staffKidNoteSave" data-note-kid="${k.id}">${esc(t('kidNotesSave'))}</button>
      </div>
      <ul class="kid-note-list">${notes}</ul>
    </section>
    <section class="card pine-settle"><div class="block-h"><span class="t">${esc(t('headerScheduleDay'))}</span></div><ul>${recent}</ul></section>
  </div>`;
}

function viewAttendanceGrid(){
  const ds=state.date||iso(new Date());
  const rows=(DB.children||[]).map(k=>{
    const a=attendanceFor(k.id,ds);
    const st=a?.status||'';
    return `<div class="att-grid-row">
      <button type="button" class="linkish" data-open-kid="${k.id}"><b>${esc(k.name)}</b></button>
      <div class="att-btns">
        <button type="button" class="chip ${st==='present'?'on':''}" data-att-kid="${k.id}" data-att-date="${ds}" data-att-status="present">${esc(t('att_present'))}</button>
        <button type="button" class="chip ${st==='absent'?'on':''}" data-att-kid="${k.id}" data-att-date="${ds}" data-att-status="absent">${esc(t('att_absent'))}</button>
        <button type="button" class="chip ${st==='excused'?'on':''}" data-att-kid="${k.id}" data-att-date="${ds}" data-att-status="excused">${esc(t('att_excused'))}</button>
      </div>
    </div>`;
  }).join('');
  return `<div class="att-grid card"><div class="block-h"><span class="t">${esc(eventDayLabel(ds))}</span>
    <input type="date" id="attDatePick" value="${ds}"/></div>${rows}</div>`;
}

function viewHomeworkStaff(){
  ensureSchoolDb();
  const list=(DB.homework||[]).slice().sort((a,b)=>(a.due||'').localeCompare(b.due||'')).map(h=>{
    const sub=subjectById(h.subjectId);
    const kidN=h.kidId?kid(h.kidId)?.name:'';
    const meta=[subjectLabel(sub), h.due, kidN].filter(Boolean).join(' · ');
    return `<label class="hw-row card">
      <input type="checkbox" data-hw-toggle="${h.id}" ${h.done?'checked':''}/>
      <span class="grow"><b>${esc(h.title||'')}</b><small>${esc(meta)}</small></span>
    </label>`;
  }).join('') || emptyState(ui('u-book'), t('hwEmpty'));
  const subOpts=activeSubjects().map(s=>`<option value="${s.id}">${esc(subjectLabel(s))}</option>`).join('');
  const kidOpts=`<option value="">${esc(t('hwAllKids'))}</option>`+(DB.children||[]).map(k=>`<option value="${k.id}">${esc(k.name)}</option>`).join('');
  return `<div class="hw-staff">
    <form class="card pine-settle" id="hwAddForm">
      <div class="block-h"><span class="t">${esc(t('hwAdd'))}</span></div>
      <input name="title" class="inp" required placeholder="${esc(t('hwTitlePh'))}"/>
      <div class="row" style="gap:8px;margin-top:8px">
        <select name="subjectId" class="inp grow">${subOpts}</select>
        <input name="due" type="date" class="inp" value="${iso(new Date())}"/>
      </div>
      <select name="kidId" class="inp" style="margin-top:8px">${kidOpts}</select>
      <button class="btn" type="submit" style="margin-top:10px">${esc(t('hwAdd'))}</button>
    </form>
    <div class="hw-list">${list}</div>
  </div>`;
}

function viewSchoolTimetable(){
  ensureSchoolDb();
  const days=DAY_NAMES[state.lang];
  const slots=(DB.schoolTimetable||[]).slice().sort((a,b)=>(a.day-b.day)||String(a.from).localeCompare(String(b.from)));
  const byDay=[0,1,2,3,4,5,6].map(di=>{
    const rows=slots.filter(s=>Number(s.day)===di).map(s=>{
      const sub=subjectById(s.subjectId);
      return `<div class="tt-slot"><b>${esc(s.from||'')}–${esc(s.to||'')}</b> ${esc(subjectLabel(sub))}</div>`;
    }).join('') || `<p class="muted">${esc(t('ttEmpty'))}</p>`;
    return `<section class="card pine-settle tt-day"><div class="block-h"><span class="t">${esc(days[di])}</span></div>${rows}</section>`;
  }).join('');
  const subOpts=activeSubjects().map(s=>`<option value="${s.id}">${esc(subjectLabel(s))}</option>`).join('');
  const dayOpts=days.map((n,i)=>`<option value="${i}">${esc(n)}</option>`).join('');
  return `<div class="tt-staff">
    ${isAdminUser()?`<form class="card" id="ttAddForm">
      <div class="block-h"><span class="t">${esc(t('ttAdd'))}</span></div>
      <div class="row" style="gap:8px">
        <select name="day" class="inp">${dayOpts}</select>
        <select name="subjectId" class="inp grow">${subOpts}</select>
      </div>
      <div class="row" style="gap:8px;margin-top:8px">
        <input name="from" class="inp" placeholder="09:00" required/>
        <input name="to" class="inp" placeholder="09:45" required/>
      </div>
      <button class="btn" type="submit" style="margin-top:10px">${esc(t('ttAdd'))}</button>
    </form>`:''}
    <div class="tt-grid">${byDay}</div>
  </div>`;
}

function viewSubjectsAdmin(){
  ensureSchoolDb();
  const rows=(DB.subjects||[]).map(s=>`<div class="school-sub-row">
    <span class="grow ${s.active===false?'muted':''}">${esc(subjectLabel(s))}</span>
    <button type="button" class="btn ghost sm" data-sub-toggle="${s.id}">${s.active===false?esc(t('subActivate')):esc(t('subArchive'))}</button>
  </div>`).join('');
  return `<div class="card">
    <div class="block-h"><span class="t">${esc(t('schoolSubjects'))}</span></div>
    ${rows}
    <form id="subAddForm" class="row" style="gap:8px;margin-top:12px">
      <input name="de" class="inp grow" placeholder="DE" required/>
      <input name="el" class="inp grow" placeholder="EL" required/>
      <button class="btn sm" type="submit">${esc(t('subAdd'))}</button>
    </form>
  </div>`;
}

function childSubjectsReadonlyHtml(kidId){
  ensureSchoolDb();
  const wk=kidWeekKey();
  const rows=activeSubjects().map(s=>{
    const sc=subjectGradeFor(kidId,s.id,wk);
    return `<div class="school-sub-row"><span class="grow">${esc(subjectLabel(s))}</span>${starsHtml(sc)}</div>`;
  }).join('');
  return `<section class="card kid-subjects-ro"><div class="block-h"><span class="t">${esc(t('schoolSubjects'))}</span></div>${rows||`<p class="muted">${esc(t('subEmpty'))}</p>`}</section>`;
}

function wireKidsView(v){
  v.querySelectorAll('[data-kids-pane]').forEach(b=>{
    b.onclick=()=>{ state.kidsPane=b.dataset.kidsPane; state.staffKidId=null; render(); };
  });
  v.querySelectorAll('[data-open-kid]').forEach(b=>{
    b.onclick=()=>{ state.staffKidId=b.dataset.openKid; render(); };
  });
  const back=v.querySelector('#kidProfileBack');
  if(back) back.onclick=()=>{ state.staffKidId=null; render(); };
  v.querySelectorAll('[data-grade-kid]').forEach(b=>{
    b.onclick=()=>{
      if(setSubjectGrade(b.dataset.gradeKid, b.dataset.gradeSub, Number(b.dataset.gradeVal))){
        save(); toast(t('gradeSaved'),'success'); render();
      }
    };
  });
  v.querySelectorAll('[data-att-kid]').forEach(b=>{
    b.onclick=()=>{
      let st=b.dataset.attStatus;
      if(b.dataset.attCycle){
        const cur=attendanceFor(b.dataset.attKid, b.dataset.attDate)?.status;
        st = cur==='present'?'absent':cur==='absent'?'excused':'present';
      }
      setAttendance(b.dataset.attKid, b.dataset.attDate, st);
      save(); toast(t('attSaved'),'success'); render();
    };
  });
  const attDate=v.querySelector('#attDatePick');
  if(attDate) attDate.onchange=()=>{ state.date=attDate.value; render(); };
  v.querySelectorAll('[data-hw-toggle]').forEach(inp=>{
    inp.onchange=()=>{
      const h=(DB.homework||[]).find(x=>x.id===inp.dataset.hwToggle);
      if(h){ h.done=!!inp.checked; h.ts=Date.now(); save(); toast(t('hwSaved'),'success'); }
    };
  });
  const hwForm=v.querySelector('#hwAddForm');
  if(hwForm) hwForm.onsubmit=ev=>{
    ev.preventDefault();
    const fd=new FormData(hwForm);
    ensureSchoolDb();
    DB.homework.push({
      id:uid(), title:String(fd.get('title')||'').trim().slice(0,120),
      subjectId:fd.get('subjectId')||'', kidId:fd.get('kidId')||null,
      due:fd.get('due')||iso(new Date()), done:false, ts:Date.now(),
    });
    save(); toast(t('hwSaved'),'success'); render();
  };
  const ttForm=v.querySelector('#ttAddForm');
  if(ttForm) ttForm.onsubmit=ev=>{
    ev.preventDefault();
    const fd=new FormData(ttForm);
    ensureSchoolDb();
    DB.schoolTimetable.push({
      id:uid(), day:Number(fd.get('day'))||0, from:String(fd.get('from')||''),
      to:String(fd.get('to')||''), subjectId:fd.get('subjectId')||'', kidIds:[],
    });
    save(); toast(t('ttSaved'),'success'); render();
  };
  const noteSave=v.querySelector('#staffKidNoteSave');
  if(noteSave) noteSave.onclick=()=>{
    const text=(v.querySelector('#staffKidNote')?.value||'').trim();
    if(!text) return;
    ensureSchoolDb();
    DB.kidNotes.push({id:uid(), kidId:noteSave.dataset.noteKid, text:text.slice(0,2000), ts:Date.now(), by:state.user?.id});
    save(); toast(t('kidNotesSaved'),'success'); render();
  };
  v.querySelectorAll('[data-sub-toggle]').forEach(b=>{
    b.onclick=()=>{
      const s=subjectById(b.dataset.subToggle);
      if(s){ s.active=s.active===false; save(); render(); }
    };
  });
  const subAdd=v.querySelector('#subAddForm');
  if(subAdd) subAdd.onsubmit=ev=>{
    ev.preventDefault();
    const fd=new FormData(subAdd);
    ensureSchoolDb();
    DB.subjects.push({id:'sub-'+uid(), de:String(fd.get('de')||'').trim(), el:String(fd.get('el')||'').trim(), active:true});
    save(); toast(t('subSaved'),'success'); render();
  };
}
