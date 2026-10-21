# Stackfall

Educational tower stacker. Pick a subject, topic, difficulty and clock, then build the tallest tower you can before the clock hits zero.

- Right answer: a floor drops onto the tower (+1)
- Wrong answer: the top 3 floors are knocked off
- Every 5 right answers in a row: a bonus gold floor (+2 in total)
- Clock (chess-clock style): you start with a few seconds; a right answer adds time, a wrong one takes it away. The clock only runs while a question is up.
  - Quick: start 10 s, +2 s / −2 s · Normal: start 15 s, +2 s / −2 s · Relaxed: start 20 s, +3 s / −2 s
  - The bonus shrinks by 0.5 s every 8 right answers (never below 0.5 s) and the clock tops out at start + 5 s, so every run ends
- Record: the tower's height when the clock hits zero, kept per topic, difficulty and clock

Same family as [Lanefall](https://github.com/aosmann/lanefall): the same minimal dark-glass interface, type and ember accent, no build step, works offline and installs to the iPhone home screen. The scene is the app icon's world: a dusk sky that deepens to night as the tower climbs, plain warm slabs, and the next floor swinging from a crane.

## Files
- `index.html` — the game (Three.js scene, menus, audio, scoring)
- `questions.js` — the shared question bank (`window.EduQ`), extracted from Lanefall v10. Any game can use it:
  `const next = EduQ.stream(topic, level); const q = next(); // {q, ans:[3], correct, answer, img?, code?}`
- `three.min.js` — Three.js r128 (same copy as Lanefall)
- `sw.js`, `manifest.webmanifest`, `icon-*.png` — offline support and home-screen install

## Results for the portal
Every finished run is appended to `localStorage['edu-results']` (last 200) and, when the game runs inside another page, posted to it:
`window.parent.postMessage({type:'edu-result', result})`, where `result` holds game, subject, topic, level, duration, score, peak, right, asked, bestStreak, missed[] and a timestamp.

## Credits

Country, capital and continent data: [mledoze/countries](https://github.com/mledoze/countries), Open Database License (ODbL 1.0).  
Flags: [flag-icons](https://github.com/lipis/flag-icons), MIT licence, compressed into `flags/`.
