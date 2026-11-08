use std::fs;
use std::path::Path;

use crate::errors::{PokedexError, Result};

pub const START_MARKER: &str = "<!-- NEO-POKEDEX:START -->";
pub const END_MARKER: &str = "<!-- NEO-POKEDEX:END -->";

pub struct ReadmeUpdater;

impl ReadmeUpdater {
    /// Safely synchronizes the README content between START and END markers.
    /// Returns `Ok(true)` if the file was modified, or `Ok(false)` if already up to date (idempotent).
    pub fn update_readme<P: AsRef<Path>>(
        readme_path: P,
        asset_relative_path: &str,
    ) -> Result<bool> {
        let path = readme_path.as_ref();
        if !path.exists() {
            return Err(PokedexError::Config(format!(
                "Target README file does not exist: {:?}",
                path
            )));
        }

        let original_content = fs::read_to_string(path)?;
        let embed_block = format!(
            "{}\n<div align=\"center\">\n  <img src=\"{}\" alt=\"Neo-Pokédex Pokémon Evolution Companion\" width=\"600\" />\n</div>\n{}",
            START_MARKER, asset_relative_path, END_MARKER
        );

        let new_content = if let (Some(start_idx), Some(end_idx)) = (
            original_content.find(START_MARKER),
            original_content.find(END_MARKER),
        ) {
            let actual_end = end_idx + END_MARKER.len();
            format!(
                "{}{}{}",
                &original_content[..start_idx],
                embed_block,
                &original_content[actual_end..]
            )
        } else {
            // Append to bottom if markers are not yet present
            format!("{}\n\n{}\n", original_content.trim_end(), embed_block)
        };

        if new_content == original_content {
            Ok(false) // Idempotent: no modification needed
        } else {
            fs::write(path, new_content)?;
            Ok(true)
        }
    }
}
