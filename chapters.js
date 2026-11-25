// Projects as playable "case files".
// Engagement techniques used on purpose:
//  - curiosity gap: every chapter opens with a question, not a project name
//  - active participation: each project has a small demo you *do*, not read (generation effect)
//  - variable reward: each action reveals a random, unseen fact
//  - Zeigarnik effect: the rail always shows what's still unexplored / locked
//  - endowed progress: the rail starts with "intro ✓" already filled in
//  - goal gradient: the message changes as you get close to 100%
//  - open loops: every chapter ends on a teaser for the next one
//  - peak-end rule: a debrief at the end replays what *you* did, then the call to action
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const lang = () => document.documentElement.lang === 'fr' ? 'fr' : 'en';
const L = x => (x && typeof x === 'object' && !Array.isArray(x)) ? (x[lang()] ?? x.en) : x;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(v => v[1]);

/* =========================================================
   State (kept across language switches and reloads)
   ========================================================= */
const KEY = 'case-files-v1';
const S = Object.assign({ explored: {}, secrets: {}, log: {} }, JSON.parse(localStorage.getItem(KEY) || '{}'));
const save = () => localStorage.setItem(KEY, JSON.stringify(S));

/* =========================================================
   Chapters
   ========================================================= */
const CH = [
  {
    id: 'battery', related: ['tracky','fin'], n: '01', stack: 'Three.js · TypeScript · Vite', url: 'https://github.com/AidinYaseri/The-Last-Battery-', name: 'The Last Battery',
    q: { en: 'What would you spend your last 5% on?', fr: 'Que ferais-tu avec ton dernier 5 %?' },
    p: {"en": "A first-person mystery / horror game that runs in the browser. You wake up alone in a forest at night with a phone at 5%, and you have to find your way home before it dies.", "fr": "Un jeu de mystère / horreur à la première personne qui roule dans le navigateur. Tu te réveilles seul en forêt la nuit avec un téléphone à 5 % et tu dois rentrer avant qu’il meure."},
    ex: [{"en": "The battery is the core mechanic: the map, GPS, photos, the torch, calls and messages all drain it, and it never refills on its own.", "fr": "La batterie est la mécanique centrale : carte, GPS, photos, lampe, appels et messages la vident, et elle ne se recharge jamais seule."}, {"en": "Five levels and four endings, with power banks, a car charger and a wall outlet hidden along the way.", "fr": "Cinq niveaux et quatre fins, avec batteries externes, chargeur d’auto et prise murale cachés en chemin."}, {"en": "Everything is generated in code at runtime: geometry, textures, photos, sound effects, voices and music. The game ships with no asset files.", "fr": "Tout est généré par le code à l’exécution : géométrie, textures, photos, effets sonores, voix et musique. Aucun fichier d’asset."}, {"en": "Built with Three.js and TypeScript on Vite, with procedural audio through WebAudio and autosave to localStorage.", "fr": "Fait avec Three.js et TypeScript sur Vite, audio procédural avec WebAudio et sauvegarde auto dans localStorage."}],
    how: {"en": "Your phone is at 5%. Tap the apps: each one costs battery, just like in the game, and reveals a detail about how it was built.", "fr": "Ton téléphone est à 5 %. Touche les applis : chacune coûte de la batterie, comme dans le jeu, et révèle un détail sur sa conception."},
    secret: { en: 'Debug flags I left in: <code>?fps</code> shows a draw-call counter, <code>?debug&level=3</code> jumps to a level, <code>?nolock</code> disables pointer lock for automated tests.', fr: 'Des options de débogage laissées dedans : <code>?fps</code> affiche les draw calls, <code>?debug&level=3</code> saute à un niveau, <code>?nolock</code> désactive le verrouillage du pointeur pour les tests automatisés.' },
    lock: { en: 'drain the battery to 0%', fr: 'vide la batterie à 0 %' },
    next: { en: 'Next: a phone that knows your 0–100 time better than your speedometer does.', fr: 'Ensuite : un téléphone qui connaît ton 0–100 mieux que ton compteur.' },
    did: { en: 'drained a dying phone', fr: 'vidé un téléphone mourant' },
    demo: battery,
  },
  {
    id: 'tracky', related: ['obd','battery'], n: '02', stack: 'Swift · SwiftUI · Core Motion', url: 'https://github.com/AidinYaseri/TrackYourDrag', name: 'Tracky',
    q: { en: 'How fast are your reflexes off the line?', fr: 'Tes réflexes au départ, ils valent combien?' },
    p: {"en": "A native iOS app for car enthusiasts that measures real acceleration runs and keeps a history you can sort, chart, map and compare.", "fr": "Une appli iOS native pour passionnés d’auto qui mesure de vraies accélérations et garde un historique à trier, graphiquer, cartographier et comparer."},
    ex: [{"en": "Uses the iPhone’s GPS, accelerometer, gyroscope and barometer to measure speed, G-force and elevation.", "fr": "Utilise le GPS, l’accéléromètre, le gyroscope et le baromètre de l’iPhone pour mesurer vitesse, forces G et altitude."}, {"en": "Times 0–100 km/h, 0–60 mph, 1/8, 1/4 and 1/2 mile with trap speed, or any custom speed or distance.", "fr": "Chronomètre le 0–100 km/h, le 0–60 mph, le 1/8, 1/4 et 1/2 mille avec vitesse de sortie, ou toute vitesse ou distance personnalisée."}, {"en": "You arm it once. The launch and the finish are detected automatically, so nothing has to be touched while the car is moving.", "fr": "Tu l’armes une fois. Le départ et l’arrivée sont détectés automatiquement : rien à toucher pendant que l’auto roule."}, {"en": "Swift, SwiftUI, SwiftData, Core Location, Core Motion, MapKit and Swift Charts, on iOS 17 and later.", "fr": "Swift, SwiftUI, SwiftData, Core Location, Core Motion, MapKit et Swift Charts, sur iOS 17 et plus."}],
    how: {"en": "Here you’re the launch detector. Press to arm, wait for the green light, then press again as fast as you can. Your reaction time sets your 0–100.", "fr": "Ici, c’est toi le détecteur de départ. Appuie pour armer, attends le vert, puis appuie le plus vite possible. Ta réaction fixe ton 0–100."},
    secret: { en: 'Any two saved runs can be compared with their speed curves overlaid, and every run keeps a GPS quality report so you know if the time is trustworthy.', fr: 'Deux courses peuvent être comparées avec leurs courbes de vitesse superposées, et chaque course garde un rapport de qualité GPS pour savoir si le temps est fiable.' },
    lock: { en: 'run a 0–100 under 4.60 s', fr: 'fais un 0–100 sous 4,60 s' },
    next: { en: 'Next: what your check-engine light is actually trying to tell you.', fr: 'Ensuite : ce que ton voyant moteur essaie vraiment de te dire.' },
    did: { en: 'launched a car', fr: 'lancé une voiture' },
    demo: tracky,
  },
  {
    id: 'obd', related: ['tracky','adopt'], n: '03', stack: 'Python · OBD-II', url: 'https://github.com/AidinYaseri/Obd_project', name: 'CarSync',
    q: { en: 'What is your check-engine light hiding?', fr: 'Que cache ton voyant moteur?' },
    p: {"en": "A Python tool that plugs into a car’s OBD-II port, reads the trouble codes stored in the engine computer and turns them into plain language.", "fr": "Un outil Python qui se branche au port OBD-II d’une voiture, lit les codes d’erreur stockés dans l’ordinateur du moteur et les traduit en langage clair."},
    ex: [{"en": "Talks to the car through an OBD-II adapter and requests the stored diagnostic trouble codes.", "fr": "Communique avec la voiture par un adaptateur OBD-II et demande les codes de diagnostic stockés."}, {"en": "Turns raw codes like P0301 into something a driver understands: “cylinder 1 misfire”.", "fr": "Transforme des codes bruts comme P0301 en quelque chose de compréhensible : « raté d’allumage au cylindre 1 »."}, {"en": "Tested on my own cars to make sure it holds up outside a classroom.", "fr": "Testé sur mes propres voitures pour m’assurer qu’il tient la route hors de la classe."}],
    how: {"en": "The scanner below is connected. Pick codes stored in the ECU and watch them get decoded.", "fr": "Le scanneur ci-dessous est branché. Choisis des codes stockés dans l’ECU et regarde-les se décoder."},
    secret: { en: 'It ships as a standalone desktop app: the repo has a PyInstaller spec (<code>CarSync.spec</code>), so a mechanic doesn’t need Python installed.', fr: 'C’est une appli de bureau autonome : le dépôt a un fichier PyInstaller (<code>CarSync.spec</code>), donc un mécanicien n’a pas besoin d’installer Python.' },
    lock: { en: 'decode 3 different codes', fr: 'décode 3 codes différents' },
    next: { en: 'Next: follow one click through six layers of a .NET app.', fr: 'Ensuite : suis un clic à travers six couches d’une appli .NET.' },
    did: { en: 'diagnosed an engine', fr: 'diagnostiqué un moteur' },
    demo: obd,
  },
  {
    id: 'adopt', related: ['fin','obd'], n: '04', stack: '.NET 10 · Blazor · Keycloak · SQL Server', url: 'https://github.com/AidinYaseri/Team-5-Web-Programming', name: 'Animal Adoption',
    q: { en: 'What happens in the 300 ms after you click “Adopt”?', fr: 'Que se passe-t-il dans les 300 ms après un clic sur « Adopter »?' },
    p: {"en": "An animal adoption platform built as a team project for Web Programming III, structured like a production .NET application.", "fr": "Une plateforme d’adoption d’animaux bâtie en équipe pour Programmation Web III, structurée comme une vraie application .NET de production."},
    ex: [{"en": "ASP.NET Core REST API with application services, a domain layer for business rules and EF Core repositories on SQL Server.", "fr": "API REST ASP.NET Core avec services applicatifs, couche domaine pour les règles d’affaires et dépôts EF Core sur SQL Server."}, {"en": "A Blazor Server client that talks to the API over HTTP through typed clients.", "fr": "Un client Blazor Server qui parle à l’API en HTTP avec des clients typés."}, {"en": "Sign-in through Keycloak with OpenID Connect. The API checks JWT bearer tokens, scope policies and a staff role.", "fr": "Connexion par Keycloak avec OpenID Connect. L’API vérifie les jetons JWT, les politiques de portée et un rôle staff."}, {"en": "xUnit unit tests and API integration tests, with architecture diagrams in Mermaid.", "fr": "Tests unitaires xUnit et tests d’intégration de l’API, avec diagrammes d’architecture en Mermaid."}],
    how: {"en": "Send an adoption request and step through every layer it passes before the database answers.", "fr": "Envoie une demande d’adoption et suis chaque couche qu’elle traverse avant que la base de données réponde."},
    secret: { en: 'The client references none of the backend projects. The API resolves the token’s <code>sub</code> claim to <code>User.ExternalId</code>, so identity lives in Keycloak and data lives in SQL.', fr: 'Le client ne référence aucun projet backend. L’API associe le <code>sub</code> du jeton à <code>User.ExternalId</code> : l’identité vit dans Keycloak, les données dans SQL.' },
    lock: { en: 'trace a request end to end', fr: 'trace une requête de bout en bout' },
    next: { en: 'Next: a budget app. Spend some fake money.', fr: 'Ensuite : une appli de budget. Dépense de l’argent fictif.' },
    did: { en: 'traced a request through 6 layers', fr: 'tracé une requête à travers 6 couches' },
    demo: adopt,
  },
  {
    id: 'fin', related: ['adopt','side'], n: '05', stack: 'TypeScript · REST · Docker', url: 'https://github.com/AidinYaseri/Webll-Final-Finance-Tracker', name: { en: 'Finance Tracker', fr: 'Suivi financier' },
    q: { en: 'Where does a student’s money actually go?', fr: 'Où va vraiment l’argent d’un étudiant?' },
    p: {"en": "A full-stack personal finance web app for students: create an account, record income and expenses, sort them into categories and see where the money goes.", "fr": "Une appli web full-stack de finances personnelles pour étudiants : crée un compte, note revenus et dépenses, classe-les par catégorie et vois où va l’argent."},
    ex: [{"en": "Planned first as user stories (auth, transactions, categories, dashboard) and an entity-relationship diagram.", "fr": "Planifiée d’abord en user stories (auth, transactions, catégories, tableau de bord) et en diagramme entité-relation."}, {"en": "REST API with routes to register, log in and create, read, update and delete transactions.", "fr": "API REST avec des routes pour s’inscrire, se connecter et créer, lire, modifier et supprimer des transactions."}, {"en": "A dashboard with the total balance, income versus expenses and spending summaries.", "fr": "Un tableau de bord avec le solde total, revenus contre dépenses et résumés de dépenses."}, {"en": "Written in TypeScript.", "fr": "Écrite en TypeScript."}],
    how: {"en": "Add a few transactions. The balance and category bars update, and you’ll see the API call the real app makes.", "fr": "Ajoute quelques transactions. Le solde et les barres se mettent à jour, et tu vois l’appel API que fait la vraie appli."},
    secret: { en: 'Three tables do all the work: USERS has many TRANSACTIONS, CATEGORIES classify them. The whole thing runs in Docker.', fr: 'Trois tables font tout : USERS a plusieurs TRANSACTIONS, CATEGORIES les classe. Le tout roule dans Docker.' },
    lock: { en: 'add 3 transactions', fr: 'ajoute 3 transactions' },
    next: { en: 'Last: three side quests, including one built in a single hackathon.', fr: 'Dernier : trois quêtes secondaires, dont une bâtie en un seul hackathon.' },
    did: { en: 'tracked a budget', fr: 'suivi un budget' },
    demo: fin,
  },
  {
    id: 'side', related: ['fin','battery'], n: '06', stack: { en: 'side quests', fr: 'quêtes secondaires' }, url: null, name: { en: 'Side quests', fr: 'Quêtes secondaires' },
    q: { en: 'Three smaller builds. Can you open all three?', fr: 'Trois petits projets. Peux-tu ouvrir les trois?' },
    p: {"en": "Three smaller projects: one built at a hackathon, one live website and one map app.", "fr": "Trois petits projets : un bâti lors d’un hackathon, un site en ligne et une appli de carte."},
    ex: [{"en": "Campus Parking: a real-time map of free parking spots on campus, built with a team of four at a hackathon. I worked on location tracking and the phone interface.", "fr": "Stationnement du campus : une carte en temps réel des places libres, bâtie à quatre lors d’un hackathon. J’ai fait la localisation et l’interface mobile."}, {"en": "Score Keeper: current and past soccer scores, browsable from a calendar, using API-Football. It’s live on GitHub Pages.", "fr": "Score Keeper : scores de soccer actuels et passés, par calendrier, avec API-Football. En ligne sur GitHub Pages."}, {"en": "Sales Map: a map-based JavaScript app, built with Vite, for tracking a sales territory.", "fr": "Sales Map : une appli JavaScript cartographique, faite avec Vite, pour suivre un territoire de ventes."}],
    how: {"en": "Flip each card to open it.", "fr": "Retourne chaque carte pour l’ouvrir."},
    secret: { en: 'The Campus Parking app was reworked live at the hackathon from other students’ feedback, and Score Keeper was designed entirely in Figma before any code.', fr: 'L’appli de stationnement a été retravaillée sur place selon les commentaires d’autres étudiants, et Score Keeper a été entièrement conçu dans Figma avant le code.' },
    lock: { en: 'flip all 3 cards', fr: 'retourne les 3 cartes' },
    next: null,
    did: { en: 'opened every side quest', fr: 'ouvert chaque quête secondaire' },
    demo: side,
  },
];

