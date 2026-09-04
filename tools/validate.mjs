#!/usr/bin/env node
/**
 * Structural checks for the skill and its learnings archive.
 * No dependencies, no API key. Runs on every push and pull request.
 *
 * It cannot tell you whether a rule is *correct* — only whether the loop is intact:
 * every rule traceable to evidence, every learning either in use or explicitly parked,
 * and the skill still small enough that someone will read it.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const BUDGET_LINES = 250;
const BUDGET_CHARS = 14000;
const STALE_DAYS = 30;

const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

/** Minimal YAML frontmatter reader — flat key: value pairs only, which is all we use. */
function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const out = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([a-z_]+):\s*(.*)$/i);
    if (kv) { key = kv[1]; out[key] = kv[2].trim(); }
    else if (key && /^\s+\S/.test(line)) out[key] = (out[key] + ' ' + line.trim()).trim();
  }
  return out;
}

const readLearnings = (dir) => {
  const p = join(ROOT, 'learnings', dir);
  if (!existsSync(p)) return [];
  return readdirSync(p)
    .filter((f) => f.endsWith('.md') && f !== 'TEMPLATE.md')
    .map((f) => {
      const text = readFileSync(join(p, f), 'utf8');
      return { file: `learnings/${dir}/${f}`, fm: frontmatter(text) || {}, text };
    });
};

// ---------------------------------------------------------------- 1. skills
const skillsDir = join(ROOT, 'skills');
const skills = readdirSync(skillsDir).filter((d) => existsSync(join(skillsDir, d, 'SKILL.md')));
if (!skills.length) fail('No skills found under skills/');

for (const name of skills) {
  const path = join(skillsDir, name, 'SKILL.md');
  const text = readFileSync(path, 'utf8');
  const fm = frontmatter(text);
  if (!fm) { fail(`${name}/SKILL.md: missing or malformed frontmatter`); continue; }
  if (!fm.name) fail(`${name}/SKILL.md: frontmatter has no "name"`);
  else if (fm.name !== name) fail(`${name}/SKILL.md: name "${fm.name}" does not match its directory`);
  if (!fm.description) fail(`${name}/SKILL.md: frontmatter has no "description"`);
  else if (fm.description.length < 80)
    warn(`${name}/SKILL.md: description is ${fm.description.length} chars — too thin to trigger reliably`);
}

// ------------------------------------------------- 2. budget on the main skill
const mainPath = join(skillsDir, 'webflow-embed', 'SKILL.md');
const main = readFileSync(mainPath, 'utf8');
const lines = main.split('\n').length;
if (lines > BUDGET_LINES) fail(`webflow-embed/SKILL.md is ${lines} lines, budget is ${BUDGET_LINES}. Compress a rule or move detail into references/.`);
else if (lines > BUDGET_LINES * 0.85) warn(`webflow-embed/SKILL.md is ${lines}/${BUDGET_LINES} lines — approaching budget.`);
if (main.length > BUDGET_CHARS) fail(`webflow-embed/SKILL.md is ${main.length} chars, budget is ${BUDGET_CHARS}.`);

// -------------------------------------------------------- 3. provenance links
const promoted = readLearnings('promoted');
const pending = readLearnings('pending');
const byId = new Map();
for (const l of [...promoted, ...pending]) {
  if (!l.fm.id) { fail(`${l.file}: no id in frontmatter`); continue; }
  if (byId.has(l.fm.id)) fail(`Duplicate learning id ${l.fm.id}: ${byId.get(l.fm.id).file} and ${l.file}`);
  byId.set(l.fm.id, l);
}

const cited = new Set([...main.matchAll(/\[(L-\d+)(?:\s*—\s*provisional)?\]/g)].map((m) => m[1]));
for (const id of cited) {
  const l = byId.get(id);
  if (!l) { fail(`SKILL.md cites ${id}, which has no learning file. A rule without evidence is an opinion.`); continue; }
  const isProvisional = main.includes(`[${id} — provisional]`);
  if (l.fm.status === 'pending' && !isProvisional)
    fail(`SKILL.md cites ${id} as settled, but ${l.file} is still status: pending. Mark the rule "[${id} — provisional]" or promote the learning.`);
  if (l.fm.status === 'promoted' && isProvisional)
    warn(`${id} is promoted but SKILL.md still marks its rule provisional — drop the marker.`);
  if (l.fm.status === 'rejected')
    fail(`SKILL.md cites ${id}, which was rejected. Remove the rule.`);
}

// ------------------------------------------------------- 4. orphans and staleness
for (const l of promoted) {
  if (l.fm.rule && l.fm.rule.startsWith('R') && !main.includes(l.fm.rule + ' '))
    warn(`${l.file} claims rule ${l.fm.rule}, but SKILL.md has no such rule — promoted but not in use.`);
  if (!/## Evidence\s*\n\s*\S/.test(l.text))
    fail(`${l.file}: empty Evidence section. Promotion requires evidence.`);
  for (const field of ['date', 'severity', 'blast_radius']) {
    if (!l.fm[field]) fail(`${l.file}: missing "${field}" in frontmatter`);
  }
}

const now = Date.now();
for (const l of pending) {
  const age = l.fm.date ? Math.floor((now - Date.parse(l.fm.date)) / 86400000) : null;
  if (age !== null && age > STALE_DAYS)
    warn(`${l.file} has been pending ${age} days. Promote it, reject it, or move it to the project README.`);
}

// ------------------------------------------------------------------- report
const counts = `${skills.length} skills · ${promoted.length} promoted · ${pending.length} pending · ${lines}/${BUDGET_LINES} lines`;
for (const w of warnings) console.log(`  warn   ${w}`);
for (const e of errors) console.log(`  ERROR  ${e}`);
console.log(`\n${errors.length ? 'FAIL' : 'ok'} — ${counts}, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
