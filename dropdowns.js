'use strict';
// Enhance native selects while retaining their options, values and change events.
(() => {
  const controls = [];
  for (const id of ['reagent', 'energy']) {
    const select = document.getElementById(id);
    if (!select) continue;
    const label = document.querySelector('label[for="' + id + '"]');
    const name = label.textContent.trim();
    const wrapper = document.createElement('div');
    wrapper.className = 'source-dropdown';
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.id = id + '-trigger';
    trigger.className = 'source-trigger';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', id + '-panel');
    const caption = document.createElement('span');
    const arrow = document.createElement('span');
    arrow.className = 'source-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    trigger.append(caption, arrow);
    const panel = document.createElement('div');
    panel.id = id + '-panel';
    panel.className = 'source-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Choose ' + name.toLowerCase());
    panel.hidden = true;
    const search = document.createElement('input');
    search.type = 'text';
    search.className = 'source-search';
    search.placeholder = id === 'reagent' ? 'Search reagents…' : 'Search electricity sources…';
    search.setAttribute('aria-label', search.placeholder.replace('…', ''));
    search.setAttribute('role', 'combobox');
    search.setAttribute('aria-autocomplete', 'list');
    search.setAttribute('aria-expanded', 'true');
    search.setAttribute('aria-controls', id + '-options');
    search.autocomplete = 'off';
    search.spellcheck = false;
    const list = document.createElement('div');
    list.id = id + '-options';
    list.className = 'source-options';
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-label', name);
    const empty = document.createElement('p');
    empty.className = 'source-empty';
    empty.setAttribute('role', 'status');
    empty.textContent = 'No matching sources.';
    panel.append(search, list, empty);
    wrapper.append(trigger, panel);
    select.after(wrapper);
    select.hidden = true;
    label.htmlFor = trigger.id;
    let choices = [], active = -1, signature = '';
    function activate(index) {
      active = index;
      [...list.children].forEach((option, i) => option.classList.toggle('is-active', i === index));
      const option = list.children[index];
      if (option) {
        search.setAttribute('aria-activedescendant', option.id);
        option.scrollIntoView?.({ block: 'nearest' });
      } else search.removeAttribute('aria-activedescendant');
    }
    function close(focus = false) {
      panel.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      if (focus) trigger.focus();
    }
    function choose(index) {
      if (!choices[index]) return;
      select.value = choices[index].value;
      close(true);
      select.dispatchEvent(new Event('change', { bubbles: true }));
      sync();
    }
    function filter() {
      const words = search.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
      choices = [...select.options].filter(option => !option.disabled && option.value && words.every(word => option.textContent.toLocaleLowerCase().includes(word)));
      list.replaceChildren();
      choices.forEach((option, i) => {
        const row = document.createElement('div');
        row.id = id + '-option-' + i;
        row.className = 'source-option';
        row.setAttribute('role', 'option');
        row.setAttribute('aria-selected', String(option.value === select.value));
        row.textContent = option.textContent;
        row.addEventListener('pointerdown', event => event.preventDefault());
        row.addEventListener('click', () => choose(i));
        list.append(row);
      });
      empty.hidden = choices.length > 0;
      activate(choices.length ? Math.max(0, choices.findIndex(option => option.value === select.value)) : -1);
    }
    function open() {
      controls.forEach(control => control.close());
      search.value = '';
      panel.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      filter();
      search.focus();
    }
    function sync() {
      const selected = select.selectedOptions[0];
      caption.textContent = selected?.textContent || (id === 'reagent' ? 'choose a chemical reagent' : 'choose an electricity source');
      trigger.setAttribute('aria-label', name + ': ' + caption.textContent);
      const next = JSON.stringify([...select.options].map(option => [option.value, option.textContent, option.disabled])) + select.value;
      if (signature !== next && !panel.hidden) filter();
      signature = next;
    }
    trigger.addEventListener('click', () => panel.hidden ? open() : close());
    trigger.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); open(); }
    });
    search.addEventListener('input', filter);
    search.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        if (choices.length) activate((active + (event.key === 'ArrowDown' ? 1 : -1) + choices.length) % choices.length);
      } else if (event.key === 'Enter') { event.preventDefault(); choose(active); }
      else if (event.key === 'Escape') { event.preventDefault(); close(true); }
    });
    wrapper.addEventListener('focusout', event => { if (!wrapper.contains(event.relatedTarget)) close(); });
    document.addEventListener('pointerdown', event => { if (!wrapper.contains(event.target)) close(); });
    select.addEventListener('change', sync);
    controls.push({ sync, close });
    sync();
  }
  window.SourceDropdowns = { sync: () => controls.forEach(control => control.sync()) };
})();
