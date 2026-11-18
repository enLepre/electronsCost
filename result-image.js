'use strict';
const ResultImage = (() => {
  const format = (n, digits = 4) => n === 0 ? '0' : Math.abs(n) < .0001 || Math.abs(n) >= 1e6
    ? n.toExponential(3) : n.toLocaleString('en-US', {maximumSignificantDigits:digits});
  function draw(canvas, s) {
    const r = ElectronModel.calculate(s);
    const chemical = REAGENTS.find(item => item.id === s.reagent);
    const energy = ENERGY.find(item => item.id === s.energy);
    if (!chemical || !energy) throw new Error('Choose both sources first.');
    canvas.width = 1200; canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Image downloads are unavailable in this browser.');
    const ink = '#34312c', muted = '#70685e';
    ctx.fillStyle = '#f5f2ec'; ctx.fillRect(0, 0, 1200, 630);
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
    text('enlepre.github.io/electronsCost', 60, 598, 19, muted);
    text((s.legacy ? 'Legacy chemistry · ' : '') + 'Selected inputs' + (EnergyChoices.metric(s)==='valcoe'?' · VALCOE':''), 1140, 598, 18, muted, 'right');
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
