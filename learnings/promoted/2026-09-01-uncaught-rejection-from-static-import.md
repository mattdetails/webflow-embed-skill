---
id: L-006
date: 2026-09-01
slug: uncaught-rejection-from-static-import
project: site-wide head script
status: promoted
severity: live-bug
blast_radius: any CDN-loaded module; triggered by content blockers and proxies
supersedes:
proposed_rule: Wrap every dynamic import in .catch, and undo anything already applied on failure.
rule: R5
---

## Symptom

Smooth scrolling silently absent on some visitors' machines, with an uncaught promise
rejection in the console and no other signal.

## Cause

A top-level `import` that fails has nothing to catch it. The module graph was two
separate fetches — `locomotive-scroll@5.0.1/+esm` and the `lenis@1.3.17/+esm` it imports
— and either can be blocked by a content blocker, a corporate proxy, or a flaky network.

## Fix

Dynamic `import()` wrapped in `.catch`. On failure it degrades to the browser's native
scrolling, logs one warning, restores `scroll-behavior` to the theme's own value, and
removes the injected stylesheet rather than leaving it behind.

## Evidence

Verified by pointing `CONFIG.src` at a non-existent version: 0 unhandled rejections,
1 warning, `scroll-behavior` restored, injected stylesheet removed. Also established
that the Locomotive bundle contains no Promise, async, await, .then or .catch at all —
so this import was the only promise in the stack and the only possible source of a
rejection.

## Why it generalises

Applies to every CDN-loaded module on a public site. The undo half is the part usually
missed: catching the error but leaving an injected stylesheet or an overridden
`scroll-behavior` in place produces a page that is worse than if the feature had never
been attempted.
