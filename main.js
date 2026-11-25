// Aidin Yaseri — portfolio. No framework, no build step.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const GH_USER = 'AidinYaseri';

/* =========================================================
   i18n (EN / FR)
   ========================================================= */
const FR = {
  'nav.about': 'profil', 'nav.work': 'projets', 'nav.log': 'parcours', 'nav.shell': 'terminal', 'nav.contact': 'contact',
  'hero.status': 'disponible pour un stage',
  'hero.lede': 'Étudiant en informatique à Montréal. Je crée des logiciels qui touchent au monde réel — <em class="serif">diagnostic automobile</em>, <em class="serif">télémétrie GPS</em>, applis full-stack et jeux web livrés sans aucun fichier d’asset.',
  'hero.scroll': 'défile pour accélérer',
  'about.title': 'qui suis-je',
  'about.big': 'J’aime partir d’une idée, frapper le mur technique et le franchir jusqu’à ce que ce soit <em class="serif">vraiment utile</em>. La moitié de mes projets se branchent dans une voiture.',
  'about.p1': 'Je fais mon D.E.C. en informatique au Collège John Abbott : web, mobile, bases de données et diagnostic automobile.',
  'about.p2': 'À côté, j’ai fondé <strong>Apex Esthétique Auto</strong>, une entreprise mobile de détaillage automobile. Tarifs, rendez-vous, facturation, image de marque, site web et publicités : tout passe par moi — de vraies échéances, de vrais clients.',
  'stat.repos': 'dépôts publics', 'stat.clients': 'clients réguliers, an 1', 'stat.langs': 'langues, couramment', 'stat.assets': 'fichiers d’asset dans mon jeu 3D',
  'work.title': 'projets choisis', 'work.sub': '// survole les cartes. clique pour ouvrir le dépôt.',
  'p.battery.tag': 'retrouve ton chemin',
  'p.battery': 'Un jeu d’horreur à la première personne dans le navigateur. Cinq niveaux, quatre fins et un téléphone à 5 % que chaque action vide. Géométrie, textures, photos, voix et musique sont générées procéduralement à l’exécution — aucun fichier d’asset.',
  'p.tracky': 'Appli iOS native de mesure de performance. Fusionne GPS, accéléromètre, gyroscope et baromètre pour chronométrer le 0–100, le quart de mille et les forces G, avec départ et arrivée détectés automatiquement.',
  'p.adopt': 'Projet d’équipe : API ASP.NET Core en couches, client Blazor Server, connexion OIDC avec PKCE, EF Core sur SQL Server et tests d’intégration xUnit.',
  'p.obd': 'Se branche à une voiture, lit les codes d’erreur de l’ordinateur du moteur et transforme les données brutes en réponses claires. Testé sur de vraies voitures.',
  'p.fin.t': 'Suivi financier',
  'p.fin': 'Suivi des revenus et dépenses full-stack : authentification, catégories, API REST et tableau de bord. Conteneurisé.',
  'p.park.tag': 'Hackathon · équipe de 4', 'p.park.t': 'Stationnement du campus',
  'p.park': 'Carte en temps réel des places libres sur le campus. J’ai fait le suivi de localisation et l’interface mobile, puis je l’ai retravaillée avec les commentaires des étudiants.',
  'p.score': 'Scores de soccer en direct et passés, consultables par calendrier, alimentés par une API sportive. Conçu d’abord dans Figma.',
  'p.map': 'Une appli web cartographique pour suivre un territoire de ventes.',
  'log.title': 'parcours',
  'log.1.when': '2025 → auj.', 'log.1.role': 'Propriétaire / Fondateur',
  'log.1.body': 'Démarré une entreprise mobile de détaillage et atteint environ 30 clients réguliers la première année dans le Grand Montréal. Je gère tout : tarifs, rendez-vous, facturation, image de marque, site web et publicités.',
  'log.2.when': '2024 → auj.', 'log.2.role': 'D.E.C. en informatique',
  'log.2.body': 'Programmation web, développement d’applications, bases de données, programmation de jeux et sécurité, avec beaucoup de projets d’équipe.',
  'log.3.when': 'étés 2023 et 2024', 'log.3.role': 'Moniteur de camp de jour',
  'log.3.body': 'Animé des activités quotidiennes pour des groupes allant jusqu’à 30 enfants, au sein d’une équipe d’environ 25 moniteurs, en assurant la sécurité de tous.',
  'stack.title': '// fiche technique', 'stack.lang': 'langages', 'stack.web': 'web', 'stack.data': 'données', 'stack.tools': 'outils', 'stack.cert': 'certifs',
  'shell.title': 'essaie le terminal',
  'contact.pre': '// à la recherche d’un stage en développement logiciel',
  'contact.big': 'Construisons', 'contact.em': 'quelque chose.',
  'footer.built': 'fait main : shader WebGL, aucun framework',
};
const EN = {};
$$('[data-i18n]').forEach(el => { EN[el.dataset.i18n] = el.innerHTML; });
let lang = localStorage.getItem('lang') || (navigator.language?.startsWith('fr') ? 'fr' : 'en');

