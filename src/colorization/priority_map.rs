/// Calculates continuous organic color reveal coverage from priority Q(x, y) and progress T.
pub fn compute_coverage(q: f64, progress: f64) -> f64 {
    if progress <= 0.0 || q <= 0.0 {
        return 0.0;
    }
    if progress >= 1.0 {
        return 1.0;
    }

    let edge0 = (1.0 - progress - 0.05).clamp(0.0, 1.0);
    let edge1 = (1.0 - progress + 0.05).clamp(0.0, 1.0);

    smoothstep(edge0, edge1, q)
}

#[inline]
fn smoothstep(edge0: f64, edge1: f64, x: f64) -> f64 {
    if edge0 >= edge1 {
        if x >= edge1 {
            1.0
        } else {
            0.0
        }
    } else {
        let t = ((x - edge0) / (edge1 - edge0)).clamp(0.0, 1.0);
        t * t * (3.0 - 2.0 * t)
    }
}
