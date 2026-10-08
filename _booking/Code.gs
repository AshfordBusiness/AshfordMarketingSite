/**
 * Ashford Integrations booking backend (Google Apps Script web app).
 *
 * Runs as ryan@ashfordintegrations.com. The website's /book/ page calls it to:
 *   GET  ?action=slots   -> free 30 minute slots from the live calendar
 *   POST {booking JSON}  -> creates the calendar event (with Google Meet and an
 *                           invite to the visitor), adds the lead to the Notion
 *                           Sales Pipeline, emails a confirmation, and queues a
 *                           reminder 24 hours before the call.
 *
 * It also saves builds from the System Showcase (/p/showcase/):
 *   POST {kind:'showcase', ...} -> creates or updates a row in the Notion
 *                                  Showcase Builds database
 *
 * Setup steps are in _booking/SETUP.md. Secrets live in Script Properties,
 * never in this file:
 *   NOTION_TOKEN           internal integration secret (starts "ntn_" or "secret_")
 *   NOTION_DATABASE_ID     Sales Pipeline database id
 *   SHOWCASE_DATABASE_ID   Showcase Builds database id
 */

const CONFIG = {
  timeZone: 'Europe/London',
  callMinutes: 30,
  bufferMinutes: 15,          // kept free either side of existing events
  dayStart: '09:00',
  dayEnd: '17:00',
  workingDays: [1, 2, 3, 4, 5], // Mon to Fri
  daysAhead: 21,
  minNoticeHours: 12,
  reminderHoursBefore: 24,
  owner: 'Ryan',
  fromName: 'Ashford Integrations',
  eventTitle: 'Discovery call: Ashford Integrations',
  siteUrl: 'https://www.ashfordintegrations.com'
};

/* ---------- web entry points ---------- */

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || '';
  if (action === 'slots') return json_({ ok: true, timeZone: CONFIG.timeZone, slots: freeSlots_() });
  return json_({ ok: true, service: 'ashford-booking' });
}

function doPost(e) {
  let data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return json_({ ok: false, error: 'Bad request.' });
  }
  if (data.website) return json_({ ok: true }); // honeypot filled: silently drop bots
  if (data.kind === 'showcase') return json_(saveShowcase_(data));

  const v = validate_(data);
  if (v) return json_({ ok: false, error: v });

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return json_({ ok: false, error: 'Busy, please try again.' });
  try {
    const start = new Date(data.start);
    const end = new Date(start.getTime() + CONFIG.callMinutes * 60000);
    const stillFree = freeSlots_().some(s => s.start === start.toISOString());
    if (!stillFree) return json_({ ok: false, error: 'That time has just been taken. Please pick another.' });

    const event = createEvent_(data, start, end);
    const meetLink = event.hangoutLink || '';
    let notionUrl = '';
    try { notionUrl = addToNotion_(data, start, meetLink); } catch (err) { console.error('Notion: ' + err); }

    sendConfirmation_(data, start, meetLink);
    notifyOwner_(data, start, meetLink, notionUrl);
    queueReminder_(data, start, meetLink, event.id);

    return json_({ ok: true, start: start.toISOString(), when: fmt_(start), meet: meetLink });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: 'Something went wrong. Please email ryan@ashfordintegrations.com.' });
  } finally {
    lock.releaseLock();
  }
}

/* ---------- availability ---------- */