function applyLang(l) {
  lang = l; localStorage.setItem('lang', l);
  document.documentElement.lang = l;
  const dict = l === 'fr' ? FR : EN;
  $$('[data-i18n]').forEach(el => { const v = dict[el.dataset.i18n]; if (v) el.innerHTML = v; });
  $('#lang').innerHTML = l === 'fr' ? 'FR<b>/</b>EN' : 'EN<b>/</b>FR';
}
function toggleLang() {
  const next = lang === 'en' ? 'fr' : 'en';
  if (document.startViewTransition && !reduced) document.startViewTransition(() => applyLang(next));
  else applyLang(next);
}
$('#lang').addEventListener('click', toggleLang);
if (lang === 'fr') applyLang('fr');

/* =========================================================
   Boot: fake OBD-II handshake
   ========================================================= */
const BOOT = [
  ['> ATZ', ''], ['ELM327 v2.3', 'ok'], ['> ATSP0   protocol: auto', ''], ['SEARCHING...', ''],
  ['ISO 15765-4 CAN (11/500)', 'ok'], ['> 0100   supported PIDs', ''], ['ECU: aidin.yaseri // CS @ JAC', 'ok'],
  ['> 03     read stored DTCs', ''], ['P0000  no faults found', 'ok'], ['> RPM    idle 850', ''], ['ignition ▸ ready', 'hot'],
];
async function boot() {
  const log = $('#boot-log'), bar = $('.boot-bar span'), el = $('#boot');
  const seen = sessionStorage.getItem('booted');
  let skip = reduced || !!seen;
  const doSkip = () => { skip = true; };
  addEventListener('keydown', doSkip, { once: true });
  el.addEventListener('pointerdown', doSkip, { once: true });
  for (let i = 0; i < BOOT.length && !skip; i++) {
    const [t, c] = BOOT[i];
    log.innerHTML += (c ? `<span class="${c}">${t}</span>` : t) + '\n';
    bar.style.width = `${((i + 1) / BOOT.length) * 100}%`;
    await new Promise(r => setTimeout(r, 90 + Math.random() * 120));
  }
  sessionStorage.setItem('booted', '1');
  el.classList.add('done');
  document.body.classList.remove('booting');
  document.body.classList.add('hero-ready');
  $$('.hero .scramble').forEach((s, i) => setTimeout(() => scramble(s), 250 + i * 120));
  setTimeout(() => el.remove(), 1000);
}
document.body.classList.add('booting');
boot();

/* =========================================================
   Text scramble
   ========================================================= */
const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ΔΣλ';
function scramble(el, text = el.dataset.text || el.textContent) {
  if (reduced) { el.textContent = text; return; }
  let frame = 0;
  const q = [...text].map((ch, i) => ({ ch, start: Math.floor(Math.random() * 10), end: 10 + i * 3 + Math.floor(Math.random() * 10) }));
  cancelAnimationFrame(el._raf);
  const tick = () => {
    let out = '', done = 0;
    for (const p of q) {
      if (frame >= p.end) { out += p.ch; done++; }
      else if (frame >= p.start) out += `<span class="gl">${GLYPHS[(Math.random() * GLYPHS.length) | 0]}</span>`;
      else out += p.ch;
    }
    el.innerHTML = out;
    if (done < q.length) { frame++; el._raf = requestAnimationFrame(tick); }
  };
  tick();
}
$$('.hero .scramble').forEach(s => s.addEventListener('pointerenter', () => scramble(s)));

