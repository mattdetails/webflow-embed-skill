---
name: webflow-embed
description: Build a custom interactive component that ships into a Webflow site — as an HTML Embed or a head script pinned on jsDelivr. Use when writing JS/CSS that will live inside Webflow, porting a Relume section to a hand-built component, replacing a native Webflow slider or interaction, or debugging a component that works locally but breaks once pasted into Webflow. Triggers on Webflow embed, HTML embed, custom code in Webflow, Relume section, Webflow slider replacement, jsDelivr script tag, Webflow custom component, IX2, Collection List component, "works locally but not on the published site".
---

# Webflow embed components

A component here is not a page — it is a self-contained piece of behaviour that has to
survive being pasted into someone else's runtime. Webflow already owns the DOM, ships
its own interactions engine, rewrites your markup, and caps how much code you can paste.
Everything below exists because one of those bit a live site.

Read `references/` as needed:

| File | Read it when |
|---|---|
| `references/webflow-runtime.md` | Deciding where code loads, or fighting IX2 / the Editor |
| `references/ship.md` | Choosing embed vs. head script, publishing, jsDelivr, CDN cache |
| `references/harness.md` | Building the local `test.html` and checking parity with the source |

---

## 1. Decide the delivery shape first

This decision constrains everything after it. Do not start writing code until it is made.

| | **HTML Embed** | **Head script on jsDelivr** |
|---|---|---|
| Lives in | A section on one page | Site Settings → Custom Code → Head |
| Size cap | **10,000 characters per embed** | None |
| Iteration | Paste, publish, repeat | `git push`, bump SHA |
| Best for | One section, CMS-bound, needs Webflow's Collection List | Site-wide behaviour: nav, scroll, reveals, backgrounds |
| Cost | Editing means going back into the Designer | The Designer shows nothing; only the published site runs it |

Split a component across **two** embeds when it needs both: styles in embed 1 at the
top of the section, script in embed 2 at the end. Never rely on that order for
correctness — see rule R2.

## 2. Produce this file set, every time

The set is the deliverable. A single blob of code is not.

```
component.css                  # source, edit this
component.js                   # source, edit this
webflow-embed-1-styles.html    # paste-ready, <style> wrapper included
webflow-embed-2-script.html    # paste-ready, <script> wrapper included
test.html                      # local harness with fake content
README.md                      # file table, the exact Webflow structure, gotchas
```

The paste-ready files are **generated from** the sources — say so in the README so the
next person does not edit the wrapped copy and lose it on the next rebuild.

The README's structure block is the highest-value thing you write. It is what turns a
pile of CSS into something buildable in the Designer:

```
Div  .tl_component            attr  data-tl="component"
└ Div  .tl_stage
  ├ Collection List Wrapper  .tl_viewport   attr  data-tl="viewport"
  │ └ Collection List  .tl_track
  │   └ Collection Item  .tl_slide
```

## 3. Hard rules

Each carries the learning that produced it. Never delete one without reading its file
in `learnings/promoted/` first — every one of these was a live bug.

### R1 — Namespace everything with a 2–3 letter prefix `[L-002]`
Classes, CSS custom properties, data attributes, and any library's own generated class
names. `tl_track`, `--tl-ink`, `data-tl="viewport"`. Webflow sites accumulate: the
next developer adds a second carousel, Relume ships `.color-scheme-3`, a client
installs an app. An un-namespaced `.track` is a bug with a delay fuse.

Configure the library to use your prefix too, not just your own markup — Swiper's
`wrapperClass` / `slideClass`, Splide's `classes`, GSAP's `id`.

### R2 — No literal closing tag for the block the file becomes `[L-003]`
A script block ends at the first `</script` the HTML parser sees; a style block ends at
the first `</style`. Inside a JS string, a CSS comment, a regex — it makes no difference,
because the parser reads tags, not JavaScript or CSS.

Only the **matching** tag matters. `</style>` sitting in a script is harmless, and so is
`</script>` sitting in a style block. Check each file against the block it becomes.

Everything after the break leaks into the page as text. JS usually also throws an
unterminated-string error, so it is not reliably silent — but the console points at a
line that looks fine, which is why it costs an hour. If you must emit one, split it so
the parser never sees it whole: `'<' + '/script>'`.

