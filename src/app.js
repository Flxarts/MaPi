(() => {
'use strict';

/* ───────── Helfer ───────── */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ESC[c]);
const rich = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
const DAY = 864e5;
const today = () => { const d = new Date(); return Math.floor((d.getTime() - d.getTimezoneOffset() * 6e4) / DAY); };
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const b64d = s => { const bin = atob(s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; };
const b64e = u => { let s = ''; for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s); };
const getItem = (st, k) => { try { return st.getItem(k); } catch { return null; } };
const setItem = (st, k, v) => { try { st.setItem(k, v); } catch { /* Speicher nicht verfügbar */ } };
const delItem = (st, k) => { try { st.removeItem(k); } catch { /* egal */ } };

const svg = (p, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const I = {
  home: '<path d="M4 11.2 12 4l8 7.2V19a1.500 1.500 0 0 1-1.500 1.500H15V15H9v5.500H5.500A1.500 1.500 0 0 1 4 19z"/>',
  book: '<path d="M12 6.600C10.300 5.400 8.100 4.900 4.500 4.900v12.800c3.600 0 5.800.5 7.500 1.700 1.700-1.200 3.900-1.700 7.500-1.700V4.900c-3.600 0-5.800.5-7.500 1.700z"/><path d="M12 6.600v12.800"/>',
  cards: '<rect x="3.500" y="8" width="13" height="11.500" rx="2.500"/><path d="M8 4.500h10a2.500 2.500 0 0 1 2.500 2.500v8.500"/>',
  quiz: '<circle cx="12" cy="12" r="8.500"/><path d="m8.400 12.300 2.500 2.500 4.700-5.300"/>',
  gear: '<path d="M5 7h7M16 7h3M5 17h3M12 17h7"/><circle cx="14" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>',
  plus: '<path d="M12 5.500v13M5.500 12h13"/>',
  x: '<path d="m6.500 6.500 11 11M17.500 6.500l-11 11"/>',
  chev: '<path d="m9.500 6 6 6-6 6"/>',
  back: '<path d="m14.500 6-6 6 6 6"/>',
  star: '<path d="m12 4 2.400 5 5.400.7-4 3.800 1 5.400L12 16.300 7.200 18.900l1-5.400-4-3.800 5.400-.7z"/>',
  search: '<circle cx="11" cy="11" r="6.500"/><path d="m16 16 4 4"/>',
  flame: '<path d="M12 20.500c3.600 0 6-2.400 6-5.700 0-2.600-1.500-4.300-2.800-5.900-.9-1.100-1.700-2.300-1.700-4.400-2.700 1.300-5 4-5 6.800-.9-.5-1.500-1.300-1.800-2.200C5.700 10.500 6 12.700 6 14.800c0 3.300 2.400 5.700 6 5.700z"/>',
  check: '<path d="m5.500 12.500 4.300 4.300 8.700-9.600"/>',
  bulb: '<path d="M9 17.500h6M10 20.500h4M8.500 14.500C7 13.400 6 11.700 6 9.800 6 6.600 8.700 4 12 4s6 2.600 6 5.800c0 1.900-1 3.600-2.500 4.700"/>',
  bolt: '<path d="M13 3.500 5.500 13.500h5.500l-1 7 7.500-10H12z"/>',
  target: '<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="4.500"/><circle cx="12" cy="12" r=".8" fill="currentColor"/>',
  calendar: '<rect x="4" y="5.500" width="16" height="14.500" rx="3"/><path d="M4 10h16M8.500 3.500v4M15.500 3.500v4"/>',
  pen: '<path d="m5 19 .8-3.800L16.200 4.800a1.800 1.800 0 0 1 2.600 0l.4.400a1.800 1.800 0 0 1 0 2.600L8.800 18.200z"/>',
  trash: '<path d="M5 7.500h14M10 4.500h4M7 7.500l.8 11a1.500 1.500 0 0 0 1.500 1.400h5.400a1.500 1.500 0 0 0 1.500-1.400l.8-11"/>',
  down: '<path d="M12 4.500v10.500M7.500 11l4.500 4.500 4.500-4.500M5.500 19.500h13"/>',
  up: '<path d="M12 15.500V5M7.500 9 12 4.500 16.500 9M5.500 19.500h13"/>',
  out: '<path d="M14 5H7.500A1.500 1.500 0 0 0 6 6.500v11A1.500 1.500 0 0 0 7.500 19H14M11 12h9M17 8.500l3.500 3.500-3.500 3.500"/>',
  redo: '<path d="M5 12a7 7 0 1 1 2.300 5.200M5 18v-4.500h4.500"/>',
};
let logoN = 0;
const LOGO = s => { const g = 'lg' + (++logoN); return `<svg viewBox="0 0 64 64" width="${s}" height="${s}" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B9EEDB"/><stop offset="1" stop-color="#3F8571"/></linearGradient></defs><rect width="64" height="64" rx="15" fill="url(#${g})"/><path d="M20.500 47.500 43 18" stroke="#fff" stroke-width="2.200" stroke-linecap="round" fill="none"/><g fill="#fff"><ellipse cx="25.500" cy="29.500" rx="6.600" ry="5.200" transform="rotate(-18 25.500 29.500)" opacity=".95"/><ellipse cx="38.500" cy="36.500" rx="6.600" ry="5.200" transform="rotate(28 38.500 36.500)" opacity=".8"/><ellipse cx="33" cy="20" rx="5.200" ry="4.100" transform="rotate(-24 33 20)" opacity=".85"/><ellipse cx="45.500" cy="25.500" rx="5.200" ry="4.100" transform="rotate(34 45.500 25.500)" opacity=".7"/><ellipse cx="18.500" cy="40" rx="5.400" ry="4.200" transform="rotate(-10 18.500 40)" opacity=".75"/></g></svg>`; };

/* ───────── Tresor (AES-GCM, Schlüssel per PBKDF2 aus dem Passwort) ───────── */
const KEY_STORE = 'mapi.key';
const STATE_STORE = 'mapi.state.v1';
let VAULT = null, DATA = null, S = null;
try { VAULT = JSON.parse($('#vault').textContent); } catch { VAULT = null; }

async function deriveKey(pw) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64d(VAULT.salt), iterations: VAULT.iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, true, ['decrypt']);
}
async function openVault(key) {
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64d(VAULT.iv) }, key, b64d(VAULT.ct));
  return JSON.parse(new TextDecoder().decode(pt));
}
async function tryStoredKey() {
  const raw = getItem(localStorage, KEY_STORE) || getItem(sessionStorage, KEY_STORE);
  if (!raw || !VAULT) return false;
  try {
    const [salt, k] = raw.split('.');
    if (salt !== VAULT.salt) throw new Error('alt');
    const key = await crypto.subtle.importKey('raw', b64d(k), 'AES-GCM', false, ['decrypt']);
    DATA = await openVault(key);
    return true;
  } catch { forgetKey(); return false; }
}
const forgetKey = () => { delItem(localStorage, KEY_STORE); delItem(sessionStorage, KEY_STORE); };

const gate = $('#gate'), gateForm = $('#gate-form'), gatePw = $('#gate-pw'), gateMsg = $('#gate-msg'), gateBtn = $('#gate-btn');
function gateFail(text) {
  gateMsg.textContent = text;
  gateForm.classList.remove('shake'); void gateForm.offsetWidth; gateForm.classList.add('shake');
  gatePw.select();
}
gateForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!VAULT || !VAULT.ct) return gateFail('Die Lerninhalte fehlen in dieser Version.');
  if (!window.crypto || !crypto.subtle) return gateFail('Bitte öffne die Seite über https.');
  const pw = gatePw.value.normalize('NFC');
  if (!pw) return gateFail('Bitte gib das Passwort ein.');
  gateBtn.classList.add('busy'); gateBtn.disabled = true; gateMsg.textContent = '';
  try {
    const key = await deriveKey(pw);
    DATA = await openVault(key);
    const raw = b64e(new Uint8Array(await crypto.subtle.exportKey('raw', key)));
    forgetKey();
    setItem($('#gate-keep').checked ? localStorage : sessionStorage, KEY_STORE, VAULT.salt + '.' + raw);
    gatePw.value = '';
    enter(true);
  } catch { gateFail('Das Passwort stimmt nicht.'); }
  finally { gateBtn.classList.remove('busy'); gateBtn.disabled = false; }
});
function enter(animated) {
  const go = () => { gate.hidden = true; $('#app').hidden = false; boot(); };
  if (!animated) return go();
  gate.classList.add('leaving');
  setTimeout(go, 380);
}

