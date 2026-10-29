'use strict';
const el=id=>document.getElementById(id);
const format=(n,digits=4)=>n===0?'0':Math.abs(n)<.0001||Math.abs(n)>=1e6?n.toExponential(3):n.toLocaleString('en-US',{maximumSignificantDigits:digits});
let scenario=ScenarioNav.read()||{reagent:'',energy:'',price:1,mass:2,electrons:2,utilization:100,tariff:.3,voltage:1,faradaic:100,supply:100,amount:1,legacy:false,plotMax:5};
for(const [id,items] of [['reagent',REAGENTS],['energy',ENERGY]])for(const item of items){
  const option=document.createElement('option');option.value=item.id;option.textContent=item.name;el(id).append(option);
}
function price(target,value,unit){
  const output=el(target);output.replaceChildren();
  if(value===null)return;
  const strong=document.createElement('strong');strong.textContent=format(value);
  const small=document.createElement('small');small.textContent=unit;
  output.append(strong,small);
}
function render(){
  el('reagent').value=scenario.reagent;el('energy').value=scenario.energy;
  const slider=el('voltage-slider');
  const max=Math.max(scenario.plotMax,scenario.voltage,.01);
  slider.max=max;slider.step='any';slider.value=scenario.voltage;
  el('voltage-value').textContent=format(scenario.voltage)+' V';
  slider.setAttribute('aria-valuetext',format(scenario.voltage)+' volts');
  const ready=!!(scenario.reagent&&scenario.energy);
  slider.disabled=!ready;el('graph-area').hidden=!ready;el('simple-error').hidden=true;
  price('chemical-price',scenario.reagent?scenario.price*scenario.mass/(1000*scenario.electrons*scenario.utilization/100):null,'USD / mol e⁻');
  price('energy-price',scenario.energy?scenario.tariff:null,'USD / kWh');
  if(!ready){el('comparison-status').textContent='Choose both sources to compare.';return;}
  try{
    const result=ElectronModel.calculate(scenario);
    if(!ScenarioNav.valid(scenario))throw new Error('Check the inputs on the Details page.');
    el('comparison-status').textContent=result.winner==='equal'?'The costs are equal.':result.winner==='electricity'?'Electricity is cheaper.':'The chemical reagent is cheaper.';
    ScenarioNav.save(scenario);draw(result,max);
  }catch(e){el('graph-area').hidden=true;slider.disabled=true;el('comparison-status').textContent='';el('simple-error').hidden=false;el('simple-error').textContent=e.message;}
}
function draw(r,max){
  const left=88,right=22,top=22,bottom=54,w=900,h=330;
  const ymax=Math.max(r.chemical,r.slope*max,1e-12)*1.15;
  const x=v=>left+v/max*(w-left-right),y=c=>h-bottom-c/ymax*(h-top-bottom);
  let html='<title id="chart-title">Electron cost versus cell voltage</title><desc id="chart-description">At '+format(scenario.voltage)+' volts, electricity costs '+format(r.electrical)+' dollars per mole of useful electron equivalents and the chemical reagent costs '+format(r.chemical)+'.</desc>';
  for(let i=0;i<=4;i++){
    const c=ymax*i/4,v=max*i/4;
    html+='<line class="grid" x1="'+left+'" x2="'+(w-right)+'" y1="'+y(c)+'" y2="'+y(c)+'"/><text x="'+(left-12)+'" y="'+(y(c)+4)+'" text-anchor="end">'+format(c,3)+'</text><text x="'+x(v)+'" y="'+(h-bottom+25)+'" text-anchor="middle">'+format(v,3)+'</text>';
  }
  html+='<path class="chemical-line" d="M '+x(0)+' '+y(r.chemical)+' L '+x(max)+' '+y(r.chemical)+'"/><path class="electric-line" d="M '+x(0)+' '+y(0)+' L '+x(max)+' '+y(r.slope*max)+'"/>';
  html+='<line class="selection-line" x1="'+x(scenario.voltage)+'" x2="'+x(scenario.voltage)+'" y1="'+top+'" y2="'+(h-bottom)+'"/>';
  for(const [cost,color] of [[r.electrical,'--electric'],[r.chemical,'--chem']])html+='<circle cx="'+x(scenario.voltage)+'" cy="'+y(cost)+'" r="5" fill="var('+color+')"/>';
  if(r.breakEven!==null&&r.breakEven<=max)html+='<circle cx="'+x(r.breakEven)+'" cy="'+y(r.chemical)+'" r="5" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5"/>';
  html+='<text x="'+((w+left-right)/2)+'" y="325" text-anchor="middle">Cell voltage (V)</text>';
  el('comparison-chart').innerHTML=html;
}
el('reagent').addEventListener('change',()=>{
  const r=REAGENTS.find(r=>r.id===el('reagent').value);scenario.reagent=r.id;
  scenario.price=r.price;scenario.mass=scenario.legacy?r.legacyMass??r.mass:r.mass;scenario.electrons=scenario.legacy?r.legacyN??r.n:r.n;
  if(r.id==='custom'){openCustom();return;}render();
});
el('energy').addEventListener('change',()=>{
  const e=ENERGY.find(e=>e.id===el('energy').value);scenario.energy=e.id;scenario.tariff=e.tariff;
  if(e.id==='custom'){openCustom();return;}render();
});
function openCustom(){
  // The detailed editor needs a complete scenario; the unchosen side starts with its documented default.
  const s={...scenario,reagent:scenario.reagent||'h2-grey',energy:scenario.energy||'eu'};
  if(!scenario.reagent){const r=REAGENTS.find(r=>r.id==='h2-grey');s.price=r.price;s.mass=r.mass;s.electrons=r.n;}
  if(!scenario.energy)s.tariff=ENERGY.find(e=>e.id==='eu').tariff;
  ScenarioNav.save(s);location.href='details.html#scenario='+encodeURIComponent(JSON.stringify(s));
}
el('voltage-slider').addEventListener('input',()=>{scenario.voltage=Number(el('voltage-slider').value);render();});
const chart=el('comparison-chart');
function position(event){
  const point=chart.createSVGPoint();point.x=event.clientX;point.y=event.clientY;
  const p=point.matrixTransform(chart.getScreenCTM().inverse());
  const max=Number(el('voltage-slider').max);
  scenario.voltage=Math.max(0,Math.min(max,(p.x-88)/(900-88-22)*max));render();
}
chart.addEventListener('pointerdown',e=>{if(e.button!==0)return;chart.setPointerCapture(e.pointerId);position(e);});
chart.addEventListener('pointermove',e=>{if(chart.hasPointerCapture(e.pointerId))position(e);});
chart.addEventListener('pointerup',e=>{if(chart.hasPointerCapture(e.pointerId))chart.releasePointerCapture(e.pointerId);});
window.addEventListener('hashchange',()=>{const s=ScenarioNav.read();if(s){scenario=s;render();}});
render();
if(location.hash.startsWith('#scenario=')&&!ScenarioNav.read()){el('simple-error').hidden=false;el('simple-error').textContent='This comparison link is invalid. Choose your sources to begin.';}