/* =========================================================
   WebGL background: domain-warped fbm, reacts to pointer + scroll velocity
   ========================================================= */
const pointer = { x: .5, y: .5, tx: .5, ty: .5 };
let scrollVel = 0, lastY = scrollY;
(function gl() {
  const c = $('#gl');
  const g = c.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' });
  if (!g) { c.style.background = 'radial-gradient(circle at 70% 30%, #1a0d07, #07080a 60%)'; return; }
  const vs = `attribute vec2 p; void main(){ gl_Position = vec4(p,0.,1.); }`;
  const fs = `
  precision highp float;
  uniform vec2 r; uniform float t; uniform vec2 m; uniform float s; uniform float v; uniform float red;
  float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float n(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
    return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }
  float fbm(vec2 p){ float a=.5, o=0.; mat2 R=mat2(.8,.6,-.6,.8); for(int i=0;i<5;i++){ o+=a*n(p); p=R*p*2.02; a*=.5; } return o; }
  void main(){
    vec2 uv = (gl_FragCoord.xy - .5*r) / r.y;
    vec2 mp = (m - .5) * vec2(r.x/r.y, 1.);
    float tt = t*.045 + s*.00025;
    vec2 q = vec2(fbm(uv*1.6 + tt), fbm(uv*1.6 + vec2(5.2,1.3) - tt));
    vec2 w = vec2(fbm(uv*1.6 + 3.*q + vec2(1.7,9.2) + .15*t*.1), fbm(uv*1.6 + 3.*q + vec2(8.3,2.8)));
    float f = fbm(uv*1.6 + 3.5*w + .4*(mp-uv)*exp(-2.*length(uv-mp)));
    // contour lines — like a topo map / heat trace
    float lines = smoothstep(.0, .06, abs(fract(f*7.) - .5) - .38 + .05*v);
    vec3 hot = mix(vec3(1.,.35,.12), vec3(1.,.12,.24), red);
    vec3 cool = mix(vec3(.37,.9,1.), vec3(1.,.6,.12), red);
    vec3 col = vec3(.027,.031,.039);
    col += hot * pow(f, 3.2) * .55;
    col += cool * pow(length(q), 6.) * .05;
    col += mix(cool, hot, f) * (1.-lines) * (.06 + .14*smoothstep(.6,0.,length(uv-mp)) + .08*v);
    col *= 1. - .55*length(uv*vec2(.7,1.));
    col *= mix(1., .5, smoothstep(0., r.y*1.2, s)); // calmer behind body text
    gl_FragColor = vec4(col, 1.);
  }`;
  const sh = (type, src) => { const x = g.createShader(type); g.shaderSource(x, src); g.compileShader(x); if (!g.getShaderParameter(x, g.COMPILE_STATUS)) console.warn(g.getShaderInfoLog(x)); return x; };
  const pr = g.createProgram();
  g.attachShader(pr, sh(g.VERTEX_SHADER, vs)); g.attachShader(pr, sh(g.FRAGMENT_SHADER, fs));
  g.linkProgram(pr); g.useProgram(pr);
  g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
  g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), g.STATIC_DRAW);
  const loc = g.getAttribLocation(pr, 'p'); g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
  const U = n => g.getUniformLocation(pr, n);
  const ur = U('r'), ut = U('t'), um = U('m'), us = U('s'), uv = U('v'), ured = U('red');
  const DPR = Math.min(devicePixelRatio, 1.5) * .6; // render under-res; the blur is part of the look
  const resize = () => { c.width = innerWidth * DPR; c.height = innerHeight * DPR; g.viewport(0, 0, c.width, c.height); };
  resize(); addEventListener('resize', resize);
  let redMix = 0, visible = true;
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) requestAnimationFrame(loop); });
  const t0 = performance.now();
  function loop(now) {
    pointer.x += (pointer.tx - pointer.x) * .05; pointer.y += (pointer.ty - pointer.y) * .05;
    redMix += ((document.body.classList.contains('redline') ? 1 : 0) - redMix) * .05;
    g.uniform2f(ur, c.width, c.height);
    g.uniform1f(ut, reduced ? 10 : (now - t0) / 1000);
    g.uniform2f(um, pointer.x, 1 - pointer.y);
    g.uniform1f(us, scrollY); g.uniform1f(uv, Math.min(scrollVel, 1)); g.uniform1f(ured, redMix);
    g.drawArrays(g.TRIANGLES, 0, 3);
    if (visible && !reduced) requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

/* =========================================================
   Cursor
   ========================================================= */
const cur = $('#cursor');
let cx = innerWidth / 2, cy = innerHeight / 2, kx = cx, ky = cy;
addEventListener('pointermove', e => {
  cx = e.clientX; cy = e.clientY;
  pointer.tx = cx / innerWidth; pointer.ty = cy / innerHeight;
});
if (finePointer) {
  (function follow() { kx += (cx - kx) * .22; ky += (cy - ky) * .22; cur.style.transform = `translate(${kx}px,${ky}px)`; requestAnimationFrame(follow); })();
  document.addEventListener('pointerover', e => cur.classList.toggle('big', !!e.target.closest('a, button, .contact-big')));
}

/* =========================================================
   Scroll: tachometer, velocity, active nav
   ========================================================= */
const tach = $('.tach'), rpm = $('#rpm');
// tick marks around the arc
(() => {
  const gt = $('.tach-ticks'), NS = 'http://www.w3.org/2000/svg';
  for (let i = 0; i <= 8; i++) {
    const a = (-135 + i * 270 / 8) * Math.PI / 180;
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', 60 + Math.sin(a) * 38); l.setAttribute('y1', 60 - Math.cos(a) * 38);
    l.setAttribute('x2', 60 + Math.sin(a) * 33); l.setAttribute('y2', 60 - Math.cos(a) * 33);
    gt.appendChild(l);
  }
})();
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? scrollY / max : 0;
  document.documentElement.style.setProperty('--p', p.toFixed(4));
  rpm.textContent = (0.85 + p * 7.15).toFixed(1);
  tach.classList.toggle('redline', p > .78);
  scrollVel = Math.min(1, scrollVel + Math.abs(scrollY - lastY) / 600);
  lastY = scrollY;
}
addEventListener('scroll', onScroll, { passive: true }); onScroll();
(function decay() { scrollVel *= .94; requestAnimationFrame(decay); })();

