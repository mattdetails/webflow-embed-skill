---
id: L-005
date: 2026-09-01
slug: wait-dont-assume-load-order
project: carousel bound to a Collection List
status: promoted
severity: debugging-time
blast_radius: any component split across embeds, or depending on a site-wide library
supersedes:
proposed_rule: Poll for the dependency rather than trusting embed or script order.
rule: R4
---

## Symptom

A component that depends on a site-wide library initialises on some loads and not
others — intermittent, and worse on slow connections.

## Cause

Embed order in the Designer does not guarantee execution order relative to footer
scripts, the CMS, or an installed Webflow app. Whichever wins the tick varies by load.

## Fix

The script waits for `window.Swiper` rather than assuming it. Recorded at the top of
the script embed: "Load order does not matter -- this waits for
window.Swiper rather than assuming it."

## Evidence

Shipped as the deliberate design of the embed-2 header comment, written at build time
as a constraint rather than discovered after.

## Why it generalises

Every Webflow site has more than one thing competing for the load, and the number grows
over the site's life. A short poll with a timeout and one warning costs about eight
lines and removes an entire class of intermittent bug.
