/* Scroll reveal: content fades and rises into place as it enters the viewport.
   Reduced-motion visitors get a fade only. Content stays visible without JavaScript. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var root = document.documentElement;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) root.classList.add('rv-fade-only');

  // The hero animates in on page load.
  var hero = [].slice.call(document.querySelectorAll('.hero > div:first-child > *, .hero .panel, .cs-hero > *, .bk-intro > *, .bk-card'));
  hero.forEach(function (el, i) {
    el.classList.add('rv');
    el.style.transitionDelay = (i * 110) + 'ms';
  });
  requestAnimationFrame(function () { requestAnimationFrame(function () {
    hero.forEach(function (el) { el.classList.add('rv-in'); });
  }); });

  var selector = [
    'main section h2', 'main section .head > p', '.feature', '.list > .item', '.included',
    '.steps > li', '.teach > div > *', '.teach .who', '.case', '.close > *',
    '.results > *', '.results-note', '.two > *', '.ba', '.principles > li',
    '.part > *', '.small-parts > *', '.outcomes > li', '.tools > li'
  ].join(',');
  var items = [].slice.call(document.querySelectorAll(selector)).filter(function (el) { return hero.indexOf(el) === -1; });
  if (!items.length) return;

  items.forEach(function (el) {
    var sibs = [].filter.call(el.parentNode.children, function (c) { return items.indexOf(c) !== -1; });
    var i = sibs.indexOf(el);
    if (i > 0) el.style.transitionDelay = Math.min(i, 6) * 120 + 'ms';
    el.classList.add('rv');
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('rv-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });

  items.forEach(function (el) { io.observe(el); });
})();
