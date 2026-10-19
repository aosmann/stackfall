# Stackfall

Educational tower stacker. Pick a subject, topic, difficulty and time limit, then build the tallest tower you can before the clock runs out.

- Right answer: a floor drops onto the tower (+1)
- Wrong answer: the top 3 floors are knocked off
- Every 5 right answers in a row: a bonus gold floor (+2 in total)
- Record: the tower's height when time runs out, kept per topic, difficulty and time limit

Same family as [Lanefall](https://github.com/aosmann/lanefall) under the hood (no build step, works offline, installs to the iPhone home screen), with its own toy-island look: the sky turns from morning to night as the tower climbs, the next floor swings from a crane, answers are colour + shape coded, and height is shown in metres against real landmarks (3 m per floor).

## Files
- `index.html` — the game (Three.js scene, menus, audio, scoring)
- `questions.js` — the shared question bank (`window.EduQ`), extracted from Lanefall v10. Any game can use it:
  `const next = EduQ.stream(topic, level); const q = next(); // {q, ans:[3], correct, answer, img?, code?}`
- `three.min.js` — Three.js r128 (same copy as Lanefall)
- `sw.js`, `manifest.webmanifest`, `icon-*.png` — offline support and home-screen install

## Results for the portal
Every finished run is appended to `localStorage['edu-results']` (last 200) and, when the game runs inside another page, posted to it:
`window.parent.postMessage({type:'edu-result', result})`, where `result` holds game, subject, topic, level, duration, score, peak, right, asked, bestStreak, missed[] and a timestamp.
