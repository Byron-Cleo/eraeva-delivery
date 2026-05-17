---
description: Clean up project housekeeping tasks (check or run)
---

Review the codebase for:

1. Verify history in @context/current-feature.md is ordered oldest to newest
2. Find unnecessary console.log statements in src/
3. Find unused imports
4. Check for stale TODO comments
5. Find orphaned/unused files
6. Verify context files match project state
7. Check .env.production has same variables as .env
8. Find stale `@ts-ignore` comments

Mode: $ARGUMENTS

If "check" or no argument: report findings only, don't modify.
If "run" or "fix": report findings, then ask which items to fix interactively.
