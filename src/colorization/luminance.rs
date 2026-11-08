/// Extracts normalized luminance Y in [0.0, 1.0] from a grayscale byte value [0, 255].
#[inline]
pub fn extract_luminance(gray_byte: u8) -> f32 {
    gray_byte as f32 / 255.0
}

/// Computes perceptual relative luminance from linear RGB components.
#[inline]
pub fn linear_rgb_luminance(r: f32, g: f32, b: f32) -> f32 {
    0.2126 * r + 0.7152 * g + 0.0722 * b
}
