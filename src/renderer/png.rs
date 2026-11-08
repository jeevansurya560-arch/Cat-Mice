use image::RgbaImage;
use std::path::Path;

use crate::errors::{PokedexError, Result};

pub struct PngRenderer;

impl PngRenderer {
    /// Upscales a 160x160 pixel art buffer using exact integer nearest-neighbor replication (no blur).
    pub fn scale_nearest_neighbor(src: &RgbaImage, scale: u32) -> RgbaImage {
        if scale <= 1 {
            return src.clone();
        }

        let w = src.width() * scale;
        let h = src.height() * scale;
        let mut scaled = RgbaImage::new(w, h);

        for y in 0..h {
            let src_y = y / scale;
            for x in 0..w {
                let src_x = x / scale;
                let pixel = *src.get_pixel(src_x, src_y);
                scaled.put_pixel(x, y, pixel);
            }
        }

        scaled
    }

    /// Saves the image buffer as PNG to the specified path.
    pub fn save_to_file<P: AsRef<Path>>(img: &RgbaImage, path: P) -> Result<()> {
        let p = path.as_ref();
        if let Some(parent) = p.parent() {
            std::fs::create_dir_all(parent)?;
        }

        img.save(p)
            .map_err(|e| PokedexError::Rendering(format!("Failed to save PNG to {:?}: {}", p, e)))
    }
}