/* ───────── Zustand ───────── */
const NEW_PER_ROUND = 15;
const fresh = () => ({ cards: {}, quiz: {}, own: [], read: {}, fav: {}, days: {}, exam: null, theme: 'auto', shuffle: false, size: 20, qcfg: { scope: [], n: 10, focus: 'all' } });
let KAP = {}, CARD = {}, QUIZ = {};

function loadState() {
  let s = {};
  try { s = JSON.parse(getItem(localStorage, STATE_STORE) || '{}') || {}; } catch { s = {}; }
  adopt(s);
}
function adopt(s) {
  const f = fresh();
  S = Object.assign(f, s);
  S.qcfg = Object.assign(fresh().qcfg, s.qcfg || {});
  for (const k of ['cards', 'quiz', 'read', 'fav', 'days']) if (!S[k] || typeof S[k] !== 'object') S[k] = {};
  if (!Array.isArray(S.own)) S.own = [];
  if (!Array.isArray(S.qcfg.scope)) S.qcfg.scope = [];
  S.own = S.own.filter(o => o && typeof o.frage === 'string' && typeof o.antwort === 'string' && typeof o.id === 'string')
    .map(o => ({ id: o.id, kap: typeof o.kap === 'string' ? o.kap : 'own', frage: o.frage, antwort: o.antwort, falsch: Array.isArray(o.falsch) ? o.falsch.map(String).slice(0, 3) : null, own: true }));
}
let saveT = 0;
const persist = () => setItem(localStorage, STATE_STORE, JSON.stringify(S));
const save = () => { clearTimeout(saveT); saveT = setTimeout(persist, 200); };
addEventListener('pagehide', () => { if (S) persist(); });

function indexData() {
  KAP = {}; CARD = {}; QUIZ = {};
  for (const k of DATA.kapitel) {
    KAP[k.id] = k;
    for (const c of k.karten) { c.kap = k.id; CARD[c.id] = c; }
    for (const q of k.quiz) { q.kap = k.id; QUIZ[q.id] = q; }
  }
  for (const o of S.own) { if (o.kap !== 'own' && !KAP[o.kap]) o.kap = 'own'; CARD[o.id] = o; }
}
const allCards = () => Object.values(CARD);
const ownQuiz = () => S.own.filter(o => o.falsch && o.falsch.some(x => x.trim())).map(o => ({
  id: 'q-' + o.id, kap: o.kap, karte: o.id, typ: 'mc', frage: o.frage,
  optionen: [o.antwort, ...o.falsch.filter(x => x.trim())], richtig: 0, erklaerung: '',
}));
const allQuiz = () => Object.values(QUIZ).concat(ownQuiz());
const hefte = () => DATA.hefte.map(h => ({ ...h, kapitel: DATA.kapitel.filter(k => k.heft === h.nr) }));

const box = id => (S.cards[id] ? S.cards[id].b : 0) || 0;
function deckStats(cards) {
  const t = today(); let learned = 0, due = 0, neu = 0, sure = 0, hard = 0;
  for (const c of cards) {
    const p = S.cards[c.id];
    if (!p || !p.b) { neu++; continue; }
    if (p.d <= t) due++;
    if (p.b >= 2) learned++;
    if (p.b >= 4) sure++;
    if (p.b === 1) hard++;
  }
  return { total: cards.length, learned, due, neu, sure, hard };
}
function quizStats(qs) {
  let r = 0, f = 0, seen = 0;
  for (const q of qs) { const p = S.quiz[q.id]; if (p) { r += p.r; f += p.f; seen++; } }
  return { total: qs.length, r, f, seen, rate: r + f ? Math.round((r / (r + f)) * 100) : null };
}
function streak() { const t = today(); let n = 0, d = S.days[t] ? t : t - 1; while (S.days[d]) { n++; d--; } return n; }
function bump() {
  const t = today(); S.days[t] = (S.days[t] || 0) + 1;
  for (const d of Object.keys(S.days)) if (+d < t - 200) delete S.days[d];
}
function todayPlan() {
  const t = today(); const due = [], neu = [];
  for (const c of allCards()) { const p = S.cards[c.id]; if (!p || !p.b) { if (neu.length < NEW_PER_ROUND) neu.push(c.id); } else if (p.d <= t) due.push(c.id); }
  return { due, neu };
}
function cardsOf(spec) {
  const all = allCards();
  if (spec === 'all') return all;
  if (spec === 'own') return all.filter(c => c.own);
  if (spec === 'fav') return all.filter(c => S.fav[c.id]);
  if (spec === 'hard') return all.filter(c => box(c.id) === 1);
  if (/^h\d$/.test(spec)) return all.filter(c => KAP[c.kap] && KAP[c.kap].heft === +spec[1]);
  const [kap, sec] = spec.split('~');
  return all.filter(c => c.kap === kap && (!sec || c.abschnitt === sec));
}
function deckTitle(spec) {
  if (spec === 'due') return 'Heute lernen';
  if (spec === 'all') return 'Alle Karten';
  if (spec === 'own') return 'Eigene Karten';
  if (spec === 'fav') return 'Favoriten';
  if (spec === 'hard') return 'Schwierige Karten';
  if (/^h\d$/.test(spec)) return 'Studienheft ' + spec[1];
  const [kap, sec] = spec.split('~'); const k = KAP[kap];
  return k ? `Heft ${k.heft} · Kapitel ${k.kapitel}${sec ? ' · ' + sec : ''}` : 'Lernkarten';
}
const cardMeta = c => {
  const k = KAP[c.kap];
  const base = k ? `Heft ${k.heft} · Kap. ${k.kapitel}${c.abschnitt && !c.own ? ' · ' + c.abschnitt : ''}` : 'Eigene Karte';
  return c.own && k ? base + ' · eigene' : base;
};

