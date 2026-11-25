// Project maze: drive a car through a fogged maze; each beacon unlocks a project card.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fr = () => document.documentElement.lang === 'fr';
const T = {
  unlocked: () => fr() ? 'projet débloqué' : 'project unlocked',
  locked: () => fr() ? 'verrouillé · trouve-le dans le labyrinthe' : 'locked · find it in the maze',
  open: () => fr() ? 'ouvrir ↗' : 'open ↗',
  exit: () => fr() ? 'Tu es sorti! Prochaine étape :' : 'You made it out. Next stop:',
  exitBtn: () => fr() ? 'écris-moi →' : 'email me →',
  allFound: () => fr() ? 'Tous les projets trouvés. Respect.' : 'All projects found. Respect.',
  wall: () => fr() ? 'mur' : 'wall',
};

const canvas = $('#maze'), stage = $('#maze-stage'), intro = $('#maze-intro');
const ctx = canvas.getContext('2d');
const cards = $$('#garage .card');
const TOTAL = cards.length;
$('#found-total').textContent = TOTAL;

/* ---------- seeded RNG ---------- */
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* ---------- maze generation ---------- */
const N = 1, E = 2, S = 4, W = 8;
const DIRS = { up: [0, -1, N, S], right: [1, 0, E, W], down: [0, 1, S, N], left: [-1, 0, W, E] };
let M; // { cols, rows, walls[], start, exit, beacons:[{c,r,card}] }

function generate(seed) {
  const narrow = stage.clientWidth < 620;
  const cols = narrow ? 9 : 17, rows = narrow ? 13 : 9;
  const R = rng(seed);
  const walls = new Array(cols * rows).fill(N | E | S | W);
  const idx = (c, r) => r * cols + c;
  const seen = new Uint8Array(cols * rows);
  const start = { c: 0, r: Math.floor(rows / 2) };
  const stack = [start]; seen[idx(start.c, start.r)] = 1;
  while (stack.length) {
    const cur = stack[stack.length - 1];
    const opts = Object.values(DIRS).filter(([dx, dy]) => {
      const nc = cur.c + dx, nr = cur.r + dy;
      return nc >= 0 && nr >= 0 && nc < cols && nr < rows && !seen[idx(nc, nr)];
    });
    if (!opts.length) { stack.pop(); continue; }
    const [dx, dy, b, ob] = opts[Math.floor(R() * opts.length)];
    const nc = cur.c + dx, nr = cur.r + dy;
    walls[idx(cur.c, cur.r)] &= ~b; walls[idx(nc, nr)] &= ~ob;
    seen[idx(nc, nr)] = 1; stack.push({ c: nc, r: nr });
  }
  // knock out a few extra walls so there's more than one route to choose
  for (let k = 0; k < cols * rows * .08; k++) {
    const c = Math.floor(R() * (cols - 1)), r = Math.floor(R() * (rows - 1));
    if (R() < .5) { walls[idx(c, r)] &= ~E; walls[idx(c + 1, r)] &= ~W; }
    else { walls[idx(c, r)] &= ~S; walls[idx(c, r + 1)] &= ~N; }
  }
  M = { cols, rows, walls, idx, start };
  // exit = farthest cell; beacons = farthest-point sampling by path distance
  const d0 = bfs(start);
  let far = 0; d0.forEach((d, i) => { if (d > d0[far]) far = i; });
  M.exit = { c: far % cols, r: Math.floor(far / cols) };
  const minD = d0.slice();
  const dx = bfs(M.exit); for (let i = 0; i < minD.length; i++) minD[i] = Math.min(minD[i], dx[i]);
  M.beacons = [];
  for (let k = 0; k < TOTAL; k++) {
    let best = 0; minD.forEach((d, i) => { if (d > minD[best]) best = i; });
    const b = { c: best % cols, r: Math.floor(best / cols), card: cards[k] };
    M.beacons.push(b);
    const db = bfs(b); for (let i = 0; i < minD.length; i++) minD[i] = Math.min(minD[i], db[i]);
  }
  // nearer beacons get the smaller projects; the flagship sits deepest
  M.beacons.sort((a, b) => d0[M.idx(a.c, a.r)] - d0[M.idx(b.c, b.r)]);
  const order = cards.slice().reverse();
  M.beacons.forEach((b, i) => { b.card = order[i]; });
  M.seen = new Float32Array(cols * rows);
}

