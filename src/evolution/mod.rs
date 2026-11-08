//! Deterministic Pokémon evolution thresholds and progression calculation.

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PokemonStage {
    Charmander,
    Charmeleon,
    Charizard,
}

#[derive(Debug, Clone)]
pub struct EvolutionState {
    pub stage: PokemonStage,
    pub name: &'static str,
    pub dex_number: &'static str,
    pub progress: f64,
    pub progress_percent: u32,
    pub contributions: u32,
}

/// Evaluates active Pokémon evolution stage and colorization progress T(P) from total contributions.
pub fn evaluate_evolution(contributions: u32) -> EvolutionState {
    if contributions <= 249 {
        let t = (contributions as f64) / 249.0;
        let clamped = t.clamp(0.0, 1.0);
        EvolutionState {
            stage: PokemonStage::Charmander,
            name: "Charmander",
            dex_number: "0004",
            progress: clamped,
            progress_percent: (clamped * 100.0).round() as u32,
            contributions,
        }
    } else if contributions <= 749 {
        let t = ((contributions - 250) as f64) / 499.0;
        let clamped = t.clamp(0.0, 1.0);
        EvolutionState {
            stage: PokemonStage::Charmeleon,
            name: "Charmeleon",
            dex_number: "0005",
            progress: clamped,
            progress_percent: (clamped * 100.0).round() as u32,
            contributions,
        }
    } else {
        let t = ((contributions - 750) as f64) / 1250.0;
        let clamped = t.clamp(0.0, 1.0);
        EvolutionState {
            stage: PokemonStage::Charizard,
            name: "Charizard",
            dex_number: "0006",
            progress: clamped,
            progress_percent: (clamped * 100.0).round() as u32,
            contributions,
        }
    }
}

