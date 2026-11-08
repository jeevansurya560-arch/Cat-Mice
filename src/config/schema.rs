use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::path::Path;

use crate::errors::{PokedexError, Result};

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct AppConfig {
    #[serde(default)]
    pub user: UserConfig,
    #[serde(default)]
    pub contributions: ContributionConfig,
    #[serde(default)]
    pub evolution: EvolutionConfig,
    #[serde(default)]
    pub languages: LanguageConfig,
    #[serde(default)]
    pub output: OutputConfig,
    #[serde(default)]
    pub cache: CacheConfig,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserConfig {
    #[serde(default = "default_username")]
    pub username: String,
    #[serde(default)]
    pub token: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContributionConfig {
    #[serde(default = "default_period")]
    pub period: String,
    #[serde(default = "default_true")]
    pub include_private: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EvolutionConfig {
    #[serde(default = "default_charmander_max")]
    pub charmander_max: u32,
    #[serde(default = "default_charmeleon_max")]
    pub charmeleon_max: u32,
    #[serde(default = "default_charizard_mastery")]
    pub charizard_mastery: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LanguageConfig {
    #[serde(default = "default_auto")]
    pub mode: String,
    #[serde(default = "default_boost")]
    pub dominant_weight_boost: f64,
    #[serde(default)]
    pub manual_weights: HashMap<String, f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OutputConfig {
    #[serde(default = "default_format")]
    pub format: String,
    #[serde(default = "default_dim")]
    pub width: u32,
    #[serde(default = "default_dim")]
    pub height: u32,
    #[serde(default = "default_false")]
    pub transparent: bool,
    #[serde(default = "default_fps")]
    pub fps: u32,
    #[serde(default = "default_frames")]
    pub frames: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CacheConfig {
    #[serde(default = "default_true")]
    pub enabled: bool,
    #[serde(default = "default_ttl")]
    pub ttl_seconds: u64,
    #[serde(default = "default_cache_dir")]
    pub cache_dir: String,
}

fn default_username() -> String {
    "developer".to_string()
}
fn default_period() -> String {
    "rolling_year".to_string()
}
fn default_true() -> bool {
    true
}
fn default_false() -> bool {
    false
}
fn default_charmander_max() -> u32 {
    249
}
fn default_charmeleon_max() -> u32 {
    749
}
fn default_charizard_mastery() -> u32 {
    2000
}
fn default_auto() -> String {
    "auto".to_string()
}
fn default_boost() -> f64 {
    1.25
}
fn default_format() -> String {
    "all".to_string()
}
fn default_dim() -> u32 {
    480
}
fn default_fps() -> u32 {
    10
}
fn default_frames() -> u32 {
    12
}
fn default_ttl() -> u64 {
    3600
}
fn default_cache_dir() -> String {
    ".cache".to_string()
}

impl Default for UserConfig {
    fn default() -> Self {
        Self {
            username: default_username(),
            token: String::new(),
        }
    }
}

impl Default for ContributionConfig {
    fn default() -> Self {
        Self {
            period: default_period(),
            include_private: default_true(),
        }
    }
}

impl Default for EvolutionConfig {
    fn default() -> Self {
        Self {
            charmander_max: default_charmander_max(),
            charmeleon_max: default_charmeleon_max(),
            charizard_mastery: default_charizard_mastery(),
        }
    }
}

impl Default for LanguageConfig {
    fn default() -> Self {
        Self {
            mode: default_auto(),
            dominant_weight_boost: default_boost(),
            manual_weights: HashMap::new(),
        }
    }
}

impl Default for OutputConfig {
    fn default() -> Self {
        Self {
            format: default_format(),
            width: default_dim(),
            height: default_dim(),
            transparent: default_false(),
            fps: default_fps(),
            frames: default_frames(),
        }
    }
}

impl Default for CacheConfig {
    fn default() -> Self {
        Self {
            enabled: default_true(),
            ttl_seconds: default_ttl(),
            cache_dir: default_cache_dir(),
        }
    }
}

impl AppConfig {
    /// Loads configuration from a TOML file path, falling back to defaults if not found.
    pub fn load_from_file<P: AsRef<Path>>(path: P) -> Result<Self> {
        let path_ref = path.as_ref();
        if !path_ref.exists() {
            return Ok(Self::default());
        }

        let content =
            std::fs::read_to_string(path_ref).map_err(|e| PokedexError::Config(e.to_string()))?;
        let config: AppConfig =
            toml::from_str(&content).map_err(|e| PokedexError::Config(e.to_string()))?;
        Ok(config)
    }

    /// Resolves token from configuration or environment variables (GH_TOKEN / GITHUB_TOKEN).
    pub fn resolve_token(&self) -> Option<String> {
        if !self.user.token.is_empty() {
            Some(self.user.token.clone())
        } else if let Ok(t) = std::env::var("GH_TOKEN") {
            Some(t)
        } else {
            std::env::var("GITHUB_TOKEN").ok()
        }
    }
}