function bfs(from) {
  const { cols, rows, walls, idx } = M;
  const dist = new Array(cols * rows).fill(Infinity);
  const q = [from]; dist[idx(from.c, from.r)] = 0;
  while (q.length) {
    const { c, r } = q.shift(); const d = dist[idx(c, r)];
    for (const [dx, dy, b] of Object.values(DIRS)) {
      if (walls[idx(c, r)] & b) continue;
      const ni = idx(c + dx, r + dy);
      if (dist[ni] === Infinity) { dist[ni] = d + 1; q.push({ c: c + dx, r: r + dy }); }
    }
  }
  return dist;
}
function path(from, to) {
  const { cols, walls, idx } = M;
  const prev = new Map(); const q = [from]; const key = p => idx(p.c, p.r);
  prev.set(key(from), null);
  while (q.length) {
    const cur = q.shift();
    if (cur.c === to.c && cur.r === to.r) break;
    for (const [name, [dx, dy, b]] of Object.entries(DIRS)) {
      if (walls[key(cur)] & b) continue;
      const n = { c: cur.c + dx, r: cur.r + dy };
      if (!prev.has(key(n))) { prev.set(key(n), [cur, name]); q.push(n); }
    }
  }
  const out = []; let k = key(to);
  if (!prev.has(k)) return out;
  while (prev.get(k)) { const [p, name] = prev.get(k); out.unshift(name); k = key(p); }
  return out;
}

/* ---------- state ---------- */
const STORE = 'maze-found-v1';
let found = new Set(JSON.parse(localStorage.getItem(STORE) || '[]'));
let seed = +(localStorage.getItem('maze-seed') || 20261125);
let car, queue = [], playing = false, exitShown = false;

function resetCar() {
  car = { c: M.start.c, r: M.start.r, x: M.start.c, y: M.start.r, a: 0, ta: 0 };
  queue = []; exitShown = false;
}

/* ---------- cards: lock / unlock ---------- */
cards.forEach(card => {
  const lock = document.createElement('div');
  lock.className = 'lock mono';
  lock.innerHTML = `<span>🔒</span><em></em>`;
  card.appendChild(lock);
});
function paintLocks() {
  cards.forEach(card => {
    const on = !found.has(card.dataset.repo);
    card.classList.toggle('locked', on);
    card.querySelector('.lock em').textContent = T.locked();
    card.setAttribute('aria-disabled', on);
    card.tabIndex = on ? -1 : 0;
  });
  $('#found-n').textContent = found.size;
  $('#found-bar').style.width = (found.size / TOTAL * 100) + '%';
}
function unlock(card, announce = true) {
  if (found.has(card.dataset.repo)) return;
  found.add(card.dataset.repo);
  localStorage.setItem(STORE, JSON.stringify([...found]));
  card.classList.add('unlocking');
  setTimeout(() => card.classList.remove('unlocking'), 1200);
  paintLocks();
  if (announce) showPanel(card);
  if (found.size === TOTAL) toast(T.allFound());
}
// stop clicks on locked cards
cards.forEach(c => c.addEventListener('click', e => { if (c.classList.contains('locked')) e.preventDefault(); }));

function showPanel(card) {
  const h = card.querySelector('h3').textContent;
  const tech = card.querySelector('.card-top span')?.textContent || '';
  const p = card.querySelector('.card-body p')?.textContent || '';
  const href = card.getAttribute('href');
  $('#mp-card').innerHTML = `
    <p class="mono mp-tag">✓ ${T.unlocked()}</p>
    <h4>${h}</h4>
    <p class="mono mp-tech">${tech}</p>
    <p class="mp-desc">${p}</p>
    ${href ? `<a class="mono mp-open" href="${href}" target="_blank" rel="noopener">${T.open()}</a>` : ''}`;
  const el = $('#mp-card'); el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
}
function showExit() {
  $('#mp-card').innerHTML = `
    <p class="mono mp-tag exit">⇥ EXIT</p>
    <h4>${T.exit()}</h4>
    <p class="mp-desc">${found.size}/${TOTAL} ${fr() ? 'projets trouvés.' : 'projects found.'}</p>
    <a class="mono mp-open" href="mailto:aidiny2000@gmail.com">${T.exitBtn()}</a>`;
}

let toastT;
function toast(msg) {
  const t = $('#maze-toast'); t.textContent = msg; t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 1600);
}

/* ---------- movement ---------- */
const ANG = { up: -Math.PI / 2, right: 0, down: Math.PI / 2, left: Math.PI };
function step(dir) {
  const [dx, dy, b] = DIRS[dir];
  car.ta = ANG[dir];
  if (M.walls[M.idx(car.c, car.r)] & b) { bump = 1; return false; }
  car.c += dx; car.r += dy;
  if (reduced) { car.x = car.c; car.y = car.r; }
  arrive();
  return true;
}
let bump = 0;
function arrive() {
  const b = M.beacons.find(b => b.c === car.c && b.r === car.r);
  if (b && !found.has(b.card.dataset.repo)) { unlock(b.card); burst(b.c, b.r); }
  else if (b) showPanel(b.card);
  if (car.c === M.exit.c && car.r === M.exit.r && !exitShown) { exitShown = true; showExit(); burst(car.c, car.r, '#3ef08a'); }
}
let lastStep = 0;
function pump(now) {
  if (queue.length && now - lastStep > (reduced ? 0 : 85)) { lastStep = now; if (!step(queue.shift())) queue = []; }
}

