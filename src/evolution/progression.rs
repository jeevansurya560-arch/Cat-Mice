use serde::{Deserialize, Serialize};

use crate::config::EvolutionConfig;
use crate::evolution::stages::PokemonStage;

/// Discrete progression milestones corresponding to visual checkpoints.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
pub enum EvolutionMilestone {
    Baseline0,     // 0%: Monochromatic grayscale
    EarlySpark10,  // 10%: Subtle flame core tint
    Accent25,      // 25%: Flame radiant, highlights begin
    Equilibrium50, // 50%: Balanced dual-tone color/monochrome
    Advanced75,    // 75%: 80% coverage, vibrant body tones
    Polish90,      // 90%: Near total coverage, secondary reflections
    Mastered100,   // 100%: Full-spectrum mastered form
}

impl EvolutionMilestone {
    pub fn from_progress(progress: f64) -> Self {
        let percent = (progress.clamp(0.0, 1.0) * 100.0).round() as u32;
        match percent {
            0..=4 => Self::Baseline0,
            5..=17 => Self::EarlySpark10,
            18..=37 => Self::Accent25,
            38..=62 => Self::Equilibrium50,
            63..=84 => Self::Advanced75,
            85..=96 => Self::Polish90,
            _ => Self::Mastered100,
        }
    }

    pub fn description(&self) -> &'static str {
        match self {
            Self::Baseline0 => "Monochromatic Grayscale Baseline",
            Self::EarlySpark10 => "Early Spark: Flame Core Awakening",
            Self::Accent25 => "Accentuation: Vivid Flame Radiance",
            Self::Equilibrium50 => "Equilibrium: Balanced Tone Transition",
            Self::Advanced75 => "Advanced: Dominant Palette Saturation",
            Self::Polish90 => "Final Polish: Specular Reflections",
            Self::Mastered100 => "Mastered: Full-Spectrum Harmony",
        }
    }
}

/// Comprehensive state snapshot of Pokémon evolution and color progress.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvolutionState {
    pub stage: PokemonStage,
    pub name: &'static str,
    pub dex_number: &'static str,
    pub progress: f64,
    pub progress_percent: u32,
    pub contributions: u32,
    pub milestone: EvolutionMilestone,
    pub commits_to_next_evolution: Option<u32>,
    pub commits_to_mastery: Option<u32>,
}

/// Deterministic evolution state machine with configurable thresholds.
#[derive(Debug, Clone)]
pub struct EvolutionEngine {
    charmander_max: u32,
    charmeleon_max: u32,
    charizard_mastery: u32,
}

impl Default for EvolutionEngine {
    fn default() -> Self {
        Self {
            charmander_max: 249,
            charmeleon_max: 749,
            charizard_mastery: 2000,
        }
    }
}

impl EvolutionEngine {
    pub fn new(charmander_max: u32, charmeleon_max: u32, charizard_mastery: u32) -> Self {
        Self {
            charmander_max,
            charmeleon_max,
            charizard_mastery,
        }
    }

    pub fn from_config(config: &EvolutionConfig) -> Self {
        Self {
            charmander_max: config.charmander_max,
            charmeleon_max: config.charmeleon_max,
            charizard_mastery: config.charizard_mastery,
        }
    }

    /// Evaluates total contributions into exact evolution stage, clamped progress T(P), and milestone.
    pub fn evaluate(&self, contributions: u32) -> EvolutionState {
        if contributions <= self.charmander_max {
            let t = if self.charmander_max > 0 {
                (contributions as f64) / (self.charmander_max as f64)
            } else {
                1.0
            };
            let clamped = t.clamp(0.0, 1.0);
            let percent = (clamped * 100.0).round() as u32;
            let commits_to_next = Some(self.charmander_max + 1 - contributions);

            EvolutionState {
                stage: PokemonStage::Charmander,
                name: PokemonStage::Charmander.display_name(),
                dex_number: PokemonStage::Charmander.dex_number(),
                progress: clamped,
                progress_percent: percent,
                contributions,
                milestone: EvolutionMilestone::from_progress(clamped),
                commits_to_next_evolution: commits_to_next,
                commits_to_mastery: Some(self.charizard_mastery.saturating_sub(contributions)),
            }
        } else if contributions <= self.charmeleon_max {
            let start = self.charmander_max + 1;
            let range = self.charmeleon_max - start;
            let offset = contributions - start;
            let t = if range > 0 {
                (offset as f64) / (range as f64)
            } else {
                1.0
            };
            let clamped = t.clamp(0.0, 1.0);
            let percent = (clamped * 100.0).round() as u32;
            let commits_to_next = Some(self.charmeleon_max + 1 - contributions);

            EvolutionState {
                stage: PokemonStage::Charmeleon,
                name: PokemonStage::Charmeleon.display_name(),
                dex_number: PokemonStage::Charmeleon.dex_number(),
                progress: clamped,
                progress_percent: percent,
                contributions,
                milestone: EvolutionMilestone::from_progress(clamped),
                commits_to_next_evolution: commits_to_next,
                commits_to_mastery: Some(self.charizard_mastery.saturating_sub(contributions)),
            }
        } else {
            let start = self.charmeleon_max + 1;
            let range = self.charizard_mastery.saturating_sub(start);
            let offset = contributions.saturating_sub(start);
            let t = if range > 0 {
                (offset as f64) / (range as f64)
            } else {
                1.0
            };
            let clamped = t.clamp(0.0, 1.0);
            let percent = (clamped * 100.0).round() as u32;

            EvolutionState {
                stage: PokemonStage::Charizard,
                name: PokemonStage::Charizard.display_name(),
                dex_number: PokemonStage::Charizard.dex_number(),
                progress: clamped,
                progress_percent: percent,
                contributions,
                milestone: EvolutionMilestone::from_progress(clamped),
                commits_to_next_evolution: None, // Final evolutionary form
                commits_to_mastery: if contributions < self.charizard_mastery {
                    Some(self.charizard_mastery - contributions)
                } else {
                    Some(0)
                },
            }
        }
    }
}

/// Convenience evaluation function using canonical defaults (249 / 749 / 2000).
pub fn evaluate_evolution(contributions: u32) -> EvolutionState {
    EvolutionEngine::default().evaluate(contributions)
}