const navLinks = $$('.hud-nav a');
const navIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) navLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
$$('main > section[id]').forEach(s => navIO.observe(s));

// fallback reveal for browsers without scroll-driven animations + counters + tracky line
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in');
  e.target.querySelectorAll?.('.count').forEach(countUp);
  if (e.target.matches('.speedline')) e.target.classList.add('in');
  io.unobserve(e.target);
}), { threshold: .2 });
$$('.reveal, .stats, .speedline').forEach(el => io.observe(el));

function countUp(el) {
  const to = +el.dataset.to, suf = el.dataset.suffix || '';
  if (reduced || to === 0) { el.textContent = to + suf; return; }
  const t0 = performance.now(), dur = 1400;
  const step = now => { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 4); el.textContent = Math.round(to * e) + suf; if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}

/* =========================================================
   Clock
   ========================================================= */
const clock = $('#clock');
const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Toronto', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
setInterval(() => { clock.textContent = 'MTL ' + fmt.format(new Date()); }, 1000);
$('#year').textContent = new Date().getFullYear();

/* =========================================================
   Cards: tilt + spotlight
   ========================================================= */
if (finePointer && !reduced) $$('.card').forEach(card => {
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.style.setProperty('--mx', x * 100 + '%'); card.style.setProperty('--my', y * 100 + '%');
    card.style.setProperty('--ry', (x - .5) * 7 + 'deg'); card.style.setProperty('--rx', (.5 - y) * 7 + 'deg');
  });
  card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
});