/* ---------- particles ---------- */
const parts = [];
function burst(c, r, col = '#ff5a1f') {
  if (reduced) return;
  for (let i = 0; i < 26; i++) { const a = Math.random() * Math.PI * 2, s = .02 + Math.random() * .06; parts.push({ x: c + .5, y: r + .5, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, col }); }
}

/* ---------- render ---------- */
let cs = 40, dpr = 1, W0 = 0, H0 = 0;
function resize() {
  dpr = Math.min(devicePixelRatio || 1, 2);
  const w = stage.clientWidth;
  cs = Math.floor(w / M.cols);
  W0 = cs * M.cols; H0 = cs * M.rows;
  canvas.width = W0 * dpr; canvas.height = H0 * dpr;
  canvas.style.width = W0 + 'px'; canvas.style.height = H0 + 'px';
}
const css = n => getComputedStyle(document.body).getPropertyValue(n).trim();

function draw(now) {
  pump(now);
  const k = reduced ? 1 : .28;
  car.x += (car.c - car.x) * k; car.y += (car.r - car.y) * k;
  let da = car.ta - car.a; da = Math.atan2(Math.sin(da), Math.cos(da)); car.a += da * (reduced ? 1 : .3);
  bump *= .85;

  const hot = css('--hot') || '#ff5a1f', cool = css('--cool') || '#5ee6ff';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W0, H0);
  const { cols, rows, walls, idx, seen } = M;
  const RAD = 2.6;
  const reveal = !playing;           // before choosing, show the whole maze faintly
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const i = idx(c, r);
    const d = Math.hypot(c - car.x, r - car.y);
    const lit = Math.max(0, 1 - d / RAD);
    if (lit > .05) seen[i] = Math.max(seen[i], .28);
    const a = reveal ? .16 : Math.max(lit, seen[i]);
    if (a <= .01) continue;
    const x = c * cs, y = r * cs;
    ctx.fillStyle = `rgba(255,255,255,${a * .03})`; ctx.fillRect(x, y, cs, cs);
    ctx.strokeStyle = `rgba(236,235,230,${a * .85})`; ctx.lineWidth = Math.max(1.5, cs * .06); ctx.lineCap = 'round';
    ctx.beginPath();
    const w = walls[i];
    if (w & N) { ctx.moveTo(x, y); ctx.lineTo(x + cs, y); }
    if (w & W) { ctx.moveTo(x, y); ctx.lineTo(x, y + cs); }
    if (r === rows - 1 && w & S) { ctx.moveTo(x, y + cs); ctx.lineTo(x + cs, y + cs); }
    if (c === cols - 1 && w & E) { ctx.moveTo(x + cs, y); ctx.lineTo(x + cs, y + cs); }
    ctx.stroke();
  }
  // headlight cone
  if (playing) {
    const cx = (car.x + .5) * cs, cy = (car.y + .5) * cs;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, cs * 3);
    g.addColorStop(0, 'rgba(255,220,170,.18)'); g.addColorStop(1, 'rgba(255,220,170,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, cs * 3, car.a - .55, car.a + .55); ctx.closePath(); ctx.fill();
  }
  // beacons: always faintly visible through the fog so there's a goal
  const t = now / 1000;
  for (const b of M.beacons) {
    const got = found.has(b.card.dataset.repo);
    const x = (b.c + .5) * cs, y = (b.r + .5) * cs;
    const pulse = reduced ? .5 : (Math.sin(t * 3 + b.c) + 1) / 2;
    ctx.fillStyle = got ? 'rgba(62,240,138,.35)' : hot;
    ctx.globalAlpha = got ? 1 : .55 + pulse * .45;
    ctx.beginPath(); ctx.arc(x, y, cs * (got ? .12 : .15), 0, 7); ctx.fill();
    if (!got) { ctx.globalAlpha = (1 - pulse) * .5; ctx.strokeStyle = hot; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x, y, cs * (.18 + pulse * .22), 0, 7); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  // exit
  { const x = M.exit.c * cs, y = M.exit.r * cs, p = cs * .22;
    ctx.strokeStyle = '#3ef08a'; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.strokeRect(x + p, y + p, cs - 2 * p, cs - 2 * p); ctx.setLineDash([]);
    ctx.fillStyle = '#3ef08a'; ctx.font = `600 ${Math.max(8, cs * .2)}px Geist Mono, monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('EXIT', x + cs / 2, y + cs / 2); }
  // particles
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i]; p.x += p.vx; p.y += p.vy; p.vx *= .94; p.vy *= .94; p.life -= .025;
    if (p.life <= 0) { parts.splice(i, 1); continue; }
    ctx.globalAlpha = p.life; ctx.fillStyle = p.col; ctx.fillRect(p.x * cs - 1.5, p.y * cs - 1.5, 3, 3);
  }
  ctx.globalAlpha = 1;
  // car
  if (playing) {
    const shake = bump * 3 * Math.sin(now / 20);
    ctx.save(); ctx.translate((car.x + .5) * cs + shake, (car.y + .5) * cs); ctx.rotate(car.a);
    const L = cs * .46, H = cs * .28;
    ctx.shadowColor = hot; ctx.shadowBlur = 14;
    ctx.fillStyle = hot; roundRect(-L / 2, -H / 2, L, H, H * .35); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(0,0,0,.55)'; roundRect(-L * .05, -H * .34, L * .26, H * .68, 2); ctx.fill(); // windshield
    ctx.fillStyle = '#fff6d8'; ctx.fillRect(L / 2 - 2, -H / 2 + 1, 2, 3); ctx.fillRect(L / 2 - 2, H / 2 - 4, 2, 3); // headlights
    ctx.restore();
  }
  requestAnimationFrame(draw);
}
function roundRect(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h); }

/* ---------- input ---------- */
const KEYMAP = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right', W: 'up', S: 'down', A: 'left', D: 'right' };
canvas.addEventListener('keydown', e => {
  const d = KEYMAP[e.key]; if (!d || !playing) return;
  e.preventDefault(); e.stopPropagation(); queue = []; step(d);
});
function driveTo(x, y) {
  const r = canvas.getBoundingClientRect();
  const c = Math.floor((x - r.left) / cs), rr = Math.floor((y - r.top) / cs);
  if (c < 0 || rr < 0 || c >= M.cols || rr >= M.rows) return;
  queue = path({ c: car.c, r: car.r }, { c, r: rr });
}
canvas.addEventListener('pointerdown', e => {
  if (!playing || e.pointerType === 'touch') return;
  canvas.focus({ preventScroll: true });
  driveTo(e.clientX, e.clientY);
});
// swipe on touch
let sx = 0, sy = 0;
canvas.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
canvas.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
  if (!playing) return;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 30) { driveTo(sx, sy); return; } // a tap = auto-drive
  queue = [];
  const d = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
  // slide until the next junction, like a car on a road
  let n = 0; while (n++ < 20 && step(d)) { const w = M.walls[M.idx(car.c, car.r)]; const open = 4 - [N, E, S, W].filter(b => w & b).length; if (open > 2) break; }
});
$$('.dpad button').forEach(b => b.addEventListener('click', () => { if (playing) { queue = []; step(b.dataset.d); } }));

function start() {
  playing = true; intro.classList.add('gone'); stage.classList.add('playing');
  canvas.focus({ preventScroll: true });
  toast(fr() ? 'phares allumés' : 'headlights on');
}
function unlockAll() { cards.forEach(c => unlock(c, false)); toast(T.allFound()); document.getElementById('garage').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }); }
$('#maze-go').addEventListener('click', start);
$('#maze-skip').addEventListener('click', () => { intro.classList.add('gone'); unlockAll(); start(); });
$('#maze-skip2').addEventListener('click', unlockAll);
$('#maze-reset').addEventListener('click', () => {
  seed = Math.floor(Math.random() * 1e9); localStorage.setItem('maze-seed', seed);
  generate(seed); resetCar(); resize();
  $('#mp-card').innerHTML = `<p class="mono mp-empty">${fr() ? 'Nouveau labyrinthe. Les projets trouvés restent débloqués.' : 'New maze. Projects you found stay unlocked.'}</p>`;
  if (!playing) start(); else canvas.focus({ preventScroll: true });
});
new MutationObserver(paintLocks).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

/* ---------- boot ---------- */
generate(seed); resetCar(); resize(); paintLocks();
let rw = stage.clientWidth;
new ResizeObserver(() => {
  if (Math.abs(stage.clientWidth - rw) < 2) return;
  const wasNarrow = rw < 620; rw = stage.clientWidth;
  if ((rw < 620) !== wasNarrow) { generate(seed); resetCar(); }
  resize();
}).observe(stage);
requestAnimationFrame(draw);
