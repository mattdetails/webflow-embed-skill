---
id: L-003
date: 2026-09-01
slug: literal-closing-tag-kills-embed
project: carousel bound to a Collection List
status: promoted
severity: live-bug
blast_radius: any HTML Embed; failure is silent
supersedes:
proposed_rule: No literal closing style or script tag anywhere in a file destined for an Embed — including in strings and comments.
rule: H2
---

## Symptom

An embed's contents stop working partway through, with no console error and no visual
indication of where it stopped.

## Cause

The HTML parser closes the block at the first literal closing tag it sees, wherever it
appears — inside a JS string, a comment, or a regex included. Everything after it is
parsed as page markup and discarded.

## Fix

Never write the literal sequence. Where one must be emitted, split it across a
concatenation so the parser never sees it whole.

## Evidence

Recorded in the project README's live-bug list.

## Why it generalises

It is a property of the HTML parser and of the Embed delivery mechanism, not of any
component. Every embed-delivered component is exposed to it, and the silence is what
makes it expensive — it presents as "the code just doesn't run" rather than as a
syntax error.