/* =========================================================
   Shell: rail, chapter, secrets, recommendations, debrief
   ========================================================= */
const pageFor = id => `project.html?p=${id}`;
const fr = () => lang() === 'fr';

function chapterHTML(c) {
  const got = S.secrets[c.id];
  const i = CH.indexOf(c), nx = CH[(i + 1) % CH.length];
  return `<article class="chapter" id="ch-${c.id}" data-ch="${c.id}">
    <section class="ch-explain">
      <div class="ch-intro">
        <p class="mono ch-n"><span>case ${c.n}</span> ${L(c.stack)}</p>
        <h1 class="ch-name">${L(c.name)}</h1>
        <p class="ch-p">${L(c.p)}</p>
        ${c.url ? `<a class="mono ch-src" href="${c.url}" target="_blank" rel="noopener">${fr() ? 'voir le code source' : 'view source code'} ↗</a>` : ''}
      </div>
      <div class="ch-how-it">
        <p class="mono try-k">${fr() ? '// comment ça marche' : '// how it works'}</p>
        <ol class="ch-points">${(c.ex || []).map(x => `<li>${L(x)}</li>`).join('')}</ol>
      </div>
    </section>
    <section class="ch-try">
      <p class="mono try-k">${fr() ? '// maintenant, essaie-le ↓' : '// now try it yourself ↓'}</p>
      <h2 class="ch-q">${L(c.q)}</h2>
      <p class="ch-p try-how">${L(c.how)}</p>
      <div class="ch-demo" data-demo="${c.id}"></div>
      <div class="secret ${got ? 'open' : ''}" data-secret="${c.id}">
        <p class="mono secret-k">${got ? '🔓 ' + (fr() ? 'secret débloqué' : 'secret unlocked') : '🔒 ' + (fr() ? 'secret verrouillé · ' : 'locked secret · ') + L(c.lock)}</p>
        <p class="secret-v">${got ? L(c.secret) : '████ ██████ ███ █████████ ██ ████ ███████ ██ ███ ████████ ███'}</p>
      </div>
    </section>
    ${c.next ? `<a class="mono ch-next" href="${pageFor(nx.id)}"><span>${L(c.next)}</span> <b>→</b></a>` : ''}
  </article>`;
}

