// Project reels: a vertical feed of projects, each a horizontal story of slides.
// Swipe up = next project, tap the sides / swipe sideways = go deeper. Autoplays like stories.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const L = x => (x && typeof x === 'object') ? (x[document.documentElement.lang] || x.en) : x;
const SLIDE_MS = 7000;

/* =========================================================
   Content. Every fact here comes from the repo READMEs or the CV.
   ========================================================= */
const P = [
  {
    id: 'The-Last-Battery-', name: 'The Last Battery', url: 'https://github.com/AidinYaseri/The-Last-Battery-',
    g: 'radial-gradient(circle at 50% 10%, rgba(255,90,31,.28), transparent 55%)',
    tease: { en: 'a horror game where your phone is dying', fr: 'un jeu d’horreur où ton téléphone meurt' },
    related: ['TrackYourDrag', 'Webll-Final-Finance-Tracker'],
    slides: [
      { t: 'hook', k: { en: 'browser game · Three.js', fr: 'jeu web · Three.js' }, h: { en: 'You wake up in a forest. Your phone is at 5%.', fr: 'Tu te réveilles en forêt. Ton téléphone est à 5 %.' }, p: { en: 'Find your way home before it dies, and find out why you’ve been here before.', fr: 'Retrouve ton chemin avant qu’il meure, et découvre pourquoi tu es déjà venu ici.' } },
      { t: 'big', big: '0', unit: { en: 'asset files', fr: 'fichiers d’asset' }, p: { en: 'Geometry, textures, photos, sound effects, voices and music are all generated in code at runtime. The game ships with nothing else.', fr: 'Géométrie, textures, photos, effets sonores, voix et musique : tout est généré par le code à l’exécution.' } },
      { t: 'list', k: { en: 'the core mechanic', fr: 'la mécanique centrale' }, h: { en: 'Everything costs battery', fr: 'Tout coûte de la batterie' }, items: [['Check map', '0.2%'], ['GPS', '1% / 30 s'], ['Take photo', '1%'], ['Phone torch', '1% / 60 s'], ['Phone call', '1% / 10 s'], ['Send message', '2%']] },
      { t: 'list', k: { en: 'structure', fr: 'structure' }, h: { en: '5 levels, 4 endings', fr: '5 niveaux, 4 fins' }, items: [['01', 'The Forest'], ['02', 'The Town'], ['03', 'The Highway'], ['04', 'The Cabin'], ['05', 'The Truth'], [{ en: 'endings', fr: 'fins' }, { en: 'Escape · Battery Death · Break the Loop · ???', fr: 'Évasion · Batterie morte · Briser la boucle · ???' }]] },
      { t: 'code', k: { en: 'under the hood', fr: 'sous le capot' }, h: { en: '470 KB of TypeScript', fr: '470 Ko de TypeScript' }, code: `<span class="h">src/</span>
  core/        <span class="k">loop, state, input, scheduler</span>
  player/      <span class="k">first-person camera, flashlight</span>
  phone/       <span class="k">battery, maps, camera, calls</span>
  audio/       <span class="k">procedural synth + 3D WebAudio</span>
  world/       <span class="k">props, forests, photo generation</span>
  story/       <span class="k">clues, dialogue, endings</span>
  save/        <span class="k">localStorage checkpoints</span>` },
    ],
  },
  {
    id: 'TrackYourDrag', name: 'Tracky', url: 'https://github.com/AidinYaseri/TrackYourDrag',
    g: 'radial-gradient(circle at 70% 15%, rgba(94,230,255,.22), transparent 55%)',
    tease: { en: 'an iPhone app that times your 0–100', fr: 'une appli iPhone qui chronomètre ton 0–100' },
    related: ['Obd_project', 'The-Last-Battery-'],
    slides: [
      { t: 'hook', k: { en: 'native iOS · Swift', fr: 'iOS natif · Swift' }, h: { en: 'Measure your drive.', fr: 'Mesure ta conduite.' }, p: { en: 'A performance tracker for car enthusiasts, built in SwiftUI.', fr: 'Un outil de performance pour passionnés d’auto, en SwiftUI.' } },
      { t: 'big', big: '4', unit: { en: 'sensors fused', fr: 'capteurs fusionnés' }, p: { en: 'GPS, accelerometer, gyroscope and barometer work together to measure speed, G-force and elevation.', fr: 'GPS, accéléromètre, gyroscope et baromètre combinés pour mesurer vitesse, forces G et altitude.' } },
      { t: 'list', k: { en: 'what it times', fr: 'ce qu’il chronomètre' }, h: { en: 'Pick a run', fr: 'Choisis ta course' }, items: [['0–100 km/h', '✓'], ['0–60 mph', '✓'], ['60–130 mph', '✓'], ['1/8 · 1/4 · 1/2 mile', '✓'], [{ en: 'trap speed', fr: 'vitesse de sortie' }, '✓'], [{ en: 'lateral + braking G', fr: 'G latéral + freinage' }, '✓']] },
      { t: 'text', k: { en: 'design decision', fr: 'choix de design' }, h: { en: 'Hands off the phone.', fr: 'Les mains loin du téléphone.' }, p: { en: 'You arm it once. Launch and finish are detected automatically, so nothing has to be touched while the car is moving.', fr: 'Tu l’armes une fois. Le départ et l’arrivée sont détectés automatiquement : rien à toucher en roulant.' } },
      { t: 'chips', k: 'stack', h: { en: 'Apple frameworks', fr: 'Frameworks Apple' }, chips: ['Swift 5', 'SwiftUI', 'SwiftData', 'Core Location', 'Core Motion', 'MapKit', 'Swift Charts', 'iOS 17+'] },
    ],
  },
  {
    id: 'Team-5-Web-Programming', name: 'Animal Adoption', url: 'https://github.com/AidinYaseri/Team-5-Web-Programming',
    g: 'radial-gradient(circle at 30% 15%, rgba(155,107,223,.25), transparent 55%)',
    tease: { en: 'a full .NET 10 stack with real auth', fr: 'une pile .NET 10 complète avec vraie auth' },
    related: ['Webll-Final-Finance-Tracker', 'Sales_map_WPA'],
    slides: [
      { t: 'hook', k: { en: 'team project · .NET 10', fr: 'projet d’équipe · .NET 10' }, h: { en: 'An adoption platform, built like production.', fr: 'Une plateforme d’adoption, bâtie comme en production.' }, p: { en: 'ASP.NET Core API, Blazor Server client, SQL Server.', fr: 'API ASP.NET Core, client Blazor Server, SQL Server.' } },
      { t: 'flow', k: { en: 'architecture', fr: 'architecture' }, h: { en: 'Request path', fr: 'Parcours d’une requête' }, steps: ['Browser', 'Blazor Server client', 'Keycloak (OIDC + PKCE)', 'REST API + JWT policies', 'Domain rules', 'EF Core → SQL Server'] },
      { t: 'text', k: { en: 'the rule we kept', fr: 'la règle qu’on a gardée' }, h: { en: 'The client never touches the database.', fr: 'Le client ne touche jamais la base de données.' }, p: { en: 'The Blazor app references none of the backend projects. It only talks to the API over HTTP with a bearer token.', fr: 'L’app Blazor ne référence aucun projet backend. Elle parle seulement à l’API en HTTP avec un jeton.' } },
      { t: 'chips', k: { en: 'tested with', fr: 'testé avec' }, h: { en: 'Unit + API integration tests', fr: 'Tests unitaires + intégration API' }, chips: ['xUnit', 'EF Core migrations', 'scope policies', 'staff role', 'Mermaid docs'] },
    ],
  },
  {
    id: 'Obd_project', name: 'CarSync', url: 'https://github.com/AidinYaseri/Obd_project',
    g: 'radial-gradient(circle at 40% 10%, rgba(255,179,71,.25), transparent 55%)',
    tease: { en: 'your check-engine light, translated', fr: 'ton voyant moteur, traduit' },
    related: ['TrackYourDrag', 'campus-parking'],
    slides: [
      { t: 'hook', k: { en: 'Python · OBD-II', fr: 'Python · OBD-II' }, h: { en: 'Your check-engine light, in plain English.', fr: 'Ton voyant moteur, en français clair.' }, p: { en: 'It plugs into the car and reads the trouble codes straight from the engine computer.', fr: 'Ça se branche à la voiture et lit les codes d’erreur directement dans l’ordinateur du moteur.' } },
      { t: 'code', k: { en: 'raw → readable', fr: 'brut → lisible' }, h: { en: 'What it does', fr: 'Ce que ça fait' }, code: `<span class="h">P0301</span>  → <span class="k">cylinder 1 misfire</span>
<span class="h">P0171</span>  → <span class="k">system too lean, bank 1</span>
<span class="h">P0000</span>  → <span class="k">no faults found ✓</span>` },
      { t: 'text', k: { en: 'proof', fr: 'preuve' }, h: { en: 'Tested on real cars.', fr: 'Testé sur de vraies voitures.' }, p: { en: 'Not only in a classroom. Then packaged as a standalone desktop app (PyInstaller).', fr: 'Pas seulement en classe. Puis empaqueté en appli de bureau autonome (PyInstaller).' } },
    ],
  },
  {
    id: 'Webll-Final-Finance-Tracker', name: { en: 'Finance Tracker', fr: 'Suivi financier' }, url: 'https://github.com/AidinYaseri/Webll-Final-Finance-Tracker',
    g: 'radial-gradient(circle at 60% 10%, rgba(62,240,138,.18), transparent 55%)',
    tease: { en: 'full-stack money tracking, in Docker', fr: 'suivi d’argent full-stack, dans Docker' },
    related: ['Team-5-Web-Programming', 'Soccer-Score-keeper'],
    slides: [
      { t: 'hook', k: 'TypeScript · Docker', h: { en: 'Where did my money go?', fr: 'Où est passé mon argent?' }, p: { en: 'Income and expense tracking for students, with categories and a dashboard.', fr: 'Suivi des revenus et dépenses pour étudiants, avec catégories et tableau de bord.' } },
      { t: 'flow', k: { en: 'data model', fr: 'modèle de données' }, h: { en: 'Three tables', fr: 'Trois tables' }, steps: ['USERS', 'has many → TRANSACTIONS', 'classified by → CATEGORIES'] },
      { t: 'code', k: 'REST API', h: { en: 'Routes', fr: 'Routes' }, code: `<span class="h">POST</span> /api/auth/register  <span class="k">201</span>
<span class="h">POST</span> /api/auth/login     <span class="k">200</span>
<span class="h">GET </span> /api/transactions
<span class="h">POST</span> /api/transactions
<span class="h">PUT </span> /api/transactions/:id
<span class="h">DEL </span> /api/transactions/:id` },
    ],
  },
  {
    id: 'campus-parking', name: { en: 'Campus Parking', fr: 'Stationnement du campus' }, url: null,
    g: 'radial-gradient(circle at 50% 10%, rgba(62,240,138,.2), transparent 55%)',
    tease: { en: 'built in one hackathon', fr: 'bâti en un hackathon' },
    related: ['Sales_map_WPA', 'Obd_project'],
    slides: [
      { t: 'hook', k: { en: 'hackathon · team of 4', fr: 'hackathon · équipe de 4' }, h: { en: 'Which spots are free, right now?', fr: 'Quelles places sont libres, là?' }, p: { en: 'A live map of open parking on campus.', fr: 'Une carte en direct des places libres sur le campus.' } },
      { t: 'text', k: { en: 'my part', fr: 'mon rôle' }, h: { en: 'Location tracking + the phone UI.', fr: 'Suivi de position + l’interface mobile.' }, p: { en: 'Then we put it in front of other students at the event and reworked it from their feedback.', fr: 'Puis on l’a montré aux autres étudiants sur place et on l’a retravaillé selon leurs commentaires.' } },
    ],
  },
  {
    id: 'Soccer-Score-keeper', name: 'Score Keeper', url: 'https://aidinyaseri.github.io/Soccer-Score-keeper/',
    g: 'radial-gradient(circle at 50% 10%, rgba(255,90,31,.2), transparent 55%)',
    tease: { en: 'live soccer scores you can open right now', fr: 'des scores de soccer en direct, ouvrables maintenant' },
    related: ['Webll-Final-Finance-Tracker', 'The-Last-Battery-'],
    slides: [
      { t: 'hook', k: { en: 'JavaScript · live site', fr: 'JavaScript · site en ligne' }, h: { en: 'Every score, on a calendar.', fr: 'Chaque score, sur un calendrier.' }, p: { en: 'Current and past soccer games, fed by API-Football.', fr: 'Matchs actuels et passés, alimentés par API-Football.' } },
      { t: 'text', k: { en: 'process', fr: 'démarche' }, h: { en: 'Figma first, code second.', fr: 'Figma d’abord, le code ensuite.' }, p: { en: 'Designed the whole thing before writing a line. It’s live — tap open.', fr: 'Tout conçu avant d’écrire une ligne. C’est en ligne — touche ouvrir.' } },
    ],
  },
  {
    id: 'Sales_map_WPA', name: 'Sales Map', url: 'https://github.com/AidinYaseri/Sales_map_WPA',
    g: 'radial-gradient(circle at 50% 10%, rgba(94,230,255,.2), transparent 55%)',
    tease: { en: 'sales territory on a map', fr: 'un territoire de ventes sur une carte' },
    related: ['campus-parking', 'Team-5-Web-Programming'],
    slides: [
      { t: 'hook', k: 'JavaScript · Vite', h: { en: 'Sales, plotted on a map.', fr: 'Les ventes, sur une carte.' }, p: { en: 'A map-based web app for tracking a sales territory.', fr: 'Une appli web cartographique pour suivre un territoire de ventes.' } },
    ],
  },
];
const byId = Object.fromEntries(P.map(p => [p.id, p]));
P.forEach(p => p.slides.push({ t: 'end' })); // every project ends on a "go deeper" slide

