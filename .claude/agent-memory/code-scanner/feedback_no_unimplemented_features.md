---
name: Only report actual issues
description: User does not want reports on features that are not yet implemented (e.g. missing auth is intentional)
type: feedback
---

Only report actual issues. Do NOT report things that are not implemented yet. If there is no authentication, don't report it as an issue.

**Why:** User is building incrementally and knows what hasn't been built yet. Flagging missing features adds noise.
**How to apply:** When scanning, distinguish between bugs/security holes in existing code vs. features that simply haven't been built. Only report the former.
