# Shipping and iterating

## The 10,000 character embed cap

Per embed, and it counts every character including comments and whitespace. Check it:

```bash
wc -c webflow-embed-2-script.html
```

When you are close: strip comments from the pasted copy but keep them in the source
(the source is the file you maintain), split styles and script into two embeds, or move
to a head script on jsDelivr. Do not minify the source itself — the comments are how the
next person understands the thing.

## jsDelivr from a GitHub repo

```html
<script src="https://cdn.jsdelivr.net/gh/USER/REPO@COMMIT_SHA/file.js" defer></script>
```

**Pin to a commit SHA. Never `@main`.** jsDelivr caches branch and tag refs for up to
7 days, so `@main` keeps serving stale code while you iterate and you will spend an
afternoon debugging a fix that already shipped. Every commit is a fresh, permanent,
immediately-live URL.

```bash
git rev-parse HEAD          # the SHA to paste
```

Repo must be public for jsDelivr to serve it.

For ES modules from npm, the `/+esm` endpoint works in a classic script via dynamic
`import()`:

```js
import('https://cdn.jsdelivr.net/npm/locomotive-scroll@5.0.1/+esm')
  .then(function (m) { /* ... */ })
  .catch(function () { /* degrade, and undo anything already applied */ });
```

Rule R5 applies: a static top-level `import` that fails has nothing to catch it.

## Verifying a release

1. Publish to the staging domain (`*.webflow.io`) first when one exists.
2. Hard-reload — Webflow sets long cache headers on published assets.
3. Check the console for **zero** uncaught errors and **zero** unhandled rejections.
   An unhandled rejection is the specific signature of a failed import (R5).
4. Test the failure path deliberately: point the CDN URL at a version that does not
   exist and confirm the page degrades cleanly rather than breaking.
5. Test on a real phone. Touch and pointer branches genuinely diverge — the loop bug
   behind rule R9 was invisible on desktop.

## Rollback

With SHA-pinned URLs, rollback is pasting the previous SHA and publishing. That is the
main practical reason to prefer head scripts over embeds for anything load-bearing.
Note the shipped SHA in the README next to each module so rollback does not require
reading git history under pressure.