/* ───────── Rahmen & Routing ───────── */
const TABS = [
  { id: 'start', label: 'Start', icon: 'home' },
  { id: 'themen', label: 'Themen', icon: 'book' },
  { id: 'karten', label: 'Karten', icon: 'cards' },
  { id: 'quiz', label: 'Quiz', icon: 'quiz' },
];
function applyTheme() {
  if (S.theme === 'light' || S.theme === 'dark') document.documentElement.dataset.theme = S.theme;
  else delete document.documentElement.dataset.theme;
}
function boot() {
  loadState(); indexData(); applyTheme();
  $('#app').innerHTML = `
    <header class="bar"><div class="bar-in">
      <a class="brand" href="#start" aria-label="MaPi Startseite">${LOGO(30)}<span>MaPi</span></a>
      <button class="icon-btn" data-act="settings" aria-label="Einstellungen">${svg(I.gear)}</button>
    </div></header>
    <nav class="tabs" aria-label="Bereiche">${TABS.map(t => `<a class="tab" href="#${t.id}" data-tab="${t.id}">${svg(I[t.icon])}<span>${t.label}</span></a>`).join('')}</nav>
    <main id="view"></main>`;
  addEventListener('hashchange', route);
  route();
}
let lastRoute = null, still = false;
function mount(html, cls = '') {
  $('#view').innerHTML = `<div class="view ${cls}"${still ? ' style="animation:none"' : ''}>${html}</div>`;
}
function route() {
  let h = location.hash.slice(1);
  try { h = decodeURIComponent(h); } catch { /* unverändert */ }
  h = h || 'start';
  const cut = h.indexOf('/');
  const name = cut < 0 ? h : h.slice(0, cut), arg = cut < 0 ? '' : h.slice(cut + 1);
  closeSheet(true);
  document.body.classList.remove('focus');
  let tab = name;
  switch (name) {
    case 'start': viewHome(); break;
    case 'themen': if (arg && KAP[arg]) viewChapter(arg); else viewTopics(); break;
    case 'karten': viewCards(); break;
    case 'lernen': tab = 'karten'; viewStudy(arg || 'due'); break;
    case 'quiz': if (arg === 'run') { if (!viewQuizRun()) return; } else viewQuiz(); break;
    default: location.replace('#start'); return;
  }
  $$('.tab').forEach(a => { const on = a.dataset.tab === tab; a.classList.toggle('on', on); if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  if (h !== lastRoute) scrollTo(0, 0);
  lastRoute = h;
}
function refresh() { const y = scrollY; still = true; route(); still = false; scrollTo(0, y); }
const go = h => { if (location.hash === '#' + h) route(); else location.hash = h; };

let toastT = 0;
function toast(text) {
  const t = $('#toast'); t.textContent = text; t.classList.add('show');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ───────── Start ───────── */
function ring(p, label, tone) {
  const r = 52, c = 2 * Math.PI * r;
  return `<div class="ring${tone ? ' tone' : ''}"><svg viewBox="0 0 120 120" width="100%" height="100%"><circle class="trk" cx="60" cy="60" r="${r}"/><circle class="val" cx="60" cy="60" r="${r}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${c.toFixed(1)}" data-to="${(c * (1 - p / 100)).toFixed(1)}"/></svg><b class="num">${p}%<small>${esc(label)}</small></b></div>`;
}
function animateRings() {
  requestAnimationFrame(() => requestAnimationFrame(() => $$('.ring .val').forEach(v => { v.style.strokeDashoffset = v.dataset.to; })));
}
function examLine() {
  if (!S.exam) return `<button class="pill plain" data-act="settings">${svg(I.calendar, 15)} Klausurtermin eintragen</button>`;
  const [y, m, d] = S.exam.split('-').map(Number);
  const left = Math.floor(Date.UTC(y, m - 1, d) / DAY) - today();
  if (left < 0) return '';
  const txt = left === 0 ? 'Heute ist Klausur – viel Erfolg!' : left === 1 ? 'Morgen ist Klausur' : `Noch ${left} Tage bis zur Klausur`;
  return `<span class="pill">${svg(I.calendar, 15)} ${txt}</span>`;
}
function chapterRow(k, href) {
  const st = deckStats(cardsOf(k.id));
  return `<a class="item" href="${href}"><span class="badge num">${k.kapitel}</span><span class="grow"><span class="h3">${esc(k.titel)}</span>
    <span class="bar-p"><i style="width:${pct(st.learned, st.total)}%"></i></span></span>
    <span class="tiny faint num">${st.learned}/${st.total}</span><span class="chev">${svg(I.chev, 18)}</span></a>`;
}
function viewHome() {
  const cards = allCards(), st = deckStats(cards), qs = quizStats(allQuiz());
  const plan = todayPlan(), due = plan.due.length, neu = plan.neu.length;
  const hr = new Date().getHours();
  const greet = hr < 5 ? 'Gute Nacht' : hr < 11 ? 'Guten Morgen' : hr < 18 ? 'Hallo' : 'Guten Abend';
  let big, sub, cta, href = '#lernen/due';
  if (due + neu === 0) { big = 'Für heute ist alles gelernt'; sub = 'Du kannst trotzdem frei weiterüben.'; cta = 'Karten wiederholen'; href = '#lernen/all'; }
  else if (!st.learned && !due) { big = 'Bereit für die ersten Karten?'; sub = `${plural(neu, 'neue Karte wartet', 'neue Karten warten')} in der ersten Runde auf dich.`; cta = 'Jetzt starten'; }
  else if (due) { big = `${plural(due, 'Karte ist', 'Karten sind')} heute fällig`; sub = neu ? `Dazu kommen ${plural(neu, 'neue Karte', 'neue Karten')}.` : 'Danach bist du für heute durch.'; cta = 'Jetzt lernen'; }
  else { big = `${plural(neu, 'neue Karte', 'neue Karten')} für heute`; sub = 'Heute steht keine Wiederholung an.'; cta = 'Weiterlernen'; }
  const t = today(), dow = (new Date().getDay() + 6) % 7, names = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
  const week = names.map((n, i) => { const d = t - dow + i; return `<div class="${S.days[d] ? 'done' : ''}${i === dow ? ' now' : ''}"><i>${S.days[d] ? svg(I.check, 16) : ''}</i>${n}</div>`; }).join('');
  const sk = streak();
  mount(`
    <div class="head"><div><h1 class="title">${greet}, Malin</h1><p class="lede">Public Health, Schritt für Schritt bis zur Klausur.</p></div>${examLine()}</div>
    <section class="hero">
      <div><p class="eyebrow">Heute</p><h2 class="hero-big">${big}</h2><p class="hero-sub">${sub}</p>
        <div class="row wrap" style="gap:10px"><a class="btn" href="${href}">${cta}</a><a class="btn line" href="#quiz">Quiz üben</a></div></div>
      ${ring(pct(st.learned, st.total), 'gelernt')}
    </section>
    <div class="grid3">
      <div class="card stat"><span class="ico">${svg(I.flame, 19)}</span><span class="v num">${sk} <small>${sk === 1 ? 'Tag' : 'Tage'}</small></span><span class="k">Lernserie</span></div>
      <div class="card stat"><span class="ico">${svg(I.cards, 19)}</span><span class="v num">${st.learned}<small> / ${st.total}</small></span><span class="k">Karten gelernt</span></div>
      <div class="card stat"><span class="ico">${svg(I.target, 19)}</span><span class="v num">${qs.rate === null ? '–' : qs.rate + ' <small>%</small>'}</span><span class="k">Quiz richtig</span></div>
    </div>
    <section class="card pad stack gap-14"><div class="head-row"><h2 class="h3">Diese Woche</h2><span class="tiny faint">${S.days[t] ? plural(S.days[t], 'Antwort', 'Antworten') + ' heute' : 'Heute noch nichts gelernt'}</span></div><div class="week">${week}</div></section>
    ${hefte().map(h => `<section class="stack gap-10"><div><p class="eyebrow">Studienheft ${h.nr} · ${esc(h.code)}</p><h2 class="h2">${esc(h.titel)}</h2></div>
      <div class="card list">${h.kapitel.map(k => chapterRow(k, '#themen/' + k.id)).join('')}</div></section>`).join('')}
  `);
  animateRings();
}

/* ───────── Themen ───────── */
function viewTopics() {
  mount(`
    <div><h1 class="title">Themen</h1><p class="lede">Alle Kapitel der beiden Studienhefte, zusammengefasst auf das Wesentliche.</p></div>
    ${hefte().map(h => `<section class="stack gap-10"><div><p class="eyebrow">Studienheft ${h.nr} · ${esc(h.code)}</p><h2 class="h2">${esc(h.titel)}</h2></div>
      <div class="card list">${h.kapitel.map(k => {
        const read = k.abschnitte.filter(a => S.read[k.id + ':' + a.nr]).length;
        return `<a class="item" href="#themen/${k.id}" style="align-items:flex-start"><span class="badge num">${k.kapitel}</span><span class="grow stack gap-6">
          <span class="h3">${esc(k.titel)}</span><span class="small muted clamp2">${esc(k.kurz)}</span>
          <span class="row wrap" style="gap:6px;margin-top:2px"><span class="pill plain">${plural(k.abschnitte.length, 'Abschnitt', 'Abschnitte')}</span><span class="pill plain">${k.karten.length} Karten</span><span class="pill plain">${k.quiz.length} Fragen</span>${read ? `<span class="pill good">${read === k.abschnitte.length ? 'gelesen' : read + ' gelesen'}</span>` : ''}</span>
        </span><span class="chev" style="margin-top:9px">${svg(I.chev, 18)}</span></a>`;
      }).join('')}</div></section>`).join('')}
  `);
}
function viewChapter(id) {
  const k = KAP[id];
  const secCards = {}; for (const c of cardsOf(id)) secCards[c.abschnitt] = (secCards[c.abschnitt] || 0) + 1;
  mount(`
    <div class="stack gap-10">
      <a class="backlink" href="#themen" style="align-self:flex-start">${svg(I.back, 18)} Themen</a>
      <div><p class="eyebrow">Studienheft ${k.heft} · Kapitel ${k.kapitel}</p><h1 class="title">${esc(k.titel)}</h1><p class="lede">${esc(k.kurz)}</p></div>
      <div class="row wrap" style="gap:10px;margin-top:6px"><a class="btn primary" href="#lernen/${id}">${svg(I.cards, 19)} Karten lernen</a><button class="btn soft" data-act="quiz-kap" data-kap="${id}">${svg(I.quiz, 19)} Quiz starten</button></div>
    </div>
    <nav class="toc" aria-label="Abschnitte">${k.abschnitte.map(a => `<button class="chip" data-act="jump" data-nr="${esc(a.nr)}">${esc(secLabel(a.nr))}</button>`).join('')}</nav>
    ${k.abschnitte.map(a => {
      const on = S.read[id + ':' + a.nr], n = secCards[a.nr] || 0;
      return `<section class="card sec" id="sec-${esc(a.nr)}">
        <div class="sec-head"><span class="sec-nr num">${esc(secLabel(a.nr))}</span><h2 class="h2 grow">${esc(a.titel)}</h2></div>
        <ul class="points">${a.punkte.map(p => `<li>${rich(p)}</li>`).join('')}</ul>
        ${a.merke ? `<p class="merke">${svg(I.bulb, 19)}<span>${rich(a.merke)}</span></p>` : ''}
        <div class="sec-foot"><button class="check${on ? ' on' : ''}" data-act="read" data-key="${esc(id + ':' + a.nr)}" aria-pressed="${on ? 'true' : 'false'}"><i>${svg(I.check, 14)}</i>${on ? 'Gelesen' : 'Als gelesen markieren'}</button>
        ${n ? `<a class="btn small ghost" href="#lernen/${id}~${encodeURIComponent(a.nr)}">${n} Karten dazu ${svg(I.chev, 15)}</a>` : ''}</div>
      </section>`;
    }).join('')}
    <div class="row wrap" style="gap:10px;justify-content:center;margin-top:6px"><a class="btn primary" href="#lernen/${id}">Karten zu diesem Kapitel</a><button class="btn soft" data-act="quiz-kap" data-kap="${id}">Quiz zu diesem Kapitel</button></div>
  `);
}
const secLabel = nr => (nr === 'E' ? 'Einleitung' : nr === 'S' ? 'Schluss' : nr);

/* ───────── Karten: Übersicht ───────── */
const B = { q: '', f: 'all', limit: 30 };
function viewCards() {
  const all = allCards(), st = deckStats(all), plan = todayPlan();
  const favN = all.filter(c => S.fav[c.id]).length, ownN = S.own.length;
  const deckRow = (spec, badge, title) => {
    const d = deckStats(cardsOf(spec));
    return `<a class="item" href="#lernen/${spec}"><span class="badge num">${badge}</span><span class="grow"><span class="h3">${esc(title)}</span>
      <span class="bar-p"><i style="width:${pct(d.learned, d.total)}%"></i></span>
      <span class="tiny faint num" style="display:block;margin-top:6px">${d.learned} von ${d.total} gelernt${d.due ? ` · ${d.due} fällig` : ''}</span></span><span class="chev">${svg(I.chev, 18)}</span></a>`;
  };
  mount(`
    <div class="head"><div><h1 class="title">Lernkarten</h1><p class="lede">Karte umdrehen, ehrlich bewerten. Was sitzt, kommt seltener wieder.</p></div>
      <button class="btn primary" data-act="new-card">${svg(I.plus, 19)} Eigene Karte</button></div>
    <div class="grid4">
      <a class="card tile accent" href="#lernen/due"><span class="ico">${svg(I.bolt, 19)}</span><span class="v num">${plan.due.length + plan.neu.length}</span><span class="k">Heute lernen</span></a>
      <a class="card tile" href="#lernen/all"><span class="ico">${svg(I.cards, 19)}</span><span class="v num">${st.total}</span><span class="k">Alle Karten</span></a>
      <a class="card tile" href="#lernen/hard"><span class="ico">${svg(I.redo, 19)}</span><span class="v num">${st.hard}</span><span class="k">Schwierige</span></a>
      <a class="card tile" href="#lernen/fav"><span class="ico">${svg(I.star, 19)}</span><span class="v num">${favN}</span><span class="k">Favoriten</span></a>
    </div>
    <div class="card pad row wrap" style="justify-content:space-between;gap:14px 24px">
      <div class="row wrap" style="gap:10px"><span class="small muted">Karten pro Runde</span><div class="seg" role="group" aria-label="Karten pro Runde">${[10, 20, 0].map(n => `<button data-act="size" data-n="${n}" class="${S.size === n ? 'on' : ''}">${n || 'Alle'}</button>`).join('')}</div></div>
      <label class="switch-row" for="opt-shuffle"><span>Mischen</span><input id="opt-shuffle" type="checkbox" class="switch" data-on="shuffle"${S.shuffle ? ' checked' : ''}></label>
    </div>
    ${hefte().map(h => `<section class="stack gap-10"><div><p class="eyebrow">Studienheft ${h.nr}</p><h2 class="h2">${esc(h.titel)}</h2></div>
      <div class="card list">${h.kapitel.map(k => deckRow(k.id, k.kapitel, k.titel)).join('')}</div></section>`).join('')}
    <section class="stack gap-10"><div><p class="eyebrow">Selbst erstellt</p><h2 class="h2">Eigene Karten</h2></div>
      ${ownN ? `<div class="card list">${deckRow('own', svg(I.pen, 18), plural(ownN, 'eigene Karte', 'eigene Karten'))}</div>`
        : `<div class="card empty"><span class="ico">${svg(I.pen, 24)}</span><p>Noch keine eigenen Karten. Halte fest, was du dir zusätzlich merken willst.</p><button class="btn soft" data-act="new-card">${svg(I.plus, 18)} Erste Karte anlegen</button></div>`}
    </section>
    <section class="stack gap-14"><h2 class="h2">Alle Karten durchsuchen</h2>
      <label class="field" for="b-q" style="position:relative"><span class="sr">Karten durchsuchen</span><span style="position:absolute;left:14px;top:13px;color:var(--ink-3)">${svg(I.search, 20)}</span><input id="b-q" type="search" placeholder="Begriff suchen, z. B. Salutogenese" value="${esc(B.q)}" data-on="search" style="padding-left:44px" autocomplete="off"></label>
      <div class="chips" id="b-f"></div>
      <div id="b-list"></div>
    </section>
  `);
  renderBrowser();
}
function renderBrowser() {
  const fs = [['all', 'Alle'], ...DATA.hefte.map(h => ['h' + h.nr, 'Heft ' + h.nr]), ['own', 'Eigene'], ['fav', 'Favoriten']];
  $('#b-f').innerHTML = fs.map(([id, l]) => `<button class="chip${B.f === id ? ' on' : ''}" data-act="bfilter" data-f="${id}">${l}</button>`).join('');
  const q = B.q.trim().toLowerCase();
  let list = cardsOf(B.f);
  if (q) list = list.filter(c => (c.frage + ' ' + c.antwort).toLowerCase().includes(q));
  const shown = list.slice(0, B.limit);
  $('#b-list').innerHTML = !list.length
    ? `<div class="card empty"><span class="ico">${svg(I.search, 24)}</span><p>${q ? 'Keine Karte passt zu dieser Suche.' : 'Hier ist noch keine Karte.'}</p></div>`
    : `<p class="tiny faint num" style="margin:0 6px 8px">${plural(list.length, 'Karte', 'Karten')}</p><div class="card list">${shown.map(c => `<button class="item" data-act="open-card" data-id="${esc(c.id)}"><span class="dot b${Math.min(box(c.id), 4)}"></span><span class="grow"><span class="clamp2" style="font-weight:600">${esc(c.frage)}</span><span class="tiny faint">${esc(cardMeta(c))}</span></span>${S.fav[c.id] ? `<span style="color:var(--warn)">${svg(I.star, 17)}</span>` : ''}<span class="chev">${svg(I.chev, 18)}</span></button>`).join('')}</div>
      ${list.length > shown.length ? `<div style="text-align:center;margin-top:14px"><button class="btn soft" data-act="bmore">Mehr anzeigen</button></div>` : ''}`;
}

/* ───────── Karten: Lernrunde ───────── */
let ST = null;
function startStudy(spec) {
  const t = today(); let ids;
  if (spec === 'due') { const p = todayPlan(); ids = [...p.due, ...p.neu]; }
  else {
    const cs = S.shuffle ? shuffle(cardsOf(spec).slice()) : cardsOf(spec).slice();
    const rank = c => { const p = S.cards[c.id]; return !p || !p.b ? 1 : p.d <= t ? 0 : 2; };
    cs.sort((a, b) => rank(a) - rank(b));
    ids = cs.map(c => c.id);
    if (S.size && ids.length > S.size) ids = ids.slice(0, S.size);
  }
  ST = { spec, q: ids, i: 0, flipped: false, seen: false, n: [0, 0, 0], first: ids.length, lock: false };
}
function viewStudy(spec) {
  if (!ST || ST.spec !== spec || ST.finished) startStudy(spec);
  document.body.classList.add('focus');
  renderStudy();
}
function renderStudy() {
  const s = ST;
  while (s.i < s.q.length && !CARD[s.q[s.i]]) s.i++;
  if (!s.q.length) {
    const why = { due: 'Für heute ist nichts fällig.', fav: 'Du hast noch keine Favoriten markiert. Tippe auf einer Karte auf den Stern.', hard: 'Im Moment gibt es keine schwierigen Karten.', own: 'Du hast noch keine eigenen Karten angelegt.' }[s.spec] || 'In dieser Auswahl gibt es keine Karten.';
    mount(`<div class="study"><div class="focus-bar"><button class="icon-btn" data-act="exit-study" aria-label="Schließen">${svg(I.x)}</button></div>
      <div class="card empty" style="margin-block:auto"><span class="ico">${svg(I.cards, 24)}</span><h2 class="h2">${esc(deckTitle(s.spec))}</h2><p>${why}</p><a class="btn primary" href="#karten">Zur Kartenübersicht</a></div></div>`);
    return;
  }
  if (s.i >= s.q.length) return renderStudyDone();
  const c = CARD[s.q[s.i]];
  s.flipped = false; s.seen = false; s.lock = false;
  mount(`<div class="study">
    <div class="focus-bar"><button class="icon-btn" data-act="exit-study" aria-label="Lernrunde beenden">${svg(I.x)}</button>
      <div class="pbar" role="progressbar" aria-valuemin="0" aria-valuemax="${s.q.length}" aria-valuenow="${s.i}"><i style="width:${pct(s.i, s.q.length)}%"></i></div>
      <span class="small muted num">${s.i + 1} / ${s.q.length}</span></div>
    <p class="tiny faint" style="text-align:center">${esc(deckTitle(s.spec))}</p>
    <div class="flip in" id="flip" data-act="flip" role="button" tabindex="0" aria-label="Karte umdrehen"><div class="flip-in">
      <article class="face front"><div class="face-top"><span class="pill plain">${esc(cardMeta(c))}</span>${favBtn(c.id)}</div>
        <div class="face-body"><p class="q">${rich(c.frage)}</p></div><p class="hint">Tippen zum Umdrehen</p></article>
      <article class="face back" aria-hidden="true"><div class="face-top"><span class="pill">Antwort</span>${favBtn(c.id)}</div>
        <div class="face-body"><div class="a">${rich(c.antwort)}</div></div></article>
    </div></div>
    <div class="rate-wrap" id="rate"><button class="btn primary block" data-act="flip" style="min-height:58px;border-radius:18px">Antwort zeigen</button></div>
    <p class="kbd">Leertaste dreht um · 1 Nochmal · 2 Unsicher · 3 Gewusst</p>
  </div>`, 'still-ok');
  const el = $('#flip');
  el.addEventListener('animationend', () => el.classList.remove('in'), { once: true });
  bindSwipe(el);
}
const favBtn = id => `<button class="icon-btn${S.fav[id] ? ' on' : ''}" data-act="fav" data-id="${esc(id)}" aria-label="Favorit" aria-pressed="${S.fav[id] ? 'true' : 'false'}"><svg width="22" height="22" viewBox="0 0 24 24" fill="${S.fav[id] ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" aria-hidden="true">${I.star}</svg></button>`;
function flip() {
  const el = $('#flip'); if (!el || ST.lock) return;
  ST.flipped = !ST.flipped;
  el.classList.toggle('flipped', ST.flipped);
  $('.face.front', el).setAttribute('aria-hidden', ST.flipped ? 'true' : 'false');
  $('.face.back', el).setAttribute('aria-hidden', ST.flipped ? 'false' : 'true');
  if (ST.flipped && !ST.seen) {
    ST.seen = true;
    $('#rate').innerHTML = `<div class="rate"><button class="btn again" data-act="rate" data-r="0">Nochmal<small>gleich wieder</small></button><button class="btn unsure" data-act="rate" data-r="1">Unsicher<small>morgen</small></button><button class="btn good" data-act="rate" data-r="2">Gewusst<small>${nextGap(ST.q[ST.i])}</small></button></div>`;
  }
}
const GAPS = [1, 2, 4, 8, 16];
const nextGap = id => { const d = GAPS[Math.min(5, Math.max(box(id), 1) + 1) - 1]; return `in ${d} Tagen`; };
function applyRating(id, r) {
  const t = today(), p = S.cards[id] || { b: 0, d: 0, n: 0 };
  if (r === 0) { p.b = 1; p.d = t; }
  else if (r === 1) { p.b = Math.max(1, Math.min(p.b, 2)); p.d = t + 1; }
  else { p.b = Math.min(5, Math.max(p.b, 1) + 1); p.d = t + GAPS[p.b - 1]; }
  p.n = (p.n || 0) + 1; p.l = t;
  S.cards[id] = p; bump(); save();
}
function rate(r) {
  const s = ST; if (!s || !s.seen || s.lock) return;
  s.lock = true;
  const id = s.q[s.i], el = $('#flip');
  applyRating(id, r); s.n[r]++;
  if (r === 0 && s.q.length < s.first + 30) s.q.push(id);
  el.classList.remove('in'); el.style.transform = '';
  el.classList.add(r === 0 ? 'out-l' : r === 2 ? 'out-r' : 'out-d');
  setTimeout(() => { s.i++; still = true; renderStudy(); still = false; }, 230);
}
function renderStudyDone() {
  const s = ST; s.finished = true;
  const total = s.n[0] + s.n[1] + s.n[2], p = pct(s.n[2], total);
  const more = s.spec === 'due' ? (todayPlan().due.length + todayPlan().neu.length) : cardsOf(s.spec).length;
  mount(`<div class="study"><div class="focus-bar"><button class="icon-btn" data-act="exit-study" aria-label="Schließen">${svg(I.x)}</button></div>
    <div class="card result" style="margin-block:auto">${ring(p, 'gewusst', true)}
      <h1 class="h2" style="margin-top:10px">Runde geschafft</h1>
      <p class="muted">${plural(s.first, 'Karte', 'Karten')} gelernt · Lernserie: ${plural(streak(), 'Tag', 'Tage')}</p>
      <div class="row wrap" style="gap:8px;justify-content:center;margin-top:8px"><span class="pill good">${s.n[2]} gewusst</span><span class="pill warn">${s.n[1]} unsicher</span><span class="pill bad">${s.n[0]} nochmal</span></div>
      <div class="stack gap-10" style="width:min(100%,320px);margin-top:20px">${more ? `<button class="btn primary block" data-act="study-again">Nächste Runde</button>` : ''}<a class="btn soft block" href="#karten">Zur Kartenübersicht</a><a class="btn ghost block" href="#start">Zur Startseite</a></div>
    </div></div>`);
  animateRings();
}
function bindSwipe(el) {
  let x0 = null, y0 = 0, dx = 0, moved = false;
  el.addEventListener('pointerdown', e => { if (e.target.closest('[data-act="fav"]')) return; x0 = e.clientX; y0 = e.clientY; dx = 0; moved = false; });
  el.addEventListener('pointermove', e => {
    if (x0 === null) return;
    dx = e.clientX - x0;
    if (!moved && Math.abs(dx) > 14 && Math.abs(dx) > Math.abs(e.clientY - y0) * 1.3) { moved = true; try { el.setPointerCapture(e.pointerId); } catch { /* egal */ } }
    if (moved && ST.seen && ST.flipped) { el.style.transition = 'none'; el.style.transform = `translateX(${dx}px) rotate(${dx / 24}deg)`; }
  });
  const end = () => {
    if (x0 === null) return; x0 = null;
    el.style.transition = 'transform .3s cubic-bezier(.22,.8,.24,1)';
    if (moved) {
      el.dataset.swiped = '1'; setTimeout(() => { delete el.dataset.swiped; }, 60);
      if (ST.seen && ST.flipped && Math.abs(dx) > 90) return rate(dx > 0 ? 2 : 0);
    }
    el.style.transform = '';
  };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
}

/* ───────── Quiz ───────── */
let QZ = null;
function quizPool() {
  let qs = allQuiz();
  const sc = S.qcfg.scope.filter(id => KAP[id] || id === 'own');
  if (sc.length) qs = qs.filter(q => sc.includes(q.kap));
  if (S.qcfg.focus === 'new') qs = qs.filter(q => !S.quiz[q.id]);
  if (S.qcfg.focus === 'wrong') qs = qs.filter(q => S.quiz[q.id] && S.quiz[q.id].ok === false);
  return qs;
}
function viewQuiz() {
  const cfg = S.qcfg, pool = quizPool(), all = allQuiz(), qs = quizStats(all);
  const hasOwn = all.some(q => q.kap === 'own');
  const wrongN = all.filter(q => S.quiz[q.id] && S.quiz[q.id].ok === false).length;
  const n = cfg.n ? Math.min(cfg.n, pool.length) : pool.length;
  const hint = pool.length ? '' : cfg.focus === 'wrong' ? 'In dieser Auswahl gibt es keine offenen Fehler.' : cfg.focus === 'new' ? 'In dieser Auswahl hast du schon alle Fragen beantwortet.' : 'In dieser Auswahl gibt es keine Fragen.';
  mount(`
    <div><h1 class="title">Quiz</h1><p class="lede">Prüfe, was von den Lernkarten hängen geblieben ist. Jede Frage wird direkt aufgelöst und erklärt.</p></div>
    <section class="card pad stack gap-18">
      <div class="stack gap-10"><h2 class="h3">Bereich</h2>
        <div class="picks">${pick('all', '', 'Alle Kapitel aus beiden Studienheften', !cfg.scope.length, true)}</div>
        ${hefte().map(h => `<div class="stack gap-6"><p class="tiny faint" style="font-weight:650;margin:4px 4px 0">Studienheft ${h.nr}</p><div class="picks">${h.kapitel.map(k => pick(k.id, k.kapitel, k.titel, cfg.scope.includes(k.id))).join('')}</div></div>`).join('')}
        ${hasOwn ? `<div class="picks">${pick('own', '', 'Eigene Quizfragen', cfg.scope.includes('own'), true)}</div>` : ''}
      </div>
      <div class="row wrap" style="gap:14px 28px">
        <div class="stack gap-6"><h2 class="h3">Anzahl</h2><div class="seg" role="group" aria-label="Anzahl der Fragen">${[10, 20, 30, 0].map(v => `<button data-act="q-n" data-n="${v}" class="${cfg.n === v ? 'on' : ''}">${v || 'Alle'}</button>`).join('')}</div></div>
        <div class="stack gap-6"><h2 class="h3">Fragen</h2><div class="seg" role="group" aria-label="Auswahl der Fragen">${[['all', 'Gemischt'], ['new', 'Neue'], ['wrong', `Fehler${wrongN ? ' (' + wrongN + ')' : ''}`]].map(([v, l]) => `<button data-act="q-focus" data-f="${v}" class="${cfg.focus === v ? 'on' : ''}">${l}</button>`).join('')}</div></div>
      </div>
      <div class="row wrap" style="justify-content:space-between;gap:12px"><span class="small muted num">${hint || `${plural(n, 'Frage', 'Fragen')} aus ${pool.length} verfügbaren`}</span>
        <button class="btn primary" data-act="q-start"${pool.length ? '' : ' disabled'}>Quiz starten</button></div>
    </section>
    <section class="stack gap-10"><div class="head-row"><h2 class="h2">Dein Stand</h2><span class="small muted num">${qs.seen} von ${qs.total} Fragen beantwortet${qs.rate === null ? '' : ' · ' + qs.rate + ' % richtig'}</span></div>
      <div class="card list">${DATA.kapitel.map(k => { const s = quizStats(k.quiz); return `<div class="item"><span class="badge num" style="font-size:12.5px">${k.heft}.${k.kapitel}</span><span class="grow"><span class="h3 clamp2">${esc(k.titel)}</span><span class="bar-p"><i style="width:${pct(s.seen, s.total)}%"></i></span></span>
        <span class="pill ${s.rate === null ? 'plain' : s.rate >= 80 ? 'good' : s.rate >= 55 ? 'warn' : 'bad'} num">${s.rate === null ? 'offen' : s.rate + ' %'}</span></div>`; }).join('')}</div>
    </section>
  `);
}
const pick = (k, n, label, on, wide) => `<button class="pick${on ? ' on' : ''}${wide ? ' wide' : ''}" data-act="q-scope" data-k="${k}" aria-pressed="${on ? 'true' : 'false'}">${n ? `<b class="num">${n}</b>` : ''}<span class="grow">${esc(label)}</span><i>${svg(I.check, 14)}</i></button>`;
function startQuiz(list) {
  const qs = shuffle(list.slice());
  QZ = { qs, i: 0, answers: [], cur: null, done: false };
  go('quiz/run');
}
function viewQuizRun() {
  if (!QZ) { location.replace('#quiz'); return false; }
  document.body.classList.add('focus');
  if (QZ.done) renderQuizResult(); else renderQuestion();
  return true;
}
const KEYS = ['A', 'B', 'C', 'D', 'E'];
function renderQuestion() {
  const q = QZ.qs[QZ.i], k = KAP[q.kap];
  if (!QZ.cur) QZ.cur = { order: q.typ === 'mc' ? shuffle(q.optionen.map((_, i) => i)) : null, answered: false };
  const body = q.typ === 'mc'
    ? `<div class="opts" id="opts">${QZ.cur.order.map((oi, n) => `<button class="opt" data-act="answer" data-v="${oi}"><span class="key">${KEYS[n]}</span><span class="grow">${rich(q.optionen[oi])}</span></button>`).join('')}</div>`
    : `<div class="opts wf" id="opts"><button class="opt" data-act="answer" data-v="true">Stimmt</button><button class="opt" data-act="answer" data-v="false">Stimmt nicht</button></div>`;
  mount(`<div class="quiz">
    <div class="focus-bar"><button class="icon-btn" data-act="exit-quiz" aria-label="Quiz beenden">${svg(I.x)}</button>
      <div class="pbar"><i style="width:${pct(QZ.i, QZ.qs.length)}%"></i></div><span class="small muted num">${QZ.i + 1} / ${QZ.qs.length}</span></div>
    <section class="card qcard"><div class="row wrap" style="gap:6px"><span class="pill plain">${k ? `Heft ${k.heft} · Kap. ${k.kapitel}${q.abschnitt ? ' · ' + esc(q.abschnitt) : ''}` : 'Eigene Frage'}</span><span class="pill">${q.typ === 'mc' ? 'Eine Antwort stimmt' : 'Stimmt die Aussage?'}</span></div>
      <h1 class="qtext">${rich(q.frage)}</h1></section>
    ${body}<div id="after"></div>
    <p class="kbd">${q.typ === 'mc' ? 'Tasten 1–4 wählen' : 'Taste 1 Stimmt · 2 Stimmt nicht'} · Enter geht weiter</p>
  </div>`);
}
function answer(v) {
  const q = QZ.qs[QZ.i]; if (!QZ.cur || QZ.cur.answered) return;
  QZ.cur.answered = true;
  const chosen = q.typ === 'mc' ? +v : v === 'true' || v === true;
  const ok = chosen === q.richtig;
  QZ.answers.push({ q, ok, chosen });
  if (!q.id.startsWith('tmp')) { const p = S.quiz[q.id] || { r: 0, f: 0 }; if (ok) p.r++; else p.f++; p.ok = ok; p.l = today(); S.quiz[q.id] = p; }
  bump(); save();
  const opts = $('#opts'); opts.classList.add('done');
  $$('.opt', opts).forEach(b => {
    const bv = q.typ === 'mc' ? +b.dataset.v : b.dataset.v === 'true';
    if (bv === q.richtig) b.classList.add('right'); else if (bv === chosen) b.classList.add('wrong');
    b.disabled = true;
  });
  const last = QZ.i === QZ.qs.length - 1;
  const sol = q.typ === 'mc' ? q.optionen[q.richtig] : (q.richtig ? 'Die Aussage stimmt.' : 'Die Aussage stimmt nicht.');
  $('#after').innerHTML = `<div class="explain ${ok ? 'ok' : 'no'}"><p class="verdict">${svg(ok ? I.check : I.x, 19)} ${ok ? 'Richtig' : 'Leider falsch'}</p>
    ${ok ? '' : `<p><strong>Richtig ist:</strong> ${rich(sol)}</p>`}${q.erklaerung ? `<p>${rich(q.erklaerung)}</p>` : ''}
    <div class="row wrap" style="justify-content:space-between;gap:10px;margin-top:6px">${q.karte && CARD[q.karte] ? `<button class="btn small" style="background:var(--surface)" data-act="open-card" data-id="${esc(q.karte)}">Lernkarte ansehen</button>` : '<span></span>'}
      <button class="btn primary" data-act="q-next" id="q-next">${last ? 'Ergebnis ansehen' : 'Weiter'}</button></div></div>`;
  const nx = $('#q-next'); nx.focus({ preventScroll: true });
  nx.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function nextQuestion() {
  if (!QZ || !QZ.cur || !QZ.cur.answered) return;
  QZ.cur = null;
  if (QZ.i >= QZ.qs.length - 1) { QZ.done = true; renderQuizResult(); scrollTo(0, 0); return; }
  QZ.i++; renderQuestion(); scrollTo(0, 0);
}
function renderQuizResult() {
  const a = QZ.answers, ok = a.filter(x => x.ok).length, p = pct(ok, a.length), wrong = a.filter(x => !x.ok);
  const msg = p === 100 ? 'Alles richtig. Stark!' : p >= 80 ? 'Sehr gut, das sitzt.' : p >= 55 ? 'Gute Basis. Die Lücken schließt du noch.' : 'Da geht noch was. Schau dir die Erklärungen an.';
  mount(`<div class="quiz">
    <div class="focus-bar"><button class="icon-btn" data-act="exit-quiz" aria-label="Schließen">${svg(I.x)}</button></div>
    <section class="card result">${ring(p, 'richtig', true)}<h1 class="h2" style="margin-top:10px">${ok} von ${a.length} richtig</h1><p class="muted">${msg}</p>
      <div class="row wrap" style="gap:10px;justify-content:center;margin-top:14px">${wrong.length ? `<button class="btn primary" data-act="q-retry">Fehler wiederholen</button>` : ''}<button class="btn ${wrong.length ? 'soft' : 'primary'}" data-act="q-start">Neues Quiz</button><a class="btn ghost" href="#quiz">Zur Quiz-Übersicht</a></div></section>
    ${wrong.length ? `<section class="stack gap-10"><h2 class="h2">Das schaust du dir noch einmal an</h2><div class="card">${wrong.map(x => `<div class="review"><p style="font-weight:650">${rich(x.q.frage)}</p>
      <p class="small"><span style="color:var(--good);font-weight:650">Richtig:</span> ${rich(x.q.typ === 'mc' ? x.q.optionen[x.q.richtig] : (x.q.richtig ? 'Die Aussage stimmt.' : 'Die Aussage stimmt nicht.'))}</p>
      ${x.q.erklaerung ? `<p class="small muted">${rich(x.q.erklaerung)}</p>` : ''}
      ${x.q.karte && CARD[x.q.karte] ? `<div><button class="btn small ghost" style="margin-left:-14px" data-act="open-card" data-id="${esc(x.q.karte)}">Lernkarte ansehen ${svg(I.chev, 15)}</button></div>` : ''}</div>`).join('')}</div></section>` : ''}
  </div>`);
  animateRings();
}

/* ───────── Sheets ───────── */
let sheetEl = null;
function openSheet(html) {
  closeSheet(true);
  const w = document.createElement('div'); w.className = 'sheet-wrap';
  w.innerHTML = `<div class="scrim" data-act="close-sheet"></div><div class="sheet" role="dialog" aria-modal="true">${html}</div>`;
  document.body.append(w); document.body.style.overflow = 'hidden'; sheetEl = w;
  const f = $('[data-focus]', w); if (f) setTimeout(() => f.focus(), 60);
}
function closeSheet(now) {
  if (!sheetEl) return;
  const w = sheetEl; sheetEl = null; document.body.style.overflow = '';
  if (now) return w.remove();
  w.classList.add('closing'); setTimeout(() => w.remove(), 260);
}
const sheetHead = t => `<div class="sheet-head"><h2 class="h2">${t}</h2><button class="icon-btn" data-act="close-sheet" aria-label="Schließen">${svg(I.x)}</button></div>`;

function cardSheet(id) {
  const c = CARD[id]; if (!c) return;
  const p = S.cards[id], b = box(id);
  const state = !b ? ['plain', 'Neu'] : b === 1 ? ['bad', 'Schwierig'] : b < 4 ? ['warn', 'In Arbeit'] : ['good', 'Sitzt sicher'];
  openSheet(`<div class="sheet-head"><span class="row wrap" style="gap:6px"><span class="pill plain">${esc(cardMeta(c))}</span><span class="pill ${state[0]}">${state[1]}</span></span><span class="row" style="gap:0">${favBtn(id)}<button class="icon-btn" data-act="close-sheet" aria-label="Schließen">${svg(I.x)}</button></span></div>
    <div class="stack gap-14"><h2 class="h2" style="text-wrap:balance">${rich(c.frage)}</h2>
      <div class="card pad" style="border-radius:20px;white-space:pre-line;line-height:1.55">${rich(c.antwort)}</div>
      ${c.own && c.falsch && c.falsch.some(x => x.trim()) ? `<p class="tiny faint">Kommt auch im Quiz vor (${plural(c.falsch.filter(x => x.trim()).length, 'falsche Antwort', 'falsche Antworten')}).</p>` : ''}
      ${p && p.n ? `<p class="tiny faint num">${plural(p.n, 'Mal', 'Mal')} gelernt</p>` : ''}
      ${c.own ? `<div class="row" style="gap:10px"><button class="btn soft grow" data-act="edit-card" data-id="${esc(id)}">${svg(I.pen, 18)} Bearbeiten</button><button class="btn danger" data-act="del-card" data-id="${esc(id)}">${svg(I.trash, 18)} Löschen</button></div>` : ''}
    </div>`);
}
function editorSheet(id) {
  const c = id ? CARD[id] : null;
  const f = (c && c.falsch) || ['', '', ''];
  const hasQ = !!(c && c.falsch && c.falsch.some(x => x.trim()));
  const lastKap = (ST && KAP[ST.spec && ST.spec.split('~')[0]] ? ST.spec.split('~')[0] : null);
  const sel = c ? c.kap : (lastKap || 'own');
  openSheet(`${sheetHead(c ? 'Karte bearbeiten' : 'Eigene Karte')}
    <form id="card-form" class="stack gap-14" data-id="${esc(id || '')}" novalidate>
      <label class="field" for="cf-kap"><span class="lbl">Thema</span><select id="cf-kap"><option value="own"${sel === 'own' ? ' selected' : ''}>Eigene Karten (ohne Kapitel)</option>${hefte().map(h => `<optgroup label="Studienheft ${h.nr}">${h.kapitel.map(k => `<option value="${k.id}"${sel === k.id ? ' selected' : ''}>${k.kapitel} · ${esc(k.titel)}</option>`).join('')}</optgroup>`).join('')}</select></label>
      <label class="field" for="cf-q"><span class="lbl">Frage</span><textarea id="cf-q" rows="2" maxlength="600" placeholder="Was möchtest du abfragen?" data-focus>${esc(c ? c.frage : '')}</textarea></label>
      <label class="field" for="cf-a"><span class="lbl">Antwort</span><textarea id="cf-a" rows="3" maxlength="1500" placeholder="Die Antwort in deinen Worten">${esc(c ? c.antwort : '')}</textarea></label>
      <label class="switch-row" for="cf-quiz"><span>Auch als Quizfrage verwenden</span><input id="cf-quiz" type="checkbox" class="switch" data-on="cf-quiz"${hasQ ? ' checked' : ''}></label>
      <div id="cf-wrong" class="stack gap-10"${hasQ ? '' : ' hidden'}><p class="tiny faint">Die Antwort oben ist die richtige. Ergänze bis zu drei falsche Antworten.</p>
        ${[0, 1, 2].map(i => `<label class="field" for="cf-w${i}"><span class="sr">Falsche Antwort ${i + 1}</span><input id="cf-w${i}" type="text" maxlength="300" placeholder="Falsche Antwort ${i + 1}" value="${esc(f[i] || '')}" autocomplete="off"></label>`).join('')}</div>
      <p id="cf-msg" class="small" style="color:var(--bad);min-height:20px" role="alert"></p>
      <button class="btn primary block" type="submit">${c ? 'Änderungen speichern' : 'Karte speichern'}</button>
    </form>`);
}
function saveCardForm(form) {
  const id = form.dataset.id, frage = $('#cf-q').value.trim(), antwort = $('#cf-a').value.trim(), kap = $('#cf-kap').value;
  const msg = $('#cf-msg');
  if (!frage || !antwort) { msg.textContent = 'Bitte fülle Frage und Antwort aus.'; return; }
  let falsch = null;
  if ($('#cf-quiz').checked) {
    falsch = [0, 1, 2].map(i => $('#cf-w' + i).value.trim());
    if (!falsch.some(Boolean)) { msg.textContent = 'Für die Quizfrage brauchst du mindestens eine falsche Antwort.'; return; }
  }
  if (id && CARD[id] && CARD[id].own) Object.assign(CARD[id], { frage, antwort, kap, falsch });
  else { const o = { id: 'own-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), kap, frage, antwort, falsch, own: true }; S.own.push(o); CARD[o.id] = o; }
  persist(); closeSheet(); toast(id ? 'Karte aktualisiert' : 'Karte gespeichert');
  if (!document.body.classList.contains('focus')) refresh();
}
function deleteCard(id) {
  S.own = S.own.filter(o => o.id !== id);
  delete CARD[id]; delete S.cards[id]; delete S.fav[id]; delete S.quiz['q-' + id];
  persist(); closeSheet(); toast('Karte gelöscht');
  if (!document.body.classList.contains('focus')) refresh();
}
function settingsSheet() {
  const nC = DATA.kapitel.reduce((n, k) => n + k.karten.length, 0), nQ = DATA.kapitel.reduce((n, k) => n + k.quiz.length, 0);
  openSheet(`${sheetHead('Einstellungen')}
    <p class="group-label" style="margin-top:0">Klausur</p>
    <div class="group"><label class="item" for="set-exam"><span class="grow">Klausurtermin</span><input id="set-exam" type="date" value="${esc(S.exam || '')}" data-on="exam" style="width:auto;min-height:40px;padding:6px 12px"></label></div>
    <p class="group-label">Darstellung</p>
    <div class="group"><div class="item"><span class="grow">Farbschema</span><div class="seg">${[['auto', 'Auto'], ['light', 'Hell'], ['dark', 'Dunkel']].map(([v, l]) => `<button data-act="theme" data-v="${v}" class="${S.theme === v ? 'on' : ''}">${l}</button>`).join('')}</div></div></div>
    <p class="group-label">Daten auf diesem Gerät</p>
    <div class="group">
      <button class="item" data-act="export">${svg(I.down, 20)}<span class="grow">Sicherung herunterladen<span class="tiny faint" style="display:block">Fortschritt und eigene Karten als Datei</span></span></button>
      <label class="item" for="set-import" style="cursor:pointer">${svg(I.up, 20)}<span class="grow">Sicherung einspielen<span class="tiny faint" style="display:block">Ersetzt den Stand auf diesem Gerät</span></span><input id="set-import" type="file" accept="application/json,.json" data-on="import" class="sr"></label>
      <button class="item" data-act="reset" style="color:var(--bad)">${svg(I.redo, 20)}<span class="grow">Lernfortschritt zurücksetzen<span class="tiny faint" style="display:block">Eigene Karten bleiben erhalten</span></span></button>
    </div>
    <p class="group-label">Zugang</p>
    <div class="group"><button class="item" data-act="logout">${svg(I.out, 20)}<span class="grow">Abmelden</span></button></div>
    <p class="tiny faint" style="text-align:center;margin-top:20px;line-height:1.5">MaPi · Malin Public Health<br>${nC} Lernkarten und ${nQ} Quizfragen aus den Studienheften ${DATA.hefte.map(h => esc(h.code)).join(' und ')}.<br>Fortschritt und eigene Karten liegen nur in diesem Browser.</p>`);
}
function exportData() {
  const blob = new Blob([JSON.stringify({ app: 'MaPi', v: 1, date: new Date().toISOString(), state: S }, null, 1)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `mapi-sicherung-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  toast('Sicherung erstellt');
}
function importData(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const j = JSON.parse(r.result);
      if (!j || j.app !== 'MaPi' || !j.state || typeof j.state !== 'object') throw new Error('Format');
      adopt(j.state); indexData(); applyTheme(); persist(); ST = null; QZ = null;
      closeSheet(); refresh(); toast('Sicherung eingespielt');
    } catch { toast('Diese Datei ist keine MaPi-Sicherung'); }
  };
  r.readAsText(file);
}

/* ───────── Ereignisse ───────── */
const ACT = {
  settings: settingsSheet,
  'close-sheet': () => closeSheet(),
  'new-card': () => editorSheet(null),
  'edit-card': el => editorSheet(el.dataset.id),
  'del-card': el => { if (el.dataset.sure) deleteCard(el.dataset.id); else { el.dataset.sure = '1'; el.innerHTML = 'Wirklich löschen?'; } },
  'open-card': el => cardSheet(el.dataset.id),
  fav: el => {
    const id = el.dataset.id; if (S.fav[id]) delete S.fav[id]; else S.fav[id] = 1; save();
    $$(`[data-act="fav"][data-id="${CSS.escape(id)}"]`).forEach(b => { b.classList.toggle('on', !!S.fav[id]); b.setAttribute('aria-pressed', S.fav[id] ? 'true' : 'false'); $('svg', b).setAttribute('fill', S.fav[id] ? 'currentColor' : 'none'); });
    if ($('#b-list') && !sheetEl) renderBrowser();
  },
  read: el => { const k = el.dataset.key; if (S.read[k]) delete S.read[k]; else S.read[k] = 1; save(); const on = !!S.read[k]; el.classList.toggle('on', on); el.setAttribute('aria-pressed', on ? 'true' : 'false'); el.lastChild.textContent = on ? 'Gelesen' : 'Als gelesen markieren'; },
  jump: el => { const t = document.getElementById('sec-' + el.dataset.nr); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
  size: el => { S.size = +el.dataset.n; save(); ST = null; refresh(); },
  bfilter: el => { B.f = el.dataset.f; B.limit = 30; renderBrowser(); },
  bmore: () => { B.limit += 40; renderBrowser(); },
  flip: el => { const f = $('#flip'); if (f && f.dataset.swiped) return; flip(); },
  rate: el => rate(+el.dataset.r),
  'exit-study': () => { ST = null; location.replace('#karten'); },
  'study-again': () => { const spec = ST.spec; ST = null; viewStudy(spec); scrollTo(0, 0); },
  'quiz-kap': el => { S.qcfg.scope = [el.dataset.kap]; S.qcfg.focus = 'all'; save(); const pool = quizPool(); startQuiz(S.qcfg.n ? shuffle(pool.slice()).slice(0, S.qcfg.n) : pool); },
  'q-scope': el => {
    const k = el.dataset.k, sc = S.qcfg.scope;
    if (k === 'all') S.qcfg.scope = []; else if (sc.includes(k)) S.qcfg.scope = sc.filter(x => x !== k); else sc.push(k);
    save(); refresh();
  },
  'q-n': el => { S.qcfg.n = +el.dataset.n; save(); refresh(); },
  'q-focus': el => { S.qcfg.focus = el.dataset.f; save(); refresh(); },
  'q-start': () => { const pool = quizPool(); if (!pool.length) { QZ = null; return go('quiz'); } const pick = shuffle(pool.slice()); QZ = null; startQuiz(S.qcfg.n ? pick.slice(0, S.qcfg.n) : pick); },
  'q-retry': () => startQuiz(QZ.answers.filter(x => !x.ok).map(x => x.q)),
  answer: el => answer(el.dataset.v),
  'q-next': nextQuestion,
  'exit-quiz': () => { QZ = null; location.replace('#quiz'); },
  theme: el => { S.theme = el.dataset.v; save(); applyTheme(); $$('[data-act="theme"]').forEach(b => b.classList.toggle('on', b === el)); },
  export: exportData,
  reset: el => {
    if (!el.dataset.sure) { el.dataset.sure = '1'; $('.grow', el).firstChild.textContent = 'Wirklich alles zurücksetzen?'; return; }
    S.cards = {}; S.quiz = {}; S.read = {}; S.days = {}; persist(); ST = null; QZ = null; closeSheet(); refresh(); toast('Lernfortschritt zurückgesetzt');
  },
  logout: () => { if (S) persist(); forgetKey(); location.hash = ''; location.reload(); },
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const fn = ACT[el.dataset.act]; if (!fn) return;
  if (el.tagName !== 'A') e.preventDefault();
  e.stopPropagation();
  fn(el, e);
});
document.addEventListener('submit', e => { if (e.target.id === 'card-form') { e.preventDefault(); saveCardForm(e.target); } });
document.addEventListener('input', e => {
  const on = e.target.dataset && e.target.dataset.on;
  if (on === 'search') { B.q = e.target.value; B.limit = 30; renderBrowser(); }
});
document.addEventListener('change', e => {
  const t = e.target, on = t.dataset && t.dataset.on;
  if (on === 'shuffle') { S.shuffle = t.checked; save(); ST = null; }
  else if (on === 'exam') { S.exam = /^\d{4}-\d{2}-\d{2}$/.test(t.value) ? t.value : null; save(); still = true; if (!document.body.classList.contains('focus')) { const y = scrollY; routeKeepSheet(); scrollTo(0, y); } still = false; }
  else if (on === 'cf-quiz') { $('#cf-wrong').hidden = !t.checked; }
  else if (on === 'import' && t.files && t.files[0]) importData(t.files[0]);
});
function routeKeepSheet() { const keep = sheetEl; sheetEl = null; route(); sheetEl = keep; if (keep) document.body.style.overflow = 'hidden'; }
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && sheetEl) { closeSheet(); return; }
  if (sheetEl || e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = e.target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  const h = location.hash;
  if (h.startsWith('#lernen') && ST && $('#flip')) {
    if (e.key === ' ' || (e.key === 'Enter' && e.target.id === 'flip')) { e.preventDefault(); flip(); }
    else if (ST.seen && ['1', '2', '3'].includes(e.key)) rate(+e.key - 1);
    else if (e.key === 'Escape') ACT['exit-study']();
  } else if (h === '#quiz/run' && QZ && !QZ.done) {
    const q = QZ.qs[QZ.i];
    if (QZ.cur && !QZ.cur.answered && /^[1-5]$/.test(e.key)) {
      const n = +e.key - 1;
      if (q.typ === 'mc' && n < QZ.cur.order.length) answer(QZ.cur.order[n]);
      else if (q.typ === 'wf' && n < 2) answer(n === 0 ? 'true' : 'false');
    } else if (e.key === 'Enter' && QZ.cur && QZ.cur.answered && e.target.id !== 'q-next') { e.preventDefault(); nextQuestion(); }
  }
});

/* ───────── Los ───────── */
(async () => {
  if (window.crypto && crypto.subtle && await tryStoredKey()) enter(false);
  else setTimeout(() => gatePw.focus({ preventScroll: true }), 400);
})();
})();
