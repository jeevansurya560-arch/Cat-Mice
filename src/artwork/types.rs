use image::{GrayImage, RgbaImage};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::evolution::PokemonStage;

/// Anatomical region identifiers for targeted progressive colorization.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum RegionMaskId {
    Body,
    Belly,
    FaceEyes,
    LimbsClaws,
    CranialCrest,
    HeadHorns,
    WingsOuter,
    WingsInner,
    ArmsClaws,
    LegsClaws,
    Tail,
    Flame,
}

impl RegionMaskId {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Body => "body",
            Self::Belly => "belly",
            Self::FaceEyes => "face_eyes",
            Self::LimbsClaws => "limbs_claws",
            Self::CranialCrest => "cranial_crest",
            Self::HeadHorns => "head_horns",
            Self::WingsOuter => "wings_outer",
            Self::WingsInner => "wings_inner",
            Self::ArmsClaws => "arms_claws",
            Self::LegsClaws => "legs_claws",
            Self::Tail => "tail",
            Self::Flame => "flame",
        }
    }

    pub fn parse_id(s: &str) -> Option<Self> {
        s.parse().ok()
    }
}

impl std::str::FromStr for RegionMaskId {
    type Err = ();

    fn from_str(s: &str) -> std::result::Result<Self, Self::Err> {
        match s {
            "body" => Ok(Self::Body),
            "belly" => Ok(Self::Belly),
            "face_eyes" => Ok(Self::FaceEyes),
            "limbs_claws" => Ok(Self::LimbsClaws),
            "cranial_crest" => Ok(Self::CranialCrest),
            "head_horns" => Ok(Self::HeadHorns),
            "wings_outer" => Ok(Self::WingsOuter),
            "wings_inner" => Ok(Self::WingsInner),
            "arms_claws" => Ok(Self::ArmsClaws),
            "legs_claws" => Ok(Self::LegsClaws),
            "tail" => Ok(Self::Tail),
            "flame" => Ok(Self::Flame),
            _ => Err(()),
        }
    }
}

/// Binary mask indicating spatial membership in a specific anatomical region.
#[derive(Debug, Clone)]
pub struct RegionMask {
    pub id: RegionMaskId,
    pub width: u32,
    pub height: u32,
    pub pixel_count: usize,
    pub mask: GrayImage, // 255 = inside mask, 0 = outside
}

/// Continuous spatial priority map Q(x,y) in [0.0, 1.0] indicating colorization ordering.
#[derive(Debug, Clone)]
pub struct PriorityMap {
    pub width: u32,
    pub height: u32,
    pub map: GrayImage, // pixel value in [0, 255] representing Q(x, y) * 255
}

impl PriorityMap {
    pub fn get_priority(&self, x: u32, y: u32) -> f64 {
        if x >= self.width || y >= self.height {
            0.0
        } else {
            self.map.get_pixel(x, y)[0] as f64 / 255.0
        }
    }
}

/// Comprehensive artwork package containing master grayscale sprite, masks, and priority map.
#[derive(Debug, Clone)]
pub struct ArtworkPackage {
    pub stage: PokemonStage,
    pub width: u32,
    pub height: u32,
    pub master_grayscale: RgbaImage,
    pub master_color: RgbaImage,
    pub masks: HashMap<RegionMaskId, RegionMask>,
    pub priority_map: PriorityMap,
}

/// Detailed report from mathematical artwork validation.
#[derive(Debug, Clone)]
pub struct ValidationReport {
    pub stage: PokemonStage,
    pub width: u32,
    pub height: u32,
    pub total_opaque_pixels: usize,
    pub mask_pixel_sums: usize,
    pub overlap_count: usize,
    pub unmasked_count: usize,
    pub is_valid: bool,
}
