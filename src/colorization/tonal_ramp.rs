use palette::Oklab;

/// 5-stop perceptual tonal ramp in OKLab color space.
#[derive(Debug, Clone, Copy)]
pub struct TonalRamp {
    pub deep_shadow: Oklab,
    pub shadow: Oklab,
    pub base_tone: Oklab,
    pub highlight: Oklab,
    pub specular: Oklab,
}

impl TonalRamp {
    /// Constructs a standard 5-stop tonal ramp from a base target color.
    pub fn from_base_color(base: Oklab) -> Self {
        Self {
            deep_shadow: Oklab::new(0.15, base.a * 0.65, base.b * 0.65),
            shadow: Oklab::new(0.35, base.a * 0.85, base.b * 0.85),
            base_tone: Oklab::new(0.55, base.a, base.b),
            highlight: Oklab::new(0.78, base.a * 0.90, base.b * 0.90),
            specular: Oklab::new(0.95, base.a * 0.40, base.b * 0.40),
        }
    }

    /// Dedicated radiant fire tonal ramp for elemental tail flames.
    pub fn flame_ramp() -> Self {
        Self {
            deep_shadow: Oklab::new(0.35, 0.18, 0.12), // Deep ember crimson
            shadow: Oklab::new(0.55, 0.22, 0.18),      // Blazing red-orange
            base_tone: Oklab::new(0.70, 0.16, 0.24),   // Radiant pure orange
            highlight: Oklab::new(0.85, 0.08, 0.28),   // Brilliant golden flame
            specular: Oklab::new(0.98, 0.01, 0.08),    // White-hot core
        }
    }

    /// Evaluates the tonal ramp at a given luminance Y in [0.0, 1.0].
    pub fn sample(&self, y: f32) -> Oklab {
        let clamped = y.clamp(0.0, 1.0);

        if clamped <= 0.15 {
            self.deep_shadow
        } else if clamped <= 0.35 {
            let t = (clamped - 0.15) / 0.20;
            self.interpolate(self.deep_shadow, self.shadow, t)
        } else if clamped <= 0.55 {
            let t = (clamped - 0.35) / 0.20;
            self.interpolate(self.shadow, self.base_tone, t)
        } else if clamped <= 0.78 {
            let t = (clamped - 0.55) / 0.23;
            self.interpolate(self.base_tone, self.highlight, t)
        } else if clamped <= 0.95 {
            let t = (clamped - 0.78) / 0.17;
            self.interpolate(self.highlight, self.specular, t)
        } else {
            self.specular
        }
    }

    #[inline]
    fn interpolate(&self, c1: Oklab, c2: Oklab, t: f32) -> Oklab {
        let t_clamped = t.clamp(0.0, 1.0);
        Oklab::new(
            c1.l + (c2.l - c1.l) * t_clamped,
            c1.a + (c2.a - c1.a) * t_clamped,
            c1.b + (c2.b - c1.b) * t_clamped,
        )
    }
}
