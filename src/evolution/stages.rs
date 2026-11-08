use serde::{Deserialize, Serialize};

/// Canonical evolutionary stages for the starter Fire-type line.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum PokemonStage {
    Charmander,
    Charmeleon,
    Charizard,
}

impl PokemonStage {
    /// 1-based index in the evolutionary chain.
    pub fn stage_index(&self) -> u8 {
        match self {
            Self::Charmander => 1,
            Self::Charmeleon => 2,
            Self::Charizard => 3,
        }
    }

    /// Official National Pokédex ID.
    pub fn dex_number(&self) -> &'static str {
        match self {
            Self::Charmander => "0004",
            Self::Charmeleon => "0005",
            Self::Charizard => "0006",
        }
    }

    /// English display name.
    pub fn display_name(&self) -> &'static str {
        match self {
            Self::Charmander => "Charmander",
            Self::Charmeleon => "Charmeleon",
            Self::Charizard => "Charizard",
        }
    }

    /// Official Pokédex species categorization.
    pub fn species(&self) -> &'static str {
        match self {
            Self::Charmander => "Lizard Pokémon",
            Self::Charmeleon => "Flame Pokémon",
            Self::Charizard => "Flame Pokémon",
        }
    }

    /// Elemental typing.
    pub fn elemental_types(&self) -> &'static [&'static str] {
        match self {
            Self::Charmander => &["Fire"],
            Self::Charmeleon => &["Fire"],
            Self::Charizard => &["Fire", "Flying"],
        }
    }

    /// Filesystem folder name for assets.
    pub fn folder_name(&self) -> &'static str {
        match self {
            Self::Charmander => "charmander",
            Self::Charmeleon => "charmeleon",
            Self::Charizard => "charizard",
        }
    }

    /// Returns the next evolutionary form, if any.
    pub fn next_stage(&self) -> Option<PokemonStage> {
        match self {
            Self::Charmander => Some(Self::Charmeleon),
            Self::Charmeleon => Some(Self::Charizard),
            Self::Charizard => None,
        }
    }

    /// Returns the preceding evolutionary form, if any.
    pub fn prev_stage(&self) -> Option<PokemonStage> {
        match self {
            Self::Charmander => None,
            Self::Charmeleon => Some(Self::Charmander),
            Self::Charizard => Some(Self::Charmeleon),
        }
    }

    /// Default contribution bracket (min_commits, max_commits).
    pub fn default_bracket(&self) -> (u32, u32) {
        match self {
            Self::Charmander => (0, 249),
            Self::Charmeleon => (250, 749),
            Self::Charizard => (750, 2000),
        }
    }

    /// Contribution threshold required to trigger the next evolution, if applicable.
    pub fn evolution_threshold(&self) -> Option<u32> {
        match self {
            Self::Charmander => Some(250),
            Self::Charmeleon => Some(750),
            Self::Charizard => None,
        }
    }
}
