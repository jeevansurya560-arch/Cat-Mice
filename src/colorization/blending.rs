use palette::{FromColor, IntoColor, Oklab, Srgb};

use crate::artwork::RegionMaskId;
use crate::evolution::PokemonStage;
use crate::language::{LanguageDistribution, PaletteRegistry};

pub struct ColorBlender;

impl ColorBlender {
    /// Mixes detected languages into a composite OKLab color based on normalized weights Wi.
    pub fn mix_languages(distribution: &LanguageDistribution, registry: &PaletteRegistry) -> Oklab {
        if distribution.normalized_weights.is_empty() {
            return registry.get("rust").oklab;
        }

        let mut l_sum = 0.0f32;
        let mut a_sum = 0.0f32;
        let mut b_sum = 0.0f32;

        for (lang, &weight) in &distribution.normalized_weights {
            let color = registry.get(lang);
            let w = weight as f32;
            l_sum += color.oklab.l * w;
            a_sum += color.oklab.a * w;
            b_sum += color.oklab.b * w;
        }

        Oklab::new(l_sum, a_sum, b_sum)
    }

    /// Derives target color for a specific anatomical region by harmonizing
    /// the authentic Pokémon palette with the user's language palette mixture.
    pub fn target_region_color(
        stage: PokemonStage,
        region: RegionMaskId,
        language_mix: Oklab,
    ) -> Oklab {
        let auth_srgb = Self::authentic_region_color(stage, region);
        let auth_oklab: Oklab = Oklab::from_color(auth_srgb);
        let blend_factor = Self::region_blend_factor(region);

        Oklab::new(
            auth_oklab.l * (1.0 - blend_factor) + language_mix.l * blend_factor,
            auth_oklab.a * (1.0 - blend_factor) + language_mix.a * blend_factor,
            auth_oklab.b * (1.0 - blend_factor) + language_mix.b * blend_factor,
        )
    }

    /// Authentic reference colors from official Pokédex entries.
    pub fn authentic_region_color(stage: PokemonStage, region: RegionMaskId) -> Srgb {
        match stage {
            PokemonStage::Charmander => match region {
                RegionMaskId::Body => Srgb::new(0.945, 0.514, 0.216), // #f18337
                RegionMaskId::Belly => Srgb::new(0.988, 0.929, 0.729), // #fcedba
                RegionMaskId::FaceEyes => Srgb::new(0.149, 0.576, 0.624), // #26939f
                RegionMaskId::LimbsClaws => Srgb::new(0.945, 0.514, 0.216),
                RegionMaskId::Tail => Srgb::new(0.945, 0.514, 0.216),
                RegionMaskId::Flame => Srgb::new(1.0, 0.416, 0.0), // #ff6a00
                _ => Srgb::new(0.945, 0.514, 0.216),
            },
            PokemonStage::Charmeleon => match region {
                RegionMaskId::Body => Srgb::new(0.820, 0.267, 0.231), // #d1443b
                RegionMaskId::Belly => Srgb::new(0.933, 0.863, 0.682), // #eedcae
                RegionMaskId::CranialCrest => Srgb::new(0.820, 0.267, 0.231),
                RegionMaskId::ArmsClaws => Srgb::new(0.820, 0.267, 0.231),
                RegionMaskId::LegsClaws => Srgb::new(0.820, 0.267, 0.231),
                RegionMaskId::Tail => Srgb::new(0.820, 0.267, 0.231),
                RegionMaskId::Flame => Srgb::new(1.0, 0.333, 0.0), // #ff5500
                _ => Srgb::new(0.820, 0.267, 0.231),
            },
            PokemonStage::Charizard => match region {
                RegionMaskId::Body => Srgb::new(0.910, 0.451, 0.165), // #e8732a
                RegionMaskId::Belly => Srgb::new(0.980, 0.910, 0.698), // #fae8b2
                RegionMaskId::HeadHorns => Srgb::new(0.910, 0.451, 0.165),
                RegionMaskId::WingsOuter => Srgb::new(0.910, 0.451, 0.165),
                RegionMaskId::WingsInner => Srgb::new(0.176, 0.533, 0.561), // #2d888f (teal membrane)
                RegionMaskId::LimbsClaws => Srgb::new(0.910, 0.451, 0.165),
                RegionMaskId::Tail => Srgb::new(0.910, 0.451, 0.165),
                RegionMaskId::Flame => Srgb::new(1.0, 0.267, 0.0), // #ff4400
                _ => Srgb::new(0.910, 0.451, 0.165),
            },
        }
    }

    /// Blending factor Br per anatomical region to preserve Pokémon character identity.
    pub fn region_blend_factor(region: RegionMaskId) -> f32 {
        match region {
            RegionMaskId::Body => 0.50,
            RegionMaskId::Belly => 0.25,
            RegionMaskId::FaceEyes => 0.00,
            RegionMaskId::LimbsClaws | RegionMaskId::ArmsClaws | RegionMaskId::LegsClaws => 0.20,
            RegionMaskId::CranialCrest | RegionMaskId::HeadHorns => 0.45,
            RegionMaskId::WingsOuter => 0.55,
            RegionMaskId::WingsInner => 0.45,
            RegionMaskId::Tail => 0.45,
            RegionMaskId::Flame => 0.45,
        }
    }

    /// Converts OKLab back to standard 8-bit sRGB with clamping.
    pub fn oklab_to_srgb(lab: Oklab) -> [u8; 3] {
        let srgb: Srgb = lab.into_color();
        [
            (srgb.red.clamp(0.0, 1.0) * 255.0).round() as u8,
            (srgb.green.clamp(0.0, 1.0) * 255.0).round() as u8,
            (srgb.blue.clamp(0.0, 1.0) * 255.0).round() as u8,
        ]
    }
}
