// suno-preload.js — runs INSIDE the embedded Suno page (the webview guest).
// Its only job is the manual "Pick" mode: the host toggles it on, then a click on
// a song row in the page imports exactly that song. No auto-detection / scraping,
// no network hooks, no CDP debugger. Talks to the host via ipcRenderer.sendToHost.
const { ipcRenderer } = require('electron');

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

function cleanTitle(t) {
  t = (t || '').replace(/\s+/g, ' ').trim();
  if (!t) return '';
  if (/,/.test(t) && t.length > 40) t = t.split(',')[0].trim();   // strip trailing style tags
  return t.slice(0, 90);
}
function titleFromRow(node) {
  // climb to a plausible row/card container, then read the most title-like text in it
  let row = node;
  for (let i = 0; i < 5 && row && row.parentElement; i++) {
    row = row.parentElement;
    if (row.querySelector && row.querySelector('a[href*="/song/"], [class*="title" i]')) break;
  }
  if (!row || !row.querySelector) return '';
  const link = row.querySelector('a[href*="/song/"]');
  if (link) { const t = cleanTitle(link.getAttribute('title') || link.getAttribute('aria-label') || link.textContent); if (t) return t; }
  const cand = row.querySelector('[class*="title" i], [class*="name" i], h1, h2, h3, h4');
  if (cand) { const t = cleanTitle(cand.textContent); if (t) return t; }
  return '';
}
function looksLikeAvatar(img) {
  const w = img.naturalWidth || img.clientWidth || img.width || 0;
  const tag = (img.className || '') + ' ' + (img.getAttribute('alt') || '');
  return /avatar|profile|pfp|user-?img/i.test(tag) || (w > 0 && w < 40);   // tiny / profile images aren't covers
}

/* ---------- manual pick mode: click a song in the page to add exactly that one ----------
   Toggled from the host. While on, hovering highlights the song row under the cursor and
   a click imports THAT song (and is swallowed so the page doesn't navigate/play). */
function rowOf(node) {
  if (node && node.closest) {
    const r = node.closest('[data-clip-id],[data-key],li,article,[class*="row" i],[class*="card" i],[class*="track" i],[class*="song" i]');
    if (r) return r;
  }
  let row = node;
  for (let i = 0; i < 6 && row && row.parentElement; i++) {
    if (row.querySelector && row.querySelector('img[src*="suno"], a[href*="/song/"]')) return row;
    row = row.parentElement;
  }
  return row;
}
function isSongRow(row) {
  return !!(row && row.querySelector && (row.querySelector('a[href*="/song/"]') || row.querySelector('img[src*="suno"]')));
}
function trackFromNode(node) {
  const row = rowOf(node);
  if (!row || !row.querySelector) return null;
  let id = null, cover = null;
  const link = row.querySelector('a[href*="/song/"]');
  if (link) { const m = (link.getAttribute('href') || link.href || '').match(UUID); if (m) id = m[0]; }
  if (!id && row.getAttribute) { const dc = row.getAttribute('data-clip-id') || row.getAttribute('data-song-id') || row.getAttribute('data-key') || ''; const m = dc.match(UUID); if (m) id = m[0]; }
  const img = row.querySelector('img[src*="suno"]');
  if (img && !looksLikeAvatar(img)) { const m = (img.src || '').match(UUID); if (m) { if (!id) id = m[0]; cover = img.src; } }
  if (!id) return null;
  return { id: 'sunoR:' + id, title: titleFromRow(node) || 'Suno song', audioUrl: 'https://cdn1.suno.ai/' + id + '.mp3', cover, source: 'suno' };
}
let pickMode = false, hoverRow = null;
function setHover(r) {
  if (hoverRow === r) return;
  if (hoverRow) hoverRow.style.outline = '';
  hoverRow = r;
  if (hoverRow) { hoverRow.style.outline = '2px solid #ff5d8f'; hoverRow.style.outlineOffset = '-2px'; hoverRow.style.borderRadius = '10px'; }
}
function onPickMove(e) { const r = rowOf(e.target); setHover(isSongRow(r) ? r : null); }
function onPickDown(e) { if (isSongRow(rowOf(e.target))) { e.preventDefault(); e.stopPropagation(); } }
function onPickClick(e) {
  const t = trackFromNode(e.target);
  if (!t) return;
  e.preventDefault(); e.stopPropagation();
  try { ipcRenderer.sendToHost('suno-pick', t); } catch {}
  const o = hoverRow; if (o && o.style) { o.style.outline = '2px solid #7CFFB2'; setTimeout(() => { if (o.style && o !== hoverRow) o.style.outline = ''; }, 450); }
}
function setPickMode(on) {
  on = !!on; if (on === pickMode) return; pickMode = on;
  const opt = true;
  if (on) {
    document.addEventListener('mousemove', onPickMove, opt);
    document.addEventListener('mousedown', onPickDown, opt);
    document.addEventListener('click', onPickClick, opt);
    if (document.body) document.body.style.cursor = 'copy';
  } else {
    document.removeEventListener('mousemove', onPickMove, opt);
    document.removeEventListener('mousedown', onPickDown, opt);
    document.removeEventListener('click', onPickClick, opt);
    setHover(null);
    if (document.body) document.body.style.cursor = '';
  }
}
try { ipcRenderer.on('kw-pick-mode', (_e, on) => setPickMode(on)); } catch {}

/* ---------- run ---------- */
function start() { try { ipcRenderer.sendToHost('suno-ready'); } catch {} }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
