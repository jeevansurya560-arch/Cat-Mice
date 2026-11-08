---
name: github-api-integration
description: GitHub GraphQL API integration for user contribution calendar retrieval, rate-limit management, token authentication, and cache policies.
---

# GitHub API Integration Skill

## Principles
- Use GraphQL `user(login: $username) { contributionsCollection { contributionCalendar { ... } } }` for exact commit, PR, review counts.
- Handle primary rate limits (5,000 pts/hr authenticated) via exponential backoff with jitter.
- Never log GH_TOKEN or Authorization headers; sanitize error payloads.
- Provide an offline/cached snapshot mechanism to support deterministic testing without network egress.
