# vvwk-skills — Vivo Wiki (VVWK)

A living knowledge base maintained by AI agents.
Drop in source documents — agents ingest, connect, query, and visualize your knowledge so it stays alive and in circulation.

> *Vivo* — alive. Knowledge that grows, links, and flows rather than sitting static in files.

```
ingest → query → synthesize → lint → graph
```

---

## What It Is

**Vivo Wiki** is an agent-maintained personal knowledge base framework.
It automates the full lifecycle of knowledge management:

1. **Ingest** — Convert raw documents into structured wiki pages, extracting entities and concepts
2. **Query** — Synthesize answers across multiple pages with wikilink citations
3. **Synthesize** — Save query answers as reusable synthesis pages
4. **Lint** — Health-check for broken links, orphans, contradictions, and stale content
5. **Graph** — Visualize the knowledge network as an interactive HTML graph

---

## Supported Agents

Works with any AI coding agent out of the box:

| File | Agent |
|------|-------|
| `AGENTS.md` | Codex, Copilot, and other general-purpose agents |
| `CLAUDE.md` | Claude Code (`claude` CLI) |
| `CURSOR.md` + `.cursor/rules/` | Cursor |
| `CODEX.md` | OpenAI Codex CLI |
| `GEMINI.md` | Gemini CLI |

---

## Installation

### Clone and install skills

```bash
git clone https://github.com/makepluscode/vvwk-skills.git
cd vvwk-skills
node scripts/install-skills.js                        # → .claude/skills/
node scripts/install-skills.js --target .agents/skills  # → .agents/skills/
```

Or with npm:

```bash
npm run install-skills
npm run install-skills:agents
```

> `scripts/install-skills.js` reads `skills-lock.json` directly and sparse-clones
> only the required directories from each source repo — no manual steps needed.

---

## Project Setup

Create this directory structure once in your wiki project:

```
raw/              # Drop zone — place source documents here before ingesting
wiki/
  index.md        # Catalog of all pages (auto-maintained)
  log.md          # Append-only change log (auto-maintained)
  overview.md     # Living synthesis across all sources (auto-maintained)
  originals/      # Full source docs after ingest — read-only archive
  sources/        # One summary page per source document
  entities/       # People, companies, projects, products
  concepts/       # Ideas, frameworks, methods, theories
  syntheses/      # Saved query answers
graph/            # Auto-generated graph data (graph.json, graph.html)
```

Only `raw/` and `wiki/` need to be created manually. Subdirectories are created automatically during ingest.

---

## Commands

All commands work as slash commands or natural language.

### Ingest a document

```
/wiki-ingest raw/my-article.md
```

Reads the source, creates a summary in `wiki/sources/`, extracts entities and concepts, archives the original, and updates `wiki/index.md` and `wiki/overview.md`.

**Supported formats:** `.md`, `.txt`, `.pdf`, `.docx`, `.pptx`, `.xlsx`

### Query the knowledge base

```
/wiki-query what are the main themes across all sources?
```

Synthesizes a markdown answer with `[[wikilink]]` citations from across the wiki.

### Save a synthesis

```
/wiki-synthesize
```

Saves the most recent query answer as a page in `wiki/syntheses/`.

### Lint the wiki

```
/wiki-lint
```

Checks for orphan pages, broken wikilinks, missing entity pages, contradictions, stale summaries, and data gaps.

```bash
python scripts/lint.py --save   # save report to wiki/lint-report.md
```

### Build the knowledge graph

```
/wiki-graph
```

Generates `graph/graph.html` — a self-contained, interactive vis.js visualization of all pages and their connections.

```bash
python scripts/build_graph.py --open
```

---

## Page Format

Every wiki page uses this frontmatter:

```yaml
---
title: "Page Title"
type: source | entity | concept | synthesis
tags: []
sources: []            # list of source slugs that inform this page
last_updated: YYYY-MM-DD
---
```

Use `[[PageName]]` wikilinks to link between pages.

### Naming conventions

| Type | Location | Naming |
|------|----------|--------|
| Source | `wiki/sources/` | `kebab-case.md` |
| Entity | `wiki/entities/` | `TitleCase.md` |
| Concept | `wiki/concepts/` | `TitleCase.md` |
| Synthesis | `wiki/syntheses/` | `kebab-case.md` |

---

## Agent Memory & Rules

```
.agents/
  rules/
    coding-standards.md   # Code style (auto-loaded by file pattern)
    git-workflow.md       # Commit conventions, branching strategy
  memory/
    context.md            # Project goals and current status
    history.md            # Major task and decision log
    error_fixes.md        # Recurring errors and fixes (Gotchas)
```

Edit `.agents/memory/context.md` to define your project's goals and keep agents aligned across sessions.

---

## Included Skills

| Skill | Purpose |
|-------|---------|
| `brainstorming` | Explore design before implementation |
| `writing-plans` | Plan before touching code |
| `executing-plans` | Execute plans with review checkpoints |
| `test-driven-development` | Tests before implementation |
| `systematic-debugging` | Root-cause analysis before fixes |
| `subagent-driven-development` | Parallel in-session task execution |
| `dispatching-parallel-agents` | Dispatch independent tasks to parallel agents |
| `grill-me` | Stress-test a plan |
| `grill-with-docs` | Validate plan against project domain model |
| `llm-wiki` | Core wiki skill (ingest / query / lint / graph) |
| `vercel-react-best-practices` | React / Next.js performance patterns |

---

## Gotchas

- **`raw/` is a drop zone** — files move to `wiki/originals/` after ingest
- **Never modify `wiki/originals/`** — read-only archive
- **Keep `wiki/index.md` current** — stale index breaks `/wiki-query`
- **Wikilinks are case-sensitive** — `[[OpenAI]]` ≠ `[[Openai]]`
- **`wiki/log.md` is append-only** — never edit past entries
- **Scripts run from project root** — `python scripts/build_graph.py` must run from your wiki project directory

---

## License

MIT
