use image::{GrayImage, Luma, Rgba, RgbaImage};
use std::collections::{HashMap, VecDeque};
use std::fs;
use std::path::Path;

use crate::artwork::types::{ArtworkPackage, PriorityMap, RegionMask, RegionMaskId};
use crate::artwork::validator::ArtworkValidator;
use crate::errors::{PokedexError, Result};
use crate::evolution::PokemonStage;

const CANONICAL_REF_BYTES: &[u8] =
    include_bytes!("../../research/references/art-styles/evolution-canonical-reference.jpg");

pub struct ArtworkGenerator;

impl ArtworkGenerator {
    /// Generates and validates the full authentic printed pixel-art package for a given stage.
    pub fn generate(stage: PokemonStage) -> ArtworkPackage {
        Self::generate_from_canonical(stage)
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
            let color_path = stage_dir.join("master_color.png");
            let priority_path = stage_dir.join("priority_map.png");
            let masks_dir = stage_dir.join("masks");

            if !master_path.exists()
                || !color_path.exists()
                || !priority_path.exists()
                || !masks_dir.exists()
            {
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

                package.master_color.save(&color_path).map_err(|e| {
                    PokedexError::AssetNotFound {
                        path: color_path.display().to_string(),
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

    fn generate_from_canonical(stage: PokemonStage) -> ArtworkPackage {
        let ref_img = image::load_from_memory(CANONICAL_REF_BYTES)
            .expect("Embedded canonical pixel-art reference must be valid JPEG")
            .to_rgb8();

        let (x1, y1, cw, ch, target_max_h, target_max_w) = match stage {
            PokemonStage::Charmander => (35u32, 55u32, 240u32, 225u32, 125u32, 140u32),
            PokemonStage::Charmeleon => (305u32, 18u32, 250u32, 262u32, 130u32, 140u32),
            PokemonStage::Charizard => (610u32, 10u32, 400u32, 270u32, 125u32, 152u32),
        };

        let crop = image::imageops::crop_imm(&ref_img, x1, y1, cw, ch).to_image();
        let mut mask_grid = vec![vec![false; cw as usize]; ch as usize];

        for y in 0..ch {
            for x in 0..cw {
                let p = crop.get_pixel(x, y);
                let (r, g, b) = (p[0] as i32, p[1] as i32, p[2] as i32);

                let is_bg = (r < 45 && g < 45 && b < 60) || (r + g + b < 75);
                let is_ground = match stage {
                    PokemonStage::Charmander => {
                        y > ch - 22
                            && ((g > r + 3 && g > 40)
                                || (r < 95 && g < 95 && b < 95 && !(r > 160 && g > 150 && b > 140)))
                            || y > ch - 6
                    }
                    PokemonStage::Charmeleon => {
                        (y > ch - 22
                            && (r < 100 && g < 90 && b < 90 && !(r > 180 && g > 170 && b > 170)))
                            || (y > ch - 30 && x < 45 && r < 140)
                            || y > ch - 4
                    }
                    PokemonStage::Charizard => {
                        (y > ch - 22
                            && (r < 125 && g < 120 && b < 120 && !(r > 180 && g > 170 && b > 170)))
                            || y > ch - 5
                    }
                };

                if !is_bg && !is_ground {
                    mask_grid[y as usize][x as usize] = true;
                }
            }
        }

        // Connected component analysis: keep only major character body & flame (>= 800 px)
        let mut visited = vec![vec![false; cw as usize]; ch as usize];
        let mut cleaned_mask = vec![vec![false; cw as usize]; ch as usize];

        for y in 0..ch {
            for x in 0..cw {
                if mask_grid[y as usize][x as usize] && !visited[y as usize][x as usize] {
                    let mut component = Vec::new();
                    let mut queue = VecDeque::new();
                    queue.push_back((x, y));
                    visited[y as usize][x as usize] = true;

                    while let Some((cx, cy)) = queue.pop_front() {
                        component.push((cx, cy));
                        for (dx, dy) in [(-1i32, 0), (1, 0), (0, -1), (0, 1)] {
                            let nx = cx as i32 + dx;
                            let ny = cy as i32 + dy;
                            if nx >= 0 && ny >= 0 && nx < cw as i32 && ny < ch as i32 {
                                let (ux, uy) = (nx as u32, ny as u32);
                                if mask_grid[uy as usize][ux as usize]
                                    && !visited[uy as usize][ux as usize]
                                {
                                    visited[uy as usize][ux as usize] = true;
                                    queue.push_back((ux, uy));
                                }
                            }
                        }
                    }

                    if component.len() >= 800 {
                        for (cx, cy) in component {
                            cleaned_mask[cy as usize][cx as usize] = true;
                        }
                    }
                }
            }
        }

        let mut min_cx = cw;
        let mut max_cx = 0;
        let mut min_cy = ch;
        let mut max_cy = 0;

        for y in 0..ch {
            for x in 0..cw {
                if cleaned_mask[y as usize][x as usize] {
                    if x < min_cx {
                        min_cx = x;
                    }
                    if x > max_cx {
                        max_cx = x;
                    }
                    if y < min_cy {
                        min_cy = y;
                    }
                    if y > max_cy {
                        max_cy = y;
                    }
                }
            }
        }

        let char_w = max_cx - min_cx + 1;
        let char_h = max_cy - min_cy + 1;

        let scale_w = target_max_w as f64 / char_w as f64;
        let scale_h = target_max_h as f64 / char_h as f64;
        let scale = scale_w.min(scale_h);

        let scaled_w = ((char_w as f64 * scale).round() as u32).min(156);
        let scaled_h = ((char_h as f64 * scale).round() as u32).min(156);

        let offset_x = (160u32.saturating_sub(scaled_w)) / 2;
        let offset_y = (160u32.saturating_sub(scaled_h)) / 2;

        let mut sprite_gray = RgbaImage::new(160, 160);
        let mut sprite_color = RgbaImage::new(160, 160);
        let mut region_grid = vec![vec![None; 160]; 160];
        let mut priority_grid = vec![vec![0.0f64; 160]; 160];

        for y in 0..scaled_h {
            for x in 0..scaled_w {
                let orig_cx = min_cx + ((x as f64 / scale).floor() as u32).min(char_w - 1);
                let orig_cy = min_cy + ((y as f64 / scale).floor() as u32).min(char_h - 1);

                if cleaned_mask[orig_cy as usize][orig_cx as usize] {
                    let dest_x = offset_x + x;
                    let dest_y = offset_y + y;
                    if dest_x >= 160 || dest_y >= 160 {
                        continue;
                    }

                    let p = crop.get_pixel(orig_cx, orig_cy);
                    let (pr, pg, pb) = (p[0] as f64, p[1] as f64, p[2] as f64);

                    let region = match stage {
                        PokemonStage::Charmander => {
                            if dest_x > offset_x + (scaled_w * 65 / 100)
                                && dest_y < offset_y + (scaled_h * 65 / 100)
                                && (pr > 150.0 && pg > 50.0)
                            {
                                RegionMaskId::Flame
                            } else if dest_x > offset_x + (scaled_w * 60 / 100)
                                && dest_y >= offset_y + (scaled_h * 55 / 100)
                            {
                                RegionMaskId::Tail
                            } else if dest_x >= offset_x + (scaled_w * 35 / 100)
                                && dest_x <= offset_x + (scaled_w * 55 / 100)
                                && dest_y <= offset_y + (scaled_h * 40 / 100)
                                && pb > 80.0
                                && pb > pr * 0.7
                            {
                                RegionMaskId::FaceEyes
                            } else if dest_x >= offset_x + (scaled_w * 25 / 100)
                                && dest_x <= offset_x + (scaled_w * 55 / 100)
                                && dest_y >= offset_y + (scaled_h * 45 / 100)
                                && dest_y <= offset_y + (scaled_h * 85 / 100)
                                && pr > 160.0
                                && pg > 140.0
                                && pb > 95.0
                            {
                                RegionMaskId::Belly
                            } else if (dest_y > offset_y + (scaled_h * 88 / 100)
                                || dest_y < offset_y + (scaled_h * 75 / 100))
                                && pr > 190.0
                                && pg > 180.0
                                && pb > 170.0
                            {
                                RegionMaskId::LimbsClaws
                            } else {
                                RegionMaskId::Body
                            }
                        }
                        PokemonStage::Charmeleon => {
                            if dest_x > offset_x + (scaled_w * 65 / 100)
                                && dest_y < offset_y + (scaled_h * 60 / 100)
                                && (pr > 140.0 && pg > 50.0)
                            {
                                RegionMaskId::Flame
                            } else if dest_x > offset_x + (scaled_w * 48 / 100)
                                && dest_y < offset_y + (scaled_h * 20 / 100)
                            {
                                RegionMaskId::CranialCrest
                            } else if dest_x > offset_x + (scaled_w * 62 / 100)
                                && dest_y >= offset_y + (scaled_h * 50 / 100)
                            {
                                RegionMaskId::Tail
                            } else if dest_x >= offset_x + (scaled_w * 25 / 100)
                                && dest_x <= offset_x + (scaled_w * 55 / 100)
                                && dest_y >= offset_y + (scaled_h * 45 / 100)
                                && dest_y <= offset_y + (scaled_h * 85 / 100)
                                && pr > 140.0
                                && pg > 120.0
                                && pb > 80.0
                            {
                                RegionMaskId::Belly
                            } else if pr > 185.0 && pg > 175.0 && pb > 175.0 {
                                if dest_y > offset_y + (scaled_h * 80 / 100) {
                                    RegionMaskId::LegsClaws
                                } else {
                                    RegionMaskId::ArmsClaws
                                }
                            } else {
                                RegionMaskId::Body
                            }
                        }
                        PokemonStage::Charizard => {
                            if (dest_x < offset_x + (scaled_w * 25 / 100)
                                && dest_y > offset_y + (scaled_h * 50 / 100)
                                && pr > 140.0
                                && pg > 50.0)
                                || (dest_x > offset_x + (scaled_w * 80 / 100)
                                    && pr > 140.0
                                    && pg > 50.0)
                            {
                                RegionMaskId::Flame
                            } else if dest_x >= offset_x + (scaled_w * 55 / 100)
                                && dest_x <= offset_x + (scaled_w * 85 / 100)
                                && dest_y < offset_y + (scaled_h * 30 / 100)
                            {
                                RegionMaskId::HeadHorns
                            } else if (pb > 70.0 || pg > 80.0)
                                && pr < 130.0
                                && (dest_x < offset_x + (scaled_w * 48 / 100)
                                    || dest_x > offset_x + (scaled_w * 80 / 100))
                            {
                                RegionMaskId::WingsInner
                            } else if (dest_x < offset_x + (scaled_w * 45 / 100)
                                || dest_x > offset_x + (scaled_w * 78 / 100))
                                && dest_y < offset_y + (scaled_h * 65 / 100)
                            {
                                RegionMaskId::WingsOuter
                            } else if dest_x < offset_x + (scaled_w * 35 / 100)
                                && dest_y >= offset_y + (scaled_h * 60 / 100)
                            {
                                RegionMaskId::Tail
                            } else if dest_x >= offset_x + (scaled_w * 52 / 100)
                                && dest_x <= offset_x + (scaled_w * 75 / 100)
                                && dest_y >= offset_y + (scaled_h * 45 / 100)
                                && dest_y <= offset_y + (scaled_h * 85 / 100)
                                && pr > 140.0
                                && pg > 120.0
                            {
                                RegionMaskId::Belly
                            } else if pr > 185.0 && pg > 175.0 && pb > 175.0 {
                                RegionMaskId::LimbsClaws
                            } else {
                                RegionMaskId::Body
                            }
                        }
                    };

                    region_grid[dest_y as usize][dest_x as usize] = Some(region);

                    let q = match region {
                        RegionMaskId::Flame => 0.85 + 0.15 * ((pr + pg) / 510.0),
                        RegionMaskId::Tail => {
                            0.70 + 0.16
                                * ((dest_x as f64 - (offset_x as f64 + scaled_w as f64 * 0.55))
                                    / (scaled_w as f64 * 0.45))
                                    .clamp(0.0, 1.0)
                        }
                        RegionMaskId::LimbsClaws
                        | RegionMaskId::ArmsClaws
                        | RegionMaskId::LegsClaws => {
                            if dest_y > offset_y + (scaled_h * 75 / 100) {
                                0.60 + 0.12
                                    * ((dest_y as f64 - (offset_y as f64 + scaled_h as f64 * 0.75))
                                        / (scaled_h as f64 * 0.25))
                                        .clamp(0.0, 1.0)
                            } else {
                                0.42 + 0.10
                                    * (1.0
                                        - (dest_y as f64
                                            - (offset_y as f64 + scaled_h as f64 * 0.50))
                                            .abs()
                                            / (scaled_h as f64 * 0.25))
                                        .clamp(0.0, 1.0)
                            }
                        }
                        RegionMaskId::Belly => {
                            0.46 + 0.18
                                * ((dest_y as f64 - (offset_y as f64 + scaled_h as f64 * 0.45))
                                    / (scaled_h as f64 * 0.40))
                                    .clamp(0.0, 1.0)
                        }
                        RegionMaskId::WingsInner | RegionMaskId::WingsOuter => {
                            0.30 + 0.15
                                * (1.0
                                    - (dest_y as f64 - offset_y as f64) / (scaled_h as f64 * 0.60))
                                    .clamp(0.0, 1.0)
                        }
                        RegionMaskId::Body => {
                            let height_factor = (dest_y as f64 - offset_y as f64) / scaled_h as f64;
                            0.15 + 0.52 * height_factor.clamp(0.0, 1.0)
                        }
                        RegionMaskId::CranialCrest | RegionMaskId::HeadHorns => 0.12,
                        RegionMaskId::FaceEyes => 0.06,
                    };
                    priority_grid[dest_y as usize][dest_x as usize] = q.clamp(0.0, 1.0);

                    // Deep, punchy, high-contrast dark shades for master grayscale
                    let norm_luma = (0.299 * pr + 0.587 * pg + 0.114 * pb) / 255.0;
                    let dark_luma = (norm_luma.powf(1.15) * 255.0).round().clamp(10.0, 255.0) as u8;
                    sprite_gray.put_pixel(
                        dest_x,
                        dest_y,
                        Rgba([dark_luma, dark_luma, dark_luma, 255]),
                    );

                    // Deep, rich, saturated color shades
                    let cr = ((p[0] as f64 / 255.0).powf(1.08) * 255.0)
                        .round()
                        .clamp(8.0, 255.0) as u8;
                    let cg = ((p[1] as f64 / 255.0).powf(1.12) * 255.0)
                        .round()
                        .clamp(8.0, 255.0) as u8;
                    let cb = ((p[2] as f64 / 255.0).powf(1.16) * 255.0)
                        .round()
                        .clamp(8.0, 255.0) as u8;
                    sprite_color.put_pixel(dest_x, dest_y, Rgba([cr, cg, cb, 255]));
                }
            }
        }

        // Apply perimeter dark outline (#1a0f0d) on outer silhouette
        for y in 0..160 {
            for x in 0..160 {
                if region_grid[y][x].is_some() {
                    let mut is_edge = false;
                    for (dx, dy) in [(-1i32, 0), (1, 0), (0, -1), (0, 1)] {
                        let nx = x as i32 + dx;
                        let ny = y as i32 + dy;
                        if nx < 0
                            || ny < 0
                            || nx >= 160
                            || ny >= 160
                            || region_grid[ny as usize][nx as usize].is_none()
                        {
                            is_edge = true;
                            break;
                        }
                    }
                    if is_edge {
                        sprite_gray.put_pixel(x as u32, y as u32, Rgba([26, 15, 13, 255]));
                        sprite_color.put_pixel(x as u32, y as u32, Rgba([26, 15, 13, 255]));
                    }
                }
            }
        }

        // Build disjoint region masks
        let mut masks = HashMap::new();
        for row in &region_grid {
            for &opt in row {
                if let Some(id) = opt {
                    masks.entry(id).or_insert_with(|| GrayImage::new(160, 160));
                }
            }
        }

        let mut priority_map = GrayImage::new(160, 160);
        for y in 0..160 {
            for x in 0..160 {
                if let Some(id) = region_grid[y][x] {
                    masks
                        .get_mut(&id)
                        .unwrap()
                        .put_pixel(x as u32, y as u32, Luma([255]));
                    let q_val = (priority_grid[y][x] * 255.0).round() as u8;
                    priority_map.put_pixel(x as u32, y as u32, Luma([q_val]));
                }
            }
        }

        let mut final_masks = HashMap::new();
        for (id, img) in masks {
            let mut count = 0;
            for p in img.pixels() {
                if p[0] > 127 {
                    count += 1;
                }
            }
            final_masks.insert(
                id,
                RegionMask {
                    id,
                    width: 160,
                    height: 160,
                    pixel_count: count,
                    mask: img,
                },
            );
        }

        let package = ArtworkPackage {
            stage,
            width: 160,
            height: 160,
            master_grayscale: sprite_gray,
            master_color: sprite_color,
            masks: final_masks,
            priority_map: PriorityMap {
                width: 160,
                height: 160,
                map: priority_map,
            },
        };

        ArtworkValidator::validate(&package)
            .expect("Generated artwork package must pass validation");

        package
    }
}
