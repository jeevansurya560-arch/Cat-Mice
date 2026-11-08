use image::{GrayImage, Luma, Rgba, RgbaImage};
use std::collections::HashMap;
use std::fs;
use std::path::Path;

use crate::artwork::types::{ArtworkPackage, PriorityMap, RegionMask, RegionMaskId};
use crate::artwork::validator::ArtworkValidator;
use crate::errors::{PokedexError, Result};
use crate::evolution::PokemonStage;

pub struct ArtworkGenerator;

impl ArtworkGenerator {
    /// Generates and validates the full artwork package for a given stage.
    pub fn generate(stage: PokemonStage) -> ArtworkPackage {
        match stage {
            PokemonStage::Charmander => Self::generate_charmander(),
            PokemonStage::Charmeleon => Self::generate_charmeleon(),
            PokemonStage::Charizard => Self::generate_charizard(),
        }
    }

    /// Generates assets and persists them to the assets directory if not present.
    pub fn ensure_assets_on_disk<P: AsRef<Path>>(base_dir: P) -> Result<()> {
        let base = base_dir.as_ref();
        let stages = [
            PokemonStage::Charmander,
            PokemonStage::Charmeleon,
            PokemonStage::Charizard,
        ];

        for stage in stages {
            let stage_dir = base.join("pokemon").join(stage.folder_name());
            let master_path = stage_dir.join("master_grayscale.png");
            let priority_path = stage_dir.join("priority_map.png");
            let masks_dir = stage_dir.join("masks");

            if !master_path.exists() || !priority_path.exists() || !masks_dir.exists() {
                fs::create_dir_all(&masks_dir).map_err(|e| PokedexError::AssetNotFound {
                    path: masks_dir.display().to_string(),
                    message: e.to_string(),
                })?;

                let package = Self::generate(stage);
                ArtworkValidator::validate(&package)?;

                package.master_grayscale.save(&master_path).map_err(|e| {
                    PokedexError::AssetNotFound {
                        path: master_path.display().to_string(),
                        message: e.to_string(),
                    }
                })?;

                package.priority_map.map.save(&priority_path).map_err(|e| {
                    PokedexError::AssetNotFound {
                        path: priority_path.display().to_string(),
                        message: e.to_string(),
                    }
                })?;

                for (id, mask) in &package.masks {
                    let mask_file = masks_dir.join(format!("{}.png", id.as_str()));
                    mask.mask
                        .save(&mask_file)
                        .map_err(|e| PokedexError::AssetNotFound {
                            path: mask_file.display().to_string(),
                            message: e.to_string(),
                        })?;
                }
            }
        }

        Ok(())
    }

