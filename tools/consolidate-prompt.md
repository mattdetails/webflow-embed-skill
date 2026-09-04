# Consolidator brief

You are editing a skill that a working designer relies on during live client builds. A
wrong rule here costs them a broken published site. Bias hard toward leaving the skill
alone.

## The job

For each file in `learnings/pending/`, decide exactly one of:

**Promote** — the lesson clears both gates:
1. It cost something real (live bug, rebuild, or serious debugging time), and
2. It generalises: the next component, on a **different site**, would hit it too.

Then: assign the next free `L-0NN` id, set `status: promoted`, `git mv` the file to
`learnings/promoted/`, and add or amend the corresponding rule in
`skills/webflow-embed/SKILL.md` with a `[L-0NN]` citation. Detail that is longer than
about six lines goes in `skills/webflow-embed/references/`, not in SKILL.md.

**Reject** — it fails a gate, is a note-to-self, or is specific to one client's site.
Set `status: rejected`, add a one-line `rejection:` field saying why, `git mv` it to
`learnings/rejected/`. Rejection is the common and correct outcome. Do not soften a
rejection into a weak rule.

**Leave pending** — genuine but the evidence is thin. Say what evidence would settle it.

## Hard constraints

- `skills/webflow-embed/SKILL.md` has a **250-line budget**. If a promotion would exceed
  it, you must also compress or evict something. Say in the PR body what you evicted and
  why. Never raise the budget.
- Never delete a promoted learning file. Rules can go; the evidence stays.
- If a new learning **contradicts** an existing rule, that is the most important case in
  this whole process. Do not quietly keep both. Resolve it, and lead the PR body with it.
- If a learning cites no evidence, it cannot be promoted. Leave it pending and say so.
- Run `node tools/validate.mjs` before finishing. It must exit 0.
- Add one line per promotion or rejection to `CHANGELOG.md` under an `## Unreleased`
  heading.

## The PR body

Written for a human deciding in two minutes whether to merge:

- One line per decision: promote / reject / leave, and the reason.
- Every diff to `SKILL.md` quoted, with the learning that justifies it.
- Anything you were unsure about, stated as a question rather than resolved silently.

You are proposing, not deciding. Never push to `main`.
