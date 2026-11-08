use neo_pokedex::artwork::ArtworkGenerator;
use neo_pokedex::colorization::ColorizationEngine;
use neo_pokedex::evolution::PokemonStage;
use neo_pokedex::language::{LanguageDistribution, PaletteRegistry};
use std::collections::HashMap;

#[test]
fn test_geometric_silhouette_invariance_across_progress() {
    let pkg = ArtworkGenerator::generate(PokemonStage::Charmeleon);
    let dist = LanguageDistribution::default();
    let registry = PaletteRegistry::default();
    let engine = ColorizationEngine::default();

    let frame_0 = engine.render(&pkg, &dist, &registry, 0.0);
    let frame_50 = engine.render(&pkg, &dist, &registry, 0.5);
    let frame_100 = engine.render(&pkg, &dist, &registry, 1.0);

    let (w, h) = (pkg.width, pkg.height);

    for y in 0..h {
        for x in 0..w {
            let a0 = frame_0.get_pixel(x, y)[3];
            let a50 = frame_50.get_pixel(x, y)[3];
            let a100 = frame_100.get_pixel(x, y)[3];
            let orig_a = pkg.master_grayscale.get_pixel(x, y)[3];

            assert_eq!(a0, orig_a, "Alpha at (x={}, y={}) changed at T=0", x, y);
            assert_eq!(a50, orig_a, "Alpha at (x={}, y={}) changed at T=0.5", x, y);
            assert_eq!(a100, orig_a, "Alpha at (x={}, y={}) changed at T=1.0", x, y);
        }
    }
}

#[test]
fn test_zero_progress_is_pure_grayscale() {
    let pkg = ArtworkGenerator::generate(PokemonStage::Charmander);
    let dist = LanguageDistribution::default();
    let registry = PaletteRegistry::default();
    let engine = ColorizationEngine::default();

    let frame = engine.render(&pkg, &dist, &registry, 0.0);
    let (w, h) = (pkg.width, pkg.height);

    for y in 0..h {
        for x in 0..w {
            let p = frame.get_pixel(x, y);
            if p[3] > 0 {
                // Outline is [26, 15, 13], interior is R=G=B
                let is_outline = p[0] == 26 && p[1] == 15 && p[2] == 13;
                let is_gray = p[0] == p[1] && p[1] == p[2];
                assert!(
                    is_outline || is_gray,
                    "Pixel at ({}, {}) must be grayscale at T=0, got {:?}",
                    x,
                    y,
                    p
                );
            }
        }
    }
}

#[test]
fn test_full_progress_has_vibrant_color() {
    let pkg = ArtworkGenerator::generate(PokemonStage::Charizard);
    let dist = LanguageDistribution::default();
    let registry = PaletteRegistry::default();
    let engine = ColorizationEngine::default();

    let frame = engine.render(&pkg, &dist, &registry, 1.0);
    let (w, h) = (pkg.width, pkg.height);

    let mut colored_pixels = 0usize;
    for y in 0..h {
        for x in 0..w {
            let p = frame.get_pixel(x, y);
            if p[3] > 0 {
                let is_outline = p[0] == 26 && p[1] == 15 && p[2] == 13;
                if !is_outline && (p[0] != p[1] || p[1] != p[2]) {
                    colored_pixels += 1;
                }
            }
        }
    }

    assert!(
        colored_pixels > 1000,
        "At T=1.0, significant pixels must be colorized, got {}",
        colored_pixels
    );
}

#[test]
fn test_language_distribution_normalization_and_boost() {
    let mut counts = HashMap::new();
    counts.insert("rust".to_string(), 80);
    counts.insert("python".to_string(), 20);

    let dist = LanguageDistribution::from_counts(counts, 1.25);
    assert_eq!(dist.dominant_language, Some("rust".to_string()));

    let w_rust = dist.weight("rust");
    let w_python = dist.weight("python");

    assert!(
        (w_rust + w_python - 1.0).abs() < 1e-6,
        "Weights must sum to 1.0"
    );
    assert!(
        w_rust > 0.80,
        "Boosted dominant language must exceed unweighted ratio"
    );
}
