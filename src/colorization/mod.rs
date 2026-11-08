//! Progressive luminance-preserving colorization engine using OKLab color space.

pub mod blending;
pub mod compositing;
pub mod luminance;
pub mod priority_map;
pub mod tonal_ramp;

pub use blending::ColorBlender;
pub use compositing::ColorCompositor;
pub use luminance::extract_luminance;
pub use priority_map::compute_coverage;
pub use tonal_ramp::TonalRamp;

use image::RgbaImage;

use crate::artwork::ArtworkPackage;
use crate::language::{LanguageDistribution, PaletteRegistry};

pub struct ColorizationEngine {
    pub gamma: f64,
}

impl Default for ColorizationEngine {
    fn default() -> Self {
        Self { gamma: 1.15 }
    }
}

impl ColorizationEngine {
    pub fn new(gamma: f64) -> Self {
        Self { gamma }
    }

    /// Renders a colorized frame for a given progress T in [0.0, 1.0].
    pub fn render(
        &self,
        package: &ArtworkPackage,
        distribution: &LanguageDistribution,
        registry: &PaletteRegistry,
        progress: f64,
    ) -> RgbaImage {
        ColorCompositor::render_frame(package, distribution, registry, progress, self.gamma)
    }
}
