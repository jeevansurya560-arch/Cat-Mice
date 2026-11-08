//! Deterministic Pokémon evolution thresholds, state machines, and progression metrics.

pub mod progression;
pub mod stages;

pub use progression::{evaluate_evolution, EvolutionEngine, EvolutionMilestone, EvolutionState};
pub use stages::PokemonStage;
