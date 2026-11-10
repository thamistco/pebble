/* Pebble — little moments together. Vanilla JS, no build step, no tracking. */
(function(){
'use strict';
const DATA = window.PEBBLE_DATA;
const ACTS = DATA.activities;
const BY_ID = Object.fromEntries(ACTS.map(a=>[a.id,a]));
const KEY = 'pebble.v1';
const VERSION = '2.3.0';

/* ---------- Icons (inline SVG, 24px grid, stroke) ---------- */
const P = {
  today:'<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
  ideas:'<path d="M5 9.5c0-3.6 3.1-6.5 7-6.5s7 2.9 7 6.5c0 2.4-1.3 4-2.6 5.2-.8.7-1.4 1.6-1.4 2.6V18H9v-.7c0-1-.6-1.9-1.4-2.6C6.3 13.5 5 11.9 5 9.5Z"/><path d="M9.5 21h5"/>',
  heart:'<path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z"/>',
  moments:'<path d="M6 3.5h9.5L19 7v13.5H6z"/><path d="M15 3.5V7.5h4"/><path d="M9 12h7M9 15.5h5"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.6-2-3.4-2.4.9a7.5 7.5 0 0 0-2.6-1.5L14 2.5h-4l-.4 2.4A7.5 7.5 0 0 0 7 6.4l-2.4-.9-2 3.4 2 1.6a7.6 7.6 0 0 0 0 3l-2 1.6 2 3.4 2.4-.9a7.5 7.5 0 0 0 2.6 1.5l.4 2.4h4l.4-2.4a7.5 7.5 0 0 0 2.6-1.5l2.4.9 2-3.4z"/>',
  clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  battery:'<rect x="3" y="7.5" width="16" height="9" rx="2.5"/><path d="M21.5 10.5v3"/><path d="M6.5 10.5v3"/>',
  bolt:'<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
  wave:'<path d="M3 14c2 0 2-2 4.5-2S10 14 12 14s2-2 4.5-2 2.5 2 4.5 2"/><path d="M3 18.5c2 0 2-2 4.5-2s2.5 2 4.5 2 2-2 4.5-2 2.5 2 4.5 2"/><path d="M12 9.5V4m0 0-2.5 2.5M12 4l2.5 2.5"/>',
  moon:'<path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10Z"/>',
  bath:'<path d="M3.5 12h17v2a5 5 0 0 1-5 5h-7a5 5 0 0 1-5-5z"/><path d="M6 12V6a2.5 2.5 0 0 1 4.7-1.2"/><path d="M7.5 19 6.5 21M16.5 19l1 2"/>',
  home:'<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5h4v5"/>',
  tree:'<path d="M12 21v-5"/><path d="M12 3a5 5 0 0 0-4.6 7A4 4 0 0 0 9 16h6a4 4 0 0 0 1.6-6A5 5 0 0 0 12 3Z"/>',
  pot:'<path d="M4 10h16v3a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7z"/><path d="M2.5 10h19"/><path d="M9 6.5c0-1 1-1.5 1-2.5M13 6.5c0-1 1-1.5 1-2.5"/>',
  walk:'<circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2.5-6.5 3 2.5V21"/><path d="M8 11.5 10.5 8l3.5 1 2 3"/><path d="m11.5 8-1 6.5"/>',
  shell:'<path d="M12 20c-4 0-8-3-8-8 0-2.5 3.5-7 8-7s8 4.5 8 7c0 5-4 8-8 8Z"/><path d="M12 20V7M8.5 19 10 8M15.5 19 14 8M5 15l4.5-6M19 15l-4.5-6"/>',
  rain:'<path d="M7 15a4 4 0 0 1-.4-8A5.5 5.5 0 0 1 17 6.5a3.8 3.8 0 0 1 .5 7.6"/><path d="m8 18-1 2.5M12 17l-1 3.5M16 18l-1 2.5"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1 1M17.4 17.4l1 1M5.6 18.4l1-1M17.4 6.6l1-1"/>',
  leaf:'<path d="M5 19c0-8 5-13.5 14.5-14 .5 9.5-5 15-12.5 15Z"/><path d="M5 19c3-4 6-6.5 9-8"/>',
  snow:'<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/><path d="m9.5 4.5 2.5 2 2.5-2M9.5 19.5l2.5-2 2.5 2"/>',
  flower:'<circle cx="12" cy="9" r="2.2"/><path d="M12 6.8c0-2.5 3.5-2.5 3.5 0 2.5 0 2.5 3.5 0 3.5 0 2.5-3.5 2.5-3.5 0 0 2.5-3.5 2.5-3.5 0-2.5 0-2.5-3.5 0-3.5 0-2.5 3.5-2.5 3.5 0Z"/><path d="M12 13.5V21M12 18c-2 0-3.5-1-4-2.5M12 18.5c2 0 3.5-1 4-2.5"/>',
  chat:'<path d="M4 5.5h16v10H10l-4 3.5v-3.5H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  sparkle:'<path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.3l-1.8-5.7L4.5 10.8 10.2 9z"/><path d="M19 17.5v3M17.5 19h3"/>',
  search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  sliders:'<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  close:'<path d="M6 6l12 12M18 6 6 18"/>',
  check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  checkc:'<circle cx="12" cy="12" r="8.5"/><path d="m8 12.3 2.7 2.7L16 9.7"/>',
  shuffle:'<path d="M3.5 7h3.5c4.5 0 5.5 10 10 10h3.5"/><path d="M3.5 17h3.5c1.8 0 3-1.6 4-3.5M13.5 10.5c1-1.9 2.2-3.5 4-3.5h3.5"/><path d="m18.5 4.5 2.5 2.5-2.5 2.5M18.5 14.5l2.5 2.5-2.5 2.5"/>',
  chevron:'<path d="m9.5 6 6 6-6 6"/>',
  back:'<path d="M14.5 6l-6 6 6 6"/>',
  info:'<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.5v.01"/>',
  shield:'<path d="M12 3 5 6v5.5c0 4.5 3 8 7 9.5 4-1.5 7-5 7-9.5V6z"/><path d="M12 8.5v4M12 15.5v.01"/>',
  box:'<path d="M4 8 12 4l8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
  download:'<path d="M12 4v11M7.5 11 12 15.5 16.5 11"/><path d="M5 19.5h14"/>',
  upload:'<path d="M12 15.5V4.5M7.5 9 12 4.5 16.5 9"/><path d="M5 19.5h14"/>',
  trash:'<path d="M5 7h14M10 7V4.5h4V7M6.5 7l1 13h9l1-13"/>',
  people:'<circle cx="9" cy="8" r="3"/><path d="M3.5 19.5c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5"/><circle cx="17" cy="9" r="2.3"/><path d="M15.5 14.2c2.8-.3 5 1.6 5 4.8"/>',
  book:'<path d="M4 5.5c3-1 5.5-1 8 1 2.5-2 5-2 8-1V19c-3-1-5.5-1-8 1-2.5-2-5-2-8-1z"/><path d="M12 6.5V20"/>',
  hand:'<path d="M8 12V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v7c0 4-2.5 7-6 7-2.5 0-4-1.2-5.5-3.5L3.8 13.2a1.5 1.5 0 0 1 2.4-1.7L8 13.5"/>',
  share:'<path d="M12 3.5v11M8 7.5l4-4 4 4"/><path d="M7 10.5H5.5v10h13v-10H17"/>',
  play:'<circle cx="12" cy="12" r="8.5"/><path d="m10 8.5 5.5 3.5-5.5 3.5z"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  calendar:'<rect x="4" y="5.5" width="16" height="15" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4"/>',
};
const ic = (n, extra='') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${P[n]||''}</svg>`;
const icFill = (n) => `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;

/* ---------- Vocab ---------- */
const AREAS = {
  cl:{n:'Talking & listening', e:'Communication and language', c:'--a-cl'},
  pd:{n:'Moving', e:'Physical development', c:'--a-pd'},
  pse:{n:'Feelings & friends', e:'Personal, social and emotional', c:'--a-pse'},
  lit:{n:'Books & stories', e:'Literacy', c:'--a-lit'},
  math:{n:'Numbers & shapes', e:'Mathematics', c:'--a-math'},
  utw:{n:'Exploring', e:'Understanding the world', c:'--a-utw'},
  ead:{n:'Making & pretending', e:'Expressive arts and design', c:'--a-ead'},
};
const PLACES = {
  indoors:{n:'At home', i:'home'}, outdoors:{n:'Outside', i:'tree'}, bath:{n:'Bath time', i:'bath'},
  bedtime:{n:'Bedtime', i:'moon'}, kitchen:{n:'Kitchen', i:'pot'}, onthego:{n:'Out & about', i:'walk'},
};
const ENERGY = { low:{n:'Low energy', s:'Low', i:'battery'}, med:{n:'Some energy', s:'Medium', i:'walk'}, high:{n:'Lots of energy', s:'High', i:'bolt'} };
const TIMES = [{k:5,n:'5 min'},{k:10,n:'10 min'},{k:20,n:'20 min'},{k:30,n:'30+ min'}];
const SEASON = (()=>{ const m=new Date().getMonth(); return m<2||m===11?'winter':m<5?'spring':m<8?'summer':'autumn'; })();
const SEASON_N = {winter:'Winter',spring:'Spring',summer:'Summer',autumn:'Autumn'}[SEASON];
const SEASON_I = {winter:'snow',spring:'flower',summer:'sun',autumn:'leaf'}[SEASON];

/* ---------- Store ---------- */
const DEFAULTS = { settings:{child:'', birth:'', parents:['',''], allAges:false, polish:false, theme:'system', goal:20, onboarded:false}, favs:[], log:[], shuffle:{date:'',n:0}, prompt:{date:'',n:0}, hints:{ios:false} };
const clone = o => JSON.parse(JSON.stringify(o));
const isDate = v => typeof v==='string' && /^\d{4}-\d\d-\d\d$/.test(v) && !isNaN(Date.parse(v+'T00:00:00Z')) && new Date(v+'T00:00:00Z').toISOString().slice(0,10)===v;
const str = (v,max) => (typeof v==='string'?v:(typeof v==='number'?String(v):'')).slice(0,max);
/* Normalise anything (old versions, hand-edited or corrupted storage, imported files) into a valid state */
const RENAMED = {'kosi-kosi-apci-clapping':'kosi-kosi-lapci-clapping'};   /* old id → current id, so saved favourites and moments follow a renamed idea */
const rid = id => (typeof id==='string' && RENAMED[id]) || id;
function normalize(raw){
  const d = clone(DEFAULTS); if(!raw || typeof raw!=='object' || Array.isArray(raw)) return d;
  const rs = (raw.settings && typeof raw.settings==='object') ? raw.settings : {}; const s=d.settings;
  s.child = str(rs.child,30).trim(); s.birth = isDate(rs.birth) ? rs.birth : '';
  const ps = Array.isArray(rs.parents) ? rs.parents : (typeof rs.parents==='string' ? [rs.parents] : []);
  s.parents = [str(ps[0],30).trim(), str(ps[1],30).trim()];
  s.allAges = rs.allAges===true; s.polish = rs.polish===true; s.onboarded = rs.onboarded===true;
  s.theme = ['system','light','dark'].includes(rs.theme) ? rs.theme : 'system';
  s.goal = [10,20,30].includes(+rs.goal) ? +rs.goal : 20;
  d.favs = Array.isArray(raw.favs) ? [...new Set(raw.favs.map(rid).filter(id=>typeof id==='string' && BY_ID[id]))] : [];
  const seen = new Set();
  d.log = (Array.isArray(raw.log) ? raw.log : []).filter(e=>e && typeof e==='object' && BY_ID[rid(e.a)] && isDate(e.d)).map((e,i)=>{ e={...e, a:rid(e.a)};
    let id = str(e.id,40) || ('m'+i+'x'+e.d.replace(/-/g,'')); while(seen.has(id)) id += 'x'; seen.add(id);
    const min = Math.round(+e.min); const ts = (typeof e.ts==='string' && !isNaN(Date.parse(e.ts))) ? e.ts : e.d+'T12:00:00.000Z';
    return {id, a:e.a, d:e.d, ts, min: (min>0 && min<=600) ? min : BY_ID[e.a].m, who: str(e.who,40), note: str(e.note,140)};
  });
  const day = o => (o && typeof o==='object' && typeof o.date==='string' && Number.isInteger(o.n) && o.n>=0) ? {date:o.date, n:o.n} : {date:'', n:0};
  d.shuffle = day(raw.shuffle); d.prompt = day(raw.prompt);
  d.hints = {ios: !!(raw.hints && raw.hints.ios)};
  return d;
}
let S = load();
function load(){
  let txt=null; try{ txt = localStorage.getItem(KEY); }catch(e){}
  if(!txt) return clone(DEFAULTS);
  let raw; try{ raw = JSON.parse(txt); }catch(e){ try{ localStorage.setItem(KEY+'.unreadable', txt); }catch(_){} raw = null; }
  const st = normalize(raw);
  try{ const out=JSON.stringify(st); if(out!==txt) localStorage.setItem(KEY, out); }catch(e){}
  return st;
}
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){ toast('Could not save on this device'); } }

