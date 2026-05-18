---
name: feature
description: Manage current feature workflow - start, review, explain or complete
argument-hint: load|start|review|test|explain|complete
---

# Feature Workflow Skill

Manages the full lifecycle of a feature from spec to merge.

## Working File

Uses: `@context/current-feature.md`

### File Structure

The current-feature.md file contains:

- `# Current Feature` — H1 heading with feature name when active
- `## Status` — Not Started | In Progress | Complete
- `## Goals` — Bullet points of what success looks like
- `## Notes` — Additional context, constraints, or details from spec
- `## History` — Completed features (append only)

## Available Actions

| Action | Description | Action Reference |
|--------|-------------|-----------------|
| `load` | Load a feature spec or inline description | `context/actions/feature/load.md` |
| `start` | Begin implementation, create branch | `context/actions/feature/start.md` |
| `review` | Check goals met, code quality | `context/actions/feature/review.md` |
| `test` | Write and run unit tests for the feature | `context/actions/feature/test.md` |
| `explain` | Document what changed and why | `context/actions/feature/explain.md` |
| `complete` | Commit, push, merge, reset | `context/actions/feature/complete.md` |

See [actions/feature/](../actions/feature/) for detailed instructions on each action.

Execute the requested action via `$ARGUMENTS`. If no action provided, explain the available options.
