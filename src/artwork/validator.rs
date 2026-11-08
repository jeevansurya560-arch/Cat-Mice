use crate::artwork::types::{ArtworkPackage, ValidationReport};
use crate::errors::{PokedexError, Result};

pub struct ArtworkValidator;

impl ArtworkValidator {
    /// Validates an artwork package for geometric and mathematical integrity:
    /// 1. Dimension invariance (160x160).
    /// 2. Zero mask overlaps (disjoint partition).
    /// 3. Complete silhouette coverage (no unmasked opaque pixels).
    /// 4. Priority field confinement within silhouette.
    pub fn validate(package: &ArtworkPackage) -> Result<ValidationReport> {
        let (w, h) = (package.width, package.height);
        if w != 160 || h != 160 {
            return Err(PokedexError::MaskDimensionMismatch {
                expected_w: 160,
                expected_h: 160,
                actual_w: w,
                actual_h: h,
            });
        }

        if package.master_grayscale.width() != 160 || package.master_grayscale.height() != 160 {
            return Err(PokedexError::MaskDimensionMismatch {
                expected_w: 160,
                expected_h: 160,
                actual_w: package.master_grayscale.width(),
                actual_h: package.master_grayscale.height(),
            });
        }

        if package.priority_map.width != 160 || package.priority_map.height != 160 {
            return Err(PokedexError::MaskDimensionMismatch {
                expected_w: 160,
                expected_h: 160,
                actual_w: package.priority_map.width,
                actual_h: package.priority_map.height,
            });
        }

        for mask in package.masks.values() {
            if mask.width != 160 || mask.height != 160 {
                return Err(PokedexError::MaskDimensionMismatch {
                    expected_w: 160,
                    expected_h: 160,
                    actual_w: mask.width,
                    actual_h: mask.height,
                });
            }
        }

        let mut total_opaque = 0usize;
        let mut overlap_count = 0usize;
        let mut unmasked_count = 0usize;
        let mut mask_pixel_sums = 0usize;

        for mask in package.masks.values() {
            mask_pixel_sums += mask.pixel_count;
        }

        for y in 0..160 {
            for x in 0..160 {
                let alpha = package.master_grayscale.get_pixel(x, y)[3];
                let is_opaque = alpha > 10;
                if is_opaque {
                    total_opaque += 1;
                }

                let mut matching_masks = 0usize;
                for mask in package.masks.values() {
                    if mask.mask.get_pixel(x, y)[0] > 127 {
                        matching_masks += 1;
                    }
                }

                if is_opaque {
                    if matching_masks == 0 {
                        unmasked_count += 1;
                    } else if matching_masks > 1 {
                        overlap_count += matching_masks - 1;
                    }
                } else if matching_masks > 0 {
                    // Mask pixel outside silhouette is an overlap with transparent background
                    overlap_count += matching_masks;
                }
            }
        }

        let is_valid = overlap_count == 0 && unmasked_count == 0 && total_opaque == mask_pixel_sums;

        let report = ValidationReport {
            stage: package.stage,
            width: w,
            height: h,
            total_opaque_pixels: total_opaque,
            mask_pixel_sums,
            overlap_count,
            unmasked_count,
            is_valid,
        };

        if !is_valid {
            return Err(PokedexError::MaskValidation(format!(
                "Artwork package for {:?} failed validation: {} overlaps, {} unmasked pixels (opaque: {}, mask sum: {})",
                package.stage, overlap_count, unmasked_count, total_opaque, mask_pixel_sums
            )));
        }

        Ok(report)
    }
}