/* ---------- Utils ---------- */
const $ = (s,r=document)=>r.querySelector(s);
const esc = s => String(s??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad2 = n => String(n).padStart(2,'0');
const dkey = (d=new Date()) => `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
const parseD = k => { const [y,m,d]=k.split('-').map(Number); return new Date(y,m-1,d); };
const daysBetween = (a,b) => Math.round((parseD(dkey(b))-parseD(dkey(a)))/864e5);
function hash(str){ let h=2166136261; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h=Math.imul(h,16777619);} return h>>>0; }
function rng(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
const childName = () => S.settings.child.trim() || 'your little one';
const fill = s => esc(s).replace(/\{name\}/g, esc(S.settings.child.trim()||'Baby'));
function ageMonths(){ const b=S.settings.birth; if(!b) return null; const bd=parseD(b), n=new Date();
  let m=(n.getFullYear()-bd.getFullYear())*12+(n.getMonth()-bd.getMonth()); if(n.getDate()<bd.getDate()) m--; return m; }
function ageLabel(m){ if(m==null) return ''; if(m<0) return 'not born yet'; if(m<1) return 'newborn'; if(m<24) return `${m} months`; const y=Math.floor(m/12), r=m%12; return `${y} year${y>1?'s':''}${r?` ${r} month${r>1?'s':''}`:''}`; }
function greeting(){ const h=new Date().getHours(); return h<12?'Good morning':h<18?'Good afternoon':'Good evening'; }
function lastDone(id){ let best=null; for(const e of S.log){ if(e.a===id && (!best||e.d>best)) best=e.d; } return best; }
function timesDone(id){ return S.log.filter(e=>e.a===id).length; }
/* Toast: a small status strip that never covers buttons. With no sheet open it docks to the top edge of the tab bar;
   inside a sheet it sits in the flow just above the sheet's buttons. Tap or swipe it away; screen readers hear it (role=status). */
let toastT, toastAt=0;
function hideToast(){ const t=$('#toast'); if(!t) return; clearTimeout(toastT); t.classList.remove('show'); document.body.classList.remove('toast-on'); }
{ const t=$('#toast');
  t.addEventListener('click', e=>{ e.stopPropagation(); hideToast(); });   /* in a sheet: tap to dismiss */
  let tx=null; t.addEventListener('touchstart', e=>{ e.stopPropagation(); tx=e.touches[0]; }, {passive:true});
  t.addEventListener('touchmove', e=>{ e.stopPropagation(); }, {passive:true});
  t.addEventListener('touchend', e=>{ e.stopPropagation(); const c=e.changedTouches[0]; if(tx && Math.hypot(c.clientX-tx.clientX, c.clientY-tx.clientY)>16) hideToast(); tx=null; });
  /* docked above the tab bar it lets taps through, and any tap or scroll elsewhere tucks it away */
  const away=e=>{ if(t.classList.contains('show') && !t.classList.contains('in-sheet') && !t.contains(e.target)) hideToast(); };
  document.addEventListener('pointerdown', away, true); window.addEventListener('scroll', ()=>{ if(Date.now()-toastAt>500 && t.classList.contains('show') && !t.classList.contains('in-sheet')) hideToast(); }, {passive:true}); }
function toast(msg){
  const t=$('#toast'); const top=sheetStack.length?sheetStack[sheetStack.length-1]:null;
  clearTimeout(toastT);
  if(top && !top.closing){ const foot=top.sh.querySelector('.sheet-foot'); const host=top.sh;
    if(t.parentNode!==host || t.nextSibling!==foot) host.insertBefore(t, foot||null); t.className='in-sheet'; }
  else { if(t.parentNode!==document.body) document.body.append(t); const bar=document.querySelector('.tabbar'); const shown=bar && !bar.hidden && getComputedStyle(bar).display!=='none';
    t.className=shown?'':'no-tabs'; if(shown) t.style.setProperty('--toast-b', bar.getBoundingClientRect().height+'px'); document.body.classList.add('toast-on'); }
  void t.offsetHeight; t.classList.add('show'); t.textContent=msg; toastAt=Date.now();
  toastT=setTimeout(hideToast, Math.min(3500, 1500+msg.length*35));
}

/* ---------- Eligibility & picks ---------- */
const MIN_AGE=18, MAX_AGE=48;
function eligible(){
  let m = ageMonths(); const s=S.settings;
  if(m!=null) m = Math.min(Math.max(m, MIN_AGE), MAX_AGE);   /* under 18 months: gentlest ideas; over 4: the 3-4 year ideas */
  return ACTS.filter(a=>{
    if(a.tags.includes('polish') && !s.polish) return false;
    if(s.allAges || m==null) return true;
    return a.a[0] <= m+2 && a.a[1] >= m;
  });
}
function weight(a, today){
  let w = 1;
  const ld = lastDone(a.id);
  if(ld){ const d = daysBetween(parseD(ld), today); w *= d<3?0.05 : d<7?0.2 : d<14?0.5 : 0.9; } else w *= 1.2;
  if(S.favs.includes(a.id)) w *= 1.25;
  const wd = today.getDay(); const weekend = wd===0||wd===6;
  if(!weekend && a.m>=30) w *= 0.3;
  if(!weekend && a.tags.includes('weekend')) w *= 0.5;
  const seasons=['winter','spring','summer','autumn'];
  const st = a.tags.filter(t=>seasons.includes(t));
  if(st.length){ w *= st.includes(SEASON) ? 1.4 : 0.12; }
  return w;
}
function weightedOrder(pool, seedStr){
  const r = rng(hash(seedStr)); const today=new Date();
  const items = pool.map(a=>({a, k: Math.pow(r(), 1/Math.max(weight(a,today),0.001))}));
  items.sort((x,y)=>y.k-x.k); return items.map(x=>x.a);
}
function todaysPick(){
  const today=dkey(); if(S.shuffle.date!==today) S.shuffle={date:today,n:0};
  const order = weightedOrder(eligible(), 'day:'+today);
  return order.length ? order[S.shuffle.n % order.length] : null;
}
const QUICK = [
  {k:'short', n:'5 minutes', i:'clock', f:a=>a.m<=5},
  {k:'tired', n:"I'm tired", i:'battery', f:a=>a.e==='low' && a.m<=10},
  {k:'out', n:"We're out", i:'walk', f:a=>a.p.includes('onthego')||a.p.includes('outdoors')},
  {k:'bed', n:'Bath & bed', i:'moon', f:a=>a.p.includes('bath')||a.p.includes('bedtime')},
];
const COLLECTIONS = [
  {k:'tired', n:'Tired after work', s:'Low effort, still lovely', i:'battery', c:'--a-pse', f:a=>a.e==='low' && a.m<=10},
  {k:'rainy', n:'Rainy day', s:'Indoors, with energy to burn', i:'rain', c:'--a-lit', f:a=>a.tags.includes('rainy') || (a.p.includes('indoors') && a.e==='high')},
  {k:'bathbed', n:'Bath & bedtime', s:'Calm and close', i:'moon', c:'--a-cl', f:a=>a.p.includes('bath')||a.p.includes('bedtime')},
  {k:'kitchen', n:'Kitchen helpers', s:'Real jobs, little hands', i:'pot', c:'--a-math', f:a=>a.p.includes('kitchen')},
  {k:'outside', n:'Outside', s:'Fresh air together', i:'tree', c:'--a-pd', f:a=>a.p.includes('outdoors')},
  {k:'seaside', n:'By the sea', s:'Pebbles, waves and wind', i:'wave', c:'--a-utw', f:a=>a.tags.includes('seaside')},
  {k:'onthego', n:'Out & about', s:'Buses, queues, waiting rooms', i:'walk', c:'--a-ead', f:a=>a.p.includes('onthego')},
  {k:'season', n:SEASON_N+' ideas', s:'Right for the time of year', i:SEASON_I, c:'--a-math', f:a=>a.tags.includes(SEASON)},
  {k:'weekend', n:'Weekend', s:'Longer, bigger adventures', i:'calendar', c:'--a-pd', f:a=>a.tags.includes('weekend')||a.m>=30},
  {k:'polish', n:'Polish rhymes & songs', s:'Rymowanki i piosenki', i:'chat', c:'--a-cl', f:a=>a.tags.includes('polish'), polish:true},
  {k:'prompts', n:'Little prompts', s:'Ways to connect anytime', i:'sparkle', c:'--a-pse', prompts:true},
];

/* ---------- Pebble art ---------- */
function pebblePath(seed){
  const r=rng(seed), n=7, pts=[];
  for(let i=0;i<n;i++){ const ang=i/n*Math.PI*2 - Math.PI/2; const rad=40+r()*7; pts.push([50+Math.cos(ang)*rad*(1.06), 52+Math.sin(ang)*rad*0.9]); }
  let d=''; for(let i=0;i<n;i++){ const p0=pts[i], p1=pts[(i+1)%n]; const mx=(p0[0]+p1[0])/2, my=(p0[1]+p1[1])/2; d += (i===0?`M${mx.toFixed(1)} ${my.toFixed(1)}`:'') ; const p2=pts[(i+1)%n], p3=pts[(i+2)%n]; d+=` Q${p2[0].toFixed(1)} ${p2[1].toFixed(1)} ${((p2[0]+p3[0])/2).toFixed(1)} ${((p2[1]+p3[1])/2).toFixed(1)}`; }
  return d+'Z';
}
function art(a, cls='art'){
  const area = AREAS[a.d[0]]; const pl = PLACES[a.p[0]];
  return `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><path d="${pebblePath(hash(a.id))}" fill="var(${area.c})"/><g transform="translate(34 34) scale(1.33)" fill="none" stroke="var(--a-ink)" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" opacity=".85">${P[pl.i]}</g></svg>`;
}
function imgSrc(a){ return a.img ? `img/${a.id}.webp${a.img>1?'?v='+a.img:''}` : ''; }
function thumb(a, cls='thumb'){ return a.img ? `<img class="${cls}" src="${imgSrc(a)}" alt="${esc(a.alt||a.t)}" width="600" height="450" loading="lazy" decoding="async">` : art(a); }
function ytURL(a){ return 'https://www.youtube.com/results?search_query='+encodeURIComponent(a.yt || (a.t+' toddler activity')); }
function heroArt(){
  return `<svg class="hero-art" viewBox="0 0 120 120" aria-hidden="true"><path d="${pebblePath(11)}" transform="translate(30 2) scale(.9)" fill="var(--sun)" opacity=".9"/><path d="${pebblePath(5)}" transform="translate(6 46) scale(.55)" fill="var(--sea)" opacity=".35"/><path d="${pebblePath(9)}" transform="translate(58 70) scale(.4)" fill="var(--brand)" opacity=".35"/></svg>`;
}
function logoSvg(cls){ return `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><path d="${pebblePath(7)}" fill="var(--brand)"/><path d="${pebblePath(3)}" transform="translate(44 44) scale(.5)" fill="var(--sun)"/></svg>`; }

