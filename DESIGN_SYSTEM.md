# Neo-Pokédex Design System Specification

## 1. Canvas & Grid Specifications

| Parameter | Value | Notes |
|---|---|---|
| **Native Sprite Canvas** | `160 x 160 px` | Sufficient native density for fine anatomical detailing, eye pupils, and multi-tone muscle clusters. |
| **Export Scaled Canvas** | `480 x 480 px` | Clean 3x nearest-neighbor integer scaling (`scale=3`); avoids subpixel anti-aliasing blur. |
| **SVG ViewBox** | `0 0 520 480` | Includes 40px HUD header area and 40px progress footer area. |
| **Aspect Ratio** | `1:1` (Character) / `13:12` (Container) | Balanced presentation inside GitHub profile README columns. |
| **Background** | Alpha Transparent (`#00000000`) or GitHub Card Dark (`#0d1117`) | Configurable by user in `config/default.toml`. |

---

## 2. Monochromatic Grayscale Token System

Used for the 0% grayscale baseline artwork and luminance extraction:

| Token | Hex Value | Normalized Luminance $Y$ | Semantic Application |
|---|---|---|---|
| `GRAY_DEEP_SHADOW` | `#1c1c1f` | `0.11` | Crevices, armpit folds, under-tail contact occlusion. |
| `GRAY_SHADOW` | `#404046` | `0.25` | Cast shadows, secondary anatomical planes. |
| `GRAY_MID_TONE` | `#707078` | `0.44` | Base body plane under diffuse ambient light. |
| `GRAY_BASE` | `#9c9ca4` | `0.61` | Primary lit surface of the body. |
| `GRAY_HIGHLIGHT` | `#c6c6cc` | `0.78` | Key light highlights on brow, snout bridge, shoulder crest. |
| `GRAY_SPECULAR` | `#f0f0f4` | `0.94` | Specular reflection points on claws, teeth, eye highlights. |
| `GRAY_WHITE` | `#ffffff` | `1.00` | Sclera, pure flame core center. |

---

## 3. Authentic Character Color Palettes

### Charmander (#004)
- **Body Base:** `#e86524` | **Body Shadow:** `#a83e12` | **Highlight:** `#f48b4e`
- **Belly Base:** `#f2d68e` | **Belly Shadow:** `#c8aa62`
- **Eye Iris:** `#3a92b8` (Teal-Blue)
- **Claws:** `#ffffff`
- **Outline:** `#231008`

### Charmeleon (#005)
- **Body Base:** `#dc4e42` | **Body Shadow:** `#9a3528` | **Highlight:** `#ea6c65`
- **Belly Base:** `#e8d5be` | **Belly Shadow:** `#bfa792`
- **Eye Iris:** `#1a7c73` (Deep Teal-Green)
- **Claws:** `#ffffff`
- **Outline:** `#2b100c`

### Charizard (#006)
- **Body Base:** `#e66a22` | **Body Shadow:** `#a2380d` | **Highlight:** `#f69450`
- **Belly Base:** `#e4ce8e` | **Belly Shadow:** `#bca05c`
- **Wing Inner Membrane:** `#1e7a78` | **Wing Membrane Shadow:** `#104a48`
- **Eye Iris:** `#2488a0`
- **Claws & Horns:** `#ffffff`
- **Outline:** `#26100a`

---

## 4. Universal Flame System

The tail flame is an authentic elemental fire system that remains warm and recognizable across all stages:

```text
[Inner White Core: #ffffff] 
       ↓
[Luminous Core: #ffea3b (Y=0.92)]
       ↓
[Mid Radiant Orange: #ff8f00 (Y=0.68)]
       ↓
[Outer Scarlet Tongue: #f03d1c (Y=0.48)]
       ↓
[Deep Crimson Edge: #b71c1c (Y=0.28)]
```

Language colors contribute subtle glowing ember sparks (`#00f2fe` for TypeScript, `#38ef7d` for Python) around the flame perimeter without distorting the core combustion gradient.

---

## 5. Typography & HUD Layout Specification

- **Font Stack:** `-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif`
- **Header Elements:**
  - `#000X` Dex Identifier: `13px`, Bold, `#8b949e`, letter-spacing `1px`.
  - Type Badge: `11px`, Bold, Fire `#ffa059`.
  - Character Name: `20px`, Heavy (`800`), `#ffffff`.
  - Contribution Counter: `14px`, Heavy, `#f0f6fc` aligned right.
- **Progress Bar:**
  - Track: `440px` width, `8px` height, `4px` radius, `#21262d`.
  - Fill: Linear gradient across authentic flame stops.
  - Metric Text: `11px`, Bold, `#8b949e` with percentage readout.

