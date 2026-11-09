/* AI plan opt-in pages: checks the form, sends it to the Apps Script backend, shows the thank-you.
   Posts the same way assets/booking.js does. The Notion token lives only in the Apps Script. */
(function () {
  // Same web app as the booking page (see WEBSITE-TRACKING.md). Never change this to a New deployment URL.
  var ENDPOINT = window.ASHFORD_BOOKING_ENDPOINT || 'https://script.google.com/macros/s/AKfycbyeicZdCrR4PBV8_VxSCwYyTZTNfREkAKTfxNythU1-ZAxDdOJMmSNhFjY_ZcxCis2Vxw/exec';
  var TIMEOUT_MS = 30000;
  var FALLBACK = "That didn't send. Please try again, or email ryan@ashfordintegrations.com.";

  var form = document.getElementById('pl-form');
  if (!form) return;
  var card = document.getElementById('pl-card');
  var btn = document.getElementById('pl-submit');
  var btnHTML = btn.innerHTML;
  var statusEl = document.getElementById('pl-status');
  var sending = false;

  // Which page this is (a, b or c) and where the visitor came from (?src=linkedin).
  var variant = form.getAttribute('data-variant') || '';
  var src = (function () {
    var m = location.search.match(/[?&]src=([^&#]*)/);
    if (!m) return '';
    try { return decodeURIComponent(m[1].replace(/\+/g, ' ')); } catch (e) { return m[1]; }
  })();

  // Same rules as validateOptin_ in _booking/Code.gs.
  var RULES = {
    name: function (v) { return v.length >= 2 ? '' : 'Please add your name.'; },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Please add a valid work email.'; },
    company: function (v) { return v.length >= 2 ? '' : 'Please add your company.'; }
  };
  function val(name) {
    var v = form.elements[name].value;
    return name === 'email' ? v.replace(/\s/g, '') : v.replace(/\s+/g, ' ').trim();
  }
  function mark(name, msg) {
    form.elements[name].setAttribute('aria-invalid', msg ? 'true' : 'false');
    document.getElementById('pl-err-' + name).textContent = msg;
  }
  function say(msg, isError) {
    statusEl.textContent = msg || '';
    statusEl.classList.toggle('err', !!isError);
  }

  // Once a field has shown an error, clear it as soon as the answer is good.
  Object.keys(RULES).forEach(function (name) {
    form.elements[name].addEventListener('input', function () {
      if (this.getAttribute('aria-invalid') === 'true') mark(name, RULES[name](val(name)));
    });
  });

  function setSending(on) {
    sending = on;
    btn.disabled = on;
    btn.innerHTML = on ? 'Sending…' : btnHTML;
  }

  function fail(msg) {
    setSending(false);
    say(msg || FALLBACK, true);
  }

  function succeed(name) {
    document.getElementById('pl-first').textContent = name.split(' ')[0];
    card.setAttribute('data-state', 'done');
    var heading = document.getElementById('pl-done-h');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    heading.focus({ preventScroll: true });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;

    var firstBad = null;
    Object.keys(RULES).forEach(function (name) {
      var msg = RULES[name](val(name));
      mark(name, msg);
      if (msg && !firstBad) firstBad = name;
    });
    if (firstBad) { say(''); form.elements[firstBad].focus(); return; }

    var body = {
      kind: 'optin',
      name: val('name'),
      email: val('email'),
      company: val('company'),
      week: val('week'),
      consent: form.elements.consent.checked,
      variant: variant,
      src: src,
      website: form.elements.website.value
    };

    setSending(true);
    say('');
    var settled = false;
    var ctrl = window.AbortController ? new AbortController() : null;
    // Never leave a dead button: give up after TIMEOUT_MS and let them try again.
    var timer = setTimeout(function () {
      if (settled) return;
      settled = true;
      if (ctrl) ctrl.abort();
      fail();
    }, TIMEOUT_MS);

    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (!res || !res.ok) { fail(res && res.error); return; }
        succeed(body.name);
      })
      .catch(function () {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        fail();
      });
  });
})();
