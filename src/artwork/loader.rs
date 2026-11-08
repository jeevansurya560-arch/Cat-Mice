use image::ImageReader;
use std::collections::HashMap;
use std::path::Path;

use crate::artwork::generator::ArtworkGenerator;
use crate::artwork::types::{ArtworkPackage, PriorityMap, RegionMask, RegionMaskId};
use crate::artwork::validator::ArtworkValidator;
use crate::errors::{PokedexError, Result};
use crate::evolution::PokemonStage;

pub struct ArtworkLoader;

impl ArtworkLoader {
    /// Loads the complete artwork package for a given stage from the filesystem,
    /// automatically generating and persisting valid assets if absent.
    pub fn load<P: AsRef<Path>>(stage: PokemonStage, base_dir: P) -> Result<ArtworkPackage> {
        let base = base_dir.as_ref();
        ArtworkGenerator::ensure_assets_on_disk(base)?;

        let stage_dir = base.join("pokemon").join(stage.folder_name());
        let master_path = stage_dir.join("master_grayscale.png");
        let priority_path = stage_dir.join("priority_map.png");
        let masks_dir = stage_dir.join("masks");

        if !master_path.exists() {
            return Err(PokedexError::AssetNotFound {
                path: master_path.display().to_string(),
                message: "Master grayscale sprite not found".to_string(),
            });
        }

        let master_img = ImageReader::open(&master_path)
            .map_err(|e| PokedexError::AssetNotFound {
                path: master_path.display().to_string(),
                message: e.to_string(),
            })?
            .decode()
            .map_err(|e| PokedexError::AssetNotFound {
                path: master_path.display().to_string(),
                message: e.to_string(),
            })?
            .to_rgba8();

        let priority_img = ImageReader::open(&priority_path)
            .map_err(|e| PokedexError::AssetNotFound {
                path: priority_path.display().to_string(),
                message: e.to_string(),
            })?
            .decode()
            .map_err(|e| PokedexError::AssetNotFound {
                path: priority_path.display().to_string(),
                message: e.to_string(),
            })?
            .to_luma8();

        let (w, h) = (master_img.width(), master_img.height());
        if w != 160 || h != 160 {
            return Err(PokedexError::MaskDimensionMismatch {
                expected_w: 160,
                expected_h: 160,
                actual_w: w,
                actual_h: h,
            });
        }

        let mut masks = HashMap::new();
        if masks_dir.exists() {
            let entries =
                std::fs::read_dir(&masks_dir).map_err(|e| PokedexError::AssetNotFound {
                    path: masks_dir.display().to_string(),
                    message: e.to_string(),
                })?;

            for entry in entries {
                let entry = entry.map_err(|e| PokedexError::AssetNotFound {
                    path: masks_dir.display().to_string(),
                    message: e.to_string(),
                })?;

                let path = entry.path();
                if path.extension().and_then(|s| s.to_str()) == Some("png") {
                    if let Some(stem) = path.file_stem().and_then(|s| s.to_str()) {
                        if let Some(mask_id) = RegionMaskId::parse_id(stem) {
                            let mask_img = ImageReader::open(&path)
                                .map_err(|e| PokedexError::AssetNotFound {
                                    path: path.display().to_string(),
                                    message: e.to_string(),
                                })?
                                .decode()
                                .map_err(|e| PokedexError::AssetNotFound {
                                    path: path.display().to_string(),
                                    message: e.to_string(),
                                })?
                                .to_luma8();

                            let mut pixel_count = 0;
                            for p in mask_img.pixels() {
                                if p[0] > 127 {
                                    pixel_count += 1;
                                }
                            }

                            masks.insert(
                                mask_id,
                                RegionMask {
                                    id: mask_id,
                                    width: mask_img.width(),
                                    height: mask_img.height(),
                                    pixel_count,
                                    mask: mask_img,
                                },
                            );
                        }
                    }
                }
            }
        }

        let package = ArtworkPackage {
            stage,
            width: w,
            height: h,
            master_grayscale: master_img,
            masks,
            priority_map: PriorityMap {
                width: priority_img.width(),
                height: priority_img.height(),
                map: priority_img,
            },
        };

        ArtworkValidator::validate(&package)?;

        Ok(package)
    }
}
