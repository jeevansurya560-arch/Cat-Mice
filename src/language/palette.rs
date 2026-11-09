use palette::{FromColor, Oklab, Oklch, Srgb};
use std::collections::HashMap;

/// Pre-calculated color representation in sRGB, OKLab, and OKLCH spaces.
#[derive(Debug, Clone, Copy)]
pub struct LanguageColor {
    pub hex: &'static str,
    pub rgb: [u8; 3],
    pub oklab: Oklab,
    pub oklch: Oklch,
}

impl LanguageColor {
    pub fn new(hex: &'static str, r: u8, g: u8, b: u8) -> Self {
        let srgb = Srgb::new(r as f32 / 255.0, g as f32 / 255.0, b as f32 / 255.0);
        let oklab = Oklab::from_color(srgb);
        let oklch = Oklch::from_color(oklab);
        Self {
            hex,
            rgb: [r, g, b],
            oklab,
            oklch,
        }
    }
}

// Renamed field for clarity
pub struct PaletteRegistry {
    entries: HashMap<String, LanguageColor>,
    fallback: LanguageColor,
}

impl Default for PaletteRegistry {
    fn default() -> Self {
        let mut entries = HashMap::new();

        // Built-in GitHub Linguist canonical palettes
        entries.insert(
            "rust".to_string(),
            LanguageColor::new("#dea584", 222, 165, 132),
        );
        entries.insert(
            "python".to_string(),
            LanguageColor::new("#3776ab", 55, 118, 171),
        );
        entries.insert(
            "typescript".to_string(),
            LanguageColor::new("#3178c6", 49, 120, 198),
        );
        entries.insert(
            "javascript".to_string(),
            LanguageColor::new("#f7df1e", 247, 223, 30),
        );
        entries.insert("go".to_string(), LanguageColor::new("#00add8", 0, 173, 216));
        entries.insert(
            "cpp".to_string(),
            LanguageColor::new("#f34b7d", 243, 75, 125),
        );
        entries.insert("c".to_string(), LanguageColor::new("#555555", 85, 85, 85));
        entries.insert(
            "csharp".to_string(),
            LanguageColor::new("#178600", 23, 134, 0),
        );
        entries.insert(
            "java".to_string(),
            LanguageColor::new("#b07219", 176, 114, 25),
        );
        entries.insert(
            "html".to_string(),
            LanguageColor::new("#e34c26", 227, 76, 38),
        );
        entries.insert(
            "css".to_string(),
            LanguageColor::new("#563d7c", 86, 61, 124),
        );
        entries.insert(
            "shell".to_string(),
            LanguageColor::new("#89e051", 137, 224, 81),
        );
        entries.insert(
            "ruby".to_string(),
            LanguageColor::new("#701516", 112, 21, 22),
        );
        entries.insert(
            "swift".to_string(),
            LanguageColor::new("#f05138", 240, 81, 56),
        );
        entries.insert(
            "kotlin".to_string(),
            LanguageColor::new("#a97bff", 169, 123, 255),
        );
        entries.insert(
            "jupyter notebook".to_string(),
            LanguageColor::new("#da5b0b", 218, 91, 11),
        );
        entries.insert(
            "jupyter".to_string(),
            LanguageColor::new("#da5b0b", 218, 91, 11),
        );
        entries.insert(
            "sql".to_string(),
            LanguageColor::new("#e38c00", 227, 140, 0),
        );
        entries.insert(
            "plpgsql".to_string(),
            LanguageColor::new("#336791", 51, 103, 145),
        );
        entries.insert(
            "solidity".to_string(),
            LanguageColor::new("#aa6746", 170, 103, 70),
        );
        entries.insert(
            "powershell".to_string(),
            LanguageColor::new("#012456", 1, 36, 86),
        );
        entries.insert(
            "dockerfile".to_string(),
            LanguageColor::new("#384d54", 56, 77, 84),
        );
        entries.insert(
            "c++".to_string(),
            LanguageColor::new("#f34b7d", 243, 75, 125),
        );
        entries.insert("c#".to_string(), LanguageColor::new("#178600", 23, 134, 0));

        let fallback = LanguageColor::new("#8b949e", 139, 148, 158);

        Self { entries, fallback }
    }
}

impl PaletteRegistry {
    pub fn get(&self, language: &str) -> LanguageColor {
        let key = language.to_lowercase();
        self.entries.get(&key).copied().unwrap_or(self.fallback)
    }

    pub fn register(&mut self, language: &str, color: LanguageColor) {
        self.entries.insert(language.to_lowercase(), color);
    }
}
