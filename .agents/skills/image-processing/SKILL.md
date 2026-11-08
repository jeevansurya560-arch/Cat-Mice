---
name: image-processing
description: Rust image buffer manipulation, RGBA quantization, palette derivation, NeuQuant median-cut, and animated GIF frame generation.
---

# Image Processing Skill

## Guidelines
- Use `image::RgbaImage` for master canvas buffers.
- Perform color transforms in linear RGB or OKLab before quantizing to 8-bit sRGB.
- GIF encoding: 12-frame breathing/flame loop at 100ms per frame (10 FPS); enforce transparent color index consistency across frames.
