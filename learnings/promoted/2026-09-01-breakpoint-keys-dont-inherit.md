---
id: L-008
date: 2026-09-01
slug: breakpoint-keys-dont-inherit
project: carousel bound to a Collection List
status: promoted
severity: live-bug
blast_radius: any responsive library config with per-breakpoint objects
supersedes:
proposed_rule: Repeat every key in every breakpoint object; absent keys come back undefined, not inherited.
rule: H7
---

## Symptom

Past a breakpoint the carousel's snap grid collapsed to a single stop — dragging yanked
the whole track instead of settling on a card.

## Cause

Swiper rebuilds params on a breakpoint change. A key absent from a breakpoint object
comes back `undefined` rather than inheriting the base value, which silently kills
`updateSlides`.

## Fix

`slidesPerView` and `slidesPerGroup` repeated in every breakpoint object, with a comment
in `CONFIG` explaining that the repetition is deliberate so nobody "tidies" it away.

## Evidence

Project README live-bug list, plus the in-code comment preserving the reason.

## Why it generalises

Config objects that look like they cascade but do not are a general library hazard.
Worth assuming for anything that rebuilds params on resize until proven otherwise. The
secondary lesson — comment deliberate redundancy so it survives the next cleanup — is
fully general.
