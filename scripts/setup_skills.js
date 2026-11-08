import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const skills = [
  {
    name: "github-api-integration",
    desc: "GitHub GraphQL API integration for user contribution calendar retrieval, rate-limit management, token authentication, and cache policies.",
    content: `# GitHub API Integration Skill

## Principles
- Use GraphQL \`user(login: $username) { contributionsCollection { contributionCalendar { ... } } }\` for exact commit, PR, review counts.
- Handle primary rate limits (5,000 pts/hr authenticated) via exponential backoff with jitter.
- Never log GH_TOKEN or Authorization headers; sanitize error payloads.
- Provide an offline/cached snapshot mechanism to support deterministic testing without network egress.`
  },
  {
    name: "pokemon-art-accuracy",
    desc: "Strict anatomical verification, silhouette fidelity, and visual character accuracy for Charmander (#004), Charmeleon (#005), and Charizard (#006).",
    content: `# Pokémon Art Accuracy Skill

## Standards
- Charmander (#004): 0-249 contributions. Soft rounded snout, large expressive pupil, cream belly, 4 fingers, 3 foot claws, teardrop tail flame.
- Charmeleon (#005): 250-749 contributions. Single backward cranial crest, hooked beak snout with smirk tooth, sharp triangular teal eye, 3 prominent razor talons, roaring torch flame.
- Charizard (#006): 750+ contributions. Dual cranial horns, broad draconic snout, expansive bat wings with teal inner membrane, 3 heavy foot talons, flaming inferno tail tip.
- Geometry is fixed across color progression.`
  },
  {
    name: "hd-pixel-art-engineering",
    desc: "Modern HD pixel-art construction techniques: cluster theory, sub-pixel rendering, rim lighting, multi-tone dithering, and edge sharpness.",
    content: `# HD Pixel Art Engineering Skill

## Requirements
- Pixel density must be uniform across the entire canvas; no mixed resolutions.
- Avoid single-pixel orphan noise (lonely pixels); organize pixels into coherent organic clusters.
- Multi-tone shading: Deep shadow, mid-shadow, base, highlight, specular highlight.
- Maintain 100% crisp boundaries on transparent alpha backgrounds.`
  },
  {
    name: "grayscale-colorization",
    desc: "Mathematical luminance preservation, OKLab/OKLCH perceptual blending, spatial priority field Q(x,y), and gamma-corrected intensity.",
    content: `# Grayscale Colorization Skill

## Mathematical Pipeline
- Luminance: Y = G / 255.0.
- Tonal Ramp: Map Y across 5 luminance stops: Deep Shadow (0.15), Mid Shadow (0.35), Base (0.55), Highlight (0.78), Specular (0.95).
- Spatial Priority Q(x,y): Connects pixel clusters along anatomical flow lines.
- Progressive eligibility: Pixel is active when Q(x,y) >= 1.0 - T.
- Intensity curve: Intensity = T^1.15; alpha composite A(x,y) = M(x,y) * Coverage(x,y) * Intensity.`
  },
  {
    name: "svg-rendering",
    desc: "Resolution-independent SVG generation, crisp pixel scaling with shape-rendering: crispEdges, and modern HUD integration.",
    content: `# SVG Rendering Skill

## Guidelines
- Embed pixel matrices into vectorized rect primitives or high-density SVG paths.
- Set shape-rendering="crispEdges" on pixel clusters to prevent anti-aliasing blur.
- Structure HUD overlays with standard system typography and responsive viewports.`
  },
  {
    name: "image-processing",
    desc: "Rust image buffer manipulation, RGBA quantization, palette derivation, NeuQuant median-cut, and animated GIF frame generation.",
    content: `# Image Processing Skill

## Guidelines
- Use \`image::RgbaImage\` for master canvas buffers.
- Perform color transforms in linear RGB or OKLab before quantizing to 8-bit sRGB.
- GIF encoding: 12-frame breathing/flame loop at 100ms per frame (10 FPS); enforce transparent color index consistency across frames.`
  },
  {
    name: "evolution-progression",
    desc: "Deterministic contribution thresholds, boundary clamping, stage evolution state machines, and mathematical progression metrics.",
    content: `# Evolution Progression Skill

## Rules
- Stage 1: Charmander (0 to 249 commits). T = P / 249.0.
- Stage 2: Charmeleon (250 to 749 commits). T = (P - 250) / 499.0.
- Stage 3: Charizard (750+ commits). T = clamp((P - 750) / 1250.0, 0.0, 1.0) with full mastery at 2,000+.
- Boundary values must never produce negative percentages or exceed 100.0%.`
  },
  {
    name: "github-actions",
    desc: "Automated CI/CD workflows, profile README marker synchronization, artifact generation, least-privilege token permissions, and idempotency.",
    content: `# GitHub Actions Skill

## Protocol
- Scheduled cron (nightly) + workflow_dispatch.
- Permissions: contents: write.
- Marker bounds: <!-- NEO-POKEDEX:START --> and <!-- NEO-POKEDEX:END -->.
- Idempotency: Commit and push ONLY if generated binary assets or README markdown have genuinely changed.`
  },
  {
    name: "automated-testing",
    desc: "Rigorous unit testing, integration tests with wiremock/fixtures, visual golden-image regression tests, and cargo test suites.",
    content: `# Automated Testing Skill

## Verification Matrix
- Unit: Progression boundaries (0, 249, 250, 749, 750, 2000), palette weights summing to 1.0, luminance ramp invariance.
- Visual: Structural pixel diffing between 0% grayscale and 100% color (silhouette must be 100% identical).
- Integration: Mocked GitHub GraphQL responses, invalid token handling, missing config fallback.`
  },
  {
    name: "security-audit",
    desc: "Token hygiene, safe path traversal prevention, memory bounding on image decoders, and dependency vulnerability scanning with cargo-audit.",
    content: `# Security Audit Skill

## Checklist
- Strip tokens from CLI arguments, error messages, and logs.
- Limit image decoding dimensions to prevent allocation bombs.
- Prevent path traversal when loading user-defined masks or palette files.
- Run \`cargo audit\` and \`cargo deny\` to detect known vulnerabilities.`
  },
  {
    name: "performance-optimization",
    desc: "Benchmarking, SIMD color conversions, precomputed tonal lookup tables, zero-copy sprite blitting, and binary size optimization.",
    content: `# Performance Optimization Skill

## Practices
- Precompute OKLab-to-sRGB lookup tables for tonal ramps.
- Use \`cargo build --release\` with LTO (Link-Time Optimization) and \`codegen-units = 1\` for small binary size.
- Profile rendering bottlenecks using Criterion benchmarks.`
  }
];

for (const s of skills) {
  const dir = join(".agents", "skills", s.name);
  mkdirSync(dir, { recursive: true });
  const fileContent = `---\nname: ${s.name}\ndescription: ${s.desc}\n---\n\n${s.content}\n`;
  writeFileSync(join(dir, "SKILL.md"), fileContent, "utf-8");
  console.log("Created skill:", s.name);
}

