'use strict';
(() => {
  const menu = document.querySelector('.menu');
  const toggle = menu?.querySelector('.menu-toggle');
  const nav = menu?.querySelector('nav');
  if (!menu || !toggle || !nav) return;
  const setOpen = open => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.inert = !open;
  };
  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
  menu.addEventListener('focusout', event => {
    if (!menu.contains(event.relatedTarget)) setOpen(false);
  });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape') { toggle.focus(); setOpen(false); }
  });
  document.addEventListener('pointerdown', event => {
    if (!menu.contains(event.target)) setOpen(false);
  });
})();
