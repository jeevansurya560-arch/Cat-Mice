use reqwest::header::HeaderMap;
use tracing::warn;

#[derive(Debug, Clone, Copy)]
pub struct RateLimitStatus {
    pub limit: u32,
    pub remaining: u32,
    pub reset_timestamp: u64,
}

pub type RateLimitInfo = RateLimitStatus;

pub struct RateLimitSupervisor;

impl RateLimitSupervisor {
    /// Inspects HTTP response headers for GitHub rate limiting thresholds.
    pub fn inspect_headers(headers: &HeaderMap) -> Option<RateLimitStatus> {
        let remaining: u32 = headers
            .get("x-ratelimit-remaining")
            .and_then(|v| v.to_str().ok())
            .and_then(|s| s.parse().ok())?;

        let limit: u32 = headers
            .get("x-ratelimit-limit")
            .and_then(|v| v.to_str().ok())
            .and_then(|s| s.parse().ok())
            .unwrap_or(5000);

        let reset_timestamp: u64 = headers
            .get("x-ratelimit-reset")
            .and_then(|v| v.to_str().ok())
            .and_then(|s| s.parse().ok())
            .unwrap_or(0);

        if remaining < 20 {
            warn!(
                remaining = remaining,
                limit = limit,
                reset_timestamp = reset_timestamp,
                "GitHub API rate limit critically low"
            );
        }

        Some(RateLimitStatus {
            limit,
            remaining,
            reset_timestamp,
        })
    }
}