### R3 — Never bind a token to `currentColor` `[L-004]`
`--tl-ink: currentColor` is a live keyword, not a captured value. Any hover that swaps
`color` and `background-color` collapses both to the same value and the element
vanishes. Resolve tokens to literal colors per scheme.

### R4 — Wait for dependencies, never assume load order `[L-005]`
Poll for `window.Swiper` / `window.gsap` rather than trusting that embed 1 ran before
embed 2, or that a head script beat the footer. Webflow's own scripts, the CMS, and any
installed app all compete for the same tick. A short `requestAnimationFrame` or
`setInterval` poll with a timeout and one console warning is the whole fix.

### R5 — Wrap every dynamic `import()` in `.catch` `[L-006]`
A failed top-level import surfaces as an **uncaught promise rejection** and the feature
silently dies. Content blockers, corporate proxies, and flaky networks all cause this
routinely. Catch it, log one warning, and restore whatever you overrode (scroll
behaviour, injected stylesheets) rather than leaving the page in a half-applied state.

### R6 — Do not fight the library for a transform `[L-007]`
If a carousel owns `transform` on the slide, put your own animation on a child element.
Two owners of one property is a race you lose intermittently, which is the worst kind.

### R7 — Repeat every key in every breakpoint object `[L-008]`
A key absent from a responsive breakpoint config comes back `undefined`, not inherited.
Silently collapses layout maths. True of Swiper, and worth assuming of any library that
rebuilds params on resize.

### R8 — Guard against double-initialisation `[L-009 — provisional]`
Set a flag on the element (`if (el.dataset.tlInit) return; el.dataset.tlInit = '1';`).
Webflow's Editor re-renders sections, the CMS can re-inject a Collection List, and a
head script plus a leftover embed can both fire. Two instances on one node produce
symptoms that look like anything but the real cause.

### R9 — Never `observeParents` (or any ancestor observer) when you write to ancestors `[L-001]`
If your sync function toggles a class on a parent, an ancestor observer turns that into
`update()` → state change → event → sync → update. An infinite loop that freezes the
component the moment it reaches an edge state. Frequently platform-specific, so it will
pass desktop testing and fail on phones.

## 4. Build order

1. **Read the source first.** If porting from Relume, a live URL, or a Figma frame,
   capture the real values — spacing, colors, easing, breakpoints — before writing
   anything. Guessed values are the main source of parity complaints.
2. **Harness before Webflow.** Build `test.html` with fake content that includes the
   ugly cases: one item, twelve items, a missing image, a 90-character title. See
   `references/harness.md`.
3. **Measure, don't assert.** If a decision is performance- or quality-shaped, produce
   the number before choosing — a table of the tradeoff at each setting, a frame cost,
   a measured worst case — and put it in the README next to the value you shipped.
   Otherwise the next person re-litigates it from taste.
4. **Then wrap and paste.** Generate the embed files, build the Designer structure from
   the README block, paste, publish.
5. **Verify on the published site**, not in the Designer. See `references/ship.md`.

## 5. Ship checklist

- [ ] Every embed under 10,000 characters — count it, do not estimate
- [ ] No literal closing `style` / `script` tag in any file (R2)
- [ ] All classes, custom properties, and data attributes namespaced (R1)
- [ ] Double-init guard present (R8)
- [ ] Dependency polling, not assumed order (R4)
- [ ] Degrades to something usable if a CDN import fails (R5)
- [ ] Tested at one item and at many; at 375px and at 2560px
- [ ] Touch tested on a real phone, not a resized desktop window (R9's bug was phone-only)
- [ ] `prefers-reduced-motion` respected for anything that moves
- [ ] README has the file table, the Designer structure block, and a gotchas section
- [ ] jsDelivr URL pinned to a commit SHA, never `@main` (`references/ship.md`)

## 6. Close the loop

When the build ships — or when a bug in it is fixed — run **`/embed-retro`**. It
captures what this build taught into `learnings/pending/`, which is how the rules above
get written. A lesson that stays only in one project's README will be rediscovered the
hard way in the next project.

Two things go in the project README rather than a learning: anything specific to that
one client's site, and anything that is a note to self rather than a rule. The bar for
a learning is *"the next component, on a different site, would hit this too."*