/* =========================================================
   Render
   ========================================================= */
const feed = $('#feed'), phone = $('#reel-phone'), bars = $('#bars');
const TOTAL = P.reduce((n, p) => n + p.slides.length, 0);
$('#rh-total').textContent = TOTAL;
const artFor = id => $(`#garage [data-repo="${CSS.escape(id)}"] .card-art`)?.outerHTML || '';

function slideHTML(p, s, i) {
  const k = s.k ? `<p class="s-k">${L(s.k)}</p>` : '';
  switch (s.t) {
    case 'hook': return `${artFor(p.id) ? `<div class="s-art">${artFor(p.id)}</div>` : ''}${k}<h3>${L(s.h)}</h3><p>${L(s.p)}</p>`;
    case 'big': return `<div class="s-big">${s.big}<small> ${L(s.unit)}</small></div><p>${L(s.p)}</p>`;
    case 'list': return `${k}<h3>${L(s.h)}</h3><ul class="s-list">${s.items.map(([a, b]) => `<li>${L(a)}<b>${L(b)}</b></li>`).join('')}</ul>`;
    case 'code': return `${k}<h3>${L(s.h)}</h3><pre class="s-code">${s.code}</pre>`;
    case 'flow': return `${k}<h3>${L(s.h)}</h3><div class="s-flow">${s.steps.map(x => `<span>${x}</span>`).join('<i></i>')}</div>`;
    case 'chips': return `${k}<h3>${L(s.h)}</h3><div class="s-chips">${s.chips.map(c => `<span>${c}</span>`).join('')}</div>`;
    case 'text': return `${k}<h3>${L(s.h)}</h3><p>${L(s.p)}</p>`;
    case 'end': {
      const fr = document.documentElement.lang === 'fr';
      const rel = p.related.map(id => byId[id]).filter(Boolean);
      return `<p class="s-k">${fr ? 'plus creux dans le terrier' : 'further down the rabbit hole'}</p>
        <h3>${fr ? 'Si t’as aimé ça…' : 'If you liked that…'}</h3>
        <div class="s-related">${rel.map(r => `<button data-jump="${r.id}"><span><b>${L(r.name)}</b><small>${L(r.tease)}</small></span><em>→</em></button>`).join('')}</div>
        ${p.url ? `<a class="s-cta" href="${p.url}" target="_blank" rel="noopener">${fr ? 'voir' : 'see'} ${L(p.name)} ↗</a>` : ''}`;
    }
  }
  return '';
}
function render() {
  const keep = cur ? { r: cur.r, s: cur.s } : null;
  feed.innerHTML = P.map((p, r) => `<div class="row" data-r="${r}">${p.slides.map((s, i) =>
    `<section class="slide ${s.t === 'end' ? 'end' : ''}" data-r="${r}" data-s="${i}" style="--g:${p.g}">${slideHTML(p, s, i)}</section>`).join('')}</div>`).join('') +
    `<div class="row" data-r="${P.length}"><section class="slide end" data-r="${P.length}" data-s="0">${bottomHTML()}</section></div>`;
  renderUpNext();
  if (keep) { jump(keep.r, keep.s, false); paintChrome(); }
}
function bottomHTML() {
  const fr = document.documentElement.lang === 'fr';
  return `<p class="s-k">${fr ? 'le fond du terrier' : 'the bottom of the rabbit hole'}</p>
    <h3>${fr ? 'T’as tout vu. Prochaine étape : une entrevue?' : 'You’ve seen it all. Next step: an interview?'}</h3>
    <p>${fr ? 'Je cherche un stage en développement logiciel.' : 'I’m looking for a software development internship.'}</p>
    <a class="s-cta" href="mailto:aidiny2000@gmail.com">${fr ? 'écris-moi' : 'email me'} →</a>
    <div class="s-related"><button data-jump="${P[0].id}"><span><b>${fr ? 'Recommencer' : 'Start over'}</b><small>${fr ? 'retour en haut' : 'back to the top'}</small></span><em>↺</em></button></div>`;
}

