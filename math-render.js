'use strict';
// The readable fallback remains visible if the optional typesetting CDN is unavailable.
if (typeof katex !== 'undefined') {
  document.querySelectorAll('[data-tex]').forEach(element => {
    try {
      katex.render(element.getAttribute('data-tex'), element, {
        displayMode: element.getAttribute('data-display') === 'true',
        output: 'htmlAndMathml', throwOnError: true, trust: false, strict: 'error'
      });
    } catch (error) {
      console.error('Unable to typeset equation:', error.message);
    }
  });
}
