use image::codecs::gif::{GifEncoder, Repeat};
use image::{Delay, Frame, RgbaImage};
use std::io::Cursor;
use std::path::Path;
use std::time::Duration;

use crate::artwork::{ArtworkPackage, RegionMaskId};
use crate::colorization::ColorCompositor;
use crate::errors::{PokedexError, Result};
use crate::language::{LanguageDistribution, PaletteRegistry};
use crate::renderer::png::PngRenderer;

pub struct GifRenderer;

impl GifRenderer {
    /// Renders a 12-frame looping animated GIF at 10 FPS with animated tail flame and breathing idle.
    pub fn render_animation(
        package: &ArtworkPackage,
        distribution: &LanguageDistribution,
        registry: &PaletteRegistry,
        progress: f64,
        frames_count: u32,
        fps: u32,
        scale: u32,
    ) -> Result<Vec<u8>> {
        let base_colored =
            ColorCompositor::render_frame(package, distribution, registry, progress, 1.15);
        let (w, h) = (package.width, package.height);
        let frame_delay_ms = 1000 / fps.max(1);

        let mut frames = Vec::with_capacity(frames_count as usize);

        for k in 0..frames_count {
            let phase = (k as f64) * 2.0 * std::f64::consts::PI / (frames_count as f64);
            let mut frame_img = RgbaImage::new(w, h);

            // Breathing vertical offset: gentle 1px oscillation
            let breath_offset = if (3..=8).contains(&k) { 1 } else { 0 };

            for y in 0..h {
                for x in 0..w {
                    // Check if pixel is in flame mask
                    let is_flame = package
                        .masks
                        .get(&RegionMaskId::Flame)
                        .map(|m| m.mask.get_pixel(x, y)[0] > 127)
                        .unwrap_or(false);

                    if is_flame {
                        // Flame wave turbulence
                        let wave = ((phase + (y as f64) * 0.4).sin() * 1.5).round() as i32;
                        let src_x = (x as i32 - wave).clamp(0, w as i32 - 1) as u32;
                        let mut pixel = *base_colored.get_pixel(src_x, y);

                        // Flame pulsing brightness
                        if pixel[3] > 0 {
                            let pulse = 1.0 + 0.12 * (phase * 2.0).sin();
                            pixel[0] = ((pixel[0] as f64) * pulse).clamp(0.0, 255.0) as u8;
                            pixel[1] = ((pixel[1] as f64) * pulse).clamp(0.0, 255.0) as u8;
                        }

                        frame_img.put_pixel(x, y, pixel);
                    } else {
                        // Character body with subtle breathing shift
                        let src_y = if breath_offset > 0 && y > 35 && y < 115 {
                            (y + breath_offset).min(h - 1)
                        } else {
                            y
                        };

                        let pixel = *base_colored.get_pixel(x, src_y);
                        frame_img.put_pixel(x, y, pixel);
                    }
                }
            }

            // Scale frame up to display resolution (3x -> 480x480)
            let scaled_frame = PngRenderer::scale_nearest_neighbor(&frame_img, scale);
            let frame = Frame::from_parts(
                scaled_frame,
                0,
                0,
                Delay::from_saturating_duration(Duration::from_millis(frame_delay_ms as u64)),
            );
            frames.push(frame);
        }

        let mut output_bytes = Vec::new();
        {
            let mut encoder = GifEncoder::new(Cursor::new(&mut output_bytes));
            encoder
                .set_repeat(Repeat::Infinite)
                .map_err(|e| PokedexError::Rendering(format!("GIF encoder error: {}", e)))?;

            for frame in frames {
                encoder.encode_frame(frame).map_err(|e| {
                    PokedexError::Rendering(format!("GIF frame encoding error: {}", e))
                })?;
            }
        }

        Ok(output_bytes)
    }

    /// Saves the animated GIF to the specified filesystem path.
    pub fn save_to_file<P: AsRef<Path>>(gif_bytes: &[u8], path: P) -> Result<()> {
        let p = path.as_ref();
        if let Some(parent) = p.parent() {
            std::fs::create_dir_all(parent)?;
        }

        std::fs::write(p, gif_bytes)
            .map_err(|e| PokedexError::Rendering(format!("Failed to write GIF to {:?}: {}", p, e)))
    }
}
