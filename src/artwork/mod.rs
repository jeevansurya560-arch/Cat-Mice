//! Master sprite loading, anatomical region masks, and geometric validation.

pub mod generator;
pub mod loader;
pub mod types;
pub mod validator;

pub use generator::ArtworkGenerator;
pub use loader::ArtworkLoader;
pub use types::{ArtworkPackage, PriorityMap, RegionMask, RegionMaskId, ValidationReport};
pub use validator::ArtworkValidator;
