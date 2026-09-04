---
id: L-010
date: 2026-09-01
slug: pin-jsdelivr-to-sha
project: site-wide head script
status: promoted
severity: debugging-time
blast_radius: every jsDelivr-delivered script during active iteration
supersedes:
proposed_rule: Pin jsDelivr URLs to a commit SHA, never a branch or tag.
rule: references/ship.md
---

## Symptom

Fixes pushed to the repo do not appear on the published site, for hours or days, with no
error anywhere.

## Cause

jsDelivr caches branch and tag refs for up to 7 days. `@main` keeps serving the old file
long after the push.

## Fix

Pin every URL to a commit SHA. Every commit is a fresh, permanent URL that goes live
immediately. `git rev-parse HEAD` gives the value to paste.

## Evidence

Documented in bold in the install instructions, at the point of use.

## Why it generalises

Applies to every head-script delivery on every site. The cost is a whole debugging
session spent looking for a bug in code that was already fixed — which is the most
demoralising kind.
