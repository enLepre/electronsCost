'use strict';
const $ = id => document.getElementById(id);
const numeric = ['price','mass','electrons','utilization','tariff','voltage','faradaic','supply','amount'];
let current;
const number = (v, digits=4) => !Number.isFinite(v) ? '—' : v === 0 ? '0' : Math.abs(v)<.0001 || Math.abs(v)>=1e6 ? v.toExponential(3) : v.toLocaleString('en-US',{maximumSignificantDigits:digits});
function state() {
  const s = Object.fromEntries(numeric.map(k=>[k,$(k).value.trim()==='' ? NaN : Number($(k).value)]));
  return {...s,reagent:$('reagent').value,energy:$('energy').value,legacy:$('legacy').checked,plotMax:Number($('plot-max').value)};
}
function reagent(){return REAGENTS.find(r=>r.id===$('reagent').value);}
function energy(){return ENERGY.find(r=>r.id===$('energy').value);}
function loadReagent(){const r=reagent();$('price').value=r.price;$('mass').value=$('legacy').checked ? r.legacyMass ?? r.mass : r.mass;$('electrons').value=$('legacy').checked ? r.legacyN ?? r.n : r.n;}
function loadEnergy(){$('tariff').value=energy().tariff;}
function annotate(){
  const r=reagent(),e=energy();
  $('reagent-type').textContent=r.type + (r.row ? ' · workbook preset, editable' : '');
  $('reaction').textContent=($('legacy').checked?'Original workbook chemistry selected. ':'')+r.note;
  $('energy-note').textContent=e.row ? 'Workbook example · undated'+(e.row>=11?' · unverified generation-cost estimate':'') : 'Enter your delivered electricity price.';
  const p=$('provenance');p.replaceChildren();
  p.append('Selected inputs: '+(r.row?'Chemical!B'+r.row+':E'+r.row:'custom reagent')+'; '+(e.row?'Electricity!C'+e.row:'custom tariff')+'. Edited values override these presets. ');
  if(r.source){const a=document.createElement('a');a.href=r.source;a.textContent='Supplier/report link recorded in workbook (price not reverified).';p.append(a);}
}
function render(){
  annotate();$('status').textContent='';$('share-fallback').hidden=true;
  try{
    const s=state(),r=ElectronModel.calculate(s);
    if(Object.values(r).some(v=>typeof v==='number'&&!Number.isFinite(v)))throw new Error('These inputs exceed the supported numeric range. Use smaller values.');
    current={s,r};$('error').hidden=true;$('results').hidden=false;
    $('at-voltage').textContent=number(s.voltage);
    $('winner').textContent=r.winner==='equal'?'The costs are equal.':r.winner==='electricity'?'Electricity is cheaper.':'The reagent is cheaper.';
    const max=Math.max(r.chemical,r.electrical);
    const savings=max ? 100*Math.abs(r.electrical-r.chemical)/max:0;
    $('difference').textContent=r.winner==='equal'?'Both options have the same cost per useful electron equivalent.':number(savings,3)+'% lower cost than '+(r.winner==='electricity'?'the reagent':'electricity')+'. '+(r.ratio===null?'Electrical / chemical ratio is undefined at zero reagent cost.':'Electrical / chemical cost: '+number(r.ratio)+'×.');
    $('electrical').textContent=number(r.electrical);$('chemical').textContent=number(r.chemical);
    $('break-even').textContent=r.breakEven===null?'No crossing':number(r.breakEven)+' V';
    $('break-note').textContent=r.breakEven===null?(r.chemical===0?'Both costs are zero at every voltage.':'Zero tariff: electricity stays cheaper.'):'Equal cost per mol e⁻';
    $('scale-label').textContent='For '+number(s.amount)+' mol of useful e⁻';
    $('scale-value').textContent='Electricity: $'+number(r.electricalTotal)+' · Reagent: $'+number(r.chemicalTotal)+' · Energy: '+number(r.energy)+' kWh';
    draw(s,r);rank(s,r);
  }catch(e){current=null;$('error').hidden=false;$('error').textContent=e.message;$('results').hidden=true;$('ranking').replaceChildren();}
}
function draw(s,r){
  const max=s.plotMax;
  if(!Number.isFinite(max)||max<=0||!Number.isFinite(r.slope*max)){$('chart').replaceChildren();$('plot-note').textContent='Enter a positive, finite plot limit within the supported range.';return;}
  const w=650,h=300,left=72,right=18,top=20,bottom=48;
  const ymax=Math.max(r.chemical,r.slope*max,1e-8)*1.15;
  const x=v=>left+v/max*(w-left-right),y=c=>h-bottom-c/ymax*(h-top-bottom);
  let svg='<title id="chart-title">Cost versus cell voltage</title><desc id="chart-desc">Electricity cost rises linearly with voltage; reagent cost is constant. Current voltage '+number(s.voltage)+' V. '+(r.breakEven===null?'No unique break-even voltage.':'Break-even '+number(r.breakEven)+' V.')+'</desc>';
  for(let i=0;i<=4;i++){
    const c=ymax*i/4,v=max*i/4;
    svg+='<line class="grid" x1="'+left+'" x2="'+(w-right)+'" y1="'+y(c)+'" y2="'+y(c)+'"/><text x="'+(left-10)+'" y="'+(y(c)+4)+'" text-anchor="end">'+number(c,3)+'</text><text x="'+x(v)+'" y="'+(h-bottom+23)+'" text-anchor="middle">'+number(v,3)+'</text>';
  }
  svg+='<path class="chemical-line" d="M '+x(0)+' '+y(r.chemical)+' L '+x(max)+' '+y(r.chemical)+'"/><path class="electric-line" d="M '+x(0)+' '+y(0)+' L '+x(max)+' '+y(r.slope*max)+'"/>';
  if(s.voltage<=max)svg+='<line class="selection-line" x1="'+x(s.voltage)+'" x2="'+x(s.voltage)+'" y1="'+top+'" y2="'+(h-bottom)+'"/><circle cx="'+x(s.voltage)+'" cy="'+y(r.electrical)+'" r="4" fill="var(--electric)"/>';
  if(r.breakEven!==null&&r.breakEven<=max)svg+='<circle cx="'+x(r.breakEven)+'" cy="'+y(r.chemical)+'" r="5" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5"/>';
  svg+='<text x="'+((w+left-right)/2)+'" y="295" text-anchor="middle">Full cell voltage (V)</text>';
  $('chart').innerHTML=svg;
  $('plot-note').textContent=(s.voltage>max?'Selected voltage is outside the plotted range. ':'')+(r.breakEven!==null&&r.breakEven>max?'Break-even is beyond this range; increase “Plot to” to see the crossing.':'The open circle marks equal cost when a crossing is in view.');
}
function rank(s,r){
  const rows=ENERGY.filter(e=>e.row).map(e=>({e,r:ElectronModel.calculate({...s,tariff:e.tariff})})).sort((a,b)=>a.r.electrical-b.r.electrical);
  $('ranking').replaceChildren(...rows.map(({e,r:rr})=>{
    const tr=document.createElement('tr');
    for(const text of [e.name,number(e.tariff),number(rr.electrical),rr.winner==='equal'?'Equal cost':rr.winner==='electricity'?'Electricity cheaper':'Reagent cheaper']){const td=document.createElement('td');td.textContent=text;tr.append(td);}
    return tr;
  }));
}
function reset(){ $('inputs').reset();$('reagent').value='h2-grey';$('energy').value='eu';$('plot-max').value=5;loadReagent();loadEnergy();render(); }
for(const [id,items] of [['reagent',REAGENTS],['energy',ENERGY]])for(const item of items){const o=document.createElement('option');o.value=item.id;o.textContent=item.name;$(id).append(o);}
$('inputs').addEventListener('submit',e=>e.preventDefault());
$('inputs').addEventListener('input',e=>{if(e.target.id==='reagent'||e.target.id==='legacy')loadReagent();if(e.target.id==='energy')loadEnergy();render();});
$('plot-max').addEventListener('input',render);$('reset').addEventListener('click',()=>{history.replaceState(null,'',location.pathname+location.search);reset();});
$('theme').addEventListener('click',()=>{const dark=document.documentElement.dataset.theme!=='dark';document.documentElement.dataset.theme=dark?'dark':'light';$('theme').textContent=dark?'Light mode':'Dark mode';try{localStorage.setItem('electron-cost-theme',dark?'dark':'light');}catch{}});
try{if(localStorage.getItem('electron-cost-theme')==='dark')$('theme').click();}catch{}
$('share').addEventListener('click',async()=>{
  if(!current)return;
  const url=new URL(location.href);url.hash='scenario='+encodeURIComponent(JSON.stringify(current.s));
  try{await navigator.clipboard.writeText(url.href);$('status').textContent='Comparison link copied, including all inputs.';}catch{$('share-fallback').hidden=false;$('share-url').value=url.href;$('share-url').select();$('status').textContent='Select and copy the comparison link below.';}
});
$('export').addEventListener('click',()=>{
  if(!current)return;const {s,r}=current;
  const rows=[['Electron Cost scenario','Value','Unit'],['Reagent',reagent().name,''],['Energy source',energy().name,''],['Original workbook chemistry',s.legacy,''],
    ...numeric.map(k=>[k,s[k],({price:'USD/kg',mass:'g/mol',electrons:'mol e-/mol reagent',utilization:'%',tariff:'USD/kWh',voltage:'V',faradaic:'%',supply:'%',amount:'mol useful e-'})[k]]),
    ['Chemical cost',r.chemical,'USD/mol useful e-'],['Electricity cost',r.electrical,'USD/mol useful e-'],['Break-even voltage',r.breakEven===null?'No unique crossing':r.breakEven,'V'],['Electrical / chemical ratio',r.ratio===null?'Undefined':r.ratio,''],['Chemical total',r.chemicalTotal,'USD'],['Electricity total',r.electricalTotal,'USD'],['Energy',r.energy,'kWh'],['Faraday constant',ElectronModel.F,'C/mol'],['Price provenance','Undated workbook examples; edited values override presets',''],['Reaction note',reagent().note,'']];
  const csv=rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='electron-cost-comparison.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('status').textContent='CSV downloaded with inputs, units and calculated results.';
});
reset();
function restore(){
  if(!location.hash.startsWith('#scenario='))return;
  try{
    const s=JSON.parse(decodeURIComponent(location.hash.slice(10)));
    if(!REAGENTS.some(r=>r.id===s.reagent)||!ENERGY.some(e=>e.id===s.energy)||typeof s.legacy!=='boolean')throw new Error();
    ElectronModel.calculate(s);
    if(!Number.isFinite(s.plotMax)||s.plotMax<=0)throw new Error();
    $('reagent').value=s.reagent;$('energy').value=s.energy;$('legacy').checked=s.legacy;
    numeric.forEach(k=>$(k).value=s[k]);$('plot-max').value=s.plotMax;render();
    $('status').textContent='Shared comparison restored.';
  }catch{reset();$('status').textContent='This comparison link is invalid. Default inputs are shown.';}
}
restore();window.addEventListener('hashchange',restore);