function status(c) {
  if (S.secrets[c.id]) return `<span class="st sec">🔓 ${fr() ? 'secret trouvé' : 'secret found'}</span>`;
  if (S.explored[c.id]) return `<span class="st done">✓ ${fr() ? 'exploré' : 'explored'}</span>`;
  return `<span class="st new">${fr() ? 'nouveau' : 'new'}</span>`;
}
function thumb(c, extra = '') {
  return `<a class="rec ${extra}" href="${pageFor(c.id)}" data-id="${c.id}">
    <span class="rec-body">
      <small class="mono">case ${c.n} · ${L(c.stack)}</small>
      <b>${L(c.name)}</b>
      <span class="rec-q">${L(c.q)}</span>
      <span class="rec-foot mono">${status(c)}<span class="rec-t">~${c.id === 'side' ? 1 : 2} min</span></span>
    </span>
  </a>`;
}

// Amazon-style blocks under a project
function recsHTML(cur) {
  const c = CH.find(x => x.id === cur);
  const related = (c?.related || []).map(id => CH.find(x => x.id === id)).filter(Boolean);
  const others = CH.filter(x => x.id !== cur);
  const hist = (S.history || []).filter(id => id !== cur).map(id => CH.find(x => x.id === id)).filter(Boolean).slice(0, 6);
  const bundle = c ? [c, ...related] : [];
  const firstTodo = bundle.find(x => x.id !== cur && !S.secrets[x.id]);
  const allDone = bundle.every(x => S.secrets[x.id]);
  return `
    ${bundle.length ? `<div class="recs-block">
      <h3 class="recs-h">${fr() ? 'À explorer ensemble' : 'Explore these together'}</h3>
      <div class="bundle">
        ${bundle.map((x, i) => `${i ? '<span class="plus">+</span>' : ''}<a class="bundle-item ${x.id === cur ? 'this' : ''}" href="${pageFor(x.id)}"><small class="mono">${x.id === cur ? (fr() ? 'ce projet' : 'this project') : 'case ' + x.n}</small><b>${L(x.name)}</b></a>`).join('')}
        <div class="bundle-total">
          <p class="mono">${bundle.filter(x => S.secrets[x.id]).length}/${bundle.length} ${fr() ? 'secrets trouvés' : 'secrets found'}</p>
          <p class="bundle-price">~${bundle.length * 2} min</p>
          ${allDone ? `<span class="bundle-go done mono">${fr() ? 'ensemble complété ✓' : 'set complete ✓'}</span>`
            : firstTodo ? `<a class="bundle-go mono" href="${pageFor(firstTodo.id)}">${fr() ? 'Continuer avec' : 'Continue with'} ${L(firstTodo.name)} →</a>`
            : `<a class="bundle-go mono" href="#ch-${cur}">${fr() ? 'Finis celui-ci d’abord ↑' : 'Finish this one first ↑'}</a>`}
        </div>
      </div>
    </div>` : ''}
    <div class="recs-block">
      <h3 class="recs-h">${c ? (fr() ? 'Si tu as aimé ce projet, essaie aussi' : 'If you liked this, you’ll also like') : (fr() ? 'Tous les dossiers' : 'All case files')}</h3>
      <div class="carousel"><button class="car-btn prev mono" aria-label="previous">‹</button><div class="car-track">${(c ? others.sort((a, b) => (related.includes(b) - related.includes(a)) || (!!S.explored[a.id] - !!S.explored[b.id])) : CH).map(x => thumb(x)).join('')}</div><button class="car-btn next mono" aria-label="next">›</button></div>
    </div>
    ${hist.length ? `<div class="recs-block">
      <h3 class="recs-h">${fr() ? 'Ton historique' : 'Your browsing history'}</h3>
      <div class="hist">${hist.map(x => `<a href="${pageFor(x.id)}" class="hist-i"><small class="mono">case ${x.n}</small><b>${L(x.name)}</b></a>`).join('')}</div>
    </div>` : ''}`;
}

