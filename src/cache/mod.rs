use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use std::time::{Duration, SystemTime};

use crate::errors::{PokedexError, Result};
use crate::github::UserContributionData;

#[derive(Debug, Serialize, Deserialize)]
struct CacheEntry {
    timestamp: u64,
    data: UserContributionData,
}

pub struct DiskCache {
    cache_dir: PathBuf,
    ttl: Duration,
    enabled: bool,
}

impl DiskCache {
    pub fn new<P: AsRef<Path>>(cache_dir: P, ttl_seconds: u64, enabled: bool) -> Self {
        Self {
            cache_dir: cache_dir.as_ref().to_path_buf(),
            ttl: Duration::from_secs(ttl_seconds),
            enabled,
        }
    }

    pub fn get(&self, username: &str) -> Option<UserContributionData> {
        if !self.enabled {
            return None;
        }

        let file_path = self
            .cache_dir
            .join(format!("contrib_{}.json", username.to_lowercase()));
        if !file_path.exists() {
            return None;
        }

        let content = fs::read_to_string(&file_path).ok()?;
        let entry: CacheEntry = serde_json::from_str(&content).ok()?;

        let now = SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .ok()?
            .as_secs();

        if now.saturating_sub(entry.timestamp) < self.ttl.as_secs() {
            Some(entry.data)
        } else {
            None
        }
    }

    pub fn set(&self, username: &str, data: &UserContributionData) -> Result<()> {
        if !self.enabled {
            return Ok(());
        }

        fs::create_dir_all(&self.cache_dir).map_err(|e| PokedexError::Config(e.to_string()))?;

        let now = SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)
            .map_err(|e| PokedexError::Config(e.to_string()))?
            .as_secs();

        let entry = CacheEntry {
            timestamp: now,
            data: data.clone(),
        };

        let json = serde_json::to_string_pretty(&entry)
            .map_err(|e| PokedexError::Config(e.to_string()))?;

        let file_path = self
            .cache_dir
            .join(format!("contrib_{}.json", username.to_lowercase()));
        fs::write(file_path, json).map_err(|e| PokedexError::Config(e.to_string()))?;

        Ok(())
    }
}
