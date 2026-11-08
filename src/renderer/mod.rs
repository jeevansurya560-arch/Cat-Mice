//! High-resolution rendering, pixel art scaling, animated GIF encoding, and SVG generation.

pub mod gif;
pub mod png;
pub mod svg;

pub use gif::GifRenderer;
pub use png::PngRenderer;
pub use svg::SvgRenderer;

use std::path::Path;

use crate::artwork::ArtworkPackage;
use crate::colorization::ColorCompositor;
use crate::config::OutputConfig;
use crate::errors::Result;
use crate::evolution::EvolutionState;
use crate::language::{LanguageDistribution, PaletteRegistry};

pub struct Renderer;

impl Renderer {
    /// Generates static PNG, animated looping GIF, and HUD SVG in the destination directory.
    pub fn generate_all<P: AsRef<Path>>(
        package: &ArtworkPackage,
        state: &EvolutionState,
        distribution: &LanguageDistribution,
        registry: &PaletteRegistry,
        config: &OutputConfig,
        output_dir: P,
    ) -> Result<()> {
        let out = output_dir.as_ref();
        std::fs::create_dir_all(out)?;

        // 1. Static high-resolution PNG (3x scaling -> 480x480)
        let colored_sprite =
            ColorCompositor::render_frame(package, distribution, registry, state.progress, 1.15);
        let scaled_png = PngRenderer::scale_nearest_neighbor(&colored_sprite, 3);
        let png_path = out.join("pokemon-evolution.png");
        PngRenderer::save_to_file(&scaled_png, &png_path)?;

        // 2. Animated Looping GIF (12 frames @ 10 FPS)
        let gif_bytes = GifRenderer::render_animation(
            package,
            distribution,
            registry,
            state.progress,
            config.frames,
            config.fps,
            3,
        )?;
        let gif_path = out.join("pokemon-evolution.gif");
        GifRenderer::save_to_file(&gif_bytes, &gif_path)?;

        // 3. Responsive SVG with embedded animated asset and HUD telemetry
        let svg_content = SvgRenderer::render_card(
            state,
            distribution,
            registry,
            &gif_bytes,
            "image/gif",
            600,
            490,
        );
        let svg_path = out.join("pokemon-evolution.svg");
        SvgRenderer::save_to_file(&svg_content, &svg_path)?;

        Ok(())
    }
}
