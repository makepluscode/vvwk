# CURSOR.md

Execution guide for Cursor agents. Refer to `AGENTS.md` for the unified SOP.

## 1. Rule Reference
- Rules are defined in `.cursor/rules/` as `.mdc` files.
- Cursor applies rules automatically based on `globs` patterns in each file's frontmatter.

## 2. Memory Usage
- At the start of a session, read `.agents/memory/context.md` to understand the project's current status.
- Record any errors or newly learned patterns in `.agents/memory/error_fixes.md`.

## 3. Key References
- @AGENTS.md: Unified SOP.
- @.agents/memory/context.md: Project goals and status.
