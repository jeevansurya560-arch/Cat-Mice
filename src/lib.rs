//! Neo-Pokédex Core Library
//!
//! GitHub Contributions → Pokémon Evolution → HD Pixel Art → Progressive Colorization

pub mod artwork;
pub mod cli;
pub mod colorization;
pub mod config;
pub mod errors;
pub mod evolution;
pub mod github;
pub mod language;
pub mod logging;
pub mod renderer;

pub use errors::{PokedexError, Result};

