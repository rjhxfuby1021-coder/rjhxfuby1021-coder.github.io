(function () {
  var root = window.PK && window.PK.root;
  if (!root) return;
  root.querySelectorAll('[data-print]').forEach(function (b) {
    b.addEventListener('click', function () { window.print(); });
  });
})();
