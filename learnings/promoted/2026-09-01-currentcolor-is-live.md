---
id: L-004
date: 2026-09-01
slug: currentcolor-is-live
project: carousel bound to a Collection List
status: promoted
severity: live-bug
blast_radius: any element whose hover swaps color and background-color
supersedes:
proposed_rule: Never bind a design token to currentColor.
rule: R3
---

## Symptom

The nav buttons disappeared entirely on hover.

## Cause

`--tl-ink: currentColor` does not capture a value — `currentColor` stays live and
resolves against `color` at each use site. The button's hover swaps `color` and
`background-color` between ink and bg, so ink followed `color` to the same value as the
background and the button became invisible.

## Fix

Resolve `--tl-ink` to a literal colour per scheme.

## Evidence

Recorded in the project README's live-bug list.

## Why it generalises

Nothing about it is Webflow- or carousel-specific. Any token system with a hover that
inverts a pair has the same failure, and `currentColor` is a natural-looking thing to
reach for when defining a token that "should follow the text."
