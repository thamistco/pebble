# Pebble · little moments together

Screen-free ideas for about twenty minutes a day with a toddler (18 months to 4 years). Free, offline, private.

**Live:** https://thamistco.github.io/pebble/

- **Today**: one idea for today (a daily pick that avoids what you did recently), a quick picker (5 minutes / I'm tired / we're out / bath & bed), a serve-and-return prompt, and a gentle weekly tally.
- **Ideas**: 114 original activities with search, collections and filters (time, energy, place, EYFS area).
- **Saved** favourites and **Moments**: mark an idea done with an optional one-line memory.
- Installable PWA, works offline, data stays in the browser (localStorage). Export/import JSON backup. No accounts, no analytics.

Content is written for Pebble and grounded in public guidance: Harvard Center on the Developing Child (serve and return), NHS Best Start in Life, CDC milestones (2 years, 30 months), ZERO TO THREE, BookTrust, and the EYFS areas of learning. Not a developmental assessment; if you're worried about development, talk to your health visitor or GP.

## Development
Vanilla HTML/CSS/JS, no build step. Activities live in `content/a*.txt`; run `python3 tools/build_data.py` to regenerate `js/data.js`. `tools/test_app.py` runs a headless Playwright click-through.
