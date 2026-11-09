# Pebble · little moments together

Screen-free ideas for about twenty minutes a day with a toddler (18 months to 4 years). Free, offline, private.

**Live:** https://thamistco.github.io/pebble/

- **Today**: one idea for today (a daily pick that avoids what you did recently), a quick picker (5 minutes / I'm tired / we're out / bath & bed), a serve-and-return prompt, and a gentle weekly tally.
- **Ideas**: 134 activities, each with its own illustration, plus search, collections and filters (time, energy, place, EYFS area). Every idea has a **Watch an example** button that opens a YouTube search in a new tab (no embedded videos, so nothing breaks).
- **Polish at home** (optional setting, offered on the welcome screen): 22 traditional Polish rhymes, finger plays and songs with the Polish words, an English gloss and actions, plus Polish words and a simple phrase to say on 80 everyday ideas.
- **Saved** favourites and **Moments**: mark an idea done with an optional one-line memory.
- Installable PWA (iPhone: Safari → Share → Add to Home Screen; Android: Install button in Settings), works offline (pictures are cached as you view them), data stays in the browser (localStorage). Export/import JSON backup. No accounts, no analytics.

Content is written for Pebble and grounded in public guidance: Harvard Center on the Developing Child (serve and return), NHS Best Start in Life, CDC milestones (2 years, 30 months), ZERO TO THREE, BookTrust, and the EYFS areas of learning. Not a developmental assessment; if you're worried about development, talk to your health visitor or GP.

## Development
Vanilla HTML/CSS/JS, no build step. Activities live in `content/a*.txt`; run `python3 tools/build_data.py` to regenerate `js/data.js`. `tools/test_app.py` runs a headless Playwright click-through.


Illustrations: `img/<id>.webp` (600×450, ~8 KB each), generated in one shared style; scene descriptions, alt text and YouTube search queries live in `content/images.tsv`. Polish rhymes are in `content/a5.txt`; sources are listed in the project research notes.

## Status (9 Nov 2026)
v2.1.0: gauntlet hardening. Storage and backups are normalised on load and import (a damaged or hand-edited file can no longer blank the app), ages under 18 months and over 4 years still get ideas, future birthdays are refused, double taps can't double-log a moment or snap a sheet shut, large text (200%) no longer overflows, the daily idea rolls over at midnight in an app left open, the service worker precaches with cache:'reload' and reloads once onto a new version, offline pictures not yet seen show a soft blank tile, and several safety notes were tightened (no pasta necklaces, laundry capsules, traffic, stairs, sun). Everyday Polish phrases still want a native check.