function freeSlots_() {
  const now = new Date();
  const earliest = new Date(now.getTime() + CONFIG.minNoticeHours * 3600000);
  const horizon = new Date(now.getTime() + CONFIG.daysAhead * 86400000);
  const busy = CalendarApp.getDefaultCalendar().getEvents(now, horizon)
    .filter(ev => !ev.isAllDayEvent() && ev.getMyStatus() !== CalendarApp.GuestStatus.NO)
    .map(ev => [ev.getStartTime().getTime() - CONFIG.bufferMinutes * 60000,
                ev.getEndTime().getTime() + CONFIG.bufferMinutes * 60000]);

  const slots = [];
  for (let d = 0; d <= CONFIG.daysAhead; d++) {
    const day = new Date(now.getTime() + d * 86400000);
    const ymd = Utilities.formatDate(day, CONFIG.timeZone, 'yyyy-MM-dd');
    const dow = Number(Utilities.formatDate(day, CONFIG.timeZone, 'u')) % 7; // 1=Mon..7=Sun -> 0=Sun
    if (CONFIG.workingDays.indexOf(dow) === -1) continue;
    let t = londonTime_(ymd, CONFIG.dayStart);
    const close = londonTime_(ymd, CONFIG.dayEnd);
    while (t.getTime() + CONFIG.callMinutes * 60000 <= close.getTime()) {
      const s = t.getTime(), e = s + CONFIG.callMinutes * 60000;
      const clash = busy.some(b => s < b[1] && e > b[0]);
      if (!clash && t >= earliest) slots.push({ start: t.toISOString(), label: fmt_(t) });
      t = new Date(s + CONFIG.callMinutes * 60000);
    }
  }
  return slots;
}

// Build a Date for a wall-clock time in London, whatever the script's own zone.
function londonTime_(ymd, hm) {
  const guess = new Date(ymd + 'T' + hm + ':00Z');
  const shown = Utilities.formatDate(guess, CONFIG.timeZone, "yyyy-MM-dd'T'HH:mm");
  const diff = new Date(shown + ':00Z').getTime() - guess.getTime();
  return new Date(guess.getTime() - diff);
}

/* ---------- actions ---------- */

function createEvent_(d, start, end) {
  const description = [
    'Booked through ashfordintegrations.com',
    '',
    'About: ' + (d.topic || '(not given)'),
    'Name: ' + d.name,
    'Email: ' + d.email,
    d.company ? 'Company: ' + d.company : '',
    d.phone ? 'Phone: ' + d.phone : '',
    'Team size: ' + (d.team || '(not given)'),
    'Systems they use now: ' + (d.systems || '(not given)'),
    '',
    'The job that eats their week:',
    d.job || '(not given)'
  ].filter(x => x !== null).join('\n');

  const resource = {
    summary: (d.topic === 'AI training' ? 'AI training call: Ashford Integrations' : CONFIG.eventTitle) + ' with ' + d.name + (d.company ? ' (' + d.company + ')' : ''),
    description: description,
    start: { dateTime: start.toISOString(), timeZone: CONFIG.timeZone },
    end: { dateTime: end.toISOString(), timeZone: CONFIG.timeZone },
    attendees: [{ email: d.email, displayName: d.name }],
    conferenceData: { createRequest: { requestId: Utilities.getUuid(), conferenceSolutionKey: { type: 'hangoutsMeet' } } },
    reminders: { useDefault: false, overrides: [{ method: 'popup', minutes: 15 }] }
  };
  // Advanced Calendar service (enable "Google Calendar API" under Services).
  return Calendar.Events.insert(resource, 'primary', { conferenceDataVersion: 1, sendUpdates: 'all' });
}