/* =========================================================
   State: current slide, seen slides, likes
   ========================================================= */
let cur = null;                        // { r, s }
const seen = new Set();
const likes = JSON.parse(localStorage.getItem('reel-likes') || '{}');
let paused = false, inView = false, t0 = performance.now(), elapsed = 0;

const rowEl = r => feed.children[r];
const nSlides = r => rowEl(r)?.children.length || 1;

function setCur(r, s) {
  if (cur && cur.r === r && cur.s === s) return;
  cur = { r, s }; elapsed = 0; t0 = performance.now();
  if (r < P.length) {
    const key = r + ':' + s;
    if (!seen.has(key)) { seen.add(key); onSeen(); }
  }
  paintChrome();
}
function paintChrome() {
  const { r, s } = cur;
  const p = P[r];
  bars.innerHTML = Array.from({ length: nSlides(r) }, (_, i) => `<i class="${i < s ? 'done' : ''}"><b></b></i>`).join('');
  $('#rt-proj').textContent = p ? L(p.name) : (document.documentElement.lang === 'fr' ? 'fin' : 'the end');
  const open = $('#r-open');
  if (p?.url) { open.href = p.url; open.removeAttribute('aria-disabled'); } else { open.removeAttribute('href'); open.setAttribute('aria-disabled', 'true'); }
  const id = p?.id;
  $('#r-like').classList.toggle('on', !!(id && likes[id]));
  $('#r-like-n').textContent = id && likes[id] ? '1' : '0';
  $$('#upnext li').forEach((li, i) => li.classList.toggle('cur', i === r));
}

