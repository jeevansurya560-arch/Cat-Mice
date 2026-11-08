---
name: automated-testing
description: Rigorous unit testing, integration tests with wiremock/fixtures, visual golden-image regression tests, and cargo test suites.
---

# Automated Testing Skill

## Verification Matrix
- Unit: Progression boundaries (0, 249, 250, 749, 750, 2000), palette weights summing to 1.0, luminance ramp invariance.
- Visual: Structural pixel diffing between 0% grayscale and 100% color (silhouette must be 100% identical).
- Integration: Mocked GitHub GraphQL responses, invalid token handling, missing config fallback.
