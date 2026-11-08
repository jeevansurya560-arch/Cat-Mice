//! Programming language detection, Linguist classification, and color mapping.

pub mod attribution;
pub mod detection;
pub mod palette;

pub use attribution::LanguageDistribution;
pub use detection::LanguageDetector;
pub use palette::{LanguageColor, PaletteRegistry};