function addToNotion_(d, start, meetLink) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('NOTION_TOKEN');
  const db = props.getProperty('NOTION_DATABASE_ID');
  if (!token || !db) return '';

  const text = s => [{ type: 'text', text: { content: String(s || '').slice(0, 1900) } }];
  const payload = {
    parent: { database_id: db },
    properties: {
      'Deal': { title: text(d.company || d.name) },
      'Stage': { select: { name: 'Discovery' } },
      'Lead Source': { select: { name: 'Website' } },
      'Next Action': { rich_text: text('Discovery call (booked on website)') },
      'Next Action Date': { date: { start: start.toISOString() } },
      'Notes': { rich_text: text('[' + (d.topic || 'Call') + '] ' + d.name + ' <' + d.email + '>' + (d.phone ? ', ' + d.phone : '') + '. Team: ' + (d.team || '-') + '. Systems: ' + (d.systems || '-') + '. Job: ' + (d.job || '')) }
    },
    children: [
      { object: 'block', type: 'paragraph', paragraph: { rich_text: text('About: ' + (d.topic || '(not given)')) } },
      { object: 'block', type: 'paragraph', paragraph: { rich_text: text('Booked on the website for ' + fmt_(start) + (meetLink ? '. Meet: ' + meetLink : '')) } },
      { object: 'block', type: 'paragraph', paragraph: { rich_text: text('Contact: ' + d.name + ', ' + d.email + (d.phone ? ', ' + d.phone : '') + (d.company ? ', ' + d.company : '')) } },
      { object: 'block', type: 'paragraph', paragraph: { rich_text: text('Team size: ' + (d.team || '(not given)') + '. Systems they use now: ' + (d.systems || '(not given)')) } },
      { object: 'block', type: 'paragraph', paragraph: { rich_text: text('The job that eats their week: ' + (d.job || '(not given)')) } }
    ]
  };
  // If a property name or type does not match the database, step down until the write
  // succeeds. The page body always carries every detail, so the lead is never lost.
  const full = payload.properties;
  const attempts = [
    full,
    { 'Deal': full['Deal'], 'Next Action Date': full['Next Action Date'], 'Notes': full['Notes'] },
    { 'Deal': full['Deal'] }
  ];
  let res;
  for (let i = 0; i < attempts.length; i++) {
    payload.properties = attempts[i];
    res = notionPost_(token, payload);
    if (res.getResponseCode() < 300) break;
    console.error('Notion write attempt ' + (i + 1) + ' failed: ' + res.getContentText());
  }
  if (res.getResponseCode() >= 300) throw new Error(res.getContentText());
  return JSON.parse(res.getContentText()).url || '';
}

function notionPost_(token, payload) {
  return UrlFetchApp.fetch('https://api.notion.com/v1/pages', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + token, 'Notion-Version': '2022-06-28' },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
}

function sendConfirmation_(d, start, meetLink) {
  const first = String(d.name).split(' ')[0];
  const html = emailShell_(
    'Your call is booked',
    '<p>Hi ' + esc_(first) + ',</p>' +
    '<p>Thanks for booking ' + (d.topic === 'AI training' ? 'a call about AI training' : 'a discovery call') + ' with Ashford Integrations. Here are the details:</p>' +
    detailRow_('When', fmt_(start) + ' (UK time)') +
    detailRow_('Length', CONFIG.callMinutes + ' minutes') +
    detailRow_('Where', meetLink ? '<a href="' + meetLink + '">Google Meet</a>' : 'Google Meet link in your calendar invite') +
    '<p>A calendar invite is on its way separately. We will send a reminder the day before.</p>' +
    (d.topic === 'AI training' ? '<p>Before the call, have a think about who needs training and what they would most like to be able to do.</p>' : '<p>Before the call, have a think about the job your team repeats every week. That is where we will start.</p>') +
    '<p>Need to change the time? Just reply to this email.</p>' +
    '<p>' + CONFIG.owner + '<br>Ashford Integrations</p>'
  );
  GmailApp.sendEmail(d.email, 'Booked: your call with Ashford Integrations, ' + fmt_(start), plain_(html), { htmlBody: html, name: CONFIG.fromName });
}

function notifyOwner_(d, start, meetLink, notionUrl) {
  const me = 'ryan@ashfordintegrations.com';
  const body = [
    'New discovery call booked on the website.',
    '',
    'When: ' + fmt_(start),
    'About: ' + (d.topic || '-'),
    'Name: ' + d.name,
    'Email: ' + d.email,
    'Company: ' + (d.company || '-'),
    'Phone: ' + (d.phone || '-'),
    'Team size: ' + (d.team || '-'),
    'Systems: ' + (d.systems || '-'),
    'Job: ' + (d.job || '-'),
    meetLink ? 'Meet: ' + meetLink : '',
    notionUrl ? 'Notion: ' + notionUrl : 'Notion: not written (check NOTION_TOKEN / NOTION_DATABASE_ID)'
  ].join('\n');
  GmailApp.sendEmail(me, 'New booking (' + (d.topic || 'call') + '): ' + d.name + ', ' + fmt_(start), body, { name: 'Website bookings' });
}

/* ---------- reminders ---------- */

function queueReminder_(d, start, meetLink, eventId) {
  const props = PropertiesService.getScriptProperties();
  const list = JSON.parse(props.getProperty('REMINDERS') || '[]');
  list.push({ name: d.name, email: d.email, start: start.toISOString(), meet: meetLink, eventId: eventId, sent: false });
  props.setProperty('REMINDERS', JSON.stringify(list));
}

