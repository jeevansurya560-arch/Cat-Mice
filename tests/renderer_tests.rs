use neo_pokedex::artwork::ArtworkGenerator;
use neo_pokedex::colorization::ColorCompositor;
use neo_pokedex::config::OutputConfig;
use neo_pokedex::evolution::{evaluate_evolution, PokemonStage};
use neo_pokedex::language::{LanguageDistribution, PaletteRegistry};
use neo_pokedex::renderer::{GifRenderer, PngRenderer, Renderer, SvgRenderer};
use tempfile::tempdir;

#[test]
fn test_png_nearest_neighbor_scaling() {
    let pkg = ArtworkGenerator::generate(PokemonStage::Charmander);
    let dist = LanguageDistribution::default();
    let registry = PaletteRegistry::default();

    let colored = ColorCompositor::render_frame(&pkg, &dist, &registry, 0.5, 1.15);
    assert_eq!(colored.width(), 160);
    assert_eq!(colored.height(), 160);

    let scaled = PngRenderer::scale_nearest_neighbor(&colored, 3);
    assert_eq!(scaled.width(), 480);
    assert_eq!(scaled.height(), 480);

    // Verify exact pixel replication (no blurring or averaging)
    for y in 0..160 {
        for x in 0..160 {
            let orig = *colored.get_pixel(x, y);
            for dy in 0..3 {
                for dx in 0..3 {
                    let s = *scaled.get_pixel(x * 3 + dx, y * 3 + dy);
                    assert_eq!(
                        orig, s,
                        "Pixel mismatch at ({}, {}) sub-pixel (+{}, +{})",
                        x, y, dx, dy
                    );
                }
            }
        }
    }
}

#[test]
fn test_animated_gif_generation() {
    let pkg = ArtworkGenerator::generate(PokemonStage::Charmeleon);
    let dist = LanguageDistribution::default();
    let registry = PaletteRegistry::default();

    let gif_bytes = GifRenderer::render_animation(&pkg, &dist, &registry, 0.5, 12, 10, 3)
        .expect("GIF animation generation must succeed");

    assert!(!gif_bytes.is_empty());
    // GIF magic bytes: 'GIF89a'
    assert_eq!(&gif_bytes[0..6], b"GIF89a");
}

#[test]
fn test_svg_card_rendering() {
    let state = evaluate_evolution(500);
    let dist = LanguageDistribution::default();
    let registry = PaletteRegistry::default();

    let dummy_gif = b"GIF89a\x01\x00\x01\x00";
    let svg = SvgRenderer::render_card(&state, &dist, &registry, dummy_gif, "image/gif", 600, 490);

    assert!(svg.contains("<svg"));
    assert!(svg.contains("CHARMELEON"));
    assert!(svg.contains("NO. 0005"));
    assert!(svg.contains("500 Commits"));
    assert!(svg.contains("50%"));
    assert!(svg.contains("data:image/gif;base64,"));
}

#[test]
fn test_renderer_generate_all_outputs() {
    let temp = tempdir().expect("Failed to create tempdir");
    let out_dir = temp.path().join("output");

    let pkg = ArtworkGenerator::generate(PokemonStage::Charizard);
    let state = evaluate_evolution(1500);
    let dist = LanguageDistribution::default();
    let registry = PaletteRegistry::default();
    let config = OutputConfig::default();

    Renderer::generate_all(&pkg, &state, &dist, &registry, &config, &out_dir)
        .expect("generate_all must produce all files");

    assert!(out_dir.join("pokemon-evolution.png").exists());
    assert!(out_dir.join("pokemon-evolution.gif").exists());
    assert!(out_dir.join("pokemon-evolution.svg").exists());
}
