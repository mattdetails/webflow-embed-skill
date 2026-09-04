# The Webflow runtime you are landing in

## Where code can run

| Slot | Runs in Designer | Runs in Editor | Runs on published | Notes |
|---|---|---|---|---|
| Site Settings → Head | no | yes | yes | Best for site-wide behaviour |
| Site Settings → Footer | no | yes | yes | After Webflow's own scripts |
| Page Settings → Head/Before-body | no | yes | yes | Per page |
| HTML Embed on canvas | renders markup only | yes | yes | Scripts do not execute in the Designer |

The Designer canvas is the trap. An HTML Embed shows its markup but does not run its
script, so a component can look completely broken in the Designer and be perfect on the
published site — and the reverse. **Verify on the published (or staging) URL.**

## IX2 — Webflow Interactions

`webflow.js` ships IX2, which writes inline styles onto elements it controls. Symptoms
of a collision: your transform gets overwritten a frame after you set it, or an element
snaps back to `opacity: 0` when it scrolls.

- Do not animate an element that has a Webflow interaction attached. Remove the
  interaction in the Designer, or animate a child element instead.
- IX2 sets `will-change` and inline `transform` — inline styles beat your stylesheet.
  If you must win from CSS, you need `!important` or a different element. Prefer the
  different element.
- `Webflow.destroy(); Webflow.ready(); Webflow.require('ix2').init();` re-initialises
  IX2 after you inject DOM. Needed when you add elements a Webflow interaction targets.

## Webflow.push

```js
window.Webflow = window.Webflow || [];
window.Webflow.push(function () { /* runs after Webflow is ready */ });
```

Useful, but it is not a dependency guarantee for *your* third-party libraries — only
for Webflow itself. Still poll for `window.Swiper` etc. (rule R4).

## What Webflow does to your markup

- **Collection Lists** render `.w-dyn-list` → `.w-dyn-items` → `.w-dyn-item`. Your
  classes are added alongside, not instead. Style your own class; do not rely on the
  `w-` ones staying put across Webflow versions.
- An **empty Collection List** renders `.w-dyn-empty` instead of items. Handle the case
  where your component finds zero children rather than throwing.
- **Rich Text** output is `.w-richtext` with Webflow's own child rules that are
  surprisingly specific. Scope overrides tightly.
- **Images** may get `srcset` and lazy loading. If you measure an image, wait for
  `decode()` or a `load` event — measuring at zero height is a classic parity bug.
- Webflow **strips some attributes** from Embed markup on paste. Verify custom
  attributes survived by inspecting the published DOM, not the Designer.

## Class collisions worth knowing

- Relume's `.color-scheme-N` classes set their own ink/bg pairs and do **not** remap
  `--color-scheme-1--*` custom properties. A component that inherits a theme token will
  come out the wrong colour inside a scheme wrapper. Map ink and bg per scheme yourself.
- Webflow reserves the `w-` prefix. Never author a class starting with `w-`.
- Client-First and Flowkit conventions (`padding-global`, `container-large`) are common
  on these sites and are the right things to align to when the component must sit on the
  page grid. Measure the real element rather than computing from `vw` — `vw` includes
  the scrollbar.

## Editor mode

The Webflow Editor re-renders sections as content is edited. That is the main real-world
cause of double-initialisation (rule R8) and of components binding to nodes that are
later replaced. Bind with delegation or re-run your init on a `MutationObserver` scoped
to your own container — never to `document`.