// Runs every hour from a time-driven trigger (see SETUP.md).
function sendDueReminders() {
  const props = PropertiesService.getScriptProperties();
  const list = JSON.parse(props.getProperty('REMINDERS') || '[]');
  const now = Date.now();
  const keep = [];
  list.forEach(r => {
    const t = new Date(r.start).getTime();
    if (t < now) return; // call has passed: drop it
    if (!r.sent && t - now <= CONFIG.reminderHoursBefore * 3600000) {
      if (stillBooked_(r.eventId)) {
        const first = String(r.name).split(' ')[0];
        const html = emailShell_(
          'Reminder: your call is tomorrow',
          '<p>Hi ' + esc_(first) + ',</p>' +
          '<p>Just a reminder of your discovery call with Ashford Integrations.</p>' +
          detailRow_('When', fmt_(new Date(r.start)) + ' (UK time)') +
          detailRow_('Where', r.meet ? '<a href="' + r.meet + '">Google Meet</a>' : 'Google Meet link in your calendar invite') +
          '<p>If the time no longer works, reply to this email and we will find another.</p>' +
          '<p>' + CONFIG.owner + '<br>Ashford Integrations</p>'
        );
        GmailApp.sendEmail(r.email, 'Reminder: your call with Ashford Integrations, ' + fmt_(new Date(r.start)), plain_(html), { htmlBody: html, name: CONFIG.fromName });
      }
      r.sent = true;
    }
    keep.push(r);
  });
  props.setProperty('REMINDERS', JSON.stringify(keep));
}

function stillBooked_(eventId) {
  try {
    const ev = Calendar.Events.get('primary', eventId);
    return ev && ev.status !== 'cancelled';
  } catch (err) {
    return false;
  }
}

/* ---------- System Showcase saves ---------- */
// Each build is one row in the Notion Showcase Builds database. Saving again updates
// the same row, but only when the page sends back the edit key from its first save,
// so nobody can overwrite a build they did not start. Prices are worked out here,
// never trusted from the page.

const SHOWCASE = {
  systems: ['AI Meeting Notes', 'Tasks & Projects', 'Custom CRM', 'Content Creation', 'Custom Dashboards'],
  included: 2,          // systems covered by the core build
  corePrice: 1650,      // the Brain plus the two included systems
  extraPrice: 300,      // each system after that
  maintainPrice: 265,   // run and maintain, per month
  maxSavesPer10Min: 40  // across the whole site, to blunt spam
};

function saveShowcase_(d) {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('NOTION_TOKEN');
  const db = props.getProperty('SHOWCASE_DATABASE_ID');
  if (!token || !db) return { ok: false, error: 'Saving is not switched on yet. Please email ryan@ashfordintegrations.com.' };

  const v = validateShowcase_(d);
  if (v) return { ok: false, error: v };
  if (showcaseBusy_()) return { ok: false, error: 'Lots of saves just now. Please try again in a few minutes.' };

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) return { ok: false, error: 'Busy, please try again.' };
  try {
    const properties = showcaseProps_(d);

    if (d.id && d.key) {
      const page = notionGet_(token, 'pages/' + d.id);
      if (page && !page.archived && page.parent && sameId_(page.parent.database_id, db) && editKeyOf_(page) === d.key) {
        const res = notionRequest_(token, 'patch', 'pages/' + d.id, { properties: properties });
        if (res.getResponseCode() < 300) return { ok: true, id: d.id, key: d.key, updated: true };
        console.error('Showcase update failed: ' + res.getContentText());
        return { ok: false, error: 'Could not save just now. Please try again.' };
      }
      // Deleted, unknown or not this page's row: start a new one instead.
    }

    const key = Utilities.getUuid();
    properties['Edit key'] = { rich_text: notionText_(key) };
    properties['Status'] = { select: { name: 'New' } };
    const deal = matchDeal_(token, d.business);
    if (deal) properties['Deal'] = { relation: [{ id: deal }] };

    const res = notionRequest_(token, 'post', 'pages', { parent: { database_id: db }, properties: properties });
    if (res.getResponseCode() >= 300) {
      console.error('Showcase create failed: ' + res.getContentText());
      return { ok: false, error: 'Could not save just now. Please try again, or email ryan@ashfordintegrations.com.' };
    }
    const page = JSON.parse(res.getContentText());
    try { notifyShowcase_(d, page.url, !!deal); } catch (err) { console.error('Showcase email: ' + err); }
    return { ok: true, id: page.id, key: key, created: true };
  } catch (err) {
    console.error(err);
    return { ok: false, error: 'Something went wrong. Please email ryan@ashfordintegrations.com.' };
  } finally {
    lock.releaseLock();
  }
}

