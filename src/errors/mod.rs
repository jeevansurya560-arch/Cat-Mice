pub mod types;

pub use types::PokedexError;
pub type Result<T> = std::result::Result<T, PokedexError>;