function debriefHTML() {
  const done = CH.filter(c => S.explored[c.id]);
  const secrets = CH.filter(c => S.secrets[c.id]).length;
  const list = done.map(c => `<li>✓ ${fr() ? 'Tu as' : 'You'} ${L(c.did)}</li>`).join('');
  const missing = CH.filter(c => !S.secrets[c.id]);
  return `<div class="debrief" id="debrief">
    <p class="mono ch-n"><span>${fr() ? 'ton parcours' : 'your progress'}</span></p>
    <h3 class="ch-q">${done.length === CH.length
      ? (fr() ? 'Tu as essayé tout ce que j’ai bâti.' : 'You’ve tried everything I’ve built.')
      : (fr() ? `${done.length} dossier${done.length > 1 ? 's' : ''} sur ${CH.length} ouvert${done.length > 1 ? 's' : ''}.` : `${done.length} of ${CH.length} case files opened.`)}</h3>
    ${list ? `<ul class="mono db-list">${list}</ul>` : ''}
    <p class="db-stat mono">${secrets}/${CH.length} secrets</p>
    ${missing.length ? `<p class="db-miss mono">${fr() ? 'Encore verrouillés :' : 'Still locked:'} ${missing.map(c => `<a href="${pageFor(c.id)}">${L(c.name)}</a>`).join(' · ')}</p>` : ''}
    <p class="ch-p">${fr() ? 'Imagine ce que je ferais avec un vrai problème de ton équipe.' : 'Imagine what I’d build with a real problem from your team.'}</p>
    <a class="db-cta" href="mailto:aidiny2000@gmail.com">${fr() ? 'Parlons stage →' : 'Let’s talk internship →'}</a>
  </div>`;
}

