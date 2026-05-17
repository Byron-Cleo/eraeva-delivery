---
description: Manage current feature workflow - load, start, review, explain, complete
---

# Feature Workflow

Manages the full lifecycle of a feature from spec to merge.

## Working File

Uses: @context/current-feature.md

Available actions: load, start, review, explain, complete

### load
1. Read specified feature file from @context/features/
2. Populate current-feature.md with name, goals, and notes
3. Set Status to "Not Started"

### start
1. Verify Goals are populated in current-feature.md
2. Set Status to "In Progress"
3. Create and checkout a feature branch
4. List goals and begin implementation

### review
1. Check if all goals in current-feature.md are met
2. Review code quality and organization
3. Suggest improvements before completion

### explain
1. Read current-feature.md
2. Get changed files from `git diff main --name-only`
3. Explain what changed per file
4. Summarize how pieces fit together

### complete
1. Commit changes with meaningful message
2. Push to remote
3. Create and merge pull request
4. Reset current-feature.md

Action: $ARGUMENTS
