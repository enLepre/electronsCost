'use strict';
const el=id=>document.getElementById(id);
const format=(n,digits=4)=>n===0?'0':Math.abs(n)<.0001||Math.abs(n)>=1e6?n.toExponential(3):n.toLocaleString('en-US',{maximumSignificantDigits:digits});
const defaultReagent=REAGENTS.find(r=>r.id==='h2-green'),defaultEnergy=ENERGY.find(e=>e.id==='solar');
const emptyScenario=()=>({reagent:'',energy:'',price:defaultReagent.price,mass:defaultReagent.mass,electrons:defaultReagent.n,utilization:100,tariff:defaultEnergy.tariff,voltage:1,faradaic:100,supply:100,amount:1,legacy:false,plotMax:5});
const sharedScenario=location.hash.startsWith('#scenario=')?ScenarioNav.read():null;
if(!sharedScenario)ScenarioNav.clear();
let scenario=sharedScenario||emptyScenario();
for(const [id,items] of [['reagent',REAGENTS],['energy',ENERGY]])for(const item of items){
  const option=document.createElement('option');option.value=item.id;option.textContent=item.name;el(id).append(option);
}
function price(target,value,unit){
  const output=el(target);output.replaceChildren();
  output.hidden=value===null;
  if(value===null)return;
  const strong=document.createElement('strong');strong.textContent=format(value);
  const small=document.createElement('small');small.textContent=unit;
  output.append(strong,small);
}
function render(){
  EnergyChoices.sync(scenario);el('reagent').value=scenario.reagent;
  window.SourceDropdowns?.sync();
  const slider=el('voltage-slider');
  const max=Math.max(scenario.plotMax,scenario.voltage,.01);
  el('max-voltage').value=max;slider.max=max;slider.step='any';slider.value=scenario.voltage;
  el('voltage-value').textContent=format(scenario.voltage)+' V';
  slider.setAttribute('aria-valuetext',format(scenario.voltage)+' volts');
  const ready=!!(scenario.reagent&&scenario.energy);
  el('voltage-comparison').hidden=!ready;
  el('share-comparison').disabled=!ready;
  el('share-status').textContent='';
  el('share-fallback').hidden=true;
  el('metric-control').hidden=!scenario.energy;
  slider.disabled=!ready;el('graph-area').hidden=!ready;el('simple-error').hidden=true;
  price('chemical-price',scenario.reagent?scenario.price*scenario.mass/(1000*scenario.electrons*scenario.utilization/100):null,'USD / mol e⁻');
  price('energy-price',scenario.energy?ElectronModel.calculate(scenario).electrical:null,'USD / mol e⁻');
  el('tariff-price').textContent=scenario.energy?format(scenario.tariff)+' USD / kWh':'';
  el('tariff-price').hidden=!scenario.energy;
  el('reagent-mass-price').textContent=scenario.reagent?format(scenario.price)+' USD / kg':'';
  el('reagent-mass-price').hidden=!scenario.reagent;
  if(!ready){el('comparison-status').textContent='';return;}
  try{
    const result=ElectronModel.calculate(scenario);
    if(!ScenarioNav.valid(scenario))throw new Error('Check the inputs on the Details page.');
    price('chemical-price',result.chemical,'USD / mol e⁻');
    price('energy-price',result.electrical,'USD / mol e⁻');
    const low=Math.min(result.chemical,result.electrical),high=Math.max(result.chemical,result.electrical);
    const verdict=result.winner==='equal'?'The costs are equal':(result.winner==='electricity'?'Electricity':'The chemical reagent')+(low===0?' has zero cost':' is ~'+format(high/low,2)+'× cheaper');
    const crossing=result.breakEven===null?'no unique break-even':('break-even at '+format(result.breakEven,2)+' V');
    el('comparison-status').textContent=verdict+' at '+format(scenario.voltage)+' V · '+crossing;
    ScenarioNav.save(scenario);draw(result,max);
  }catch(e){el('graph-area').hidden=true;slider.disabled=true;el('comparison-status').textContent='';el('simple-error').hidden=false;el('simple-error').textContent=e.message;}
}
function draw(r,max){ElectronChart.draw(el('comparison-chart'),scenario,r,max);}
el('reagent').addEventListener('change',()=>{
  const r=REAGENTS.find(r=>r.id===el('reagent').value);scenario.reagent=r.id;
  scenario.price=r.price;scenario.mass=scenario.legacy?r.legacyMass??r.mass:r.mass;scenario.electrons=scenario.legacy?r.legacyN??r.n:r.n;
  if(r.id==='custom'){openCustom();return;}render();
});
el('valcoe').addEventListener('change',()=>{
  const previous=scenario.energy,mode=el('valcoe').checked?'valcoe':'lcoe';
  scenario=EnergyChoices.switchMetric(scenario,mode);
  el('metric-status').textContent=mode==='valcoe'&&previous!=='custom'&&!scenario.energy.startsWith(previous+'-')?'This source has no verified VALCOE. Solar PV has been selected.':'';
  render();
});
el('energy').addEventListener('change',()=>{
  el('metric-status').textContent='';
  const mode=el('valcoe').checked?'valcoe':'lcoe';
  const e=ENERGY.find(e=>e.id===el('energy').value);scenario.energy=e.id;scenario.tariff=e.tariff;if(e.id==='custom')scenario.energyMetric=mode;else delete scenario.energyMetric;
  if(e.id==='custom'){openCustom();return;}render();
});
function openCustom(){
  // The detailed editor needs a complete scenario; the unchosen side starts with its documented default.
  const s={...scenario,reagent:scenario.reagent||defaultReagent.id,energy:scenario.energy||defaultEnergy.id};
  if(!scenario.reagent){const r=defaultReagent;s.price=r.price;s.mass=r.mass;s.electrons=r.n;}
  if(!scenario.energy)s.tariff=defaultEnergy.tariff;
  ScenarioNav.save(s);location.href='details.html#scenario='+encodeURIComponent(JSON.stringify(s));
}
el('voltage-slider').addEventListener('input',()=>{scenario.voltage=Number(el('voltage-slider').value);render();});
const chart=el('comparison-chart');
function position(event){
  const point=chart.createSVGPoint();point.x=event.clientX;point.y=event.clientY;
  const p=point.matrixTransform(chart.getScreenCTM().inverse());
  const max=Number(el('voltage-slider').max);
  scenario.voltage=Math.max(0,Math.min(max,(p.x-chart._plot.left)/chart._plot.width*max));render();
}
chart.addEventListener('pointerdown',e=>{if(e.button!==0)return;chart.setPointerCapture(e.pointerId);position(e);});
chart.addEventListener('pointermove',e=>{if(chart.hasPointerCapture(e.pointerId))position(e);});
chart.addEventListener('pointerup',e=>{if(chart.hasPointerCapture(e.pointerId))chart.releasePointerCapture(e.pointerId);});
window.addEventListener('hashchange',()=>{const s=ScenarioNav.read();if(s){scenario=s;render();}});
render();
if(location.hash.startsWith('#scenario=')&&!ScenarioNav.read()){el('simple-error').hidden=false;el('simple-error').textContent='This comparison link is invalid. Choose your sources to begin.';}

