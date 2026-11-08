use reqwest::header::{HeaderMap, HeaderValue, AUTHORIZATION, USER_AGENT};
use serde_json::json;
use tracing::{debug, info, warn};

use crate::cache::DiskCache;
use crate::errors::{PokedexError, Result};
use crate::github::contributions::{ContributionParser, UserContributionData};
use crate::github::rate_limit::RateLimitSupervisor;

pub struct GitHubClient {
    token: Option<String>,
    api_url: String,
    http_client: reqwest::Client,
    cache: Option<DiskCache>,
}

impl GitHubClient {
    pub fn new(token: Option<String>) -> Self {
        Self {
            token,
            api_url: "https://api.github.com/graphql".to_string(),
            http_client: reqwest::Client::new(),
            cache: None,
        }
    }

    pub fn with_api_url(mut self, url: String) -> Self {
        self.api_url = url;
        self
    }

    pub fn with_cache(mut self, cache: DiskCache) -> Self {
        self.cache = Some(cache);
        self
    }

    pub fn token(&self) -> Option<&str> {
        self.token.as_deref()
    }

    /// Fetches user contributions and language metrics via GitHub GraphQL v4 API.
    pub async fn fetch_contributions(
        &self,
        username: &str,
        period: &str,
    ) -> Result<UserContributionData> {
        // 1. Check cache first
        if let Some(cache) = &self.cache {
            if let Some(cached) = cache.get(username) {
                debug!(user = %username, "Retrieved user contributions from disk cache");
                return Ok(cached);
            }
        }

        // 2. Fallback to mock deterministic data if no token is available
        if self.token.is_none() && self.api_url == "https://api.github.com/graphql" {
            warn!(
                user = %username,
                "No GitHub token found (set GH_TOKEN or GITHUB_TOKEN). Using offline fallback."
            );
            let mut lang_bytes = std::collections::HashMap::new();
            lang_bytes.insert("rust".to_string(), 750_000);
            lang_bytes.insert("python".to_string(), 200_000);
            lang_bytes.insert("typescript".to_string(), 80_000);

            return Ok(UserContributionData {
                username: username.to_string(),
                total_contributions: 500,
                reporting_period: period.to_string(),
                language_bytes: lang_bytes,
            });
        }

        // 3. Build GraphQL Query
        let query = r#"
            query ($login: String!) {
                user(login: $login) {
                    contributionsCollection {
                        contributionCalendar {
                            totalContributions
                        }
                    }
                    repositories(first: 20, ownerAffiliations: OWNER, orderBy: {field: PUSHED_AT, direction: DESC}) {
                        nodes {
                            languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
                                edges {
                                    size
                                    node {
                                        name
                                    }
                                }
                            }
                        }
                    }
                }
            }
        "#;

        let mut headers = HeaderMap::new();
        headers.insert(USER_AGENT, HeaderValue::from_static("neo-pokedex"));
        if let Some(t) = &self.token {
            let auth_val = format!("Bearer {}", t);
            if let Ok(val) = HeaderValue::from_str(&auth_val) {
                headers.insert(AUTHORIZATION, val);
            }
        }

        let body = json!({
            "query": query,
            "variables": { "login": username }
        });

        info!(endpoint = %self.api_url, user = %username, "Dispatching GitHub GraphQL query");
        let resp = self
            .http_client
            .post(&self.api_url)
            .headers(headers)
            .json(&body)
            .send()
            .await
            .map_err(|e| PokedexError::GitHub(format!("Network transport failure: {}", e)))?;

        // Supervise rate limits
        RateLimitSupervisor::inspect_headers(resp.headers());

        if !resp.status().is_success() {
            return Err(PokedexError::GitHub(format!(
                "GitHub API responded with status {}",
                resp.status()
            )));
        }

        let json_val: serde_json::Value = resp
            .json()
            .await
            .map_err(|e| PokedexError::GitHub(format!("Failed to parse response JSON: {}", e)))?;

        let data = ContributionParser::parse_graphql_response(&json_val, username, period)?;

        // Cache result if cache is configured
        if let Some(cache) = &self.cache {
            let _ = cache.set(username, &data);
        }

        Ok(data)
    }
}
