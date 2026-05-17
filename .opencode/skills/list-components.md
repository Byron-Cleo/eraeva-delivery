---
name: list-components
description: List all React components in the project
argument-hint: "[subdirectory]"
---

# List Components Skill

Lists all React component files in the project, optionally filtered by subdirectory.

## Task

List all React component files (.tsx, .ts, .jsx, .js) in the components folder.

If a `[subdirectory]` argument is provided (e.g., `list-components dashboard`), only list files in that subdirectory.

## Output Format

- Numbered list of files with relative paths
- Brief one-line description for each (inferred from filename)
- Summary count at the end

If no files found, respond: "No components found."

## Example Usage

- `list-components` — Show all components
- `list-components auth` — Show only auth components
- `list-components dashboard` — Show only dashboard components
