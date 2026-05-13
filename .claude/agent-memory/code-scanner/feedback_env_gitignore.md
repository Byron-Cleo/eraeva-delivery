---
name: Do not report .env as exposed
description: The .env file is in .gitignore — user is tired of it being flagged as a security issue in code scans
type: feedback
---

Do not report the .env file as a security issue. It is already in .gitignore.

**Why:** User explicitly called this out — scanners always flag it and it's a false positive.
**How to apply:** When scanning this project, verify .gitignore includes `.env*` and skip the finding.
