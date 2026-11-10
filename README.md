# Pebble · little moments together

Screen-free ideas for about twenty minutes a day with a toddler (18 months to 4 years). Free, offline, private.

**Live:** https://thamistco.github.io/pebble/

- **Today**: one idea for today (a daily pick that avoids what you did recently), a quick picker (5 minutes / I'm tired / we're out / bath & bed), a serve-and-return prompt, and a gentle weekly tally.
- **Ideas**: 134 activities, each with its own illustration, plus search, collections and filters (time, energy, place, EYFS area). Every idea has a **Watch an example** button that opens a YouTube search in a new tab (no embedded videos, so nothing breaks).
- **Polish at home** (optional setting, offered on the welcome screen): 22 traditional Polish rhymes, finger plays and songs with the Polish words, an English gloss and actions, plus Polish words and a simple phrase to say on 80 everyday ideas.
- **Saved** favourites and **Moments**: mark an idea done with an optional one-line memory.
- Installable PWA (iPhone: Safari → Share → Add to Home Screen; Android: Install button in Settings when Chrome offers it, otherwise a **Download app (APK)** link plus the Chrome menu ⋮ → Add to home screen → Install steps), works offline (pictures are cached as you view them), data stays in the browser (localStorage). Export/import JSON backup. No accounts, no analytics.

Content is written for Pebble and grounded in public guidance: Harvard Center on the Developing Child (serve and return), NHS Best Start in Life, CDC milestones (2 years, 30 months), ZERO TO THREE, BookTrust, and the EYFS areas of learning. Not a developmental assessment; if you're worried about development, talk to your health visitor or GP.

## Android app (APK)
**Download:** https://thamistco.github.io/pebble/download/pebble.apk (`download/pebble.apk`, ~115 KB, app version 1.0 / versionCode 1).

A thin native wrapper: package `io.github.thamistco.pebble`, minSdk 26 (Android 8), targetSdk 34, one permission (INTERNET). It opens the live site in a full-screen WebView with JavaScript, DOM storage and the site's own service worker (so it works offline after the first launch, and picks up site updates without reinstalling). Android Back closes the open sheet (sheets are history entries) and then leaves the app; links off the site (YouTube "Watch an example") open in the browser. "Export a backup" saves to Downloads through a small `window.PebbleNative.saveFile` bridge (a WebView can't download `blob:` links); Import uses the system file picker. The WebView adds ` PebbleAndroid/1` to its user agent, which hides the install/download row inside the app. Data in the app is separate from data in Chrome: use Export/Import to move it.

Install: open the download link in Chrome on the phone, open the file, and allow Chrome to "install unknown apps" when Android asks. Signed with the thamistco release key (alias `pebble`); future APKs must use the same key to install as updates. Source and build script live in the project workspace (`work/android`, `/workspace/work/build-pebble-apk.sh`), not in this repo.

## Development
Vanilla HTML/CSS/JS, no build step. Activities live in `content/a*.txt`; run `python3 tools/build_data.py` to regenerate `js/data.js`. `tools/test_app.py` runs a headless Playwright click-through.


Illustrations: `img/<id>.webp` (600×450, ~8 KB each), generated in one shared style; scene descriptions, alt text and YouTube search queries live in `content/images.tsv`. Polish rhymes are in `content/a5.txt`; sources are listed in the project research notes.

## Status (9 Nov 2026)
v2.1.0: gauntlet hardening. Storage and backups are normalised on load and import (a damaged or hand-edited file can no longer blank the app), ages under 18 months and over 4 years still get ideas, future birthdays are refused, double taps can't double-log a moment or snap a sheet shut, large text (200%) no longer overflows, the daily idea rolls over at midnight in an app left open, the service worker precaches with cache:'reload' and reloads once onto a new version, offline pictures not yet seen show a soft blank tile, and several safety notes were tightened (no pasta necklaces, laundry capsules, traffic, stairs, sun). Everyday Polish phrases still want a native check.
v2.1.0 live 9 Nov 2026 (commit 00145c9) after 4-round gauntlet; findings in qa/gauntlet.md. (Open items closed in v2.2.0, below.)

## Status (10 Nov 2026)
v2.2.0: every open gauntlet item closed. The Pebble sorting and Beach pebble tower pictures were redrawn with large, hand-sized pebbles only (cache-busted with `?v=2`, old copies dropped by the service worker). Toasts no longer cover the screen: with no sheet open they dock to the top edge of the tab bar (taps pass through, any tap or scroll tucks them away, ~1.7 s), inside a sheet they sit in the flow above its buttons (tap or swipe to dismiss), and they stay a polite live region. "We did this" now shows one sheet at a time: the idea sheet slides away and comes back when Save a moment closes. Future updates apply on the first launch after a deploy, with a one-time "Updated to version x" note. The everyday Polish phrases and rhyme variants were checked against PWN/Wikisłownik/Wikicytaty and preschool collections (standard form kept, common variants shown as a small note). The Kosi kosi id lost its "ł" in v1; it is now `kosi-kosi-lapci-clapping` and old saved data is mapped on load. Gauntlet round 5 (12 seeds × 300 steps, full scripted suite, 134 sheets at 200% on 3 widths, axe light/dark, test_app.py): 0 findings, 0 JS errors. Details in qa/gauntlet.md.

## Status (10 Nov 2026, v2.3.0)
v2.3.0: Android app. Chrome on some Android phones never offers the PWA install prompt, so Settings now shows **Install on Android: Download app (APK)** plus the manual Chrome menu steps whenever no install prompt is available on Android (never inside the app itself; iPhone hint unchanged). The service worker never intercepts or caches the APK. QA: test_app.py clean, scripted suite (edge, time, personas, offline, SW update from v2.2.0, perf, v22) 0 findings, fuzz seeds 0/1/2/3 (80–150 steps) 0 violations 0 JS errors, Android checks (`work/qa_tools/android_check.py`) 13/13.
