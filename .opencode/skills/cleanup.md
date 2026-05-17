---
name: cleanup
description: Clean up project housekeeping tasks (add "run" to execute fixes)
argument-hint: run|check
---

# Cleanup Skill

Manages project housekeeping tasks like removing console.logs, unused imports, and stale TODO comments.

## Cleanup Tasks

Review the codebase for:

1. Verify history in @context/current-feature.md is ordered from oldest to newest
2. Find unnecessary console.log statements in src/
3. Find unused imports
4. Check for stale TODO comments
5. Find orphaned/unused files
6. Verify context files match actual project state
7. Check that .env.production has the same variables as .env (values may differ, but keys should match)
8. Find stale `@ts-ignore` comments

## Behavior by Mode

### Check Mode (default)
- Only report findings, don't modify anything
- List what WOULD be cleaned up
- Usage: `cleanup` or `cleanup check`

### Run/Fix Mode
- First, report all findings with numbered items
- Then prompt: "Which items would you like me to fix? (enter numbers like 1,3,5 or 'all' or 'none')"
- Wait for user response before making any changes
- Only fix specified items
- Report what changed
- Usage: `cleanup run` or `cleanup fix`
