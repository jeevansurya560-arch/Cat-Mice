# Neo-Pokédex: Mathematical Colorization Engine & Palette Systems

## 1. Mathematical Model Formulation

Every rendered pixel $O(x,y)$ is deterministically computed from four inputs:
1. $I_{\text{gray}}(x,y)$: Original grayscale master artwork pixel at coordinate $(x,y)$.
2. $M_r(x,y)$: Binary/alpha anatomical mask for region $r$ ($r \in \{\text{body}, \text{belly}, \text{face}, \text{limbs}, \text{wings}, \text{tail}, \text{flame}\}$).
3. $C_{\text{mix}}$: Perceptually mixed programming-language palette.
4. $T(P) \in [0, 1]$: Contribution-based colorization progress.

---

## 2. Contribution Progression Functions $T(P)$

Given total contribution count $P \in \mathbb{N}$:

### Stage 1: Charmander (0 to 249 commits)
$$T(P) = \text{clamp}\left(\frac{P - 0}{249 - 0}, 0.0, 1.0\right) = \text{clamp}\left(\frac{P}{249}, 0.0, 1.0\right)$$
- $P = 0 \implies T = 0.00$ ($0\%$ color)
- $P = 125 \implies T = 0.50$ ($50\%$ color)
- $P = 249 \implies T = 1.00$ ($100\%$ color)

### Stage 2: Charmeleon (250 to 749 commits)
$$T(P) = \text{clamp}\left(\frac{P - 250}{749 - 250}, 0.0, 1.0\right) = \text{clamp}\left(\frac{P - 250}{499}, 0.0, 1.0\right)$$
- $P = 250 \implies T = 0.00$ ($0\%$ color)
- $P = 500 \implies T = 0.50$ ($50\%$ color)
- $P = 749 \implies T = 1.00$ ($100\%$ color)

### Stage 3: Charizard (750+ commits)
$$T(P) = \text{clamp}\left(\frac{P - 750}{2000 - 750}, 0.0, 1.0\right) = \text{clamp}\left(\frac{P - 750}{1250}, 0.0, 1.0\right)$$
- $P = 750 \implies T = 0.00$ ($0\%$ color)
- $P = 1250 \implies T = 0.40$ ($40\%$ color)
- $P = 1500 \implies T = 0.60$ ($60\%$ color)
- $P = 1750 \implies T = 0.80$ ($80\%$ color)
- $P \ge 2000 \implies T = 1.00$ ($100\%$ color)

$$\text{ColorizationPercentage} = T(P) \times 100$$

---

## 3. Luminance Extraction & 5-Stop Tonal Ramp

For each input grayscale pixel $G(x,y) \in [0, 255]$:
$$Y(x,y) = \frac{G(x,y)}{255.0} \in [0.0, 1.0]$$

Given a target color $C_{\text{target}}$ derived for anatomical region $r$, we generate a 5-stop perceptual tonal ramp in OKLab color space:

| Tonal Stop | Target Luminance $L_{\text{target}}$ | Chromaticity Multiplier $C_{\text{mult}}$ | Description |
|---|---|---|---|
| **Deep Shadow** | $0.15$ | $0.65$ | Deep creases, crevices, contact occlusion. |
| **Shadow** | $0.35$ | $0.85$ | Form shadows away from light. |
| **Base Tone** | $0.55$ | $1.00$ | True diffuse body tone under neutral light. |
| **Highlight** | $0.78$ | $0.90$ | Surfaces catching direct directional light. |
| **Specular** | $0.95$ | $0.40$ | Specular glints (desaturates towards white). |

For any pixel luminance $Y$, we interpolate piecewise-linearly between the two bounding tonal stops in OKLab space:
$$I_{\text{color}}(x,y) = \text{Interpolate}_{\text{OKLab}}(\text{Stop}_k, \text{Stop}_{k+1}, t_Y)$$

This ensures that original texture contrast and muscle shading are mathematically preserved without flattening into uniform solid fills.

---

