/* Booking page: loads free slots from the Apps Script backend and submits the booking. */
(function () {
  // Paste the deployed Apps Script web app URL here (see _booking/SETUP.md).
  var ENDPOINT = window.ASHFORD_BOOKING_ENDPOINT || 'https://script.google.com/macros/s/AKfycbyeicZdCrR4PBV8_VxSCwYyTZTNfREkAKTfxNythU1-ZAxDdOJMmSNhFjY_ZcxCis2Vxw/exec';

  var root = document.getElementById('booking');
  if (!root) return;
  var daysEl = document.getElementById('bk-days');
  var timesEl = document.getElementById('bk-times');
  var form = document.getElementById('bk-form');
  var chosenEl = document.getElementById('bk-chosen');
  var statusEl = document.getElementById('bk-status');
  var submitBtn = document.getElementById('bk-submit');
  var chosen = null;

  function setState(s) { root.setAttribute('data-state', s); }
  function say(msg, isError) {
    statusEl.textContent = msg || '';
    statusEl.classList.toggle('err', !!isError);
  }

  // Pre-select the topic when arriving from a specific button, e.g. /book/?topic=training
  var topicParam = (location.search.match(/[?&]topic=([^&]+)/) || [])[1];
  if (topicParam === 'training') document.getElementById('bk-topic').value = 'AI training';

  if (!ENDPOINT) { setState('offline'); return; }

  fetch(ENDPOINT + '?action=slots')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data.ok || !data.slots || !data.slots.length) { setState('empty'); return; }
      renderDays(group(data.slots));
      setState('pick');
    })
    .catch(function () { setState('offline'); });

  function group(slots) {
    var map = {}, order = [];
    slots.forEach(function (s) {
      var d = s.label.split(' at ')[0];
      if (!map[d]) { map[d] = []; order.push(d); }
      map[d].push(s);
    });
    return order.map(function (d) { return { day: d, slots: map[d] }; });
  }

  function renderDays(days) {
    daysEl.innerHTML = '';
    days.forEach(function (g, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bk-day';
      var parts = g.day.split(' ');
      b.innerHTML = '<span>' + parts[0].slice(0, 3) + '</span><b>' + parts[1] + '</b><span>' + parts[2].slice(0, 3) + '</span>';
      b.setAttribute('aria-label', g.day + ', ' + g.slots.length + ' times free');
      b.addEventListener('click', function () {
        [].forEach.call(daysEl.children, function (c) { c.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        renderTimes(g);
      });
      daysEl.appendChild(b);
      if (i === 0) b.click();
    });
  }

  function renderTimes(g) {
    timesEl.innerHTML = '';
    g.slots.forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bk-time';
      b.textContent = s.label.split(' at ')[1];
      b.addEventListener('click', function () {
        chosen = s;
        chosenEl.textContent = s.label + ' (UK time)';
        setState('details');
        document.getElementById('bk-name').focus();
      });
      timesEl.appendChild(b);
    });
  }

  document.getElementById('bk-back').addEventListener('click', function () { setState('pick'); say(''); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!chosen) { setState('pick'); return; }
    var fd = new FormData(form);
    var body = { start: chosen.start };
    fd.forEach(function (v, k) { body[k] = v; });
    submitBtn.disabled = true;
    say('Booking your call...');
    fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        submitBtn.disabled = false;
        if (!res.ok) { say(res.error || 'Something went wrong. Please try again.', true); return; }
        document.getElementById('bk-done-when').textContent = res.when + ' (UK time)';
        document.getElementById('bk-done-email').textContent = body.email;
        setState('done');
        root.scrollIntoView({ behavior: 'smooth', block: 'start' });
      })
      .catch(function () {
        submitBtn.disabled = false;
        say('We could not reach the booking system. Please email ryan@ashfordintegrations.com.', true);
      });
  });
})();
