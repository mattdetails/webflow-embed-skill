---
id:            # required, even while pending: next free L-0NN (validate.mjs enforces it)
date:          # YYYY-MM-DD
slug:          # short-kebab-case, matches the filename
project:       # repo or client site this came from
status: pending   # pending | promoted | rejected
severity:      # live-bug | rebuild | debugging-time
blast_radius:  # e.g. "phone only, at carousel edges" — be narrow and honest
supersedes:    # rule id this contradicts, or blank
proposed_rule: # the one-line rule you think SKILL.md should carry, or blank
---

## Symptom

What was observably wrong. Write it the way you would search for it in six months,
when the cause is exactly what you do not know yet.

## Cause

The actual mechanism. Not "a bug in X" — the chain, step by step.

## Fix

What was changed, and why that specific change rather than the obvious one.

## Evidence

The proof it was real and the fix worked. A reproduction, a measurement, a commit SHA,
a before/after. A learning without evidence is an opinion, and gets rejected at review.

## Why it generalises

The case for gate 2 — the next component, on a different site, hitting the same thing.
If you cannot make this case, this belongs in the project README instead.
