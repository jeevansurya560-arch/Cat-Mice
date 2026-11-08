//! GitHub API transport, contribution metrics, and rate-limiting supervisor.

pub mod client;
pub mod contributions;
pub mod rate_limit;

pub use client::GitHubClient;
pub use contributions::{ContributionParser, UserContributionData};
pub use rate_limit::{RateLimitInfo, RateLimitStatus, RateLimitSupervisor};
