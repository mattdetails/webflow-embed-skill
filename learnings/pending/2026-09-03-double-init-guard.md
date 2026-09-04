---
id: L-009
date: 2026-09-03
slug: double-init-guard
project: (cross-project — no single logged bug)
status: pending
severity: debugging-time
blast_radius: Editor mode, CMS re-render, and head-script-plus-leftover-embed overlap
supersedes:
proposed_rule: Guard init with a flag on the element so a second run is a no-op.
rule: H8
---

## Symptom

Two instances of a component on one node. Presents as doubled event handlers, doubled
animation speed, or state that fights itself — symptoms that point almost anywhere
except the real cause.

## Cause

Three known routes: the Webflow Editor re-renders a section as content is edited; a
Collection List can be re-injected; and a head script plus a leftover embed can both
fire on the same node.

## Fix

`if (el.dataset.tlInit) return; el.dataset.tlInit = '1';` at the top of init.

## Evidence

**Weak — this is the honest status of this learning.** The three routes are real
properties of the Webflow runtime, and the guard is cheap and standard practice, but no
specific logged bug in these projects traces to it. Promoted to `SKILL.md` as rule H8
provisionally, and marked as such there.

To firm it up: catch it happening once, in Editor mode or after a CMS re-render, and
replace this section with the reproduction.

## Why it generalises

If it holds at all it holds everywhere — nothing about it is component-specific.
