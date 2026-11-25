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
- Projects as a Reels/Stories-style feed (`reels.js`): swipe up for the next project, tap or swipe sideways for slides, autoplay, double-tap to like, a "rabbit-hole depth" meter with badges, and each project's last slide leads into related projects. A grid toggle shows the classic cards (3D tilt, pointer spotlight, rotating conic border). Slide text lives in the `P` array in `reels.js`
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