function railHTML() {
  const n = CH.filter(c => S.explored[c.id]).length, sec = CH.filter(c => S.secrets[c.id]).length;
  const pct = Math.round((1 + n + sec) / (1 + CH.length * 2) * 100); // endowed: "intro" counts as done
  const msg = pct >= 100 ? (fr() ? 'tout débloqué 🏁' : 'everything unlocked 🏁')
    : pct >= 75 ? (fr() ? 'presque fini…' : 'almost there…')
    : n === 0 ? (fr() ? 'commence par jouer avec un projet' : 'start by playing with one')
    : `${CH.length * 2 - n - sec} ${fr() ? 'choses encore cachées' : 'things still hidden'}`;
  return `<div class="fr-bar"><i style="width:${pct}%"></i></div>
    <div class="fr-row mono">
      <span class="fr-chip done">intro ✓</span>
      ${CH.map(c => `<a class="fr-chip ${S.explored[c.id] ? 'done' : ''} ${S.secrets[c.id] ? 'sec' : ''} ${c.id === mounted.id ? 'cur' : ''}" href="${pageFor(c.id)}">${c.n} ${L(c.name)}${S.secrets[c.id] ? ' 🔓' : S.explored[c.id] ? ' ✓' : ''}</a>`).join('')}
      <span class="fr-msg">${pct}% · ${msg}</span>
    </div>`;
}

/* mount: render one chapter (or none) plus whichever surrounding blocks the page has */
const mounted = { id: null, els: {} };
export function mount({ id = null, chapter, rail, recs, debrief } = {}) {
  mounted.id = id; mounted.els = { chapter, rail, recs, debrief };
  if (id) { S.history = [id, ...(S.history || []).filter(x => x !== id)].slice(0, 10); save(); }
  draw();
}
function draw() {
  const { chapter, rail, recs, debrief } = mounted.els;
  const c = CH.find(x => x.id === mounted.id);
  if (chapter && c) { chapter.innerHTML = chapterHTML(c); c.demo($(`[data-demo="${c.id}"]`, chapter), c); }
  refreshChrome();
}
function refreshChrome() {
  const { rail, recs, debrief } = mounted.els;
  if (rail) rail.innerHTML = railHTML();
  if (recs) { recs.innerHTML = recsHTML(mounted.id); wireCarousels(recs); }
  if (debrief) debrief.innerHTML = debriefHTML();
}
function wireCarousels(root) {
  $$('.carousel', root).forEach(car => {
    const tr = $('.car-track', car);
    $('.prev', car).onclick = () => tr.scrollBy({ left: -tr.clientWidth * .8, behavior: 'smooth' });
    $('.next', car).onclick = () => tr.scrollBy({ left: tr.clientWidth * .8, behavior: 'smooth' });
  });
}
function explored(id) {
  if (S.explored[id]) return;
  S.explored[id] = true; save(); refreshChrome();
}
function unlockSecret(id) {
  if (S.secrets[id]) return;
  S.secrets[id] = true; S.explored[id] = true; save();
  const c = CH.find(x => x.id === id);
  const box = $(`[data-secret="${id}"]`);
  if (box) {
    box.classList.add('open', 'just');
    box.querySelector('.secret-k').textContent = '🔓 ' + (fr() ? 'secret débloqué' : 'secret unlocked');
    const target = L(c.secret), v = box.querySelector('.secret-v');
    if (reduced) v.innerHTML = target;
    else {
      const plain = target.replace(/<[^>]+>/g, ''); let i = 0;
      const iv = setInterval(() => {
        i += Math.ceil(plain.length / 30);
        v.textContent = plain.slice(0, i) + plain.slice(i).replace(/\S/g, '█');
        if (i >= plain.length) { clearInterval(iv); v.innerHTML = target; }
      }, 30);
    }
  }
  refreshChrome();
  toast(fr() ? `🔓 secret débloqué : ${L(c.name)}` : `🔓 secret unlocked: ${L(c.name)}`);
}
let toastT;
function toast(msg) {
  let t = $('#cf-toast');
  if (!t) { t = document.createElement('div'); t.id = 'cf-toast'; t.className = 'cf-toast mono'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 2600);
}
export const chapters = CH;
// re-render text on language switch; demo state lives in S so nothing is lost
new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

/* =========================================================
   Demo 1 — The Last Battery: spend 5% to reveal facts
   ========================================================= */