/* scroll -> current */
let scrollRAF;
function readScroll() {
  cancelAnimationFrame(scrollRAF);
  scrollRAF = requestAnimationFrame(() => {
    const r = Math.round(feed.scrollTop / feed.clientHeight);
    const row = rowEl(r); if (!row) return;
    const s = Math.round(row.scrollLeft / row.clientWidth);
    setCur(r, s);
    if (r > 0 || s > 0) $('#swipe-hint').classList.add('gone');
  });
}
feed.addEventListener('scroll', readScroll, { passive: true });
feed.addEventListener('scroll', e => { if (e.target.classList?.contains('row')) readScroll(); }, { passive: true, capture: true });

function jump(r, s = 0, smooth = !reduced) {
  r = Math.max(0, Math.min(r, feed.children.length - 1));
  const row = rowEl(r); s = Math.max(0, Math.min(s, row.children.length - 1));
  const b = smooth ? 'smooth' : 'instant';
  feed.scrollTo({ top: r * feed.clientHeight, behavior: b });
  row.scrollTo({ left: s * row.clientWidth, behavior: b });
  if (!smooth) setCur(r, s);
}
function next() {
  const { r, s } = cur;
  if (s < nSlides(r) - 1) jump(r, s + 1);
  else if (r < feed.children.length - 1) { rowEl(r + 1).scrollTo({ left: 0, behavior: 'instant' }); jump(r + 1, 0); }
}
function prev() {
  const { r, s } = cur;
  if (s > 0) jump(r, s - 1); else if (r > 0) jump(r - 1, 0);
}

