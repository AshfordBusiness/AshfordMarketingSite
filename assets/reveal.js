/* Scroll reveal: content fades and rises into place as it enters the viewport.
   Content stays visible without JavaScript or with reduced motion. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var selector = [
    'main section .head', '.builds > *', '.included', '.steps > li', '.teach > *',
    '.cases > *', '.close', '.results > *', '.ba', '.principles > li', '.part',
    '.small-parts > *', '.outcomes > li', '.tools', '.two > *'
  ].join(',');
  var items = [].slice.call(document.querySelectorAll(selector));
  if (!items.length) return;

  // Stagger siblings that reveal together.
  items.forEach(function (el) {
    var sibs = [].filter.call(el.parentNode.children, function (c) { return items.indexOf(c) !== -1; });
    var i = sibs.indexOf(el);
    if (i > 0) el.style.transitionDelay = Math.min(i, 5) * 80 + 'ms';
    el.classList.add('rv');
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  items.forEach(function (el) { io.observe(el); });
})();
