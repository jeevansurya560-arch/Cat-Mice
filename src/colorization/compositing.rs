use image::{Rgba, RgbaImage};

use crate::artwork::{ArtworkPackage, RegionMaskId};
use crate::colorization::blending::ColorBlender;
use crate::colorization::luminance::extract_luminance;
use crate::colorization::priority_map::compute_coverage;
use crate::colorization::tonal_ramp::TonalRamp;
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

        // Precompute language mix and tonal ramps for each anatomical region
        let lang_mix = ColorBlender::mix_languages(distribution, registry);
        let mut ramps = std::collections::HashMap::new();

        for &id in package.masks.keys() {
            let ramp = if id == RegionMaskId::Flame {
                TonalRamp::flame_ramp()
            } else {
                let target_lab = ColorBlender::target_region_color(package.stage, id, lang_mix);
                TonalRamp::from_base_color(target_lab)
            };
            ramps.insert(id, ramp);
        }

        // Intensity scaling function T^gamma
        let intensity = progress.clamp(0.0, 1.0).powf(gamma);

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

                // Find owning mask
                let mut owning_region = None;
                for (id, mask) in &package.masks {
                    if mask.mask.get_pixel(x, y)[0] > 127 {
                        owning_region = Some(*id);
                        break;
                    }
                }

                let region = owning_region.unwrap_or(RegionMaskId::Body);
                let ramp = ramps.get(&region).copied().unwrap_or_else(|| {
                    let target = ColorBlender::target_region_color(package.stage, region, lang_mix);
                    TonalRamp::from_base_color(target)
                });

                let luma = extract_luminance(src_pixel[0]);
                let sampled_lab = ramp.sample(luma);
                let color_rgb = ColorBlender::oklab_to_srgb(sampled_lab);

                let q = package.priority_map.get_priority(x, y);
                let coverage = compute_coverage(q, progress);
                let blend_weight = (coverage * intensity).clamp(0.0, 1.0) as f32;

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