el('max-voltage').addEventListener('input',()=>{
  const value=Number(el('max-voltage').value);
  if(!Number.isFinite(value)||value<.01||!Number.isFinite(ElectronModel.calculate(scenario).slope*value)){
    el('max-voltage').setAttribute('aria-invalid','true');
    el('simple-error').hidden=false;el('simple-error').textContent='Enter a finite max V of at least 0.01.';return;
  }
  el('max-voltage').setAttribute('aria-invalid','false');
  scenario.plotMax=value;scenario.voltage=Math.min(scenario.voltage,value);render();
});
window.addEventListener('resize',()=>render());

el('start-over').addEventListener('click',()=>{
  ScenarioNav.clear();
  history.replaceState(null,'',location.pathname);
  scenario=emptyScenario();
  el('metric-status').textContent='';
  el('max-voltage').setAttribute('aria-invalid','false');
  render();
});

el('share-comparison').addEventListener('click',async()=>{
  if(!ScenarioNav.valid(scenario))return;
  const url=new URL(location.href);url.hash='scenario='+encodeURIComponent(JSON.stringify(scenario));
  try{
    await navigator.clipboard.writeText(url.href);
    el('share-status').textContent='Link copied';
  }catch{
    el('share-fallback').hidden=false;el('share-url').value=url.href;el('share-url').focus();el('share-url').select();
    el('share-status').textContent='Copy the link below';
  }
});
