---
name: feature
description: Manage current feature workflow - start, review, explain or complete
argument-hint: load|start|review|explain|complete
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

| Action | Description |
|--------|-------------|
| `load` | Load a feature spec or inline description |
| `start` | Begin implementation, create branch |
| `review` | Check goals met, code quality |
| `explain` | Document what changed and why |
| `complete` | Commit, push, merge, reset |

### load
1. Reads a feature specification from @context/features/
2. Populates current-feature.md with name, goals, and notes
3. Sets Status to "Not Started"

### start
1. Verifies Goals are populated in current-feature.md
2. Sets Status to "In Progress"
3. Creates and checks out a feature branch (derived from H1 heading)
4. Lists the goals and begins implementation

### review
1. Checks if all goals in current-feature.md have been met
2. Reviews code quality and organization
3. Suggests any improvements before completion

### explain
1. Reads current-feature.md to understand what was implemented
2. Gets list of changed files from `git diff main --name-only`
3. For each file created or modified:
   - Shows file path
   - Gives 1-2 sentence explanation of what changed
   - Highlights key functions, components, or patterns
4. Ends with summary of how pieces fit together

### complete
1. Commits changes with meaningful message
2. Pushes to remote
3. Creates and merges pull request
4. Resets current-feature.md for next feature
