use thiserror::Error;

/// Structured domain errors for the Neo-Pokédex system.
#[derive(Debug, Error)]
pub enum PokedexError {
    #[error("GitHub API communication error: {0}")]
    GitHub(String),

    #[error("Authentication error: GitHub token is invalid or missing required scope")]
    AuthenticationFailed,

    #[error("Rate limit exceeded: resets at {reset_time}")]
    RateLimitExceeded { reset_time: String },

    #[error("Evolution error: {0}")]
    Evolution(String),

    #[error("Colorization mathematical error: {0}")]
    Colorization(String),

    #[error("Artwork asset loading error for '{path}': {message}")]
    AssetNotFound { path: String, message: String },

    #[error(
        "Mask dimension mismatch: expected {expected_w}x{expected_h}, got {actual_w}x{actual_h}"
    )]
    MaskDimensionMismatch {
        expected_w: u32,
        expected_h: u32,
        actual_w: u32,
        actual_h: u32,
    },

    #[error("Mask validation error: {0}")]
    MaskValidation(String),

    #[error("Rendering error: {0}")]
    Rendering(String),

    #[error("Configuration error: {0}")]
    Config(String),

    #[error("Security violation: {0}")]
    SecurityViolation(String),

    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Image processing error: {0}")]
    Image(#[from] image::ImageError),
}
