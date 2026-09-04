---
id: L-002
date: 2026-09-01
slug: namespace-everything
project: carousel bound to a Collection List
status: promoted
severity: rebuild
blast_radius: any Webflow site that later gains a second instance of the same library
supersedes:
proposed_rule: Namespace classes, custom properties, data attributes, and the library's own generated class names.
rule: H1
---

## Symptom

Pre-emptive rather than post-mortem: a second Swiper added to the same site by anyone
later would have shared `.swiper-wrapper` / `.swiper-slide` with this component and
inherited its hand-written core CSS.

## Cause

The site loads `swiper-bundle.min.js` but not its stylesheet, so the component
hand-writes the minimal core CSS it needs. Those rules are global. Any future Swiper
picks them up.

## Fix

`wrapperClass` / `slideClass` set to `tl_track` / `tl_slide`, so the library generates
the namespaced names itself and the hand-written CSS only ever matches this component.
Same prefix applied to custom properties (`--tl-ink`) and hooks (`data-tl="viewport"`).

## Evidence

Recorded in the stylesheet at build time: "Namespaced to a prefix
via the wrapperClass / slideClass options so this can never collide with another Swiper
added to the site later."

## Why it generalises

Webflow sites accumulate code from many hands over years — apps, embeds, a later
developer, Relume's own classes. Component CSS on a shared site is global by default.
Configuring the library's generated names, not just your own markup, is the part people
miss.