    fn generate_charmander() -> ArtworkPackage {
        let w = 160u32;
        let h = 160u32;
        let mut sprite = RgbaImage::new(w, h);
        let mut region_grid = vec![vec![None; w as usize]; h as usize];
        let mut priority_grid = vec![vec![0.0f64; w as usize]; h as usize];

        // Geometric definition for Charmander (Lizard Pokémon)
        // Canvas center: (80, 80). Charmander bounds: X in [52, 144], Y in [36, 138]
        for y in 0..h {
            for x in 0..w {
                let fx = x as f64;
                let fy = y as f64;

                // 1. Flame (Teardrop flame at tail tip: X ~ [118, 144], Y ~ [64, 102])
                let dx_flame = fx - 131.0;
                let dy_flame = fy - 83.0;
                let flame_dist =
                    (dx_flame * dx_flame) / (12.5 * 12.5) + (dy_flame * dy_flame) / (18.0 * 18.0);
                let flame_taper = (fy - 65.0) / 36.0;
                let flame_mod = if flame_taper > 0.0 && flame_taper < 1.0 {
                    (1.0 - flame_taper * 0.4).max(0.2)
                } else {
                    1.0
                };

                if flame_dist * flame_mod <= 1.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::Flame);
                    let q = 0.85 + 0.15 * (1.0 - flame_dist).clamp(0.0, 1.0);
                    priority_grid[y as usize][x as usize] = q;
                    continue;
                }

                // 2. Tail (Curving upward from pelvis to flame base)
                let dx_tail = fx - 114.0;
                let dy_tail = fy - 104.0;
                let tail_dist =
                    (dx_tail * dx_tail) / (18.0 * 18.0) + (dy_tail * dy_tail) / (14.0 * 14.0);
                if tail_dist <= 1.0 && fx > 96.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::Tail);
                    let q = 0.65 + 0.20 * ((fx - 96.0) / 35.0).clamp(0.0, 1.0);
                    priority_grid[y as usize][x as usize] = q;
                    continue;
                }

                // 3. Limbs & Claws (Feet: Y in [120, 138], Hands: Y in [84, 102])
                let left_foot =
                    ((fx - 68.0) * (fx - 68.0) / 100.0) + ((fy - 128.0) * (fy - 128.0) / 64.0);
                let right_foot =
                    ((fx - 98.0) * (fx - 98.0) / 121.0) + ((fy - 129.0) * (fy - 129.0) / 64.0);
                let left_arm =
                    ((fx - 56.0) * (fx - 56.0) / 49.0) + ((fy - 92.0) * (fy - 92.0) / 121.0);
                let right_arm =
                    ((fx - 96.0) * (fx - 96.0) / 49.0) + ((fy - 94.0) * (fy - 94.0) / 100.0);

                if left_foot <= 1.0 || right_foot <= 1.0 || left_arm <= 1.0 || right_arm <= 1.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::LimbsClaws);
                    let q = 0.50 + 0.25 * ((fy - 80.0) / 55.0).clamp(0.0, 1.0);
                    priority_grid[y as usize][x as usize] = q;
                    continue;
                }

                // 4. Belly (Pale cream chest/underside oval)
                let dx_belly = fx - 78.0;
                let dy_belly = fy - 96.0;
                let belly_dist =
                    (dx_belly * dx_belly) / (12.0 * 12.0) + (dy_belly * dy_belly) / (18.0 * 18.0);
                if belly_dist <= 1.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::Belly);
                    let q = 0.35 + 0.25 * (1.0 - belly_dist).clamp(0.0, 1.0);
                    priority_grid[y as usize][x as usize] = q;
                    continue;
                }

                // 5. Face & Eyes (Snout highlight, eye at (83, 52))
                let dx_eye = fx - 83.0;
                let dy_eye = fy - 52.0;
                let eye_dist = (dx_eye * dx_eye) / (6.0 * 6.0) + (dy_eye * dy_eye) / (8.0 * 8.0);
                if eye_dist <= 1.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::FaceEyes);
                    priority_grid[y as usize][x as usize] = 0.05; // Eyes ignite right after head colorization
                    continue;
                }

                // 6. Body (Head & Torso)
                let dx_head = fx - 79.0;
                let dy_head = fy - 56.0;
                let head_dist =
                    (dx_head * dx_head) / (20.0 * 20.0) + (dy_head * dy_head) / (19.0 * 19.0);

                let dx_snout = fx - 64.0;
                let dy_snout = fy - 60.0;
                let snout_dist =
                    (dx_snout * dx_snout) / (12.0 * 12.0) + (dy_snout * dy_snout) / (9.0 * 9.0);

                let dx_torso = fx - 82.0;
                let dy_torso = fy - 98.0;
                let torso_dist =
                    (dx_torso * dx_torso) / (19.0 * 19.0) + (dy_torso * dy_torso) / (22.0 * 22.0);

                if head_dist <= 1.0 || snout_dist <= 1.0 || torso_dist <= 1.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::Body);
                    let q = if head_dist <= 1.0 || snout_dist <= 1.0 {
                        0.10 + 0.20 * ((fy - 37.0) / 38.0).clamp(0.0, 1.0)
                    } else {
                        0.35 + 0.25 * ((fy - 76.0) / 44.0).clamp(0.0, 1.0)
                    };
                    priority_grid[y as usize][x as usize] = q;
                }
            }
        }

        Self::build_package(
            PokemonStage::Charmander,
            w,
            h,
            region_grid,
            priority_grid,
            &mut sprite,
        )
    }

    fn generate_charmeleon() -> ArtworkPackage {
        let w = 160u32;
        let h = 160u32;
        let mut sprite = RgbaImage::new(w, h);
        let mut region_grid = vec![vec![None; w as usize]; h as usize];
        let mut priority_grid = vec![vec![0.0f64; w as usize]; h as usize];

        // Geometric definition for Charmeleon (Flame Pokémon)
        // Canvas center: (80, 80). Horn, predatory snout, smirk tooth, 3 claws
        for y in 0..h {
            for x in 0..w {
                let fx = x as f64;
                let fy = y as f64;

                // 1. Flame (Blazing torch flame at tail tip: X ~ [120, 150], Y ~ [58, 98])
                let dx_flame = fx - 134.0;
                let dy_flame = fy - 78.0;
                let flame_dist =
                    (dx_flame * dx_flame) / (14.0 * 14.0) + (dy_flame * dy_flame) / (19.0 * 19.0);
                if flame_dist <= 1.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::Flame);
                    let q = 0.85 + 0.15 * (1.0 - flame_dist).clamp(0.0, 1.0);
                    priority_grid[y as usize][x as usize] = q;
                    continue;
                }

                // 2. Tail (Powerful muscular tail)
                let dx_tail = fx - 116.0;
                let dy_tail = fy - 100.0;
                let tail_dist =
                    (dx_tail * dx_tail) / (20.0 * 20.0) + (dy_tail * dy_tail) / (15.0 * 15.0);
                if tail_dist <= 1.0 && fx > 96.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::Tail);
                    let q = 0.65 + 0.20 * ((fx - 96.0) / 38.0).clamp(0.0, 1.0);
                    priority_grid[y as usize][x as usize] = q;
                    continue;
                }

                // 3. Cranial Crest (Backward-curving single horn from rear skull: X in [88, 114], Y in [28, 48])
                let dx_crest = fx - 101.0;
                let dy_crest = fy - 38.0;
                let crest_dist =
                    (dx_crest * dx_crest) / (13.0 * 13.0) + (dy_crest * dy_crest) / (9.0 * 9.0);
                if crest_dist <= 1.0 && (fx - 86.0) > (fy - 32.0) * 0.4 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::CranialCrest);
                    priority_grid[y as usize][x as usize] = 0.12;
                    continue;
                }

                // 4. Arms & Claws (Curved razor talons)
                let left_arm =
                    ((fx - 56.0) * (fx - 56.0) / 64.0) + ((fy - 90.0) * (fy - 90.0) / 169.0);
                let right_arm =
                    ((fx - 98.0) * (fx - 98.0) / 64.0) + ((fy - 92.0) * (fy - 92.0) / 144.0);
                if left_arm <= 1.0 || right_arm <= 1.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::ArmsClaws);
                    let q = 0.45 + 0.20 * ((fy - 78.0) / 45.0).clamp(0.0, 1.0);
                    priority_grid[y as usize][x as usize] = q;
                    continue;
                }

                // 5. Legs & Claws (Heavy ground talons: Y in [116, 142])
                let left_leg =
                    ((fx - 66.0) * (fx - 66.0) / 144.0) + ((fy - 128.0) * (fy - 128.0) / 121.0);
                let right_leg =
                    ((fx - 102.0) * (fx - 102.0) / 169.0) + ((fy - 129.0) * (fy - 129.0) / 121.0);
                if left_leg <= 1.0 || right_leg <= 1.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::LegsClaws);
                    let q = 0.55 + 0.25 * ((fy - 110.0) / 32.0).clamp(0.0, 1.0);
                    priority_grid[y as usize][x as usize] = q;
                    continue;
                }

                // 6. Belly (Pale beige underside patch)
                let dx_belly = fx - 79.0;
                let dy_belly = fy - 94.0;
                let belly_dist =
                    (dx_belly * dx_belly) / (13.0 * 13.0) + (dy_belly * dy_belly) / (19.0 * 19.0);
                if belly_dist <= 1.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::Belly);
                    let q = 0.35 + 0.25 * (1.0 - belly_dist).clamp(0.0, 1.0);
                    priority_grid[y as usize][x as usize] = q;
                    continue;
                }

                // 7. Body (Head, predatory downward beak snout, muscular torso)
                let dx_head = fx - 78.0;
                let dy_head = fy - 55.0;
                let head_dist =
                    (dx_head * dx_head) / (19.0 * 19.0) + (dy_head * dy_head) / (18.0 * 18.0);

                let dx_snout = fx - 62.0;
                let dy_snout = fy - 62.0;
                let snout_dist =
                    (dx_snout * dx_snout) / (14.0 * 14.0) + (dy_snout * dy_snout) / (10.0 * 10.0);

                let dx_torso = fx - 82.0;
                let dy_torso = fy - 96.0;
                let torso_dist =
                    (dx_torso * dx_torso) / (20.0 * 20.0) + (dy_torso * dy_torso) / (24.0 * 24.0);

                if head_dist <= 1.0 || snout_dist <= 1.0 || torso_dist <= 1.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::Body);
                    let q = if head_dist <= 1.0 || snout_dist <= 1.0 {
                        0.05 + 0.25 * ((fy - 36.0) / 40.0).clamp(0.0, 1.0)
                    } else {
                        0.30 + 0.30 * ((fy - 72.0) / 48.0).clamp(0.0, 1.0)
                    };
                    priority_grid[y as usize][x as usize] = q;
                }
            }
        }

        Self::build_package(
            PokemonStage::Charmeleon,
            w,
            h,
            region_grid,
            priority_grid,
            &mut sprite,
        )
    }

    fn generate_charizard() -> ArtworkPackage {
        let w = 160u32;
        let h = 160u32;
        let mut sprite = RgbaImage::new(w, h);
        let mut region_grid = vec![vec![None; w as usize]; h as usize];
        let mut priority_grid = vec![vec![0.0f64; w as usize]; h as usize];

        // Geometric definition for Charizard (Flame Pokémon / Dragon)
        // Dual horns, massive wingspan, heavy dragon legs, roaring flame
        for y in 0..h {
            for x in 0..w {
                let fx = x as f64;
                let fy = y as f64;

                // 1. Flame (Roaring inferno at tail tip: X ~ [124, 156], Y ~ [64, 108])
                let dx_flame = fx - 139.0;
                let dy_flame = fy - 86.0;
                let flame_dist =
                    (dx_flame * dx_flame) / (16.0 * 16.0) + (dy_flame * dy_flame) / (22.0 * 22.0);
                if flame_dist <= 1.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::Flame);
                    let q = 0.85 + 0.15 * (1.0 - flame_dist).clamp(0.0, 1.0);
                    priority_grid[y as usize][x as usize] = q;
                    continue;
                }

                // 2. Tail (Heavy serpentine tail)
                let dx_tail = fx - 120.0;
                let dy_tail = fy - 108.0;
                let tail_dist =
                    (dx_tail * dx_tail) / (22.0 * 22.0) + (dy_tail * dy_tail) / (16.0 * 16.0);
                if tail_dist <= 1.0 && fx > 98.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::Tail);
                    let q = 0.65 + 0.20 * ((fx - 98.0) / 40.0).clamp(0.0, 1.0);
                    priority_grid[y as usize][x as usize] = q;
                    continue;
                }

                // 3. Head & Horns (Dual cranial horns: X in [74, 98], Y in [22, 42])
                let dx_horn1 = fx - 82.0;
                let dy_horn1 = fy - 28.0;
                let horn1_dist =
                    (dx_horn1 * dx_horn1) / (7.0 * 7.0) + (dy_horn1 * dy_horn1) / (11.0 * 11.0);

                let dx_horn2 = fx - 94.0;
                let dy_horn2 = fy - 32.0;
                let horn2_dist =
                    (dx_horn2 * dx_horn2) / (7.0 * 7.0) + (dy_horn2 * dy_horn2) / (11.0 * 11.0);

                if horn1_dist <= 1.0 || horn2_dist <= 1.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::HeadHorns);
                    priority_grid[y as usize][x as usize] = 0.08;
                    continue;
                }

                // 4. Wings Outer (Draconic wing bones and outer armatures)
                let left_wing_outer =
                    ((fx - 44.0) * (fx - 44.0) / 484.0) + ((fy - 54.0) * (fy - 54.0) / 1024.0);
                let right_wing_outer =
                    ((fx - 122.0) * (fx - 122.0) / 576.0) + ((fy - 52.0) * (fy - 52.0) / 1024.0);

                // 5. Wings Inner (Teal/Cyan inner membranes)
                let left_wing_inner =
                    ((fx - 46.0) * (fx - 46.0) / 256.0) + ((fy - 56.0) * (fy - 56.0) / 576.0);
                let right_wing_inner =
                    ((fx - 120.0) * (fx - 120.0) / 324.0) + ((fy - 54.0) * (fy - 54.0) / 576.0);

                if (left_wing_inner <= 1.0 || right_wing_inner <= 1.0) && (fx < 64.0 || fx > 98.0) {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::WingsInner);
                    priority_grid[y as usize][x as usize] = 0.25;
                    continue;
                }

                if (left_wing_outer <= 1.0 || right_wing_outer <= 1.0) && (fx < 66.0 || fx > 96.0) {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::WingsOuter);
                    priority_grid[y as usize][x as usize] = 0.20;
                    continue;
                }

                // 6. Limbs & Claws (Heavy dragon legs, feet talons: Y in [116, 144])
                let left_leg =
                    ((fx - 64.0) * (fx - 64.0) / 196.0) + ((fy - 130.0) * (fy - 130.0) / 144.0);
                let right_leg =
                    ((fx - 100.0) * (fx - 100.0) / 225.0) + ((fy - 131.0) * (fy - 131.0) / 144.0);
                if left_leg <= 1.0 || right_leg <= 1.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::LimbsClaws);
                    let q = 0.55 + 0.25 * ((fy - 110.0) / 34.0).clamp(0.0, 1.0);
                    priority_grid[y as usize][x as usize] = q;
                    continue;
                }

                // 7. Belly (Cream segmented belly plates)
                let dx_belly = fx - 80.0;
                let dy_belly = fy - 94.0;
                let belly_dist =
                    (dx_belly * dx_belly) / (14.0 * 14.0) + (dy_belly * dy_belly) / (20.0 * 20.0);
                if belly_dist <= 1.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::Belly);
                    let q = 0.35 + 0.25 * (1.0 - belly_dist).clamp(0.0, 1.0);
                    priority_grid[y as usize][x as usize] = q;
                    continue;
                }

                // 8. Body (Draconic neck, jaw, shoulders, torso)
                let dx_head = fx - 78.0;
                let dy_head = fy - 52.0;
                let head_dist =
                    (dx_head * dx_head) / (18.0 * 18.0) + (dy_head * dy_head) / (16.0 * 16.0);

                let dx_snout = fx - 64.0;
                let dy_snout = fy - 56.0;
                let snout_dist =
                    (dx_snout * dx_snout) / (14.0 * 14.0) + (dy_snout * dy_snout) / (10.0 * 10.0);

                let dx_torso = fx - 82.0;
                let dy_torso = fy - 96.0;
                let torso_dist =
                    (dx_torso * dx_torso) / (22.0 * 22.0) + (dy_torso * dy_torso) / (26.0 * 26.0);

                if head_dist <= 1.0 || snout_dist <= 1.0 || torso_dist <= 1.0 {
                    region_grid[y as usize][x as usize] = Some(RegionMaskId::Body);
                    let q = if head_dist <= 1.0 || snout_dist <= 1.0 {
                        0.05 + 0.20 * ((fy - 36.0) / 36.0).clamp(0.0, 1.0)
                    } else {
                        0.30 + 0.30 * ((fy - 70.0) / 52.0).clamp(0.0, 1.0)
                    };
                    priority_grid[y as usize][x as usize] = q;
                }
            }
        }

        Self::build_package(
            PokemonStage::Charizard,
            w,
            h,
            region_grid,
            priority_grid,
            &mut sprite,
        )
    }

    fn build_package(
        stage: PokemonStage,
        w: u32,
        h: u32,
        region_grid: Vec<Vec<Option<RegionMaskId>>>,
        priority_grid: Vec<Vec<f64>>,
        sprite: &mut RgbaImage,
    ) -> ArtworkPackage {
        let mut masks_map: HashMap<RegionMaskId, GrayImage> = HashMap::new();
        let mut priority_map = GrayImage::new(w, h);

        // Pre-create mask images
        for y in 0..h {
            for x in 0..w {
                if let Some(id) = region_grid[y as usize][x as usize] {
                    masks_map.entry(id).or_insert_with(|| GrayImage::new(w, h));
                }
            }
        }

        // Compute 5-stop luminance and populate sprite pixels
        for y in 0..h {
            for x in 0..w {
                let fx = x as f64;
                let fy = y as f64;

                if let Some(id) = region_grid[y as usize][x as usize] {
                    // Mark binary mask
                    masks_map.get_mut(&id).unwrap().put_pixel(x, y, Luma([255]));

                    // Priority map value
                    let q_val = (priority_grid[y as usize][x as usize].clamp(0.0, 1.0) * 255.0)
                        .round() as u8;
                    priority_map.put_pixel(x, y, Luma([q_val]));

                    // Directional light from top-left (dx = -1.0, dy = -1.0)
                    let light_angle = ((fx - 40.0) * 0.5 + (fy - 30.0) * 0.5) / 100.0;
                    let form_shading = (1.0 - light_angle).clamp(0.0, 1.0);

                    // 5-stop monochromatic luminance calculation
                    let luma_norm = match id {
                        RegionMaskId::Flame => {
                            // Flame has high internal radiance
                            0.70 + 0.28 * form_shading
                        }
                        RegionMaskId::Belly => {
                            // Belly is pale diffuse cream
                            0.60 + 0.25 * form_shading
                        }
                        RegionMaskId::FaceEyes => {
                            // Specular glint in pupil
                            if x % 2 == 0 && y % 2 == 0 {
                                0.95
                            } else {
                                0.20
                            }
                        }
                        RegionMaskId::LimbsClaws
                        | RegionMaskId::ArmsClaws
                        | RegionMaskId::LegsClaws => 0.45 + 0.35 * form_shading,
                        RegionMaskId::CranialCrest | RegionMaskId::HeadHorns => {
                            0.48 + 0.38 * form_shading
                        }
                        RegionMaskId::WingsInner => 0.35 + 0.30 * form_shading,
                        RegionMaskId::WingsOuter => 0.42 + 0.32 * form_shading,
                        _ => {
                            // Body / Tail
                            0.40 + 0.35 * form_shading
                        }
                    };

                    let gray_val = (luma_norm.clamp(0.05, 0.98) * 255.0) as u8;

                    // Check if edge pixel (outline)
                    let is_outline = Self::is_boundary_pixel(x, y, w, h, &region_grid);
                    if is_outline {
                        // Crisp dark outline contour #1a0f0d
                        sprite.put_pixel(x, y, Rgba([26, 15, 13, 255]));
                    } else {
                        sprite.put_pixel(x, y, Rgba([gray_val, gray_val, gray_val, 255]));
                    }
                } else {
                    // Fully transparent outside silhouette
                    sprite.put_pixel(x, y, Rgba([0, 0, 0, 0]));
                    priority_map.put_pixel(x, y, Luma([0]));
                }
            }
        }

        let mut masks = HashMap::new();
        for (id, img) in masks_map {
            let mut count = 0;
            for p in img.pixels() {
                if p[0] > 127 {
                    count += 1;
                }
            }
            masks.insert(
                id,
                RegionMask {
                    id,
                    width: w,
                    height: h,
                    pixel_count: count,
                    mask: img,
                },
            );
        }

        ArtworkPackage {
            stage,
            width: w,
            height: h,
            master_grayscale: sprite.clone(),
            masks,
            priority_map: PriorityMap {
                width: w,
                height: h,
                map: priority_map,
            },
        }
    }

    fn is_boundary_pixel(
        x: u32,
        y: u32,
        w: u32,
        h: u32,
        grid: &[Vec<Option<RegionMaskId>>],
    ) -> bool {
        if x == 0 || y == 0 || x == w - 1 || y == h - 1 {
            return true;
        }

        let neighbors = [
            (x.wrapping_sub(1), y),
            (x + 1, y),
            (x, y.wrapping_sub(1)),
            (x, y + 1),
        ];

        for (nx, ny) in neighbors {
            if nx >= w || ny >= h || grid[ny as usize][nx as usize].is_none() {
                return true;
            }
        }

        false
    }
}
