use base64::engine::general_purpose::STANDARD as BASE64;
use base64::Engine;
use std::path::Path;

use crate::errors::{PokedexError, Result};
use crate::evolution::EvolutionState;
use crate::language::{LanguageDistribution, PaletteRegistry};

pub struct SvgRenderer;

impl SvgRenderer {
    /// Renders an SVG card embedding the animated Pokémon asset with HUD telemetry.
    pub fn render_card(
        state: &EvolutionState,
        distribution: &LanguageDistribution,
        registry: &PaletteRegistry,
        asset_bytes: &[u8],
        mime_type: &str,
        width: u32,
        height: u32,
    ) -> String {
        let b64_data = BASE64.encode(asset_bytes);
        let data_uri = format!("data:{};base64,{}", mime_type, b64_data);

        let progress_pct = state.progress_percent;
        let progress_bar_width = (280.0 * (progress_pct as f64 / 100.0)).round() as u32;

        let next_evo_text = if let Some(remaining) = state.commits_to_next_evolution {
            let next_name = state
                .stage
                .next_stage()
                .map(|s| s.display_name())
                .unwrap_or("Mastery");
            format!("Evolves to {} in {} commits", next_name, remaining)
        } else if let Some(remaining) = state.commits_to_mastery {
            if remaining == 0 {
                "Mastery Achieved ★".to_string()
            } else {
                format!("Mastery in {} commits", remaining)
            }
        } else {
            "Mastery Achieved ★".to_string()
        };

        // Render top 3 language pills
        let mut lang_pills = Vec::new();
        let mut sorted_langs: Vec<_> = distribution.normalized_weights.iter().collect();
        sorted_langs.sort_by(|a, b| b.1.partial_cmp(a.1).unwrap_or(std::cmp::Ordering::Equal));

        let mut pill_x = 40;
        for (lang, weight) in sorted_langs.into_iter().take(3) {
            let color = registry.get(lang);
            let pct = (weight * 100.0).round() as u32;
            let display_name = match lang.as_str() {
                "jupyter notebook" => "JUPYTER",
                other => other,
            };
            let label = format!("{}: {}%", display_name.to_uppercase(), pct);
            let pill_width = (label.len() * 7 + 24) as u32;

            lang_pills.push(format!(
                r##"<g transform="translate({pill_x}, 445)">
                    <rect width="{pill_width}" height="20" rx="4" fill="#161b22" stroke="#30363d" stroke-width="1"/>
                    <circle cx="8" cy="10" r="3.5" fill="{color_hex}"/>
                    <text x="16" y="14" fill="#c9d1d9" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif" font-size="10" font-weight="600">{label}</text>
                </g>"##,
                pill_x = pill_x,
                pill_width = pill_width,
                color_hex = color.hex,
                label = label
            ));
            pill_x += pill_width + 8;
        }

        let pills_xml = lang_pills.join("\n    ");

        format!(
            r##"<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="0 0 {width} {height}" fill="none">
    <style>
        .title {{ font: 700 16px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; fill: #f0f6fc; letter-spacing: 1.5px; }}
        .subtitle {{ font: 600 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; fill: #8b949e; letter-spacing: 0.5px; }}
        .stat-val {{ font: 700 13px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; fill: #ff7b72; }}
        .badge {{ font: 600 10px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; fill: #7ee787; }}
        .label {{ font: 500 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; fill: #8b949e; }}
        .progress-text {{ font: 600 11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; fill: #c9d1d9; }}
    </style>

    <!-- Card Background -->
    <rect width="{width}" height="{height}" rx="12" fill="#0d1117" stroke="#30363d" stroke-width="1.5"/>

    <!-- Header Telemetry -->
    <g transform="translate(32, 28)">
        <text x="0" y="0" class="subtitle">NO. {dex} • {species}</text>
        <text x="0" y="22" class="title">{name}</text>
    </g>

    <g transform="translate({right_x}, 28)" text-anchor="end">
        <text x="0" y="0" class="subtitle">LIFETIME ACTIVITY</text>
        <text x="0" y="22" class="stat-val">{commits} Commits</text>
    </g>

    <!-- Character Sprite Container -->
    <g transform="translate({sprite_x}, 75)">
        <image href="{data_uri}" xlink:href="{data_uri}" width="280" height="280" style="image-rendering: pixelated; shape-rendering: crispEdges;"/>
    </g>

    <!-- Progress Telemetry Bar -->
    <g transform="translate(160, 375)">
        <!-- Bar track -->
        <rect width="280" height="8" rx="4" fill="#21262d"/>
        <!-- Active bar -->
        <rect width="{progress_bar_width}" height="8" rx="4" fill="url(#flame_grad)"/>
        <!-- Text labels -->
        <text x="0" y="24" class="label">Stage Colouring Progress</text>
        <text x="280" y="24" class="progress-text" text-anchor="end">{progress_pct}%</text>
        <text x="140" y="44" class="badge" text-anchor="middle">{next_evo_text}</text>
    </g>

    <!-- Language Attribution Pills -->
    {pills_xml}

    <!-- Gradients -->
    <defs>
        <linearGradient id="flame_grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ff4400"/>
            <stop offset="50%" stop-color="#ff7700"/>
            <stop offset="100%" stop-color="#ffbb00"/>
        </linearGradient>
    </defs>
</svg>"##,
            width = width,
            height = height,
            dex = state.dex_number,
            species = state.stage.species().to_uppercase(),
            name = state.name.to_uppercase(),
            right_x = width - 32,
            commits = state.contributions,
            sprite_x = (width - 280) / 2,
            data_uri = data_uri,
            progress_bar_width = progress_bar_width,
            progress_pct = progress_pct,
            next_evo_text = next_evo_text,
            pills_xml = pills_xml,
        )
    }

    /// Saves SVG string to filesystem.
    pub fn save_to_file<P: AsRef<Path>>(svg_content: &str, path: P) -> Result<()> {
        let p = path.as_ref();
        if let Some(parent) = p.parent() {
            std::fs::create_dir_all(parent)?;
        }

        std::fs::write(p, svg_content)
            .map_err(|e| PokedexError::Rendering(format!("Failed to write SVG to {:?}: {}", p, e)))
    }
}