/* =========================================================
   Autoplay + progress bars
   ========================================================= */
new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView) t0 = performance.now() - elapsed; }, { threshold: .6 }).observe(phone);
function tick(now) {
  const run = inView && !paused && !document.hidden && cur && cur.r < P.length;
  if (run) {
    elapsed = now - t0;
    const bar = bars.children[cur.s]?.firstElementChild;
    const isEnd = P[cur.r].slides[cur.s]?.t === 'end';
    const dur = isEnd ? SLIDE_MS * 1.6 : SLIDE_MS;
    if (bar) bar.style.width = Math.min(100, elapsed / dur * 100) + '%';
    if (elapsed >= dur) {
      // at the end of a project, autoplay drops into the first related one: the rabbit hole
      if (isEnd) { const rel = byId[P[cur.r].related[0]]; jumpTo(rel ? rel.id : null); }
      else next();
      elapsed = 0; t0 = now;
    }
  } else t0 = now - elapsed;
  requestAnimationFrame(tick);
}
function jumpTo(id) {
  const r = id ? P.findIndex(p => p.id === id) : cur.r + 1;
  if (r < 0) return;
  rowEl(r).scrollTo({ left: 0, behavior: 'instant' });
  jump(r, 0);
}

/* =========================================================
   Input: tap sides, hold to pause, double-tap like, keys, buttons
   ========================================================= */
