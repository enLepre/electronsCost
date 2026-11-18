/* Restore the palette before CSS and before a history-restored page is revealed. */
(() => {
  function restore() {
    const root = document.documentElement;
    try {
      const saved = localStorage.getItem('electron-cost-theme');
      root.dataset.theme = saved === 'dark' ? 'dark' : 'light';
    } catch (_) { root.dataset.theme ||= 'light'; }
    const dark = root.dataset.theme === 'dark';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#272c32' : '#f5f2ec';
    const button = document.getElementById('theme');
    if (button) {
      const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
      button.setAttribute('aria-label', label); button.title = label;
      button.setAttribute('aria-pressed', String(dark));
    }
  }
  restore();
  addEventListener('pagereveal', restore);
  addEventListener('pageshow', restore);
})();
