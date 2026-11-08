use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Weighted distribution of user activity across programming languages.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LanguageDistribution {
    pub raw_counts: HashMap<String, u64>,
    pub normalized_weights: HashMap<String, f64>,
    pub dominant_language: Option<String>,
}

impl Default for LanguageDistribution {
    fn default() -> Self {
        let mut raw = HashMap::new();
        raw.insert("rust".to_string(), 70);
        raw.insert("python".to_string(), 20);
        raw.insert("typescript".to_string(), 10);
        Self::from_counts(raw, 1.25)
    }
}

impl LanguageDistribution {
    /// Creates a distribution from raw commit or byte counts, applying a dominant boost.
    pub fn from_counts(counts: HashMap<String, u64>, dominant_boost: f64) -> Self {
        if counts.is_empty() {
            return Self {
                raw_counts: HashMap::new(),
                normalized_weights: HashMap::new(),
                dominant_language: None,
            };
        }

        // Find dominant language
        let mut max_count = 0u64;
        let mut dominant = None;
        for (lang, &count) in &counts {
            if count > max_count {
                max_count = count;
                dominant = Some(lang.clone());
            }
        }

        // Apply weights with optional boost
        let mut weighted: HashMap<String, f64> = HashMap::new();
        let mut total_weighted = 0.0f64;

        for (lang, &count) in &counts {
            let mut w = count as f64;
            if Some(lang) == dominant.as_ref() && dominant_boost > 1.0 {
                w *= dominant_boost;
            }
            weighted.insert(lang.clone(), w);
            total_weighted += w;
        }

        let mut normalized = HashMap::new();
        if total_weighted > 0.0 {
            for (lang, w) in weighted {
                normalized.insert(lang, w / total_weighted);
            }
        }

        Self {
            raw_counts: counts,
            normalized_weights: normalized,
            dominant_language: dominant,
        }
    }

    /// Returns the normalized weight for a language, or 0.0 if not present.
    pub fn weight(&self, language: &str) -> f64 {
        self.normalized_weights
            .get(&language.to_lowercase())
            .copied()
            .unwrap_or(0.0)
    }
}