let downT = 0, downX = 0, downY = 0, lastTap = 0, holdTimer;
feed.addEventListener('pointerdown', e => {
  if (e.target.closest('a, button')) return;
  downT = performance.now(); downX = e.clientX; downY = e.clientY;
  holdTimer = setTimeout(() => { paused = true; phone.classList.add('paused'); }, 220);
});
addEventListener('pointerup', e => {
  if (!downT) return;
  clearTimeout(holdTimer);
  const held = performance.now() - downT; downT = 0;
  if (held >= 220) { paused = false; phone.classList.remove('paused'); return; }
  if (Math.hypot(e.clientX - downX, e.clientY - downY) > 10) return; // it was a swipe
  const now = performance.now();
  const rect = phone.getBoundingClientRect(), x = (e.clientX - rect.left) / rect.width;
  if (now - lastTap < 300) { like(true, e.clientX - rect.left, e.clientY - rect.top); lastTap = 0; return; }
  lastTap = now;
  setTimeout(() => { if (lastTap === now) { x < .3 ? prev() : next(); } }, 260);
});
addEventListener('pointercancel', () => { clearTimeout(holdTimer); downT = 0; paused = false; phone.classList.remove('paused'); });
feed.addEventListener('click', e => {
  const j = e.target.closest('[data-jump]'); if (j) { e.preventDefault(); jumpTo(j.dataset.jump); }
});
feed.addEventListener('keydown', e => {
  const k = e.key;
  if (k === 'ArrowDown') { e.preventDefault(); if (cur.r < feed.children.length - 1) jumpTo(P[cur.r + 1]?.id ?? null); }
  else if (k === 'ArrowUp') { e.preventDefault(); if (cur.r > 0) { rowEl(cur.r - 1).scrollTo({ left: 0, behavior: 'instant' }); jump(cur.r - 1, 0); } }
  else if (k === 'ArrowRight') { e.preventDefault(); next(); }
  else if (k === 'ArrowLeft') { e.preventDefault(); prev(); }
  else if (k === ' ') { e.preventDefault(); paused = !paused; phone.classList.toggle('paused', paused); }
  else if (k.toLowerCase() === 'l') like();
  else return;
  e.stopPropagation();
});
// desktop wheel: one notch = one project (otherwise trackpads fly through everything)
let wheelLock = 0;
feed.addEventListener('wheel', e => {
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
  const atTop = cur.r === 0 && e.deltaY < 0, atEnd = cur.r === feed.children.length - 1 && e.deltaY > 0;
  if (atTop || atEnd) return; // let the page scroll on
  e.preventDefault();
  if (performance.now() < wheelLock || Math.abs(e.deltaY) < 8) return;
  wheelLock = performance.now() + 650;
  if (e.deltaY > 0) jumpTo(P[cur.r + 1]?.id ?? null); else { rowEl(cur.r - 1).scrollTo({ left: 0, behavior: 'instant' }); jump(cur.r - 1, 0); }
}, { passive: false });

