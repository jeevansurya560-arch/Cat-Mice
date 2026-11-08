//! Programming-language classification, attribution, and palette registry.

use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct LanguageDistribution {
    pub shares: HashMap<String, f64>,
    pub dominant: String,
}

impl Default for LanguageDistribution {
    fn default() -> Self {
        let mut shares = HashMap::new();
        shares.insert("Rust".to_string(), 0.50);
        shares.insert("Python".to_string(), 0.30);
        shares.insert("TypeScript".to_string(), 0.20);
        Self {
            shares,
            dominant: "Rust".to_string(),
        }
    }
}
