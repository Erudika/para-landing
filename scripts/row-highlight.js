(function () {
  function highlight() {
    var id = window.location.hash.slice(1);
    if (!id) return;
    var row = document.getElementById(id);
    if (!row || row.tagName !== 'TR') return;
    row.classList.remove('row-highlight');
    // Force reflow so re-navigating to the same hash restarts the animation
    void row.offsetWidth;
    row.classList.add('row-highlight');
    row.addEventListener('animationend', function () {
      row.classList.remove('row-highlight');
    }, { once: true });
  } 
  window.addEventListener('DOMContentLoaded', highlight);
  window.addEventListener('hashchange', highlight);
})();