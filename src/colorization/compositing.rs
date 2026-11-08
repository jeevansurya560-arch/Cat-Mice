use image::{Rgba, RgbaImage};
use palette::FromColor;

use crate::artwork::{ArtworkPackage, RegionMaskId};
use crate::colorization::blending::ColorBlender;
use crate::colorization::priority_map::compute_coverage;
use crate::language::{LanguageDistribution, PaletteRegistry};

pub struct ColorCompositor;

impl ColorCompositor {
    /// Renders a progressive colorization frame preserving exact silhouette and alpha channel.
    pub fn render_frame(
        package: &ArtworkPackage,
        distribution: &LanguageDistribution,
        registry: &PaletteRegistry,
        progress: f64,
        gamma: f64,
    ) -> RgbaImage {
        let (w, h) = (package.width, package.height);
        let mut output = RgbaImage::new(w, h);

        // Precompute language mix for optional language harmonization
        let has_languages = !distribution.normalized_weights.is_empty();
        let lang_mix = ColorBlender::mix_languages(distribution, registry);

        let _ = gamma;

        // Map pixel-to-region for fast lookup
        for y in 0..h {
            for x in 0..w {
                let src_pixel = package.master_grayscale.get_pixel(x, y);
                let alpha = src_pixel[3];

                if alpha <= 10 {
                    output.put_pixel(x, y, Rgba([0, 0, 0, 0]));
                    continue;
                }

                // Check if outline pixel (#1a0f0d)
                if src_pixel[0] == 26 && src_pixel[1] == 15 && src_pixel[2] == 13 {
                    output.put_pixel(x, y, *src_pixel);
                    continue;
                }

                let color_pixel = package.master_color.get_pixel(x, y);

                // If language attribution exists, gently harmonize the authentic color towards the language palette
                let color_rgb = if has_languages {
                    let mut owning_region = None;
                    for (id, mask) in &package.masks {
                        if mask.mask.get_pixel(x, y)[0] > 127 {
                            owning_region = Some(*id);
                            break;
                        }
                    }
                    let region = owning_region.unwrap_or(RegionMaskId::Body);
                    let blend_factor = ColorBlender::region_blend_factor(region);
                    let orig_lab = palette::Oklab::from_color(palette::Srgb::new(
                        color_pixel[0] as f32 / 255.0,
                        color_pixel[1] as f32 / 255.0,
                        color_pixel[2] as f32 / 255.0,
                    ));
                    let blended_lab = palette::Oklab::new(
                        orig_lab.l * (1.0 - blend_factor) + lang_mix.l * blend_factor,
                        orig_lab.a * (1.0 - blend_factor) + lang_mix.a * blend_factor,
                        orig_lab.b * (1.0 - blend_factor) + lang_mix.b * blend_factor,
                    );
                    ColorBlender::oklab_to_srgb(blended_lab)
                } else {
                    [color_pixel[0], color_pixel[1], color_pixel[2]]
                };

                let q = package.priority_map.get_priority(x, y);
                let coverage = compute_coverage(q, progress);
                let blend_weight = coverage as f32;

                let gray_f = src_pixel[0] as f32;
                let r = ((1.0 - blend_weight) * gray_f + blend_weight * (color_rgb[0] as f32))
                    .round() as u8;
                let g = ((1.0 - blend_weight) * gray_f + blend_weight * (color_rgb[1] as f32))
                    .round() as u8;
                let b = ((1.0 - blend_weight) * gray_f + blend_weight * (color_rgb[2] as f32))
                    .round() as u8;

                output.put_pixel(x, y, Rgba([r, g, b, alpha]));
            }
        }

        output
    }
}