function validateShowcase_(d) {
  d.business = String(d.business || '').trim().slice(0, 120);
  d.name = String(d.name || '').trim().slice(0, 120);
  d.email = String(d.email || '').trim().slice(0, 160);
  d.notes = String(d.notes || '').trim().slice(0, 6000);
  d.maintain = d.maintain === true;
  d.systems = (Array.isArray(d.systems) ? d.systems : [])
    .filter((s, i, all) => SHOWCASE.systems.indexOf(s) > -1 && all.indexOf(s) === i);
  d.id = /^[0-9a-f-]{32,36}$/i.test(String(d.id || '')) ? String(d.id) : '';
  d.key = /^[0-9a-f-]{36}$/i.test(String(d.key || '')) ? String(d.key) : '';
  if (d.business.length < 2) return 'Please add the business name.';
  if (d.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return 'Please check the email address.';
  return '';
}

function showcaseTotal_(d) {
  return SHOWCASE.corePrice + Math.max(0, d.systems.length - SHOWCASE.included) * SHOWCASE.extraPrice;
}

function showcaseProps_(d) {
  return {
    'Name': { title: notionText_(d.business) },
    'Contact': { rich_text: notionText_(d.name) },
    'Email': { email: d.email || null },
    'Systems': { multi_select: d.systems.map(n => ({ name: n })) },
    'Included': { multi_select: d.systems.slice(0, SHOWCASE.included).map(n => ({ name: n })) },
    'Extra systems': { number: Math.max(0, d.systems.length - SHOWCASE.included) },
    'Build total': { number: showcaseTotal_(d) },
    'Run and maintain': { checkbox: d.maintain },
    'Monthly': { number: d.maintain ? SHOWCASE.maintainPrice : 0 },
    'Additional information': { rich_text: notionText_(d.notes) },
    'Last saved': { date: { start: new Date().toISOString() } }
  };
}

// Links a new build to its Sales Pipeline deal when exactly one deal title contains the business name.
function matchDeal_(token, business) {
  const pipeline = PropertiesService.getScriptProperties().getProperty('NOTION_DATABASE_ID');
  if (!pipeline || !business) return '';
  const res = notionRequest_(token, 'post', 'databases/' + pipeline + '/query', {
    filter: { property: 'Deal', title: { contains: business.slice(0, 80) } },
    page_size: 2
  });
  if (res.getResponseCode() >= 300) { console.error('Deal match: ' + res.getContentText()); return ''; }
  const rows = JSON.parse(res.getContentText()).results || [];
  return rows.length === 1 ? rows[0].id : '';
}

function notifyShowcase_(d, url, linked) {
  const me = 'ryan@ashfordintegrations.com';
  const pounds = n => '£' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const body = [
    'A new build was saved from the System Showcase.',
    '',
    'Business: ' + d.business,
    'Contact: ' + (d.name || '-') + (d.email ? ' <' + d.email + '>' : ''),
    'Systems: ' + (d.systems.join(', ') || 'none yet'),
    'Build total: ' + pounds(showcaseTotal_(d)) + (d.maintain ? ' + ' + pounds(SHOWCASE.maintainPrice) + '/mo run and maintain' : ''),
    'Additional information: ' + (d.notes || '-'),
    '',
    'Notion: ' + url + (linked ? ' (linked to the matching deal)' : '')
  ].join('\n');
  GmailApp.sendEmail(me, 'New showcase build: ' + d.business, body, { name: 'Website showcase' });
}

function showcaseBusy_() {
  const cache = CacheService.getScriptCache();
  const n = Number(cache.get('showcase-saves') || 0) + 1;
  cache.put('showcase-saves', String(n), 600);
  return n > SHOWCASE.maxSavesPer10Min;
}

// Rich text in chunks, because Notion caps one text object at 2,000 characters.
function notionText_(s) {
  s = String(s || '');
  const out = [];
  for (let i = 0; i < s.length && out.length < 50; i += 1900) out.push({ type: 'text', text: { content: s.slice(i, i + 1900) } });
  return out;
}

function notionGet_(token, path) {
  const res = notionRequest_(token, 'get', path);
  return res.getResponseCode() < 300 ? JSON.parse(res.getContentText()) : null;
}

function notionRequest_(token, method, path, body) {
  const opts = { method: method, headers: { Authorization: 'Bearer ' + token, 'Notion-Version': '2022-06-28' }, muteHttpExceptions: true };
  if (body) { opts.contentType = 'application/json'; opts.payload = JSON.stringify(body); }
  return UrlFetchApp.fetch('https://api.notion.com/v1/' + path, opts);
}

function sameId_(a, b) { return String(a || '').replace(/-/g, '') === String(b || '').replace(/-/g, ''); }

function editKeyOf_(page) {
  const p = page.properties && page.properties['Edit key'];
  return p && p.rich_text ? p.rich_text.map(t => t.plain_text).join('') : '';
}

/* ---------- helpers ---------- */

function validate_(d) {
  if (!d.name || String(d.name).trim().length < 2) return 'Please add your name.';
  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return 'Please add a valid email address.';
  if (!d.start || isNaN(new Date(d.start).getTime())) return 'Please pick a time.';
  if (!d.team) return 'Please choose your team size.';
  if (d.topic !== 'AI training') d.topic = 'Building a system'; // default keeps older page versions working
  ['name', 'company', 'phone', 'team', 'systems', 'job'].forEach(k => { if (d[k]) d[k] = String(d[k]).trim().slice(0, k === 'job' ? 1500 : (k === 'systems' ? 300 : 120)); });
  return '';
}

function fmt_(date) {
  return Utilities.formatDate(date, CONFIG.timeZone, "EEEE d MMMM 'at' HH:mm");
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function esc_(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function detailRow_(k, v) {
  return '<p style="margin:0 0 6px"><span style="color:#4f5c55;display:inline-block;width:70px">' + k + '</span><strong>' + v + '</strong></p>';
}

function emailShell_(title, inner) {
  return '<div style="font-family:Arial,Helvetica,sans-serif;color:#16211b;font-size:15px;line-height:1.55;max-width:520px">' +
    '<p style="font-weight:800;font-size:20px;margin:0 0 16px">' + title + '</p>' + inner +
    '<p style="color:#4f5c55;font-size:12px;margin-top:24px">Ashford Integrations is a trading name of Ashford Business Finance Ltd. ' +
    '<a href="' + CONFIG.siteUrl + '" style="color:#146c46">ashfordintegrations.com</a></p></div>';
}

function plain_(html) {
  return html.replace(/<br>/g, '\n').replace(/<\/p>/g, '\n\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&');
}

/* ---------- one-off helpers you can run from the editor ---------- */

// Run once after setup to create the hourly reminder trigger.
function installReminderTrigger() {
  ScriptApp.getProjectTriggers().forEach(t => { if (t.getHandlerFunction() === 'sendDueReminders') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('sendDueReminders').timeBased().everyHours(1).create();
}

// Run to check the showcase saves without opening the website. Delete the test row after.
function testShowcase() {
  const r = saveShowcase_({ business: 'TEST, delete me', name: 'Setup test', systems: ['AI Meeting Notes', 'Tasks & Projects', 'Custom CRM'], maintain: true, notes: 'Setup test from the Apps Script editor.' });
  console.log(JSON.stringify(r));
}

// Run to check the Notion connection without making a booking.
function testNotion() {
  const url = addToNotion_({ name: 'Test Booking', email: 'test@example.com', company: 'TEST, delete me', job: 'Setup test' }, new Date(Date.now() + 86400000), '');
  console.log(url ? 'Notion OK: ' + url : 'Notion not configured');
}