function battery(el, c) {
  const st = S.log.battery ||= { pct: 5, seen: [] };
  const APPS = [
    { k: 'map', i: '🗺', n: { en: 'Map', fr: 'Carte' }, cost: .2 },
    { k: 'gps', i: '📍', n: 'GPS', cost: 1 },
    { k: 'cam', i: '📷', n: { en: 'Photo', fr: 'Photo' }, cost: 1 },
    { k: 'torch', i: '🔦', n: { en: 'Torch', fr: 'Lampe' }, cost: 1 },
    { k: 'call', i: '📞', n: { en: 'Call', fr: 'Appel' }, cost: 1 },
    { k: 'msg', i: '💬', n: { en: 'Message', fr: 'Message' }, cost: 2 },
  ];
  const FACTS = [
    { en: 'Five levels: The Forest, The Town, The Highway, The Cabin, The Truth.', fr: 'Cinq niveaux : La Forêt, La Ville, L’Autoroute, Le Chalet, La Vérité.' },
    { en: 'Four endings: Escape, Battery Death, Break the Loop… and a hidden one.', fr: 'Quatre fins : Évasion, Batterie morte, Briser la boucle… et une cachée.' },
    { en: 'Every texture, photo, voice and song is generated in code. Zero asset files.', fr: 'Chaque texture, photo, voix et chanson est générée par le code. Zéro fichier d’asset.' },
    { en: 'The battery carries over between levels and never refills by itself.', fr: 'La batterie passe d’un niveau à l’autre et ne se recharge jamais seule.' },
    { en: 'Power banks, a car charger and a wall outlet are hidden along the way.', fr: 'Batteries externes, chargeur d’auto et prise murale sont cachés en chemin.' },
    { en: 'The flashlight has its own batteries, separate from the phone.', fr: 'La lampe de poche a ses propres piles, séparées du téléphone.' },
    { en: 'Audio is synthesised live with 3D positioning and reverb.', fr: 'L’audio est synthétisé en direct avec spatialisation 3D et réverbération.' },
    { en: 'It autosaves every 20 seconds to localStorage, with checkpoints.', fr: 'Sauvegarde auto toutes les 20 secondes dans localStorage, avec points de contrôle.' },
    { en: 'Graphics quality is auto-detected: low, medium or high.', fr: 'La qualité graphique est détectée automatiquement : basse, moyenne ou haute.' },
    { en: 'The phone has six apps: Maps, Camera, Messages, Notes, Calls, Settings.', fr: 'Le téléphone a six applis : Cartes, Caméra, Messages, Notes, Appels, Réglages.' },
  ];
  const draw = () => {
    const dead = st.pct <= 0;
    const left = FACTS.length - st.seen.length;
    el.innerHTML = `<div class="bat-phone ${dead ? 'dead' : ''} ${st.pct <= 1.2 && !dead ? 'crit' : ''}">
      <div class="bat-top mono"><span>23:41</span><span class="bat-ico"><i style="width:${Math.max(0, st.pct) * 20}%"></i></span><b>${Math.max(0, st.pct).toFixed(1)}%</b></div>
      <div class="bat-feed">${st.seen.slice().reverse().map(i => `<p>${L(FACTS[i])}</p>`).join('') || `<p class="mono dim">${lang() === 'fr' ? 'Touche une appli. Chacune coûte de la batterie.' : 'Tap an app. Each one costs battery.'}</p>`}</div>
      <div class="bat-apps">${APPS.map(a => `<button data-k="${a.k}" ${dead ? 'disabled' : ''}><span>${a.i}</span><small>${L(a.n)}</small><em class="mono">-${a.cost}%</em></button>`).join('')}</div>
      ${dead ? `<div class="bat-dead"><p class="mono">${lang() === 'fr' ? 'FIN : BATTERIE MORTE' : 'ENDING: BATTERY DEATH'}</p><small>${left ? (lang() === 'fr' ? `${left} faits jamais vus.` : `${left} facts you never saw.`) : ''}</small><button class="mono" data-k="charge">🔌 ${lang() === 'fr' ? 'trouver un chargeur' : 'find a charger'}</button></div>` : ''}
    </div>`;
  };
  draw();
  el.addEventListener('click', e => {
    const b = e.target.closest('button[data-k]'); if (!b) return;
    if (b.dataset.k === 'charge') { st.pct = 5; save(); draw(); return; }
    const a = APPS.find(x => x.k === b.dataset.k);
    st.pct = Math.round((st.pct - a.cost) * 10) / 10;
    const unseen = FACTS.map((_, i) => i).filter(i => !st.seen.includes(i));
    if (unseen.length) st.seen.push(shuffle(unseen)[0]);
    explored('battery'); save(); draw();
    if (st.pct <= 0) unlockSecret('battery');
  });
}

/* =========================================================
   Demo 2 — Tracky: christmas-tree launch, reaction -> 0-100 time
   ========================================================= */
function tracky(el) {
  const st = S.log.tracky ||= { best: null, runs: [] };
  let phase = 'idle', goAt = 0, timers = [], raf;
  const BASE = 4.2;
  const draw = () => {
    const fr = lang() === 'fr';
    el.innerHTML = `<div class="trk">
      <div class="trk-tree"><i></i><i></i><i></i><i class="g"></i></div>
      <div class="trk-gauge"><svg viewBox="0 0 200 120"><path d="M20 110 A 80 80 0 0 1 180 110" class="trk-arc"/><path d="M20 110 A 80 80 0 0 1 180 110" class="trk-fill" id="trk-fill"/></svg>
        <div class="trk-read mono"><b id="trk-spd">0</b><small>km/h</small></div></div>
      <p class="trk-time mono"><b id="trk-t">—.——</b> s <span>0–100</span></p>
      <button class="trk-btn mono" id="trk-btn">${fr ? 'APPUIE pour armer' : 'PRESS to arm'}</button>
      <div class="trk-runs mono">${st.runs.slice(-8).map(r => `<i style="height:${Math.max(8, 100 - (r - 4.2) * 60)}%" title="${r.toFixed(2)} s" class="${r === st.best ? 'pb' : ''}"></i>`).join('')}</div>
      <p class="trk-best mono">${st.best ? `${fr ? 'record' : 'best'} ${st.best.toFixed(2)} s` : (fr ? 'pas encore de record' : 'no best yet')}</p>
    </div>`;
    const btn = $('#trk-btn', el);
    btn.addEventListener('pointerdown', press);
    btn.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) press(e); });
  };
  const lights = () => $$('.trk-tree i', el);
  function reset() { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); phase = 'idle'; }
  function press(e) {
    e.preventDefault();
    const btn = $('#trk-btn', el), fr = lang() === 'fr';
    if (phase === 'idle' || phase === 'done') {
      reset(); phase = 'armed'; lights().forEach(l => l.className = l.classList.contains('g') ? 'g' : '');
      $('#trk-t', el).textContent = '—.——'; $('#trk-spd', el).textContent = '0'; $('#trk-fill', el).style.strokeDashoffset = 252;
      btn.textContent = fr ? 'attends le vert… puis APPUIE' : 'wait for green… then PRESS';
      [0, 1, 2].forEach(i => timers.push(setTimeout(() => lights()[i].classList.add('on'), 450 * (i + 1))));
      const delay = 1500 + Math.random() * 1600;
      timers.push(setTimeout(() => { lights()[3].classList.add('on'); goAt = performance.now(); phase = 'go'; }, delay));
      explored('tracky');
    } else if (phase === 'armed') {
      reset(); phase = 'done'; lights().forEach(l => l.classList.add('red'));
      btn.textContent = fr ? 'FAUX DÉPART · réessayer' : 'JUMP START · try again';
    } else if (phase === 'go') {
      const react = (performance.now() - goAt) / 1000;
      const t = BASE + react;
      phase = 'running';
      const t0 = performance.now(), dur = reduced ? 0 : Math.min(t * 400, 2200);
      const anim = now => {
        const k = dur ? Math.min(1, (now - t0) / dur) : 1, e = 1 - Math.pow(1 - k, 2.2);
        $('#trk-spd', el).textContent = Math.round(100 * e);
        $('#trk-fill', el).style.strokeDashoffset = 252 - 252 * e;
        $('#trk-t', el).textContent = (t * k).toFixed(2);
        if (k < 1) raf = requestAnimationFrame(anim);
        else {
          st.runs.push(t); if (!st.best || t < st.best) st.best = t; save();
          phase = 'done'; draw();
          $('#trk-t', el).textContent = t.toFixed(2); $('#trk-spd', el).textContent = '100'; $('#trk-fill', el).style.strokeDashoffset = 0;
          $('#trk-btn', el).textContent = (fr ? `réaction ${Math.round(react * 1000)} ms · encore?` : `reaction ${Math.round(react * 1000)} ms · again?`);
          if (t < 4.6) unlockSecret('tracky');
          else toast(fr ? `${t.toFixed(2)} s… le secret est sous 4,60` : `${t.toFixed(2)} s… the secret is under 4.60`);
        }
      };
      raf = requestAnimationFrame(anim);
    }
  }
  draw();
}

