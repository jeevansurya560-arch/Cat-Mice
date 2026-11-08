# Neo-Pokédex: Evolution Progression & Visual Milestones

## 1. Evolution Progression Thresholds

```text
[0 Commits] ─────────────────→ [249 Commits]
           CHARMANDER (#004)
           0% ────────────→ 100% Color
                     │
                     ▼ (Evolution Threshold: 250)
[250 Commits] ────────────────→ [749 Commits]
           CHARMELEON (#005)
           0% ────────────→ 100% Color
                     │
                     ▼ (Evolution Threshold: 750)
[750 Commits] ───────────────────────────────────────────────→ [2000+ Commits]
                               CHARIZARD (#006)
           0% ──────→ 40% (1250) ──────→ 60% (1500) ──────→ 80% (1750) ──────→ 100% (2000+)
```

---

## 2. Milestone Progression Checkpoints

For every character, visual quality is verified across seven standard checkpoints:

### Stage 1: Charmander (#004) — Lizard Pokémon
- **Master Sprite Resolution:** `160 x 160 px`
- **Masks:** `body`, `belly`, `face_eyes`, `limbs_claws`, `tail`, `flame`
- **Checkpoints:**
  - `0% (0 commits):` Crisp monochromatic grayscale. Deep shadow under belly, soft highlight on snout, detailed circular eye pupils, distinct flame contour.
  - `10% (25 commits):` Subtle warm spark in tail flame center.
  - `25% (62 commits):` Flame fully radiant; tail base and lower spine acquire warm orange tones.
  - `50% (125 commits):` Torso and limbs partially colored; cream belly begins warm transition.
  - `75% (187 commits):` Body, limbs, and snout fully colored; teal eyes brightly revealed.
  - `90% (224 commits):` Complete saturation across all clusters; final shadow tones enriched.
  - `100% (249 commits):` Fully saturated, high-contrast final colored Charmander.

### Stage 2: Charmeleon (#005) — Flame Pokémon
- **Master Sprite Resolution:** `160 x 160 px`
- **Masks:** `body`, `belly`, `cranial_crest`, `arms_claws`, `legs_claws`, `tail`, `flame`
- **Checkpoints:**
  - `0% (250 commits):` Pure monochromatic grayscale. Single cranial crest sharply defined, downward beak snout, smirk tooth, 3 sharp razor claws on each limb, blazing tail flame.
  - `10% (300 commits):` Intense yellow/orange core appears in the tail flame.
  - `25% (375 commits):` Tail and muscular hind thighs acquire deep coral-red hues.
  - `50% (500 commits):` Mid-torso, arms, and cream belly colored; head crest and facial planes remain in sharp grayscale.
  - `75% (625 commits):` Cranial crest and jaw colorized; emerald-teal eyes ignite.
  - `90% (700 commits):` Complete coverage; secondary language specular reflections on razor claws.
  - `100% (749 commits):` Full-spectrum master Charmeleon artwork.

### Stage 3: Charizard (#006) — Flame Pokémon
- **Master Sprite Resolution:** `160 x 160 px`
- **Masks:** `body`, `belly`, `head_horns`, `wings_outer`, `wings_inner_membrane`, `limbs_claws`, `tail`, `flame`
- **Checkpoints:**
  - `0% (750 commits):` Pure monochromatic grayscale. Massive bat wings, dual cranial horns, broad draconic snout, heavy foot talons, roaring inferno flame.
  - `25% (1062 commits):` Flame inferno fully blazing; tail and lower dragon flanks colored.
  - `40% (1250 commits):` Muscular legs, cream belly plates, and tail fully colored.
  - `60% (1500 commits):` Torso, draconic neck, and inner wing membranes (teal/cyan) rich with color.
  - `80% (1750 commits):` Outer wing spans and dual horns colorized; fierce eyes ignited.
  - `100% (2000+ commits):` Mastered Charizard with glowing ambient light and floating ember particles.

---

## 3. Geometric Invariance Verification

A visual regression test executes against every milestone:
$$\Delta_{\text{alpha}} = \sum_{x,y} \left| \alpha_{T=0}(x,y) - \alpha_{T=k}(x,y) \right| = 0$$
$$\Delta_{\text{silhouette}} = \sum_{x,y} \left( I_{\text{mask}}(x,y)_{T=0} \oplus I_{\text{mask}}(x,y)_{T=k} \right) = 0$$

If any pixel moves, shifts, or changes its bounding transparency between 0% and 100%, the visual test fails.

