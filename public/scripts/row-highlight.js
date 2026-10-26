// Highlight the configuration row targeted by an in-page anchor.
(() => {
  const highlightRow = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (!target || target.tagName !== 'TR') return;
    target.classList.remove('row-highlight');
    void target.offsetWidth;
    target.classList.add('row-highlight');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', highlightRow, { once: true });
  } else {
    highlightRow();
  }
  window.addEventListener('hashchange', highlightRow);
})();
