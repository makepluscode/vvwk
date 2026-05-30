# CODEX.md

Execution guide for OpenAI Codex CLI agents. Refer to `AGENTS.md` for the unified SOP.

## 1. Rule Reference
- Refer to Markdown files in the `.agents/rules/` directory.
- Rules are applied based on the `pattern` field in each file's YAML front matter.

## 2. Memory Usage
- At the start of a session, read `.agents/memory/context.md` to understand the project's current status.
- Record any errors or newly learned patterns in `.agents/memory/error_fixes.md`.

## 3. Tool Mapping
Codex uses different tool names than Claude Code. Use the equivalents below:

| Skill references    | Codex equivalent                          |
|---------------------|-------------------------------------------|
| `Task` (subagent)   | `spawn_agent` / `wait_agent` / `close_agent` |
| `TodoWrite`         | `update_plan`                             |
| `Skill` tool        | Skills load natively — follow instructions |
| `Read/Write/Edit`   | Native file tools                         |
| `Bash`              | Native shell tools                        |

## 4. Multi-Agent Support
To enable parallel subagent dispatch (required for `dispatching-parallel-agents` and `subagent-driven-development` skills), add to `~/.codex/config.toml`:

```toml
[features]
multi_agent = true
```

## 5. Key References
- @AGENTS.md: Unified SOP.
- @.agents/memory/context.md: Project goals and status.
- @.claude/skills/using-superpowers/references/codex-tools.md: Full tool mapping reference.