// Tracky: fake run that re-times on hover
const trackyT = $('#tracky-t');
$('[data-repo="TrackYourDrag"]').addEventListener('pointerenter', () => {
  if (reduced) return;
  const target = (4.4 + Math.random() * .8), t0 = performance.now();
  const step = now => { const k = Math.min(1, (now - t0) / 1600); trackyT.textContent = (target * k).toFixed(2); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
});

/* =========================================================
   GitHub: language bars + live "last push" times
   ========================================================= */
const LANG_COLORS = { TypeScript: '#3178c6', JavaScript: '#f1e05a', 'C#': '#9b6bdf', Swift: '#F05138', Python: '#3572A5', CSS: '#663399', HTML: '#e34c26', TeX: '#3D6117', Dockerfile: '#384d54', Mermaid: '#ff3670' };
$$('.langbar').forEach(bar => {
  const langs = JSON.parse(bar.dataset.langs), total = Object.values(langs).reduce((a, b) => a + b, 0);
  const key = document.createElement('div'); key.className = 'langkey';
  for (const [k, v] of Object.entries(langs)) {
    const pct = v / total * 100; if (pct < 1) continue;
    const i = document.createElement('i'); i.style.width = pct + '%'; i.style.background = LANG_COLORS[k] || '#888'; bar.appendChild(i);
    const s = document.createElement('span'); s.style.setProperty('--c', LANG_COLORS[k] || '#888'); s.textContent = `${k} ${pct.toFixed(1)}%`; key.appendChild(s);
  }
  bar.after(key);
});

const rtf = (d) => {
  const days = Math.round((Date.now() - new Date(d)) / 864e5);
  if (days < 1) return 'today'; if (days < 30) return `${days}d ago`;
  const mo = Math.round(days / 30); return mo < 12 ? `${mo}mo ago` : `${Math.round(mo / 12)}y ago`;
};
let REPOS = [];
fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`)
  .then(r => r.ok ? r.json() : [])
  .then(repos => {
    REPOS = repos.filter(r => !r.fork);
    if (REPOS.length) { const rc = $('#repo-count'); rc.dataset.to = REPOS.length; rc.textContent = REPOS.length; }
    for (const r of REPOS) {
      const u = $(`[data-repo="${CSS.escape(r.name)}"] .updated`);
      if (u) u.textContent = '⟳ ' + rtf(r.pushed_at);
    }
  }).catch(() => {});

/* =========================================================
   Terminal
   ========================================================= */
const out = $('#term-out'), input = $('#term-input');
const hist = []; let hIdx = 0;
const esc = s => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const print = (html = '') => { out.insertAdjacentHTML('beforeend', html + '\n'); out.scrollTop = out.scrollHeight; };
const go = id => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });

const CMDS = {
  help: () => print(
`<span class="h">available commands</span>
  <span class="k">whoami</span>      who is this
  <span class="k">ls</span>          list projects
  <span class="k">open</span> &lt;n&gt;    open project n on GitHub
  <span class="k">repos</span>       live list from the GitHub API
  <span class="k">skills</span>      the stack
  <span class="k">contact</span>     how to reach me
  <span class="k">obd</span>         run a diagnostic scan
  <span class="k">lang</span>        switch EN / FR
  <span class="k">redline</span>     you'll see
  <span class="k">clear</span>       clear the screen`),
  whoami: () => print(`Aidin Yaseri — CS student @ John Abbott College, Montréal.
Founder of Apex Esthétique Auto. Fluent EN / FR.
Looking for a <span class="h">software development internship</span>.`),
  ls: () => PROJECTS.forEach((p, i) => print(`<span class="k">${i + 1}</span>  ${p.name.padEnd(18)} <span style="color:var(--mute)">${p.tech}</span>`)),
  open: n => { const p = PROJECTS[+n - 1]; if (!p) return print('usage: open &lt;1-' + PROJECTS.length + '&gt;'); print(`opening ${p.name}…`); window.open(p.url, '_blank', 'noopener'); },
  repos: async () => {
    print('<span style="color:var(--mute)">GET api.github.com/users/' + GH_USER + '/repos …</span>');
    if (!REPOS.length) { try { REPOS = (await (await fetch(`https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`)).json()).filter(r => !r.fork); } catch { return print('network error'); } }
    REPOS.forEach(r => print(`  ${esc(r.name).padEnd(30)} <span class="k">${(r.language || '—').padEnd(11)}</span> ${rtf(r.pushed_at)}`));
  },
  skills: () => print(`<span class="h">lang </span> C# Python TypeScript JavaScript Swift SQL Bash PowerShell
<span class="h">web  </span> React Blazor ASP.NET-Core Three.js Vite
<span class="h">data </span> SQL-Server PostgreSQL MySQL MongoDB EF-Core
<span class="h">tools</span> Git Docker Keycloak Arduino OBD-II`),
  contact: () => print(`mail     <a href="mailto:aidiny2000@gmail.com">aidiny2000@gmail.com</a>
github   <a href="https://github.com/AidinYaseri" target="_blank" rel="noopener">github.com/AidinYaseri</a>
linkedin <a href="https://www.linkedin.com/in/aidin-yaseri/" target="_blank" rel="noopener">linkedin.com/in/aidin-yaseri</a>`),
  obd: async () => {
    const steps = ['connecting to ECU', 'reading PIDs', 'checking DTCs', 'checking motivation'];
    for (const s of steps) { print(`  ${s}…`); await new Promise(r => setTimeout(r, 380)); }
    print(`<span class="k">✓ P0000</span> no faults. candidate is ready for an internship.`);
  },
  lang: () => { toggleLang(); print('lang → ' + lang); },
  redline: () => { toggleRedline(); print(document.body.classList.contains('redline') ? '<span class="h">⚠ redline engaged</span>' : 'back to idle'); },
  clear: () => { out.innerHTML = ''; },
  sudo: () => print('nice try.'),
  'rm': () => print('not on my portfolio.'),
};
const PROJECTS = [
  { name: 'The Last Battery', tech: 'Three.js / TS', url: 'https://github.com/AidinYaseri/The-Last-Battery-' },
  { name: 'Tracky', tech: 'Swift / SwiftUI', url: 'https://github.com/AidinYaseri/TrackYourDrag' },
  { name: 'Animal Adoption', tech: '.NET / Blazor', url: 'https://github.com/AidinYaseri/Team-5-Web-Programming' },
  { name: 'CarSync', tech: 'Python / OBD-II', url: 'https://github.com/AidinYaseri/Obd_project' },
  { name: 'Finance Tracker', tech: 'TypeScript', url: 'https://github.com/AidinYaseri/Webll-Final-Finance-Tracker' },
  { name: 'Score Keeper', tech: 'JavaScript', url: 'https://aidinyaseri.github.io/Soccer-Score-keeper/' },
  { name: 'Sales Map', tech: 'JavaScript / Vite', url: 'https://github.com/AidinYaseri/Sales_map_WPA' },
];
async function run(line) {
  const [cmd, ...args] = line.trim().split(/\s+/);
  print(`<span class="prompt">guest@aidin:~$</span> <span class="c">${esc(line)}</span>`);
  if (!cmd) return;
  const fn = CMDS[cmd.toLowerCase()];
  if (fn) await fn(...args); else print(`command not found: ${esc(cmd)} — try <span class="k">help</span>`);
}
print(`<span class="h">aidin-os</span> 1.0 · type <span class="k">help</span> to start`);
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') { const v = input.value; input.value = ''; if (v.trim()) { hist.push(v); hIdx = hist.length; } run(v); }
  else if (e.key === 'ArrowUp') { if (hIdx > 0) input.value = hist[--hIdx]; e.preventDefault(); }
  else if (e.key === 'ArrowDown') { input.value = hist[++hIdx] ?? ''; if (hIdx > hist.length) hIdx = hist.length; }
  else if (e.key === 'Tab') { e.preventDefault(); const m = Object.keys(CMDS).find(k => k.startsWith(input.value)); if (m) input.value = m; }
});
$('#term').addEventListener('click', () => input.focus({ preventScroll: true }));

/* =========================================================
   Command palette (Ctrl/Cmd + K)
   ========================================================= */
const dlg = $('#cmdk'), ci = $('#cmdk-input'), cl = $('#cmdk-list');
const ACTIONS = [
  { t: 'Go to About', k: 'section', f: () => go('about') },
  { t: 'Go to Work', k: 'section', f: () => go('work') },
  { t: 'Go to Changelog', k: 'section', f: () => go('log') },
  { t: 'Go to Shell', k: 'section', f: () => { go('shell'); setTimeout(() => input.focus({ preventScroll: true }), 600); } },
  { t: 'Go to Contact', k: 'section', f: () => go('contact') },
  ...PROJECTS.map(p => ({ t: 'Open ' + p.name, k: 'project', f: () => window.open(p.url, '_blank', 'noopener') })),
  { t: 'Email Aidin', k: 'contact', f: () => { location.href = 'mailto:aidiny2000@gmail.com'; } },
  { t: 'Copy email address', k: 'contact', f: () => navigator.clipboard?.writeText('aidiny2000@gmail.com') },
  { t: 'GitHub profile', k: 'link', f: () => window.open('https://github.com/AidinYaseri', '_blank', 'noopener') },
  { t: 'LinkedIn profile', k: 'link', f: () => window.open('https://www.linkedin.com/in/aidin-yaseri/', '_blank', 'noopener') },
  { t: 'Switch language EN / FR', k: 'pref', f: toggleLang },
  { t: 'Toggle redline mode', k: 'fun', f: () => toggleRedline() },
];
let sel = 0, shown = ACTIONS;
const fuzzy = (q, s) => { q = q.toLowerCase(); s = s.toLowerCase(); let i = 0; for (const c of s) if (c === q[i]) i++; return i === q.length; };
function renderCmd() {
  shown = ACTIONS.filter(a => fuzzy(ci.value, a.t));
  sel = Math.min(sel, Math.max(0, shown.length - 1));
  cl.innerHTML = shown.map((a, i) => `<li role="option" aria-selected="${i === sel}" data-i="${i}">${a.t}<small>${a.k}</small></li>`).join('') || '<li>no match</li>';
}
function openCmd() { ci.value = ''; sel = 0; renderCmd(); dlg.showModal(); ci.focus(); }
function runCmd(i) { const a = shown[i]; if (!a) return; dlg.close(); a.f(); }
$('#cmdk-open').addEventListener('click', openCmd);
ci.addEventListener('input', () => { sel = 0; renderCmd(); });
ci.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { sel = (sel + 1) % shown.length; renderCmd(); e.preventDefault(); }
  if (e.key === 'ArrowUp') { sel = (sel - 1 + shown.length) % shown.length; renderCmd(); e.preventDefault(); }
  if (e.key === 'Enter') runCmd(sel);
});
cl.addEventListener('click', e => { const li = e.target.closest('li[data-i]'); if (li) runCmd(+li.dataset.i); });
dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); dlg.open ? dlg.close() : openCmd(); }
});

/* =========================================================
   Konami → redline mode
   ========================================================= */
function toggleRedline() {
  document.body.classList.toggle('redline');
  $$('.hero .scramble').forEach(s => scramble(s));
}
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let kpos = 0;
addEventListener('keydown', e => {
  if (e.target.matches('input')) return;
  kpos = (e.key.toLowerCase() === KONAMI[kpos].toLowerCase()) ? kpos + 1 : (e.key === KONAMI[0] ? 1 : 0);
  if (kpos === KONAMI.length) { kpos = 0; toggleRedline(); }
});

console.log('%cAY_%c  hey, you opened the console. try the shell section, or Ctrl+K.', 'color:#ff5a1f;font:700 20px monospace', 'color:#8a8c92');
