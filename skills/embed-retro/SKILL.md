---
name: embed-retro
description: Capture what a Webflow component build taught into a reviewable learning file, so the webflow-embed skill improves instead of the lesson dying in one project's README. Use after shipping a component, after fixing a bug in a shipped one, or when the user says a rule in the skill was wrong or missing. Triggers on embed retro, retro, capture this lesson, the skill should have known, add this to the skill, that gotcha keeps happening.
---

# Embed retro

This is the capture half of the `webflow-embed` loop. It writes candidates. It does not
edit `SKILL.md` — promotion is a separate, reviewed step (see `README.md` in the repo
root). Keeping those apart is the whole reason the skill does not rot.

## When to run

- A component shipped
- A bug in a shipped component was found and fixed
- The user pushed back on something the skill told them to do
- You noticed yourself rediscovering something the skill should have said

## The bar

A candidate must clear **both** gates. Say out loud which one is in doubt if either is.

1. **It cost something.** Real debugging time, a broken published site, or a rebuild.
   Not "I read the docs and learned a thing."
2. **It generalises.** The next component, on a **different site**, would hit this too.

Fails gate 2 → it belongs in that project's README gotchas, not here. Say so and write
it there instead. Most findings are this, and that is the correct outcome — a skill that
absorbs everything becomes a skill nobody reads.

## Writing one

One file per lesson, at `learnings/pending/YYYY-MM-DD-short-slug.md`, using
`learnings/TEMPLATE.md`. Fill every field; `evidence` and `symptom` are what make the
lesson survive review six months from now, when nobody remembers the build.

```bash
./tools/new-learning.sh swiper-observeparents-loop
```

Be specific about the **symptom** — the observable, wrong behaviour — separately from
the **cause**. Future-you searches by symptom, because the symptom is all you have when
it happens again.

State the **blast radius** honestly. "Phone only, edge states only" is far more useful
than "breaks swiping," and it tells the next person what to test.

If the lesson contradicts an existing rule in `SKILL.md`, say so in `supersedes:` and
explain why the old rule was wrong. Contradictions are the most valuable learnings and
the most likely to be missed.

## Then

```bash
git add learnings/pending && git commit -m "Learning: <slug>" && git push
```

That push is what triggers consolidation. What happens next is in the repo `README.md` —
the short version is that a PR gets opened proposing edits to `SKILL.md`, and a human
merges it or does not.
