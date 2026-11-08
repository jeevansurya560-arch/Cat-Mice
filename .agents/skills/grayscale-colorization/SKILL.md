---
name: grayscale-colorization
description: Mathematical luminance preservation, OKLab/OKLCH perceptual blending, spatial priority field Q(x,y), and gamma-corrected intensity.
---

# Grayscale Colorization Skill

## Mathematical Pipeline
- Luminance: Y = G / 255.0.
- Tonal Ramp: Map Y across 5 luminance stops: Deep Shadow (0.15), Mid Shadow (0.35), Base (0.55), Highlight (0.78), Specular (0.95).
- Spatial Priority Q(x,y): Connects pixel clusters along anatomical flow lines.
- Progressive eligibility: Pixel is active when Q(x,y) >= 1.0 - T.
- Intensity curve: Intensity = T^1.15; alpha composite A(x,y) = M(x,y) * Coverage(x,y) * Intensity.
