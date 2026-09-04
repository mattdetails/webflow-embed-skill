---
id: L-001
date: 2026-09-01
slug: swiper-observeparents-loop
project: carousel bound to a Collection List
status: promoted
severity: live-bug
blast_radius: touch devices only, and only once the carousel reaches either end
supersedes:
proposed_rule: Never enable an ancestor observer on a library instance whose sync code writes to an ancestor.
rule: H9
---

## Symptom

Swiping the timeline froze the moment it reached the first or last card. Phone only —
completely unreproducible on desktop, including a desktop window resized to phone width.

## Cause

`syncNav()` toggles a class on `.tl_component`, which is the carousel's parent.
`observeParents: true` makes any ancestor attribute change call `update()`. On touch,
`update()` calls `slideTo()`, which re-fires the edge events, which calls `syncNav()`
again. Infinite loop.

Desktop escaped it because `freeMode` makes `update()` take a different branch that does
not call `slideTo()`.

## Fix

Removed `observeParents`. The component does not need it: nothing outside it resizes the
viewport in a way `observer` alone does not already catch.

## Evidence

Reproduced on a real handset. Removing the single option fixed it; re-adding it brought
the freeze straight back. Recorded in the project README under "all of these were live
bugs, don't undo them."

## Why it generalises

The pattern — a sync function that writes to an ancestor, plus an ancestor observer — is
not Swiper-specific. Any library offering `observeParents`, a `ResizeObserver` on a
wrapper, or a `MutationObserver` scoped above the component has the same shape. The
platform-specific manifestation is the dangerous part: it passes desktop review.
