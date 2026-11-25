// Dedicated project page: project.html?p=<id> shows one case file, then recommendations.
// project.html with no ?p shows every case file as a catalog.
import './bg.js';
import { mount, chapters } from './chapters.js';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const T = { home: { en: 'home', fr: 'accueil' }, all: { en: 'all case files', fr: 'tous les dossiers' }, contact: { en: 'contact', fr: 'contact' } };
let lang = localStorage.getItem('lang') || (navigator.language?.startsWith('fr') ? 'fr' : 'en');
function applyLang(l) {
  lang = l; localStorage.setItem('lang', l);
  document.documentElement.lang = l;              // chapters.js re-renders on this
  $$('[data-t]').forEach(el => { el.textContent = T[el.dataset.t][l]; });
  $('#lang').innerHTML = l === 'fr' ? 'FR<b>/</b>EN' : 'EN<b>/</b>FR';
  crumbs();
}
$('#lang').addEventListener('click', () => {
  const next = lang === 'en' ? 'fr' : 'en';
  document.startViewTransition ? document.startViewTransition(() => applyLang(next)) : applyLang(next);
});

const id = new URLSearchParams(location.search).get('p');
const c = chapters.find(x => x.id === id);
const name = x => typeof x.name === 'object' ? x.name[lang] || x.name.en : x.name;

function crumbs() {
  const fr = lang === 'fr';
  $('#crumbs').innerHTML = `<a href="index.html">${fr ? 'accueil' : 'home'}</a> / <a href="project.html">${fr ? 'dossiers' : 'case files'}</a>${c ? ` / <b>${name(c)}</b>` : ''}`;
  document.title = (c ? name(c) : (fr ? 'Dossiers' : 'Case files')) + ' — Aidin Yaseri';
}

if (c) {
  mount({ id: c.id, chapter: $('#chapter'), rail: $('#files-rail'), recs: $('#recs'), debrief: $('#debrief-slot') });
} else {
  $('#nav-all').classList.add('on');
  $('#chapter').innerHTML = `<div class="catalog-head"><p class="mono ch-n"><span>case files</span></p><h1 class="ch-q" id="cat-h"></h1></div>`;
  $('#recs').classList.add('as-grid');
  mount({ rail: $('#files-rail'), recs: $('#recs'), debrief: $('#debrief-slot') });
  const h = () => { $('#cat-h').textContent = lang === 'fr' ? 'Six projets. Chacun se joue.' : 'Six projects. Each one is playable.'; };
  h(); new MutationObserver(h).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
}
applyLang(lang);
$('#year').textContent = new Date().getFullYear();
