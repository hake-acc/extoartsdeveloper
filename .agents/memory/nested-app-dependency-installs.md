---
name: Nested app dependency installs
description: Environment-specific guidance for projects whose runnable app lives below the workspace root.
---

When a project workflow runs from a nested application directory, install dependencies from that directory with its existing package manager and lockfile. Workspace-level package helpers may create unrelated root manifests and dependencies instead of populating the app's `node_modules`.

**Why:** The imported project runs from `nextjs/`, while the package helper operates from the workspace root when invoked without a directory context.

**How to apply:** Inspect the workflow command and app lockfile first. For a nested Next.js app, use the package manager and frozen lockfile from the app directory, then restart the workflow.