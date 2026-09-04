---
id: L-007
date: 2026-09-01
slug: one-owner-per-transform
project: carousel bound to a Collection List
status: promoted
severity: debugging-time
blast_radius: any component combining a carousel or scroll library with its own animation
supersedes:
proposed_rule: Animate a child element rather than contesting a property the library owns.
rule: R6
---

## Symptom

Scroll-driven animation on the slides fought the carousel: positions jumped or reset
mid-transition, intermittently.

## Cause

Swiper owns `transform` on `.tl_slide` and rewrites it every frame while the track
moves. A ScrollTrigger transform on the same element is a second writer to one property.

## Fix

Put the animation on `.tl_item`, the child. Recorded in the README as: "Don't put
ScrollTrigger transforms on `.tl_slide`; Swiper owns that transform. Use `.tl_item`."

## Evidence

Project README live-bug list.

## Why it generalises

Two owners of one CSS property is a race, and the intermittency is what makes it
expensive — it survives review and appears in production. Adding a wrapper or targeting
a child is nearly always cheaper than winning the fight.
