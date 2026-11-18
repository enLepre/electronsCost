'use strict';
// Human-readable fragments. Only inputs that differ from the source defaults
// need extra fields; no server, upload, or short-link database is involved.
const ShareLinks = (() => {
  const reagentNames = {
    'h2-grey':'grey-hydrogen','h2-green':'green-hydrogen','o2':'oxygen',
    'bh4-lab':'sodium-borohydride','li':'lithium','nh3-green':'green-ammonia',
    'nh3-us':'fossil-ammonia','zn':'zinc','fe':'iron','custom':'custom-chemical'
  };
  const energyNames = {
    'eu':'eu-grid','us':'us-grid','us-industry':'us-industry',
    'eu-industry':'eu-industry','china-industry':'china-industry',
    'solar':'solar','wind':'onshore-wind','hydro':'hydropower',
    'wind-offshore':'offshore-wind','csp':'concentrated-solar',
    'gas':'gas','custom':'custom-electricity'
  };
  const fields = {v:'voltage',p:'price',m:'mass',n:'electrons',u:'utilization',
    t:'tariff',f:'faradaic',s:'supply',a:'amount',max:'plotMax'};
  const chemicalSlug = id => reagentNames[id] || id;
  const energySlug = id => id.endsWith('-valcoe')
    ? (energyNames[id.replace(/-eu2030-valcoe$|-valcoe$/, '')] || id.replace(/-valcoe$/, '')) + '-valcoe'
    : energyNames[id] || id;
  function defaults(reagent, energy, legacy = false) {
    const r = REAGENTS.find(item => item.id === reagent), e = ENERGY.find(item => item.id === energy);
    if (!r || !e) return null;
    return {reagent,energy,price:r.price,mass:legacy?r.legacyMass??r.mass:r.mass,
      electrons:legacy?r.legacyN??r.n:r.n,utilization:100,tariff:e.tariff,
      voltage:1,faradaic:100,supply:100,amount:1,legacy,plotMax:5};
  }
  function slug(s) { return chemicalSlug(s.reagent) + '-vs-' + energySlug(s.energy); }
  function encode(s) {
    const base = defaults(s.reagent, s.energy, s.legacy);
    if (!base) throw new Error('Choose both sources before sharing.');
    const params = new URLSearchParams();
    for (const [key, field] of Object.entries(fields)) {
      if (s[field] !== base[field]) params.set(key, String(s[field]));
    }
    if (s.legacy) params.set('l', '1');
    if (s.energyMetric) params.set('metric', s.energyMetric);
    return '#' + slug(s) + (params.size ? '?' + params.toString() : '');
  }
  function isShared(hash) { return hash.startsWith('#scenario=') || /^#[a-z0-9-]+-vs-[a-z0-9-]+(?:\?|$)/.test(hash); }
  function decode(hash) {
    if (hash.startsWith('#scenario=')) return JSON.parse(decodeURIComponent(hash.slice(10)));
    const [pair, query = ''] = hash.slice(1).split('?');
    const split = pair.indexOf('-vs-');
    if (split < 0) return null;
    const r = REAGENTS.find(item => chemicalSlug(item.id) === pair.slice(0, split));
    const e = ENERGY.find(item => energySlug(item.id) === pair.slice(split + 4));
    if (!r || !e) return null;
    const params = new URLSearchParams(query);
    if (params.has('l') && params.get('l') !== '1') return null;
    const result = defaults(r.id, e.id, params.get('l') === '1');
    for (const [key, value] of params) {
      if (fields[key]) {
        if (!value.trim() || !Number.isFinite(Number(value))) return null;
        result[fields[key]] = Number(value);
      } else if (key === 'metric') {
        if (!['lcoe','valcoe'].includes(value)) return null;
        result.energyMetric = value;
      } else if (key !== 'l') return null;
    }
    return result;
  }
  function url(s, base) {
    const result = new URL(base);
    result.search = '';
    result.hash = encode(s);
    return result;
  }
  return {encode,decode,isShared,url,slug};
})();
