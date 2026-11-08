# Language Attribution Model & Palette Registry

## 1. The GitHub Language Attribution Problem

> [!WARNING]
> **The Critical Limitation:**
> GitHub's repository `languages` API measures the **aggregate byte count of the entire repository**.
> This does **not** reflect an individual contributor's personal contribution shares. For instance, contributing 200 lines of Python to a 50MB C++ repository would register as $< 0.1\%$ Python under naive repository-wide metrics.

### Neo-Pokédex Attribution Methodology:
Neo-Pokédex implements a multi-tier attribution engine:

```text
               Tier 1: Commit Patch Analysis
       (Inspects actual added/modified lines by file extension)
                             │
                             ▼ (If rate-limited or shallow)
        Tier 2: Repository Weighted Contribution Model
    (Weights repo primary languages by user's commit volume)
                             │
                             ▼ (If API completely unreachable)
            Tier 3: User Configured Override / Fallback
```

### Attribution Formulation:
For each user commit $c$ within the reporting period:
1. Parse modified file paths $f \in c$.
2. Match file extension to programming language $L(f)$ using GitHub Linguist definitions (ignoring generated files, documentation, and lockfiles).
3. Sum added lines $\Delta_{\text{lines}}(f)$:
   $$A_i = \sum_{f \in \text{user commits}, L(f) = i} \Delta_{\text{lines}}(f)$$
4. Calculate normalized language weight $W_i$:
   $$W_i = \frac{A_i}{\sum_{j=1}^n A_j}, \quad \sum_{i=1}^n W_i = 1.0$$

---

## 2. Central Language Palette Registry

Official Linguist brand colors and tonal stops in OKLab space:

| Language | Primary Hex | Highlight Hex | Shadow Hex | Notes |
|---|---|---|---|---|
| **Python** | `#3776AB` | `#5aa9e6` | `#1f486d` | Official Python blue. |
| **JavaScript** | `#F7DF1E` | `#fff066` | `#b8a209` | Official JS bright yellow. |
| **TypeScript** | `#3178C6` | `#589ef0` | `#1a4b80` | Official TS deep blue. |
| **Rust** | `#DEA584` | `#f0c2a8` | `#9c6546` | Rust warm crab-shell tan. |
| **Go** | `#00ADD8` | `#40d5fc` | `#006f8c` | Gopher cyan. |
| **C++** | `#00599C` | `#2d88d6` | `#00335c` | Standard C++ blue. |
| **C** | `#A8B9CC` | `#d2e0ee` | `#6b7e94` | Classic slate grey. |
| **Java** | `#E76F00` | `#ff9e3b` | `#8f4200` | Duke flame orange. |
| **HTML** | `#E34F26` | `#f07c5b` | `#962d10` | HTML5 orange-red. |
| **CSS** | `#1572B6` | `#419be0` | `#0b4673` | CSS3 blue. |
| **Ruby** | `#CC342D` | `#e8645e` | `#7a1712` | Ruby gem crimson. |
| **Swift** | `#F05138` | `#f88673` | `#9b2c1a` | Swift bird orange. |
| **Kotlin** | `#7F52FF` | `#aa8aff` | `#4824b3` | JetBrains purple. |
| **Fallback** | `#8B949E` | `#b1bac4` | `#484f58` | GitHub neutral gray. |

---

## 3. Configuration & Overrides

Users can override attribution or pin custom weights in `config/default.toml`:
```toml
[languages]
# Mode: "auto" (commit diffs) | "repo_summary" | "manual"
mode = "auto"

[languages.manual_weights]
Rust = 0.60
Python = 0.30
TypeScript = 0.10
```
This guarantees determinism for offline testing or developers with legacy private commit histories.

