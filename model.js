/* Cost per mole of useful electron equivalents. No network or UI dependencies. */
(function (root) {
  'use strict';
  const F = 96485.33212;
  function calculate(s) {
    for (const k of ['price','mass','electrons','utilization','tariff','voltage','faradaic','supply','amount']) {
      if (typeof s[k] !== 'number' || !Number.isFinite(s[k])) throw new Error('Enter a finite number for every input.');
    }
    if (s.price < 0 || s.tariff < 0 || s.voltage < 0 || s.amount <= 0 || s.mass <= 0 || s.electrons <= 0) throw new Error('Prices and voltage must be non-negative. Mass, electron equivalents and amount must be positive.');
    for (const k of ['utilization','faradaic','supply']) if (s[k] <= 0 || s[k] > 100) throw new Error('Efficiencies must be greater than 0 and at most 100%.');
    const chemical = s.price * s.mass / (1000 * s.electrons * s.utilization / 100);
    const slope = s.tariff * F / (3600000 * s.faradaic / 100 * s.supply / 100);
    const electrical = slope * s.voltage;
    const equal = Math.abs(electrical - chemical) <= 1e-12 * Math.max(1, chemical, electrical);
    return { chemical, electrical, slope, breakEven: slope ? chemical / slope : null,
      ratio: chemical ? electrical / chemical : null,
      winner: equal ? 'equal' : electrical < chemical ? 'electricity' : 'reagent',
      chemicalTotal: chemical * s.amount, electricalTotal: electrical * s.amount,
      energy: F * s.voltage * s.amount / (3600000 * s.faradaic / 100 * s.supply / 100) };
  }
  const api = { F, calculate };
  if (typeof module !== 'undefined') module.exports = api;
  else root.ElectronModel = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
