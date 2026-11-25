# Aidin Yaseri — portfolio

Static site: `index.html`, `style.css`, `main.js`. No build step, no framework.

## Run locally
    npx http-server . -p 5199

## Deploy to GitHub Pages
Your empty `AidinYaseri.github.io` repo is ready for it:

    git init && git add . && git commit -m "portfolio"
    git branch -M main
    git remote add origin https://github.com/AidinYaseri/AidinYaseri.github.io.git
    git push -u origin main

It goes live at https://aidinyaseri.github.io.

## What's in it
- WebGL fragment shader background (domain-warped fbm with contour lines) that reacts to the pointer and scroll speed
- OBD-II handshake boot sequence (shown once per visit, any key skips it)
- Scroll-linked tachometer (`@property` + CSS custom properties), redline past 78%
- Text scramble on the name, scroll-driven `view()` reveal animations
- Projects as playable "case files" (`chapters.js`): each project opens with a question and has a small demo to play (drain the game's 5% battery, a launch-reaction 0–100 timer, an OBD code decoder, a request trace through the .NET stack, a mini budget tracker, flip cards). Doing the demo unlocks a redacted "secret" about the project. A sticky progress bar shows what's still unexplored, and a debrief at the end lists what the visitor did before the contact button. Progress is saved in localStorage. The classic project cards are in a collapsed "at a glance" section. All chapter text lives in the `CH` array
- GitHub API live data: repo count and "last push" time on each card
- Working terminal (`help`, `ls`, `open 1`, `repos`, `obd`, ...)
- Ctrl/Cmd+K command palette with fuzzy search
- EN/FR toggle using the View Transitions API
- Konami code: ↑↑↓↓←→←→BA turns on redline mode
- Respects `prefers-reduced-motion`

## Editing
- Text: `index.html`. French copy is in the `FR` object at the top of `main.js`
- Projects in the terminal and command palette: `PROJECTS` in `main.js`
- Colours: CSS variables at the top of `style.css`
