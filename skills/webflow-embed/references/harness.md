# The local harness

## Why

Iterating inside Webflow costs a paste and a publish per change. `test.html` costs a
save and a reload. Everything except CMS binding and Webflow's own CSS can be settled
locally.

```bash
python3 -m http.server 8981
# http://localhost:8981/test.html
```

A plain file open (`file://`) will fail on module imports and fetch — serve it.

## What test.html must contain

1. **The exact DOM Webflow will produce**, including the `w-dyn-*` wrappers if a
   Collection List is involved. Copy it from the published site's inspector rather than
   writing it from memory — this is what makes the harness predictive.
2. **Fake content covering the ugly cases**, not the happy one:
   - one item, and twelve items
   - a missing image and a missing optional field
   - a 90-character title and a one-word title
   - the longest body copy the CMS actually allows
3. **A link to the real source files** (`component.css`, `component.js`) — never a
   copy. A harness that drifts from the source is worse than none.

## Parity checking against a source design

When rebuilding something that already exists (a Relume section, a Figma frame, a live
competitor page), assert parity rather than eyeballing it:

- Pull computed values from the source with the browser tools — spacing, font sizes,
  line heights, colours, easing curves, breakpoints. Write them into the component as
  tokens.
- Screenshot both at the same width and flip between them. Differences you would never
  catch side-by-side are obvious when they blink.
- Check the breakpoints the source actually uses. Webflow's defaults (991 / 767 / 479)
  are not the same as Tailwind's, and a component built to the wrong set will look right
  on your monitor and wrong on a tablet.

## What the harness cannot tell you

- IX2 collisions — Webflow's interactions are not present locally
- Real CMS field limits and empty-state rendering
- Webflow's own stylesheet cascade, which is large and opinionated
- Editor-mode re-rendering

Those four are exactly the list to check first when something works locally and breaks
once pasted. That is not a coincidence — it is the definition of what the harness omits.
