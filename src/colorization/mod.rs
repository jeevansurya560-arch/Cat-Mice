//! Mathematical colorization engine: luminance extraction, OKLab blending, spatial priority field Q(x,y).

pub struct ColorizationEngine {
    gamma: f64,
}

impl Default for ColorizationEngine {
    fn default() -> Self {
        Self { gamma: 1.15 }
    }
}

impl ColorizationEngine {
    pub fn new() -> Self {
        Self::default()
    }

    /// Computes the progressive colorization intensity based on progress T: Intensity = T^1.15
    pub fn compute_intensity(&self, progress: f64) -> f64 {
        progress.clamp(0.0, 1.0).powf(self.gamma)
    }
}

