# Happy Birthday, Kiru 🤍

A luxury digital scrapbook birthday website. Pure HTML/CSS/JS, no
frameworks, no build step.

## Files

```
index.html   → structure/content of every section
style.css    → all design tokens, layout, and animations
script.js    → all interactivity (well commented, organized by section)
images/      → drop gallery photos here (see images/README.md)
audio/       → drop the birthday song here (see audio/README.md)
```

## Adding your photos and song later (e.g. via GitHub)

You do not need to edit any code to add real content later:

- **Photos**: add files named `memory-1.jpg` through `memory-6.jpg` to
  `/images`. The gallery checks for these automatically; any placeholder
  card whose file now exists switches over to the real photo on its own.
- **Song**: add `birthday-song.mp3` to `/audio`. The vinyl music button
  will start using it automatically.

Just commit those files into the matching folders on GitHub (same file
names) and the live site updates itself — nothing else to touch.

## Running locally

Since the gallery/audio use relative `fetch`-style loading (via `<img>`
and `<audio>` `src` + `onerror` fallback), open this with a local server
rather than double-clicking the file, so the browser's file-access rules
don't block image loading:

```bash
# from inside this folder
python3 -m http.server 8000
# then visit http://localhost:8000
```

Or just push the folder to GitHub Pages / Netlify / Vercel — it works
immediately with zero configuration.

## Customizing

- Timeline cards, memory jar notes, and the "Reasons You're Amazing" list
  all live in the config section at the top of `script.js` — edit the
  arrays there, nothing else needs to change.
- The letter text lives directly in `index.html` inside `#letterBody`.
- The birthday date is hardcoded to **8 August** in `script.js`
  (`getBirthdayTarget()` and the `isBirthdayToday()` check inside
  `initCountdown()`) — search for `7, 8` (month 7 = August, 0-indexed) if
  you ever need to change it.
