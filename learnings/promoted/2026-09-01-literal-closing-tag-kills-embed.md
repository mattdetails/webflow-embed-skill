---
id: L-003
date: 2026-09-01
slug: literal-closing-tag-kills-embed
project: carousel bound to a Collection List
status: promoted
severity: live-bug
blast_radius: any HTML Embed; failure is silent
supersedes:
proposed_rule: No literal closing tag for the block a file becomes — in strings and comments too. Only the matching tag matters.
rule: R2
---

## Symptom

An embed's contents stop working partway through. The remainder of the code appears as
visible text on the page, and the console error — when there is one — points at a line
that looks perfectly fine.

## Cause

A script block ends at the first `</script` the HTML tokenizer sees, and a style block
at the first `</style`. The tokenizer is in RAWTEXT/script-data state and reads tags,
not JavaScript or CSS, so a string, comment or regex gives no protection.

Only the **matching** tag terminates the block.

## Fix

Check each source file against the block it actually becomes. Where the sequence must be
emitted, split it so the parser never sees it whole: `'<' + '/script>'`.

## Evidence

Originally recorded in a project README's live-bug list. **Re-verified 2026-09-03**
against Python's `html.parser`, which implements the same RAWTEXT rule:

| Input | Result |
|---|---|
| `<script>var s = "</script>"; done();</script>` | script ends inside the string; `done()` never runs; `"; done();` leaks to the page |
| `<script>var s = "</style>"; done();</script>` | **harmless** — passes through as script data |
| `<style>.a{} /* </style> */ .b{}</style>` | style ends inside the comment; `*/ .b{}` leaks to the page |
| `<style>.a{} /* </script> */ .b{}</style>` | **harmless** |
| `<script>var s = "<" + "/script>";</script>` | the escape works |

The two harmless rows corrected the rule: the first version banned both tags in every
file, which is over-broad. The original wording also called the failure silent; in the
common case JS throws an unterminated-string error as well.

## Why it generalises

It is a property of the HTML parser, not of any component or of Webflow — every inline
script or style in any HTML is exposed to it. Embeds just make it likely, because they
are where hand-written script and style get pasted whole.

What makes it expensive is misdirection rather than silence: the break happens at the
tag, but the error surfaces wherever the truncated code first fails to parse.