/* =========================================================
   Demo 3 — CarSync: decode standard OBD-II codes
   ========================================================= */
function obd(el) {
  const st = S.log.obd ||= { done: [] };
  const CODES = {
    P0300: { en: 'Random or multiple cylinder misfire detected', fr: 'Ratés d’allumage aléatoires ou multiples détectés' },
    P0301: { en: 'Cylinder 1 misfire detected', fr: 'Raté d’allumage détecté au cylindre 1' },
    P0171: { en: 'System too lean (bank 1): too much air, not enough fuel', fr: 'Mélange trop pauvre (banc 1) : trop d’air, pas assez d’essence' },
    P0420: { en: 'Catalyst system efficiency below threshold (bank 1)', fr: 'Efficacité du catalyseur sous le seuil (banc 1)' },
    P0128: { en: 'Coolant temperature below thermostat regulating temperature', fr: 'Température du liquide sous la température de régulation du thermostat' },
    P0442: { en: 'Evaporative emission system leak detected (small leak)', fr: 'Fuite détectée dans le système d’émissions évaporatives (petite fuite)' },
  };
  const draw = (out = '') => {
    const fr = lang() === 'fr';
    el.innerHTML = `<div class="obd">
      <div class="obd-bar mono"><span class="obd-led"></span> ELM327 · ISO 15765-4 CAN · ${fr ? 'connecté' : 'connected'}</div>
      <div class="obd-screen mono" id="obd-out">${out || `<span class="dim">&gt; ${fr ? 'choisis un code stocké dans l’ECU' : 'pick a code stored in the ECU'}</span>`}</div>
      <div class="obd-codes mono">${Object.keys(CODES).map(k => `<button data-c="${k}" class="${st.done.includes(k) ? 'done' : ''}">${k}</button>`).join('')}</div>
      <p class="mono obd-count">${st.done.length}/${Object.keys(CODES).length} ${fr ? 'décodés' : 'decoded'}</p>
    </div>`;
  };
  draw();
  el.addEventListener('click', async e => {
    const b = e.target.closest('button[data-c]'); if (!b) return;
    const code = b.dataset.c, out = $('#obd-out', el);
    $$('.obd-codes button', el).forEach(x => x.disabled = true);
    const lines = [`&gt; 03`, `43 ${code.slice(1, 3)} ${code.slice(3)}`, `<span class="h">${code}</span> → `];
    out.innerHTML = '';
    for (const l of lines) { out.innerHTML += l + (l.endsWith('→ ') ? '' : '<br>'); await new Promise(r => setTimeout(r, reduced ? 0 : 260)); }
    const txt = L(CODES[code]);
    for (let i = 0; i <= txt.length; i += 2) { out.innerHTML = lines.slice(0, 2).join('<br>') + `<br><span class="h">${code}</span> → <span class="k">${txt.slice(0, i)}</span>`; if (!reduced) await new Promise(r => setTimeout(r, 12)); }
    if (!st.done.includes(code)) st.done.push(code);
    explored('obd'); save();
    draw(out.innerHTML);
    if (st.done.length >= 3) unlockSecret('obd');
  });
}

/* =========================================================
   Demo 4 — Animal Adoption: trace one request through the stack
   ========================================================= */
function adopt(el) {
  const HOPS = [
    ['Browser', { en: 'You click “Adopt Milo”. The Blazor page holds a session cookie, nothing else.', fr: 'Tu cliques « Adopter Milo ». La page Blazor ne garde qu’un cookie de session.' }],
    ['Blazor Server', { en: 'The client calls the API through a typed HttpClient. It has no reference to the database code.', fr: 'Le client appelle l’API via un HttpClient typé. Aucune référence au code de la base de données.' }],
    ['Keycloak', { en: 'Sign-in used OIDC authorization code + PKCE. The request carries a bearer token.', fr: 'La connexion a utilisé OIDC code d’autorisation + PKCE. La requête porte un jeton bearer.' }],
    ['ASP.NET Core API', { en: 'JWT validated, scope policy checked, staff role checked where needed.', fr: 'JWT validé, politique de portée vérifiée, rôle staff vérifié au besoin.' }],
    ['Domain', { en: 'Business rules decide if Milo can be adopted. Rule violations become domain exceptions.', fr: 'Les règles d’affaires décident si Milo peut être adopté. Les violations deviennent des exceptions du domaine.' }],
    ['EF Core → SQL Server', { en: 'A repository writes the adoption. Migrations keep the schema in sync. 201 Created.', fr: 'Un dépôt enregistre l’adoption. Les migrations gardent le schéma à jour. 201 Created.' }],
  ];
  let i = -1, running = false;
  const draw = () => {
    const fr = lang() === 'fr';
    el.innerHTML = `<div class="adp">
      <ol class="adp-hops mono">${HOPS.map(([n], k) => `<li class="${k < i ? 'past' : k === i ? 'now' : ''}"><span>${String(k + 1).padStart(2, '0')}</span>${n}</li>`).join('')}</ol>
      <div class="adp-info"><p>${i < 0 ? (fr ? 'Une requête, six couches. Envoie-la.' : 'One request, six layers. Send it.') : L(HOPS[i][1])}</p></div>
      <button class="adp-btn mono">${i < 0 ? (fr ? '🐾 Adopter Milo' : '🐾 Adopt Milo') : i < HOPS.length - 1 ? (fr ? 'couche suivante ↓' : 'next layer ↓') : (fr ? '✓ 201 Created · rejouer' : '✓ 201 Created · replay')}</button>
    </div>`;
  };
  draw();
  el.addEventListener('click', e => {
    if (!e.target.closest('.adp-btn') || running) return;
    if (i >= HOPS.length - 1) i = -1;
    i++; explored('adopt'); draw();
    if (i === HOPS.length - 1) unlockSecret('adopt');
  });
}