## 4. Language Palette Mixing in Perceptual Color Space

For $n$ detected programming languages with attributed activity $A_i$:
$$W_i = \frac{A_i}{\sum_{j=1}^n A_j}, \quad \sum_{i=1}^n W_i = 1.0$$

Convert each language sRGB color to OKLab coordinates $C_i = (L_i, a_i, b_i)$.

### Perceptual Mixture Equation:
$$C_{\text{mix}} = \sum_{i=1}^n \left(W_i \cdot C_i\right)$$

For hue-sensitive mixing, we convert to OKLCH $(L, C, h)$ and compute circular weighted hue:
$$\bar{h} = \text{atan2}\left(\sum_{i=1}^n W_i \sin(h_i), \sum_{i=1}^n W_i \cos(h_i)\right)$$

### Dominant Language Rule:
The dominant language $W_{\max} = \max(W_i)$ anchors the primary hue. Secondary languages are allocated to highlight rim lighting and particle accents, preventing low-share languages from muddying the primary identity.

### Anatomical Region Harmonization:
To preserve Pokémon recognizability, language colors are blended with authentic Pokémon colors using region weights $B_r$:
$$\text{FinalTargetColor}_r = \text{blend}_{\text{OKLab}}\left(\text{AuthenticPalette}_r, C_{\text{mix}}, B_r\right)$$

| Region $r$ | Blend Factor $B_r$ | Visual Result |
|---|---|---|
| **Body Skin** | $0.60$ | Primary body takes strong language hue while retaining red/orange undertone. |
| **Belly Underside**| $0.15$ | Preserves iconic light cream/sand belly with subtle warm tint. |
| **Eye Iris** | $0.00$ | Always authentic Pokédex eye color (e.g. teal for Charmeleon). |
| **Claws & Horns** | $0.05$ | Clean ivory/white with subtle environmental reflection. |
| **Wings (Charizard)**| $0.45$ | Inner membrane harmonizes with language palette; outer wing matches body. |
| **Tail Flame** | $0.10$ | Elemental fire gradient strictly preserved; language adds ember sparks. |

---

## 5. Spatial Priority Field $Q(x,y)$ & Organic Progressive Reveal

Rather than scattering color across random disjoint pixels, Neo-Pokédex defines a continuous, deterministic spatial priority field:
$$Q(x,y) \in [0.0, 1.0]$$

A pixel $(x,y)$ becomes eligible for colorization when:
$$Q(x,y) \ge 1.0 - T(P)$$

The priority field $Q(x,y)$ follows natural biological energy flow:
$$\text{Tail Flame} (Q \approx 1.0 \to 0.85) \longrightarrow \text{Tail \& Feet} (Q \approx 0.85 \to 0.65) \longrightarrow \text{Torso \& Belly} (Q \approx 0.65 \to 0.35) \longrightarrow \text{Head, Crest \& Eyes} (Q \approx 0.35 \to 0.00)$$

### Coverage & Intensity Modulation:
$$\text{Coverage}(x,y) = \text{smoothstep}\left(1.0 - T - 0.05, 1.0 - T + 0.05, Q(x,y)\right)$$
$$\text{Intensity}(T) = T^\gamma, \quad \text{where } \gamma = 1.15$$

### Final Pixel Compositing:
The effective colorization alpha weight $A(x,y)$ is:
$$A(x,y) = M(x,y) \times \text{Coverage}(x,y) \times \text{Intensity}(T)$$

The final pixel output $O(x,y)$ is composited in linear RGB space:
$$O(x,y) = (1.0 - A(x,y)) \times I_{\text{gray}}(x,y) + A(x,y) \times I_{\text{color}}(x,y)$$

- At $T = 0 \implies A = 0 \implies O(x,y) = I_{\text{gray}}(x,y)$ (100% grayscale).
- At $T = 1 \implies A = 1 \implies O(x,y) = I_{\text{color}}(x,y)$ (100% full color).
- Alpha channel and silhouette are mathematically invariant across all $T$.