function metaHTML(a, full){
  const parts = [`<span>${ic('clock')}${a.m>=30?'30+':a.m} min</span>`, `<span>${ic(ENERGY[a.e].i)}${full?ENERGY[a.e].n:ENERGY[a.e].s}</span>`, `<span>${ic(PLACES[a.p[0]].i)}${PLACES[a.p[0]].n}</span>`];
  return `<div class="meta">${parts.join('')}</div>`;
}
function cardHTML(a){
  const fav = S.favs.includes(a.id); const done = lastDone(a.id);
  return `<button class="card" data-open="${a.id}">${thumb(a)}<span class="body"><span class="title">${esc(a.t)}</span>${metaHTML(a)}</span><span class="end">${done?`<span class="done-dot" title="Done before">${ic('checkc')}</span><span class="vh">done before</span>`:''}${fav?`<span class="fav-on">${icFill('heart')}</span><span class="vh">saved</span>`:''}${ic('chevron')}</span></button>`;
}

/* ---------- Router / tabs ---------- */
let tab = 'today'; let renderedDay = '';
const ui = { quick:null, search:'', coll:null, f:{time:[],energy:[],place:[],area:[]} };
function setTab(t, push=true){
  tab=t;
  document.querySelectorAll('.tab').forEach(b=>{ if(b.dataset.tab===t) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current'); });
  if(push && location.hash!=='#'+t) history.replaceState(history.state, '', '#'+t);
  render(); window.scrollTo(0,0);
}
function render(){
  renderedDay = dkey(); const m = $('#main');
  document.querySelector('.tabbar').hidden = !S.settings.onboarded;
  if(!S.settings.onboarded){ m.innerHTML = welcomeHTML(); return; }
  m.innerHTML = tab==='today'?todayHTML(): tab==='ideas'?ideasHTML(): tab==='saved'?savedHTML(): momentsHTML();
}

/* ---------- Welcome ---------- */
function welcomeHTML(){
  return `<section class="welcome" aria-labelledby="w-h">
    ${logoSvg('mark')}
    <h1 id="w-h">Pebble</h1>
    <p class="lead">Little ideas for twenty minutes a day with your toddler. Screen-free, using things you already have.</p>
    <form id="welcome-form" autocomplete="off">
      <label class="field"><span>Your child's first name</span><input class="input" name="child" maxlength="30" placeholder="e.g. Sam"></label>
      <label class="field"><span>Their birthday</span><input class="input" type="date" name="birth" max="${dkey()}"></label>
      <label class="field"><span>Your name <small class="muted">(optional)</small></span><input class="input" name="p1" maxlength="30" placeholder="So we can say hello"></label>
      <label class="check-row"><input type="checkbox" name="polish"><span><b>We speak Polish at home</b><small>Adds 22 Polish rhymes and songs, plus Polish words to say during everyday ideas. You can change this in Settings.</small></span></label>
      <p class="fine">${ic('shield','style="display:inline;width:14px;height:14px;vertical-align:-2px"')} Everything stays on this phone. No account, no tracking.</p>
      <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap">
        <button class="btn btn-primary" type="submit" style="flex:1">Let's begin</button>
        <button class="btn btn-ghost" type="button" data-act="skip-welcome">Skip for now</button>
      </div>
    </form>
  </section>`;
}

/* ---------- Today ---------- */
function todayHTML(){
  const s=S.settings; const m=ageMonths(); const pick=todaysPick();
  const hi = s.parents[0] ? `${greeting()}, ${esc(s.parents[0])}` : greeting();
  const sub = s.child ? `${esc(s.child)}${m!=null?` · ${ageLabel(m)}`:''}` : new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
  let h = `<header class="top"><div><h1 class="greet">${hi}</h1><p class="sub">${sub}</p></div><button class="icon-btn" data-act="settings" aria-label="Settings">${ic('settings')}</button></header>`;
  if(pick){
    const doneToday = S.log.some(e=>e.a===pick.id && e.d===dkey());
    h += `<section class="hero${pick.img?' has-img':''}" aria-labelledby="hero-t">${pick.img?`<button class="hero-pic" data-open="${pick.id}" tabindex="-1" aria-hidden="true">${thumb(pick,'hero-img')}</button>`:heroArt()}
      <p class="eyebrow">${doneToday?'Done today':'Idea for today'}</p>
      <h2 id="hero-t" tabindex="-1">${esc(pick.t)}</h2>
      <p class="why">${fill(pick.w)}</p>
      ${metaHTML(pick,true)}
      ${s.polish && (pick.plp||pick.pl) ? `<p class="small pl-line">Po polsku: <b lang="pl">${esc(splitPl(pick.plp||pick.pl)[0])}</b></p>`:''}
      <div class="actions"><button class="btn btn-primary" data-open="${pick.id}">Let's do it</button><button class="btn btn-tonal" data-act="another">${ic('shuffle')}Another</button></div>
    </section>`;
  } else {
    h += `<div class="empty"><h2>No ideas match the age setting</h2><p>Try turning on "Show ideas for every age" in settings.</p></div>`;
  }
  if(showIosHint()) h += `<aside class="install-hint" aria-label="Install Pebble"><span class="ih-ic">${ic('share')}</span><p><b>Add Pebble to your Home Screen</b><br>Tap <span class="share-glyph" aria-label="Share">${ic('share')}</span> Share, then <b>Add to Home Screen</b>.</p><button class="icon-btn" data-act="dismiss-ios" aria-label="Dismiss">${ic('close')}</button></aside>`;
  // quick picker
  h += `<section class="section" aria-labelledby="q-h"><div class="section-h"><h2 id="q-h">What kind of moment?</h2></div><div class="quick">`+
    QUICK.map(q=>`<button class="qbtn" data-quick="${q.k}" aria-pressed="${ui.quick===q.k}"><span class="qi">${ic(q.i)}</span>${q.n}</button>`).join('')+`</div>`;
  if(ui.quick){
    const q = QUICK.find(x=>x.k===ui.quick);
    const order = weightedOrder(eligible().filter(q.f).filter(a=>!pick||a.id!==pick.id), 'q:'+q.k+dkey());
    h += `<div class="quick-results list" aria-live="polite">${order.slice(0,3).map(cardHTML).join('')||'<p class="muted">Nothing here yet for this age.</p>'}</div>`;
  }
  h += `</section>`;
  // prompt
  const pr = todaysPrompt();
  h += `<section class="section" aria-labelledby="p-h"><div class="section-h"><h2 id="p-h">A little prompt</h2></div>
    <div class="prompt"><span class="k">${esc(pr.k)}</span><p>${esc(pr.t)}</p>
    <div class="row"><span class="muted">Based on serve-and-return</span><button class="btn btn-ghost" data-act="next-prompt">Next prompt</button></div></div></section>`;
  // week
  const recent = S.log.some(e=>daysBetween(parseD(e.d), new Date())<14);
  if(recent){ h += `<section class="section" aria-labelledby="t-h"><div class="section-h"><h2 id="t-h">This week together</h2><button class="link" data-goto="moments">Moments</button></div>${tallyHTML()}</section>`; }
  else { h += `<p class="fine" style="margin-top:24px">After you play, tap <b>We did this</b> on the idea to keep a gentle note of your time together.</p>`; }
  return h;
}
function todaysPrompt(){
  const today=dkey(); if(S.prompt.date!==today) S.prompt={date:today,n:0};
  const base = hash('p'+today) % DATA.prompts.length;
  return DATA.prompts[(base + S.prompt.n) % DATA.prompts.length];
}
function weekDays(){
  const now=new Date(); const dow=(now.getDay()+6)%7; const mon=new Date(now.getFullYear(),now.getMonth(),now.getDate()-dow);
  return [...Array(7)].map((_,i)=>new Date(mon.getFullYear(),mon.getMonth(),mon.getDate()+i));
}
function tallyHTML(){
  const days=weekDays(); const goal=S.settings.goal||20; const today=dkey();
  const mins = days.map(d=>S.log.filter(e=>e.d===dkey(d)).reduce((s,e)=>s+(+e.min||0),0));
  const total = mins.reduce((a,b)=>a+b,0); const max=Math.max(goal*1.5, ...mins);
  const daysWith = mins.filter(x=>x>0).length;
  const L=['M','T','W','T','F','S','S'];
  const AREA_H=70, LBL=24;
  let note = total===0 ? 'A fresh week. Even five minutes counts.' : daysWith>=5 ? 'Lots of little moments this week. Lovely.' : `${daysWith} day${daysWith>1?'s':''} with time together so far. Every bit counts.`;
  return `<div class="tally"><p class="big">${total} min</p><p class="small muted">together this week · aim of about ${goal} min a day</p>
  <div class="bars" role="img" aria-label="Minutes per day this week: ${days.map((d,i)=>`${d.toLocaleDateString('en-GB',{weekday:'long'})} ${mins[i]}`).join(', ')}">
    <div class="goal-line" style="bottom:${LBL + goal/max*AREA_H}px" title="Daily aim"></div>
    ${mins.map((v,i)=>`<div class="bar ${dkey(days[i])===today?'today':''}"><i class="${v?'':'zero'}" style="height:${v? Math.max(8, Math.min(v,max)/max*AREA_H):4}px"></i><b>${L[i]}</b></div>`).join('')}
  </div><p class="note">${note}</p></div>`;
}

/* ---------- Ideas ---------- */
function filtered(){
  let list = eligible();
  if(ui.coll){ const c=COLLECTIONS.find(x=>x.k===ui.coll); if(c && c.f) list=list.filter(c.f); }
  const f=ui.f;
  if(f.time.length) list=list.filter(a=>f.time.some(t=> t===30? a.m>=30 : a.m===t));
  if(f.energy.length) list=list.filter(a=>f.energy.includes(a.e));
  if(f.place.length) list=list.filter(a=>a.p.some(p=>f.place.includes(p)));
  if(f.area.length) list=list.filter(a=>a.d.some(d=>f.area.includes(d)));
  const q=ui.search.trim().toLowerCase();
  if(q) list=list.filter(a=>(a.t+' '+a.mat+' '+a.s.join(' ')+' '+(S.settings.polish?(a.wd||'')+' '+(a.pl||'')+' '+(a.plp||''):'')+' '+a.w+' '+a.d.map(d=>AREAS[d].n).join(' ')+' '+a.p.map(p=>PLACES[p].n).join(' ')).toLowerCase().includes(q));
  return list;
}
function nFilters(){ const f=ui.f; return f.place.length+f.area.length; }
function ideasHTML(){
  const s=S.settings;
  const colls = COLLECTIONS.filter(c=>!c.polish||s.polish).filter(c=>c.prompts || eligible().some(c.f));
  let h = `<header class="top"><div><h1>Ideas</h1><p class="sub">${eligible().length} ideas${s.allAges||ageMonths()==null?'':' for '+esc(childName())+"'s age"}</p></div><button class="icon-btn" data-act="settings" aria-label="Settings">${ic('settings')}</button></header>
  <label class="search">${ic('search')}<span class="vh">Search ideas</span><input id="q" type="search" placeholder="Search: ball, bath, pebbles…" value="${esc(ui.search)}" autocomplete="off" enterkeyhint="search"></label>
  <section class="section" aria-labelledby="c-h"><div class="section-h"><h2 id="c-h">Collections</h2>${ui.coll?`<button class="link" data-act="clear-coll">Show all</button>`:''}</div>
  <div class="collections">${colls.map(c=>`<button class="coll" data-coll="${c.k}" aria-pressed="${ui.coll===c.k}" style="background:var(${c.c})"><span class="ci">${ic(c.i)}</span><span><b>${c.n}</b><small>${c.s}</small></span></button>`).join('')}</div></section>`;
  if(ui.coll==='prompts'){
    h += `<div class="result-h"><p>${DATA.prompts.length} prompts · use any time, no setup</p></div><div class="list">`+
      DATA.prompts.map(p=>`<div class="prompt" style="padding:14px 16px"><span class="k">${esc(p.k)}</span><p style="font-size:var(--fs-m)">${esc(p.t)}</p></div>`).join('')+`</div>`;
    return h;
  }
  const n=nFilters();
  h += `<div class="chips" role="group" aria-label="Quick filters" style="margin-top:20px">
    <button class="chip" data-act="filters" aria-pressed="${n>0}">${ic('sliders')}Filters${n?` · ${n}`:''}</button>
    ${TIMES.map(t=>`<button class="chip" data-f="time" data-v="${t.k}" aria-pressed="${ui.f.time.includes(t.k)}">${t.n}</button>`).join('')}
    ${Object.entries(ENERGY).map(([k,e])=>`<button class="chip" data-f="energy" data-v="${k}" aria-pressed="${ui.f.energy.includes(k)}">${e.s} energy</button>`).join('')}
  </div>`;
  h += `<div id="results">${resultsHTML()}</div>`;
  return h;
}
function resultsHTML(){
  const list = filtered(); const any = ui.coll||ui.search||Object.values(ui.f).some(x=>x.length);
  let h = `<div class="result-h"><p aria-live="polite">${list.length} idea${list.length===1?'':'s'}</p>${any?`<button class="btn btn-ghost" data-act="clear-all">Clear</button>`:''}</div>`;
  if(!list.length) return h+`<div class="empty"><h2>Nothing quite matches</h2><p>Try fewer filters, or turn on every age in settings.</p></div>`;
  return h + `<div class="list">${list.map(cardHTML).join('')}</div>`;
}

/* ---------- Saved ---------- */
function savedHTML(){
  const favs = S.favs.map(id=>BY_ID[id]).filter(Boolean);
  let h = `<header class="top"><div><h1>Saved</h1><p class="sub">${favs.length?`${favs.length} favourite${favs.length>1?'s':''}`:'Your favourites live here'}</p></div><button class="icon-btn" data-act="settings" aria-label="Settings">${ic('settings')}</button></header>`;
  if(!favs.length) return h + `<div class="empty">${emptyArt()}<h2>Nothing saved yet</h2><p>Tap the heart on any idea you'd like to come back to.</p><button class="btn btn-primary" data-goto="ideas" style="margin-top:18px">Browse ideas</button></div>`;
  return h + `<div class="list" style="margin-top:8px">${favs.map(cardHTML).join('')}</div>`;
}
function emptyArt(){ return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${pebblePath(21)}" fill="var(--tone-2)"/><g transform="translate(32 32) scale(1.5)" fill="none" stroke="var(--ink-3)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${P.heart}</g></svg>`; }

/* ---------- Moments ---------- */
function momentsHTML(){
  let h = `<header class="top"><div><h1>Moments</h1><p class="sub">Kept on this phone</p></div><button class="icon-btn" data-act="settings" aria-label="Settings">${ic('settings')}</button></header>`;
  h += tallyHTML();
  if(!S.log.length) return h + `<div class="empty">${emptyArt().replace(P.heart,P.moments)}<h2>No moments yet</h2><p>When you finish an idea, tap <b>We did this</b> and add a one-line memory if you like.</p></div>`;
  const tried = new Set(S.log.map(e=>e.a)).size;
  h += `<p class="fine">${tried} different idea${tried>1?'s':''} tried so far.</p>`;
  const groups = {}; [...S.log].sort((a,b)=> (b.d+b.ts).localeCompare(a.d+a.ts)).forEach(e=>{ (groups[e.d]=groups[e.d]||[]).push(e); });
  const today=dkey(), yest=dkey(new Date(Date.now()-864e5));
  for(const [d,items] of Object.entries(groups)){
    const label = d===today?'Today': d===yest?'Yesterday': parseD(d).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'short'});
    h += `<div class="mgroup"><h2>${label}</h2>` + items.map(e=>{ const a=BY_ID[e.a]; if(!a) return '';
      return `<div class="mem">${thumb(a,'thumb sm')}<div class="body"><button class="title" data-open="${a.id}">${esc(a.t)}</button><p class="meta">${e.min} min${e.who?` · ${esc(e.who)}`:''}</p>${e.note?`<p class="note">“${esc(e.note)}”</p>`:''}</div><button class="icon-btn" data-del="${e.id}" aria-label="Delete this moment">${ic('trash')}</button></div>`; }).join('') + `</div>`;
  }
  return h;
}

/* ---------- Sheets ---------- */
let sheetStack = [];
function openSheet(html, opts={}){
  const top=sheetStack[sheetStack.length-1];
  if(top && opts.name && top.name===opts.name) return top.sh;          /* double tap: don't stack the same sheet twice */
  if(top && top.closing) return top.sh;
  const root=$('#sheet-root'); const prev=document.activeElement;
  const scrim=document.createElement('div'); scrim.className='scrim';
  const sh=document.createElement('div'); sh.className='sheet'; sh.setAttribute('role','dialog'); sh.setAttribute('aria-modal','true'); if(opts.label) sh.setAttribute('aria-label',opts.label);
  sh.innerHTML = `<div class="grab" aria-hidden="true"></div><div class="sheet-head"><span>${opts.head||''}</span><button class="icon-btn" data-act="close-sheet" aria-label="Close">${ic('close')}</button></div><div class="sheet-body">${html}</div>${opts.foot?`<div class="sheet-foot">${opts.foot}</div>`:''}`;
  root.append(scrim, sh);
  enableDragClose(sh);
  const opened=Date.now(); scrim.addEventListener('click', ()=>{ if(Date.now()-opened<450) return; closeSheetUI(); });   /* a double tap must not close what the first tap opened */
  const prevSel = prev && prev.dataset ? ['act','open','tab','quick','coll'].map(k=>prev.dataset[k]!=null?`[data-${k}="${CSS.escape(prev.dataset[k])}"]`:'').join('') : '';
  const entry={sh,scrim,prev,prevSel,onClose:opts.onClose,name:opts.name};
  if(top){ top.sh.classList.add('under'); scrim.classList.add('stacked'); }   /* one sheet on screen at a time: the one below slides away and comes back when this closes */
  hideToast();
  sheetStack.push(entry);
  document.body.classList.add('sheet-open'); $('#app').inert=true;   /* the page behind a sheet can't be focused, tapped or read out */
  history.pushState({sheet:sheetStack.length}, '');
  void sh.offsetHeight; sh.classList.add('open'); scrim.classList.add('open');   /* open now (forced reflow keeps the slide-in); never depend on a frame that may not come */
  { const f = sh.querySelector(opts.focus||'h2,[autofocus]') || sh.querySelector('button'); if(f){ if(!f.hasAttribute('tabindex') && f.tagName==='H2') f.setAttribute('tabindex','-1'); f.focus({preventScroll:true}); } }
  return sh;
}
/* Swipe down to close: there is no browser back button in an installed iOS app */
function enableDragClose(sh){
  let y0=null, dy=0; const body=()=>sh.querySelector('.sheet-body');
  sh.addEventListener('touchstart', e=>{ if(e.touches.length!==1) return; const b=body(); if(b && b.scrollTop>0 && !e.target.closest('.grab')) return; y0=e.touches[0].clientY; dy=0; }, {passive:true});
  sh.addEventListener('touchmove', e=>{ if(y0==null) return; dy=e.touches[0].clientY-y0; if(dy>0){ sh.classList.add('dragging'); sh.style.transform=`translateY(${dy}px)`; } }, {passive:true});
  sh.addEventListener('touchend', ()=>{ if(y0==null) return; y0=null; sh.classList.remove('dragging'); sh.style.transform=''; if(dy>110) closeSheetUI(); dy=0; });
}
function closeTopSheet(){
  const e=sheetStack.pop(); if(!e) return;
  if(e.sh.contains($('#toast'))){ hideToast(); document.body.append($('#toast')); }
  e.sh.classList.remove('open'); e.scrim.classList.remove('open');
  const below=sheetStack[sheetStack.length-1]; if(below) below.sh.classList.remove('under');
  const rm=()=>{ e.sh.remove(); e.scrim.remove(); };
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) rm(); else setTimeout(rm, 280);
  if(!sheetStack.length){ document.body.classList.remove('sheet-open'); $('#app').inert=false; }
  if(e.onClose) e.onClose();
  const back = (e.prev && document.contains(e.prev)) ? e.prev : (e.prevSel ? document.querySelector('#main '+e.prevSel+', .sheet.open '+e.prevSel) : null);
  if(back) back.focus({preventScroll:true});
}
let afterClose=null;
window.addEventListener('popstate', ()=>{ const target=(history.state&&history.state.sheet)||0; while(sheetStack.length>target) closeTopSheet(); if(!sheetStack.length && afterClose){ const f=afterClose; afterClose=null; f(); } });
function closeSheetUI(){ if(sheetStack.length) history.back(); }
document.addEventListener('focusin', e=>{ const top=sheetStack[sheetStack.length-1]; if(top && !top.sh.contains(e.target) && !e.target.closest('#toast')){ const f=top.sh.querySelector('h2[tabindex],button'); if(f) f.focus({preventScroll:true}); } });
document.addEventListener('keydown', e=>{
  if(!sheetStack.length) return;
  if(e.key==='Escape'){ e.preventDefault(); closeSheetUI(); }
  if(e.key==='Tab'){ const sh=sheetStack[sheetStack.length-1].sh; const f=[...sh.querySelectorAll('button,input,textarea,select,a[href],[tabindex]:not([tabindex="-1"])')].filter(x=>!x.disabled && x.offsetParent!==null);
    if(!f.length) return; const first=f[0], last=f[f.length-1];
    if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); } else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); } }
});

function splitPl(x){ const m=String(x).match(/^(.*?)\s*\(([^()]*)\)\s*$/); return m?[m[1],'('+m[2]+')']:[x,'']; }
function detailHTML(a){
  const s=S.settings; const fav=S.favs.includes(a.id);
  const hist = S.log.filter(e=>e.a===a.id).sort((x,y)=>y.d.localeCompare(x.d));
  const ages = `${Math.floor(a.a[0]/12)?'':''}${a.a[0]}–${a.a[1]} months`;
  const head = a.img
    ? `<figure class="d-hero"><img src="${imgSrc(a)}" alt="${esc(a.alt||'')}" width="600" height="450" decoding="async"></figure><p class="small muted" style="margin-top:14px">${ages}</p><h2 class="st" id="d-title" tabindex="-1"${a.tags.includes('polish')?' lang="pl"':''}>${esc(a.t)}</h2>`
    : `<div class="d-head">${art(a,'d-art')}<div><p class="small muted">${ages}</p><h2 class="st" id="d-title" tabindex="-1">${esc(a.t)}</h2></div></div>`;
  const words = a.wd ? `<div class="d-sec lyrics"><h3>Words <span class="muted small">· po polsku</span></h3><p lang="pl">${a.wd.split(' / ').map(esc).join('<br>')}</p>${a.en?`<p class="gloss"><b>In English:</b> ${esc(a.en)}</p>`:''}${a.pn?`<p class="pl-note">${esc(a.pn)}</p>`:''}</div>` : '';
  const plBox = (s.polish && (a.pl||a.plp) && !a.wd) ? `<div class="d-sec pl-box"><span class="muted small">Po polsku</span>${a.pl?`<p><span class="muted small">Words</span> <b lang="pl">${esc(splitPl(a.pl)[0])}</b> <span class="muted small">${esc(splitPl(a.pl)[1])}</span></p>`:''}${a.plp?`<p><span class="muted small">Say</span> <b lang="pl">${esc(splitPl(a.plp)[0])}</b> <span class="muted small">${esc(splitPl(a.plp)[1])}</span></p>`:''}${a.pn?`<p class="pl-note">${esc(a.pn)}</p>`:''}</div>` : (a.wd && a.plp && s.polish ? `<div class="d-sec pl-box"><span class="muted small">Say</span> <b lang="pl">${esc(splitPl(a.plp)[0])}</b> <span class="muted small">${esc(splitPl(a.plp)[1])}</span></div>` : '');
  return `${head}
  <div style="margin-top:12px">${metaHTML(a,true)}</div>
  <a class="btn btn-tonal watch" href="${ytURL(a)}" target="_blank" rel="noopener noreferrer">${ic('play')}Watch an example<span class="vh"> (opens YouTube search in a new tab)</span></a>
  <div class="d-sec"><h3>You'll need</h3><p>${esc(a.mat)}</p></div>
  ${words}
  <div class="d-sec"><h3>How to</h3><ol class="steps">${a.s.map(x=>`<li><span>${fill(x)}</span></li>`).join('')}</ol></div>
  <div class="d-sec why-box">${ic('sparkle')}<p><b>Why it helps.</b> ${fill(a.w)}</p></div>
  <div class="d-sec vary"><div><b>Make it easier</b>${fill(a.ez)}</div><div><b>Make it harder</b>${fill(a.hd)}</div></div>
  ${a.sf?`<div class="d-sec safety" role="note">${ic('shield')}<p><b>Safety.</b> ${fill(a.sf)}</p></div>`:''}
  ${plBox}
  <div class="d-sec"><h3>Helps with</h3><div class="tags">${a.d.map(d=>`<span class="tag" style="background:var(${AREAS[d].c})" title="EYFS: ${AREAS[d].e}">${AREAS[d].n}</span>`).join('')}</div>
  <p class="fine" style="margin-top:8px">EYFS areas: ${a.d.map(d=>AREAS[d].e).join(', ')}</p></div>
  ${hist.length?`<div class="d-sec"><h3>Your moments</h3><ul class="history">${hist.slice(0,5).map(e=>`<li>${parseD(e.d).toLocaleDateString('en-GB',{day:'numeric',month:'short'})} · ${e.min} min${e.note?` · “${esc(e.note)}”`:''}</li>`).join('')}</ul></div>`:''}`;
}
function openDetail(id){
  const a=BY_ID[id]; if(!a) return;
  const fav=S.favs.includes(id);
  const foot = `<button class="btn btn-tonal" data-fav="${id}" aria-pressed="${fav}" style="flex:0 0 auto;padding:0 16px" aria-label="${fav?'Remove from saved':'Save idea'}">${fav?`<span class="fav-on">${icFill('heart')}</span>`:ic('heart')}<span>${fav?'Saved':'Save'}</span></button><button class="btn btn-primary" data-done="${id}">${ic('check')}We did this</button>`;
  openSheet(detailHTML(a), {foot, label:a.t, focus:'#d-title', name:'detail:'+id});
}
function refreshDetailFoot(id){
  const top=sheetStack[sheetStack.length-1]; if(!top||top.name!=='detail:'+id) return;
  const b=top.sh.querySelector('[data-fav]'); const fav=S.favs.includes(id);
  b.setAttribute('aria-pressed',fav); b.setAttribute('aria-label',fav?'Remove from saved':'Save idea');
  b.innerHTML = `${fav?`<span class="fav-on">${icFill('heart')}</span>`:ic('heart')}<span>${fav?'Saved':'Save'}</span>`;
}
function openDone(id){
  const a=BY_ID[id]; const s=S.settings; const p=s.parents.map(x=>x.trim()).filter(Boolean);
  const who = p.length ? [...p, ...(p.length>1?['Both of us']:[])] : [];
  const mins=[5,10,20,30,45]; const def = a.m;
  const html = `<h2 class="st" style="font-size:var(--fs-xl)" tabindex="-1">Lovely. How long did you play?</h2><p class="muted small" style="margin-top:4px">${esc(a.t)}</p>
  <form id="done-form" data-id="${id}">
    <div class="field"><span>Minutes</span><div class="seg" role="radiogroup" aria-label="Minutes">${mins.map(m=>`<button type="button" class="chip" role="radio" data-min="${m}" aria-checked="${m===def}">${m} min</button>`).join('')}</div></div>
    ${who.length?`<div class="field"><span>Who played?</span><div class="seg" role="radiogroup" aria-label="Who played">${who.map((w,i)=>`<button type="button" class="chip" role="radio" data-who="${esc(w)}" aria-checked="false">${esc(w)}</button>`).join('')}</div></div>`:''}
    <label class="field"><span>A little memory <small class="muted">(optional)</small></span><input class="input" name="note" maxlength="140" placeholder="He laughed every time the tower fell"></label>
    <button class="btn btn-primary btn-block" type="submit" style="margin-top:20px">Save moment</button>
  </form>`;
  openSheet(html, {label:'Save a moment', focus:'h2', name:'done:'+id});
}

/* ---------- Install ---------- */
const IS_IOS = /iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
const STANDALONE = () => navigator.standalone===true || matchMedia('(display-mode: standalone)').matches;
const IOS_SAFARI = IS_IOS && /Safari/.test(navigator.userAgent) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\//.test(navigator.userAgent);
function showIosHint(){ return IOS_SAFARI && !STANDALONE() && !(S.hints&&S.hints.ios); }
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt', e=>{ e.preventDefault(); deferredPrompt=e; });
window.addEventListener('appinstalled', ()=>{ deferredPrompt=null; });
/* Android: the Pebble app (APK) is a WebView of this site that adds ' PebbleAndroid/' to its user agent */
const IN_APK = /PebbleAndroid\//.test(navigator.userAgent) || !!window.PebbleNative;
const IS_ANDROID = /Android/i.test(navigator.userAgent) && !IN_APK;
const APK_URL = 'download/pebble.apk';
function installRowHTML(){
  if(IN_APK || STANDALONE()) return '';
  if(deferredPrompt) return `<div class="d-sec" id="install-row"><h3>Install</h3><div class="group"><button class="row-btn" data-act="install">${ic('plus')}Install Pebble on this phone</button></div><p class="fine">Opens full-screen from your home screen and works offline.</p></div>`;
  if(IS_ANDROID) return `<div class="d-sec" id="install-row"><h3>Install</h3><div class="group"><a class="row-btn" href="${APK_URL}" download="Pebble.apk">${ic('download')}Install on Android: Download app (APK)</a></div><p class="fine">Open the downloaded file to install. If Android asks, allow Chrome to install unknown apps.</p><p class="fine">Or add it from Chrome: menu <b aria-label="More options">⋮</b> → <b>Add to home screen</b> → <b>Install</b>.</p></div>`;
  if(IS_IOS) return `<div class="d-sec"><h3>Install</h3><p class="small">In Safari, tap <span class="share-glyph" aria-label="Share">${ic('share')}</span> Share, then <b>Add to Home Screen</b>.</p></div>`;
  return '';
}

/* ---------- Settings ---------- */
function settingsHTML(){
  const s=S.settings;
  const sw=(k,t,sub)=>`<div class="switch-row"><div class="txt" id="lbl-${k}"><b>${t}</b><small>${sub}</small></div><button class="switch" role="switch" aria-checked="${!!s[k]}" aria-labelledby="lbl-${k}" data-toggle="${k}"></button></div>`;
  return `<h2 class="st" tabindex="-1">Settings</h2>
  <form id="settings-form" autocomplete="off">
    <label class="field"><span>Child's name</span><input class="input" name="child" maxlength="30" value="${esc(s.child)}"></label>
    <label class="field"><span>Birthday</span><input class="input" type="date" name="birth" value="${esc(s.birth)}" max="${dkey()}"></label>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <label class="field"><span>Parent 1</span><input class="input" name="p1" maxlength="30" value="${esc(s.parents[0])}"></label>
      <label class="field"><span>Parent 2</span><input class="input" name="p2" maxlength="30" value="${esc(s.parents[1])}"></label>
    </div>
    <div class="field"><span>Daily aim</span><div class="seg">${[10,20,30].map(g=>`<button type="button" class="chip" data-goal="${g}" aria-pressed="${s.goal===g}">${g} min</button>`).join('')}</div></div>
    <div class="field"><span>Appearance</span><div class="seg">${['system','light','dark'].map(t=>`<button type="button" class="chip" data-theme="${t}" aria-pressed="${s.theme===t}">${t[0].toUpperCase()+t.slice(1)}</button>`).join('')}</div></div>
  </form>
  <div class="group" style="margin-top:20px">
    ${sw('allAges','Show ideas for every age','Includes ideas for older and younger children')}
    ${sw('polish','Polish at home','Polish rhymes & songs, and Polish words to say on everyday ideas')}
  </div>
  ${installRowHTML()}
  <div class="d-sec"><h3>Your data</h3><div class="group">
    <button class="row-btn" data-act="export">${ic('download')}Export a backup</button>
    <label class="row-btn" style="cursor:pointer">${ic('upload')}Import a backup<input id="import-file" type="file" accept="application/json,.json" class="vh"></label>
    <button class="row-btn danger" data-act="reset">${ic('trash')}Erase everything</button>
  </div><p class="fine">Pebble stores everything in this browser only. No accounts, no analytics, no ads. Export a backup to move to another phone.</p></div>
  <div class="d-sec"><h3>About</h3>
  <p class="small">Ideas are written for Pebble and grounded in public guidance: Harvard Center on the Developing Child (serve and return), NHS Best Start in Life, CDC milestones for 2 years and 30 months, ZERO TO THREE, BookTrust, and the EYFS areas of learning.</p>
  <p class="fine">Pebble is for fun and connection, not a developmental assessment. If you're worried about your child's development, talk to your health visitor or GP. Always supervise play, especially near water and with small objects. Version ${VERSION}.</p></div>`;
}
function openSettings(){ openSheet(settingsHTML(), {label:'Settings', focus:'h2', name:'settings', onClose:()=>render()}); }
function readSettingsForm(){
  const f=$('#settings-form'); if(!f) return; const s=S.settings;
  s.child=f.child.value.trim().slice(0,30); s.parents=[f.p1.value.trim().slice(0,30), f.p2.value.trim().slice(0,30)];
  const b=f.birth.value; if(!b) s.birth=''; else if(isDate(b) && b<=dkey()) s.birth=b; else { toast('Birthday can\'t be in the future'); }
  save();
}
function applyTheme(){ const t=S.settings.theme; if(t==='system') document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme',t);
  const dark = t==='dark' || (t==='system' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelectorAll('meta[name="theme-color"]').forEach(m=>{ m.setAttribute('content', dark?'#171311':'#FBF7F2'); m.removeAttribute('media'); });
  const sb=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]'); if(sb) sb.setAttribute('content', dark?'black':'default'); }

/* ---------- Events ---------- */
let lastTap={el:null,t:0};
document.addEventListener('click', e=>{
  const t = e.target.closest('button,[data-open]'); if(!t) return;
  const d = t.dataset;
  if(d.fav||d.done||d.act==='another'||d.del){ const now=Date.now(); if(lastTap.el===t && now-lastTap.t<450) return; lastTap={el:t,t:now}; }
  if(t.classList.contains('tab')) return setTab(d.tab);
  if(d.open){ return openDetail(d.open); }
  if(d.goto){ return closeAllSheets(()=>setTab(d.goto)); }
  if(d.quick){ ui.quick = ui.quick===d.quick?null:d.quick; return render(); }
  if(d.coll){ ui.coll = ui.coll===d.coll?null:d.coll; return render(); }
  if(d.f){ const v = d.f==='time'?+d.v:d.v; const arr=ui.f[d.f]; const i=arr.indexOf(v); i>=0?arr.splice(i,1):arr.push(v);
    if(t.closest('.sheet')){ t.setAttribute('aria-pressed', i<0); updateFilterSheetCount(); } else { t.setAttribute('aria-pressed', i<0); $('#results').innerHTML=resultsHTML(); }
    return; }
  if(d.fav){ const id=d.fav; const i=S.favs.indexOf(id); if(i>=0){ S.favs.splice(i,1); toast('Removed from saved'); } else { S.favs.push(id); toast('Saved'); } save(); refreshDetailFoot(id); return render(); }
  if(d.done){ return openDone(d.done); }
  if(d.min){ t.parentElement.querySelectorAll('[data-min]').forEach(b=>{ b.setAttribute('aria-checked', b===t); }); return; }
  if(d.who!==undefined){ const was=t.getAttribute('aria-checked')==='true'; t.parentElement.querySelectorAll('[data-who]').forEach(b=>{ b.setAttribute('aria-checked','false'); }); if(!was){ t.setAttribute('aria-checked','true'); } return; }
  if(d.del){ if(confirm('Delete this moment?')){ S.log=S.log.filter(x=>x.id!==d.del); save(); render(); toast('Moment deleted'); } return; }
  if(d.goal){ S.settings.goal=+d.goal; save(); t.parentElement.querySelectorAll('[data-goal]').forEach(b=>b.setAttribute('aria-pressed', b===t)); return; }
  if(d.theme){ S.settings.theme=d.theme; save(); applyTheme(); t.parentElement.querySelectorAll('[data-theme]').forEach(b=>b.setAttribute('aria-pressed', b===t)); return; }
  if(d.toggle){ const k=d.toggle; S.settings[k]=!S.settings[k]; save(); t.setAttribute('aria-checked', S.settings[k]); return; }
  switch(d.act){
    case 'close-sheet': return closeSheetUI();
    case 'settings': return openSettings();
    case 'another': S.shuffle.n++; save(); render(); $('#hero-t')?.focus?.(); return;
    case 'next-prompt': S.prompt.n++; save(); return render();
    case 'clear-coll': ui.coll=null; return render();
    case 'clear-all': ui.coll=null; ui.search=''; ui.f={time:[],energy:[],place:[],area:[]}; return render();
    case 'filters': return openFilters();
    case 'apply-filters': closeSheetUI(); return;
    case 'export': return exportData();
    case 'reset': if(confirm('Erase all settings, favourites and moments on this phone? This cannot be undone.')){ try{ localStorage.removeItem(KEY); localStorage.removeItem(KEY+'.unreadable'); }catch(_){} S=load(); applyTheme(); closeAllSheets(()=>{ render(); toast('Everything erased'); }); } return;
    case 'dismiss-ios': S.hints={...(S.hints||{}), ios:true}; save(); t.closest('.install-hint')?.remove(); return;
    case 'install': if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt.userChoice.finally(()=>{ deferredPrompt=null; const r=$('#install-row'); if(r) r.remove(); }); } return;
    case 'skip-welcome': S.settings.onboarded=true; save(); return setTab('today');
  }
});
function closeAllSheets(then){ const n=sheetStack.length; if(!n){ if(then) then(); return; } sheetStack.forEach(x=>x.closing=true); afterClose=then||null; history.go(-n); }
document.addEventListener('submit', e=>{
  e.preventDefault(); const f=e.target;
  if(f.id==='welcome-form'){ const b=f.birth.value; if(b && !(isDate(b) && b<=dkey())){ toast('Birthday can\'t be in the future'); f.birth.focus(); return; }
    S.settings.child=f.child.value.trim().slice(0,30); S.settings.birth=b; S.settings.parents=[f.p1.value.trim().slice(0,30), '']; S.settings.polish=!!(f.polish&&f.polish.checked); S.settings.onboarded=true; save(); setTab('today'); toast('Welcome to Pebble'); }
  if(f.id==='done-form'){
    if(f.dataset.saved) return; f.dataset.saved='1'; f.querySelector('[type=submit]')?.setAttribute('disabled','');
    const id=f.dataset.id; const minB=f.querySelector('[data-min][aria-checked="true"]'); const whoB=f.querySelector('[data-who][aria-checked="true"]');
    S.log.push({id:'m'+Date.now().toString(36)+Math.random().toString(36).slice(2,6), a:id, d:dkey(), ts:new Date().toISOString(), min: minB?+minB.dataset.min:BY_ID[id].m, who: whoB?whoB.dataset.who:'', note: f.note.value.trim().slice(0,140)});
    save(); closeAllSheets(()=>{ render(); toast('Saved to Moments'); });
  }
  if(f.id==='settings-form'){ readSettingsForm(); }
});
document.addEventListener('input', e=>{
  if(e.target.id==='q'){ ui.search=e.target.value; $('#results') && ($('#results').innerHTML=resultsHTML()); }
  if(e.target.closest('#settings-form')) readSettingsForm();
});
document.addEventListener('change', e=>{
  if(e.target.id==='import-file'){ const file=e.target.files[0]; if(!file) return; const r=new FileReader();
    r.onload=()=>{ try{ const data=JSON.parse(r.result); if(!data || data.app!=='pebble' || !data.state) throw new Error('bad');
        S=normalize(data.state); S.settings.onboarded=true;
        save(); applyTheme(); closeAllSheets(()=>{ render(); toast('Backup imported'); }); }
      catch(err){ toast("That file isn't a Pebble backup"); } e.target.value=''; };
    if(file.size>5e6){ toast("That file is too big to be a Pebble backup"); e.target.value=''; return; }
    r.readAsText(file); }
});
function exportData(){
  const json=JSON.stringify({app:'pebble', version:VERSION, exported:new Date().toISOString(), state:S},null,2);
  if(window.PebbleNative && PebbleNative.saveFile){   /* Android app: a WebView can't download blob: links */
    let ok=false; try{ ok=PebbleNative.saveFile(`pebble-backup-${dkey()}.json`, json, 'application/json'); }catch(_){}
    if(ok) toast('Backup saved to Downloads'); return; }
  const blob=new Blob([json],{type:'application/json'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`pebble-backup-${dkey()}.json`; document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000); toast('Backup downloaded');
}
function filterSheetHTML(){
  const grp=(title,key,entries)=>`<div class="d-sec"><h3>${title}</h3><div class="chips wrap">${entries.map(([v,n])=>`<button class="chip" data-f="${key}" data-v="${v}" aria-pressed="${ui.f[key].includes(key==='time'?+v:v)}">${n}</button>`).join('')}</div></div>`;
  return `<h2 class="st" tabindex="-1">Filters</h2>
  ${grp('Time','time',TIMES.map(t=>[t.k,t.n]))}
  ${grp('Energy','energy',Object.entries(ENERGY).map(([k,e])=>[k,e.n]))}
  ${grp('Where','place',Object.entries(PLACES).map(([k,p])=>[k,p.n]))}
  ${grp('Helps with','area',Object.entries(AREAS).map(([k,a])=>[k,a.n]))}`;
}
function openFilters(){ openSheet(filterSheetHTML(), {label:'Filters', focus:'h2', name:'filters', foot:`<button class="btn btn-tonal" data-act="clear-filters-sheet">Clear</button><button class="btn btn-primary" data-act="apply-filters" id="apply-f">Show ${filtered().length} ideas</button>`, onClose:()=>render()}); }
function updateFilterSheetCount(){ const b=$('#apply-f'); if(b) b.textContent=`Show ${filtered().length} ideas`; }
document.addEventListener('click', e=>{ const t=e.target.closest('[data-act="clear-filters-sheet"]'); if(!t) return; ui.f={time:[],energy:[],place:[],area:[]}; t.closest('.sheet').querySelectorAll('[data-f]').forEach(b=>b.setAttribute('aria-pressed','false')); updateFilterSheetCount(); });

/* ---------- Boot ---------- */
document.querySelectorAll('.tab').forEach(b=>{ const n={today:'today',ideas:'ideas',saved:'heart',moments:'moments'}[b.dataset.tab]; b.querySelector('.tab-ic').innerHTML=ic(n); });
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);
applyTheme();
const initial = location.hash.slice(1); setTab(['today','ideas','saved','moments'].includes(initial)?initial:'today', false);
history.replaceState(null,'',location.pathname+location.search+'#'+tab);
/* Day rollover: an app left open overnight shows the new day's idea when it comes back */
function checkDay(){ if(dkey()!==renderedDay){ renderedDay=dkey(); if(!sheetStack.length) render(); } }
document.addEventListener('visibilitychange', ()=>{ if(document.visibilityState==='visible'){ checkDay(); reg && reg.update && reg.update().catch(()=>{}); } });
setInterval(checkDay, 60000);
/* Service worker: when a new version takes over, reload once (only if nothing is open) so nobody is stuck on an old copy */
let reg=null;
if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  const hadController = !!navigator.serviceWorker.controller; let reloaded=false;
  /* nothing open: reload now (the 'Updated' note shows after). A sheet open: wait until the app is next hidden with no sheet open, so nothing half-typed is lost */
  let pendingReload=false;
  navigator.serviceWorker.addEventListener('controllerchange', ()=>{ if(!hadController || reloaded) return; reloaded=true;
    if(!sheetStack.length) location.reload(); else pendingReload=true; });
  document.addEventListener('visibilitychange', ()=>{ if(pendingReload && document.visibilityState==='hidden' && !sheetStack.length) location.reload(); });
  window.addEventListener('load', ()=>navigator.serviceWorker.register('sw.js').then(r=>{reg=r;}).catch(()=>{}));
}
/* A gentle note the first time a new version opens (not on a fresh install) */
(function(){ const LV='pebble.lastVersion'; let prev=null; try{ prev=localStorage.getItem(LV); localStorage.setItem(LV, VERSION); }catch(_){}
  if(prev!==VERSION && (prev || S.settings.onboarded)) setTimeout(()=>{ if(!sheetStack.length) toast('Updated to version '+VERSION); }, 600); })();
window.__pebble = { get state(){return S;}, todaysPick, eligible, ACTS, sheets:()=>sheetStack.length, VERSION };
})();
