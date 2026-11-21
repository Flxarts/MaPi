#!/usr/bin/env node
// MaPi – baut index.html aus src/ und verschlüsselt die Lerninhalte mit dem Passwort.
//
//   MAPI_PASSWORD='…' node tools/build.mjs build   --content inhalt.json
//   MAPI_PASSWORD='…' node tools/build.mjs decrypt --out inhalt.json
//   MAPI_PASSWORD='…' NEW_PASSWORD='…' node tools/build.mjs rekey
//
// Die Inhalte liegen nur verschlüsselt im Repository (AES-256-GCM, Schlüssel per PBKDF2-SHA256).
// "decrypt" holt sie mit dem Passwort wieder aus index.html heraus, z. B. um Karten zu ändern.
import { readFileSync, writeFileSync } from 'node:fs';
import { webcrypto as crypto } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'index.html');
const ITER = 600000;
const b64 = u => Buffer.from(u).toString('base64');
const arg = name => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : null; };
const die = msg => { console.error('Fehler: ' + msg); process.exit(1); };

async function keyFrom(pw, salt, iter) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw.normalize('NFC')), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
}
async function seal(content, pw) {
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await keyFrom(pw, salt, ITER);
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(JSON.stringify(content)));
  return { v: 1, kdf: 'PBKDF2-SHA256', iter: ITER, salt: b64(salt), iv: b64(iv), ct: b64(new Uint8Array(ct)) };
}
async function unseal(pw) {
  const html = readFileSync(OUT, 'utf8');
  const m = html.match(/<script id="vault" type="application\/json">([\s\S]*?)<\/script>/);
  if (!m) die('In index.html steckt kein Tresor.');
  const v = JSON.parse(m[1]);
  const key = await keyFrom(pw, Buffer.from(v.salt, 'base64'), v.iter);
  try {
    const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: Buffer.from(v.iv, 'base64') }, key, Buffer.from(v.ct, 'base64'));
    return JSON.parse(new TextDecoder().decode(pt));
  } catch { die('Das Passwort passt nicht zu index.html.'); }
}
function check(content) {
  if (!content || !Array.isArray(content.hefte) || !Array.isArray(content.kapitel)) die('Inhalt braucht "hefte" und "kapitel".');
  const ids = new Set();
  for (const k of content.kapitel) {
    for (const f of ['id', 'titel', 'kurz']) if (typeof k[f] !== 'string') die(`Kapitel ohne "${f}".`);
    for (const f of ['abschnitte', 'karten', 'quiz']) if (!Array.isArray(k[f])) die(`${k.id}: "${f}" fehlt.`);
    for (const x of [...k.karten, ...k.quiz]) { if (ids.has(x.id)) die('Doppelte ID ' + x.id); ids.add(x.id); }
  }
}
async function write(content, pw) {
  check(content);
  const vault = await seal(content, pw);
  const read = f => readFileSync(join(ROOT, 'src', f), 'utf8');
  const js = read('app.js');
  if (/<\/script/i.test(js)) die('app.js darf kein schließendes Script-Tag enthalten.');
  const html = read('shell.html')
    .replace('/*__CSS__*/', () => read('styles.css').trim())
    .replace('/*__JS__*/', () => js.trim())
    .replace('__VAULT__', () => JSON.stringify(vault));
  writeFileSync(OUT, html);
  const n = content.kapitel.reduce((a, k) => [a[0] + k.karten.length, a[1] + k.quiz.length], [0, 0]);
  console.log(`index.html geschrieben: ${content.kapitel.length} Kapitel, ${n[0]} Karten, ${n[1]} Quizfragen, ${(html.length / 1024).toFixed(0)} KB.`);
}

const cmd = process.argv[2];
const pw = process.env.MAPI_PASSWORD;
if (!pw) die('Bitte das Passwort in der Umgebungsvariable MAPI_PASSWORD übergeben.');
if (cmd === 'build') {
  const src = arg('content') || die('--content <datei.json> fehlt.');
  if (pw.length < 10) die('Das Passwort sollte mindestens 10 Zeichen haben.');
  await write(JSON.parse(readFileSync(src, 'utf8')), pw);
} else if (cmd === 'decrypt') {
  const out = arg('out') || die('--out <datei.json> fehlt.');
  writeFileSync(out, JSON.stringify(await unseal(pw), null, 1));
  console.log('Inhalte entschlüsselt nach ' + out);
} else if (cmd === 'rekey') {
  const neu = process.env.NEW_PASSWORD || die('Bitte das neue Passwort in NEW_PASSWORD übergeben.');
  if (neu.length < 10) die('Das neue Passwort sollte mindestens 10 Zeichen haben.');
  await write(await unseal(pw), neu);
} else die('Befehl: build | decrypt | rekey');