/* =========================================================
   Demo 5 — Finance Tracker: add transactions, see API calls
   ========================================================= */
function fin(el) {
  const st = S.log.fin ||= { tx: [] };
  const CATS = { food: { en: 'Food', fr: 'Bouffe' }, rent: { en: 'Rent', fr: 'Loyer' }, fun: { en: 'Fun', fr: 'Sorties' }, job: { en: 'Job', fr: 'Job' } };
  const draw = (api = '') => {
    const fr = lang() === 'fr';
    const bal = st.tx.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0);
    const byCat = {}; st.tx.filter(t => t.type === 'expense').forEach(t => byCat[t.cat] = (byCat[t.cat] || 0) + t.amount);
    const max = Math.max(1, ...Object.values(byCat));
    el.innerHTML = `<div class="fin">
      <div class="fin-bal"><small class="mono">${fr ? 'solde' : 'balance'}</small><b class="${bal < 0 ? 'neg' : ''}">${bal < 0 ? '−' : ''}$${Math.abs(bal).toFixed(2)}</b></div>
      <form class="fin-form mono">
        <input name="amount" type="number" min="1" step="1" value="${[12, 450, 30, 600][st.tx.length % 4]}" aria-label="amount">
        <select name="cat" aria-label="category">${Object.entries(CATS).map(([k, v]) => `<option value="${k}" ${k === ['food', 'rent', 'fun', 'job'][st.tx.length % 4] ? 'selected' : ''}>${L(v)}</option>`).join('')}</select>
        <button>+ ${fr ? 'ajouter' : 'add'}</button>
      </form>
      <div class="fin-bars">${Object.keys(CATS).filter(k => k !== 'job').map(k => `<div><i style="height:${(byCat[k] || 0) / max * 100}%"></i><small class="mono">${L(CATS[k])}</small></div>`).join('')}</div>
      <pre class="fin-api mono">${api || `<span class="dim">// ${fr ? 'les appels API apparaissent ici' : 'API calls show up here'}</span>`}</pre>
    </div>`;
    $('form', el).addEventListener('submit', submit);
  };
  function submit(e) {
    e.preventDefault();
    const f = new FormData(e.target);
    const amount = Math.max(1, Math.min(99999, +f.get('amount') || 1)), cat = f.get('cat');
    const type = cat === 'job' ? 'income' : 'expense';
    st.tx.push({ amount, cat, type }); save(); explored('fin');
    const body = JSON.stringify({ amount, type, category_id: Object.keys(CATS).indexOf(cat) + 1 });
    draw(`<span class="h">POST</span> /api/transactions\n${body}\n<span class="k">201 Created</span> · id ${st.tx.length}`);
    if (st.tx.length >= 3) unlockSecret('fin');
  }
  draw();
}

/* =========================================================
   Demo 6 — side quests: flip cards
   ========================================================= */
function side(el) {
  const st = S.log.side ||= { flipped: [] };
  const Q = [
    { k: 'park', t: { en: 'Campus Parking', fr: 'Stationnement' }, f: { en: 'Hackathon, team of 4', fr: 'Hackathon, équipe de 4' }, b: { en: 'A live map of free spots on campus. My part: location tracking and the phone UI.', fr: 'Une carte en direct des places libres. Mon rôle : la localisation et l’interface mobile.' }, url: null },
    { k: 'score', t: 'Score Keeper', f: 'JavaScript · API-Football', b: { en: 'Current and past soccer scores, browsable from a calendar. It’s live.', fr: 'Scores de soccer actuels et passés, par calendrier. C’est en ligne.' }, url: 'https://aidinyaseri.github.io/Soccer-Score-keeper/' },
    { k: 'map', t: 'Sales Map', f: 'JavaScript · Vite', b: { en: 'A map-based web app for tracking a sales territory.', fr: 'Une appli web cartographique pour suivre un territoire de ventes.' }, url: 'https://github.com/AidinYaseri/Sales_map_WPA' },
  ];
  el.innerHTML = `<div class="side">${Q.map(q => `<button class="flip ${st.flipped.includes(q.k) ? 'on' : ''}" data-k="${q.k}">
      <span class="ff"><b>?</b><small class="mono">${lang() === 'fr' ? 'retourne-moi' : 'flip me'}</small></span>
      <span class="fb"><small class="mono">${L(q.f)}</small><b>${L(q.t)}</b><p>${L(q.b)}</p>${q.url ? `<a class="mono" href="${q.url}" target="_blank" rel="noopener">${lang() === 'fr' ? 'ouvrir' : 'open'} ↗</a>` : ''}</span>
    </button>`).join('')}</div>`;
  el.addEventListener('click', e => {
    const b = e.target.closest('.flip'); if (!b || e.target.closest('a')) return;
    b.classList.add('on');
    if (!st.flipped.includes(b.dataset.k)) st.flipped.push(b.dataset.k);
    explored('side'); save();
    if (st.flipped.length === Q.length) unlockSecret('side');
  });
}