function like(force, x, y) {
  const id = P[cur.r]?.id; if (!id) return;
  likes[id] = force ? true : !likes[id];
  localStorage.setItem('reel-likes', JSON.stringify(likes));
  paintChrome();
  if (likes[id] && !reduced) {
    const h = document.createElement('div'); h.className = 'heart'; h.textContent = '♥';
    h.style.left = (x ?? phone.clientWidth / 2) + 'px'; h.style.top = (y ?? phone.clientHeight / 2) + 'px';
    phone.appendChild(h); setTimeout(() => h.remove(), 900);
  }
}
$('#r-like').addEventListener('click', () => like());
$('#r-deeper').addEventListener('click', next);
$('#r-share').addEventListener('click', async () => {
  const url = `${location.origin}${location.pathname}#p=${encodeURIComponent(P[cur.r]?.id || '')}`;
  try { await navigator.clipboard.writeText(url); toast(document.documentElement.lang === 'fr' ? 'lien copié' : 'link copied'); } catch { toast(url); }
});

/* =========================================================
   Rabbit-hole meter: depth, time, badges
   ========================================================= */
const BADGES = [
  [3, { en: '🕳️ <b>3</b> deep: it begins', fr: '🕳️ <b>3</b> : ça commence' }],
  [8, { en: '🐇 <b>8</b> deep: officially in the hole', fr: '🐇 <b>8</b> : officiellement dans le terrier' }],
  [16, { en: '🔦 <b>16</b> deep: bring a flashlight', fr: '🔦 <b>16</b> : apporte une lampe' }],
  [24, { en: '⚙️ <b>24</b> deep: you’ve read more code than most recruiters', fr: '⚙️ <b>24</b> : plus de code que la plupart des recruteurs' }],
  [TOTAL, { en: '🏁 <b>all of it</b>: okay, let’s talk', fr: '🏁 <b>tout</b> : bon, parlons-nous' }],
];
const earned = new Set();
function onSeen() {
  const n = seen.size;
  $('#rh-seen').textContent = n;
  $('#rh-fill').style.height = (n / TOTAL * 100) + '%';
  for (const [at, txt] of BADGES) if (n >= at && !earned.has(at)) {
    earned.add(at);
    const li = document.createElement('li'); li.innerHTML = L(txt); li.dataset.at = at;
    $('#rh-badges').prepend(li);
    toast(li.textContent);
  }
  renderUpNextProgress();
}
let watched = 0, lastT = performance.now();
setInterval(() => {
  const now = performance.now();
  if (inView && !document.hidden) watched += now - lastT;
  lastT = now;
  const s = Math.floor(watched / 1000);
  $('#rh-time').textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}, 500);

let toastT;
function toast(msg) { const t = $('#reel-toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2200); }

/* up next list */
function renderUpNext() {
  $('#upnext').innerHTML = P.map((p, i) => `<li data-i="${i}"><button><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${L(p.name)}</span><span class="p"><i></i></span></button></li>`).join('');
  $$('#upnext li').forEach(li => li.querySelector('button').addEventListener('click', () => jumpTo(P[+li.dataset.i].id)));
  renderUpNextProgress();
}
function renderUpNextProgress() {
  $$('#upnext li').forEach(li => {
    const i = +li.dataset.i, total = P[i].slides.length;
    let n = 0; for (let s = 0; s < total; s++) if (seen.has(i + ':' + s)) n++;
    li.querySelector('.p i').style.width = (n / total * 100) + '%';
    li.classList.toggle('all', n === total);
  });
}

/* =========================================================
   Reels / grid toggle
   ========================================================= */
$$('.view-toggle button').forEach(b => b.addEventListener('click', () => {
  const grid = b.dataset.view === 'grid';
  $$('.view-toggle button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
  $('#reels').hidden = grid; $('#garage').hidden = !grid;
  if (!grid) requestAnimationFrame(() => jump(cur.r, cur.s, false));
}));

/* =========================================================
   Boot
   ========================================================= */
render();
const hashId = decodeURIComponent((location.hash.match(/#p=(.+)/) || [])[1] || '');
const startR = Math.max(0, P.findIndex(p => p.id === hashId));
requestAnimationFrame(() => { jump(startR, 0, false); if (hashId && byId[hashId]) document.getElementById('work').scrollIntoView(); });
new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
addEventListener('resize', () => cur && jump(cur.r, cur.s, false));
requestAnimationFrame(tick);
