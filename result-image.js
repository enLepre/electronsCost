'use strict';
const ResultImage = (() => {
  const format = (n, digits = 4) => n === 0 ? '0' : Math.abs(n) < .0001 || Math.abs(n) >= 1e6
    ? n.toExponential(3) : n.toLocaleString('en-US', {maximumSignificantDigits:digits});
  function draw(canvas, s) {
    const r = ElectronModel.calculate(s);
    const chemical = REAGENTS.find(item => item.id === s.reagent);
    const energy = ENERGY.find(item => item.id === s.energy);
    if (!chemical || !energy) throw new Error('Choose both sources first.');
    canvas.width = 1200; canvas.height = 1050;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Image downloads are unavailable in this browser.');
    const ink = '#34312c', muted = '#70685e';
    ctx.fillStyle = '#f5f2ec'; ctx.fillRect(0, 0, 1200, 1050);
    function text(value, x, y, size = 24, color = ink, align = 'left') {
      ctx.fillStyle = color; ctx.textAlign = align; ctx.font = size + 'px Georgia, serif';
      ctx.fillText(value, x, y);
    }
    function line(x1, y, x2) {
      ctx.strokeStyle = '#b3aa9c';ctx.lineWidth = 1;ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x2,y);ctx.stroke();
    }
    function sourceName(value, x) {
      let size = 27, lines;
      do {
        ctx.font = size + 'px Georgia, serif';
        lines = [''];
        for (const word of value.split(/\s+/)) {
          const candidate = (lines.at(-1) + ' ' + word).trim();
          if (ctx.measureText(candidate).width > 490 && lines.at(-1)) lines.push(word);
          else lines[lines.length - 1] = candidate;
        }
        if (lines.length <= 2) break;
        size--;
      } while (size >= 18);
      lines.forEach((value, i) => text(value, x, 194 + i * 33, size, ink, 'center'));
    }
    text('Which electron is cheaper?', 60, 78, 44);
    text('A comparison at ' + format(s.voltage) + ' V', 60, 119, 23, muted);
    line(60, 143, 1140);
    sourceName(chemical.name, 318);sourceName(energy.name, 882);
    text(format(r.chemical), 318, 300, 54, '#875f7b', 'center');
    text(format(r.electrical), 882, 300, 54, '#007f78', 'center');
    text('USD / mol e⁻', 318, 342, 23, muted, 'center');
    text('USD / mol e⁻', 882, 342, 23, muted, 'center');
    text(format(s.price) + ' USD / kg', 318, 380, 21, muted, 'center');
    text(format(s.tariff) + ' USD / kWh', 882, 380, 21, muted, 'center');
    line(60, 412, 1140);
    const low = Math.min(r.chemical, r.electrical), high = Math.max(r.chemical, r.electrical);
    const verdict = r.winner === 'equal' ? 'The costs are equal'
      : (r.winner === 'electricity' ? 'Electricity' : 'The chemical reagent') +
        (low === 0 ? ' has zero cost' : ' is ~' + format(high / low, 2) + '× cheaper');
    text(verdict + ' at ' + format(s.voltage) + ' V', 600, 467, 32, ink, 'center');
    text(r.breakEven === null ? 'No unique break-even voltage' : 'Break-even at ' + format(r.breakEven) + ' V', 600, 508, 23, muted, 'center');
    text('Utilization ' + format(s.utilization) + '% · Faradaic efficiency ' + format(s.faradaic) + '% · Power supply ' + format(s.supply) + '%', 600, 549, 18, muted, 'center');
    // Use the same range, units, nice tick spacing and lines as the live graph.
    const max = Math.max(s.plotMax, s.voltage, .01);
    const left=135, right=990, top=625, bottom=915;
    const peak=Math.max(r.chemical,r.slope*max,1e-12)*1000;
    const raw=peak/4,power=10**Math.floor(Math.log10(raw));
    const step=([1,2,2.5,5,10].find(n=>n*power>=raw)||10)*power;
    const ymax=Math.ceil(peak/step)*step;
    const x=v=>left+v/max*(right-left),y=c=>bottom-c*1000/ymax*(bottom-top);
    function stroke(x1,y1,x2,y2,color,width=1){
      ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
    }
    function dot(cx,cy,color,radius=5){ctx.fillStyle=color;ctx.beginPath();ctx.arc(cx,cy,radius,0,2*Math.PI);ctx.fill();}
    text('Cost per useful mole of electrons (mUSD/mol e⁻)',60,593,21,muted);
    for(let i=0;i<=Math.round(ymax/step);i++){
      const cy=y(i*step/1000);stroke(left,cy,right,cy,'#ded8ce');text(format(i*step,3),left-14,cy+6,18,muted,'right');
    }
    for(let i=0;i<=4;i++)text(format(max*i/4,3),x(max*i/4),bottom+30,18,muted,'center');
    stroke(x(0),y(r.chemical),x(max),y(r.chemical),'#875f7b',3);
    stroke(x(0),y(0),x(max),y(r.slope*max),'#007f78',3);
    const cy=y(r.chemical),ey=y(r.slope*max),close=Math.abs(cy-ey)<24;
    text('Reagent',right+12,cy+(close?(cy>=ey?18:-12):6),19,'#875f7b');
    text('Electricity',right+12,ey+(close?(cy>=ey?-12:18):6),19,'#007f78');
    ctx.setLineDash([5,6]);stroke(x(s.voltage),top,x(s.voltage),bottom,ink);ctx.setLineDash([]);
    dot(x(s.voltage),y(r.chemical),'#875f7b');dot(x(s.voltage),y(r.electrical),'#007f78');
    if(r.breakEven!==null&&r.breakEven<=max){
      dot(x(r.breakEven),y(r.chemical),ink,6);
      const labelX=Math.max(left+125,Math.min(right-125,x(r.breakEven)));
      text('Break-even '+format(r.breakEven,3)+' V',labelX,Math.max(top+20,y(r.chemical)-18),19,ink,'center');
    }
    text('Cell voltage (V)',(left+right)/2,978,21,muted,'center');
    line(60,993,1140);
    text('enlepre.github.io/electronsCost', 60, 1020, 19, muted);
    text((s.legacy ? 'Legacy chemistry · ' : '') + 'Selected inputs' + (EnergyChoices.metric(s)==='valcoe'?' · VALCOE':''), 1140, 1020, 18, muted, 'right');
    return canvas;
  }
  async function download(s) {
    const canvas = draw(document.createElement('canvas'), s);
    const blob = await new Promise((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Could not create image.')), 'image/png'));
    const href = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = href;a.download = ShareLinks.slug(s) + '-' + s.voltage + 'v.png';
    document.body.append(a);a.click();a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 30000);
  }
  return {draw,download};
})();
