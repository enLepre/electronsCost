'use strict';
// Carry full input values between pages, including edited custom scenarios.
const ScenarioNav = (() => {
  let last = null;
  function valid(s) {
    if(!s || !REAGENTS.some(r=>r.id===s.reagent) || !ENERGY.some(e=>e.id===s.energy) || typeof s.legacy!=='boolean' || !Number.isFinite(s.plotMax) || s.plotMax<=0) return false;
    try{return Object.values(ElectronModel.calculate(s)).every(v=>typeof v!=='number'||Number.isFinite(v));}catch{return false;}
  }
  function read() {
    try {
      if(location.hash.startsWith('#scenario=')) {
        const s=JSON.parse(decodeURIComponent(location.hash.slice(10)));
        return valid(s)?s:null;
      }
      const s=JSON.parse(sessionStorage.getItem('electron-cost-scenario'));
      return valid(s)?s:null;
    }catch{return null;}
  }
  function save(s) {
    if(!valid(s))return;
    last={...s};
    try{sessionStorage.setItem('electron-cost-scenario',JSON.stringify(last));}catch{}
    document.querySelectorAll('[data-scenario-link]').forEach(a=>{
      const url=new URL(a.getAttribute('href'),location.href);
      url.hash='scenario='+encodeURIComponent(JSON.stringify(last));a.href=url.href;
    });
  }
  const loaded=read();if(loaded)save(loaded);
  const page=location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('[data-scenario-link]').forEach(a=>{if(new URL(a.href,location.href).pathname.endsWith('/'+page))a.setAttribute('aria-current','page');});
  const theme=document.getElementById('theme');
  function setTheme(dark){document.documentElement.dataset.theme=dark?'dark':'light';theme.textContent=dark?'Light mode':'Dark mode';}
  theme.addEventListener('click',()=>{const dark=document.documentElement.dataset.theme!=='dark';setTheme(dark);try{localStorage.setItem('electron-cost-theme',dark?'dark':'light');}catch{}});
  try{setTheme(localStorage.getItem('electron-cost-theme')==='dark');}catch{}
  return {read,save,valid};
})();
