/* Shared, responsive chart. Coordinates remain in CSS pixels on narrow screens. */
'use strict';
const ElectronChart = (() => {
  const fmt=n=>n===0?'0':Number(n.toPrecision(3)).toLocaleString('en-US',{maximumSignificantDigits:3});
  function draw(chart,s,r,max){
    const w=Math.max(320,chart.clientWidth||650),h=320,left=54,right=92,top=42,bottom=48;
    chart.setAttribute('viewBox',`0 0 ${w} ${h}`);
    chart._plot={left,width:w-left-right};
    const peak=Math.max(r.chemical,r.slope*max,1e-12)*1000;
    const raw=peak/4,power=10**Math.floor(Math.log10(raw));
    const step=([1,2,2.5,5,10].find(n=>n*power>=raw)||10)*power;
    const ymax=Math.ceil(peak/step)*step;
    const x=v=>left+v/max*(w-left-right),y=c=>h-bottom-(c*1000/ymax)*(h-top-bottom);
    let svg=`<title id="chart-title">Electron cost versus cell voltage</title><desc id="${chart.id==='chart'?'chart-desc':'chart-description'}">At ${fmt(s.voltage)} volts, electricity costs ${fmt(r.electrical)} dollars per mole of useful electron equivalents and the chemical reagent costs ${fmt(r.chemical)}. ${r.breakEven===null?'No unique break-even voltage.':'Break-even '+fmt(r.breakEven)+' V.'}</desc>`;
    for(let i=0;i<=Math.round(ymax/step);i++){
      const c=i*step/1000;
      svg+=`<line class="grid" x1="${left}" x2="${w-right}" y1="${y(c)}" y2="${y(c)}"/><text x="${left-9}" y="${y(c)+4}" text-anchor="end">${fmt(i*step)}</text>`;
    }
    for(let i=0;i<=4;i++)svg+=`<text x="${x(max*i/4)}" y="${h-bottom+24}" text-anchor="middle">${fmt(max*i/4)}</text>`;
    svg+=`<path class="chemical-line" d="M ${x(0)} ${y(r.chemical)} L ${x(max)} ${y(r.chemical)}"/><path class="electric-line" d="M ${x(0)} ${y(0)} L ${x(max)} ${y(r.slope*max)}"/>`;
    const cy=y(r.chemical),ey=y(r.slope*max),close=Math.abs(cy-ey)<22;
    const chemicalLabel=cy+(close?(cy>=ey?14:-10):4),electricLabel=ey+(close?(cy>=ey?-10:14):4);
    svg+=`<text class="chemical-label" x="${x(max)+8}" y="${chemicalLabel}">Reagent</text><text class="electric-label" x="${x(max)+8}" y="${electricLabel}">Electricity</text>`;
    if(s.voltage<=max){
      svg+=`<line class="selection-line" x1="${x(s.voltage)}" x2="${x(s.voltage)}" y1="${top}" y2="${h-bottom}"/>`;
      for(const [cost,color] of [[r.electrical,'--electric'],[r.chemical,'--chem']])svg+=`<circle cx="${x(s.voltage)}" cy="${y(cost)}" r="4" fill="var(${color})"/>`;
    }
    if(r.breakEven!==null&&r.breakEven<=max){
      const bx=x(r.breakEven),by=y(r.chemical);
      // Keep the crossing label inside the plot, even at either boundary.
      const lx=Math.max(left+65,Math.min(w-right-65,bx));
      svg+=`<circle cx="${bx}" cy="${by}" r="5" fill="var(--paper)" stroke="var(--ink)" stroke-width="1.5"/><text class="crossing-label" x="${lx}" y="${Math.max(18,by-18)}" text-anchor="middle">break-even ${fmt(r.breakEven)} V</text>`;
    }
    svg+=`<text x="${(w+left-right)/2}" y="${h-5}" text-anchor="middle">Cell voltage (V)</text>`;
    chart.innerHTML=svg;
  }
  return {draw};
})();
