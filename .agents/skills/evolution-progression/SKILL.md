---
name: evolution-progression
description: Deterministic contribution thresholds, boundary clamping, stage evolution state machines, and mathematical progression metrics.
---

# Evolution Progression Skill

## Rules
- Stage 1: Charmander (0 to 249 commits). T = P / 249.0.
- Stage 2: Charmeleon (250 to 749 commits). T = (P - 250) / 499.0.
- Stage 3: Charizard (750+ commits). T = clamp((P - 750) / 1250.0, 0.0, 1.0) with full mastery at 2,000+.
- Boundary values must never produce negative percentages or exceed 100.0%.
