---
name: github-actions
description: Automated CI/CD workflows, profile README marker synchronization, artifact generation, least-privilege token permissions, and idempotency.
---

# GitHub Actions Skill

## Protocol
- Scheduled cron (nightly) + workflow_dispatch.
- Permissions: contents: write.
- Marker bounds: <!-- NEO-POKEDEX:START --> and <!-- NEO-POKEDEX:END -->.
- Idempotency: Commit and push ONLY if generated binary assets or README markdown have genuinely changed.
