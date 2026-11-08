use clap::{Parser, Subcommand};
use std::path::PathBuf;

/// Neo-Pokédex: GitHub Contributions → Pokémon Evolution → HD Pixel Art → Progressive Colorization
#[derive(Parser, Debug)]
#[command(name = "neo-pokedex", version, about, long_about = None)]
pub struct Cli {
    /// Path to TOML configuration file
    #[arg(short, long, default_value = "config/default.toml")]
    pub config: PathBuf,

    /// Subcommand to execute
    #[command(subcommand)]
    pub command: Option<Commands>,
}

#[derive(Subcommand, Debug)]
pub enum Commands {
    /// Generate Pokémon visual assets for a GitHub user
    Generate {
        /// GitHub username
        #[arg(short, long)]
        username: Option<String>,

        /// Output directory
        #[arg(short, long, default_value = "output")]
        output: PathBuf,

        /// Explicit contribution count override (skips network query)
        #[arg(long)]
        commits: Option<u32>,

        /// Export format: png, gif, svg, or all
        #[arg(short, long, default_value = "all")]
        format: String,

        /// Synchronize generated asset link into README.md markers
        #[arg(long)]
        sync_readme: bool,

        /// Path to target README file for marker synchronization
        #[arg(long, default_value = "README.md")]
        readme: PathBuf,
    },

    /// Render a terminal and image preview across progression stages
    Preview {
        /// Target Pokémon: charmander, charmeleon, charizard, or all
        #[arg(short, long, default_value = "all")]
        stage: String,

        /// Output directory for preview images
        #[arg(short, long, default_value = "output/previews")]
        output: PathBuf,
    },

    /// Validate asset dimensions, region masks, and colorization pipelines
    Validate,

    /// Print active resolved configuration
    Config,

    /// Print version and engine build details
    Version,
}
