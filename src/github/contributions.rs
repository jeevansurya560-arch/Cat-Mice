use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use crate::errors::{PokedexError, Result};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserContributionData {
    pub username: String,
    pub total_contributions: u32,
    pub reporting_period: String,
    pub language_bytes: HashMap<String, u64>,
}

pub struct ContributionParser;

impl ContributionParser {
    /// Parses a raw GitHub GraphQL response JSON into structured UserContributionData.
    pub fn parse_graphql_response(
        json: &serde_json::Value,
        username: &str,
        period: &str,
    ) -> Result<UserContributionData> {
        let user = json
            .get("data")
            .and_then(|d| d.get("user"))
            .ok_or_else(|| {
                PokedexError::GitHub("User data missing in GraphQL response".to_string())
            })?;

        if user.is_null() {
            return Err(PokedexError::GitHub(format!(
                "User '{}' not found on GitHub",
                username
            )));
        }

        let total_contributions = user
            .get("contributionsCollection")
            .and_then(|c| c.get("contributionCalendar"))
            .and_then(|cal| cal.get("totalContributions"))
            .and_then(|t| t.as_u64())
            .unwrap_or(0) as u32;

        let mut language_bytes = HashMap::new();
        if let Some(nodes) = user
            .get("repositories")
            .and_then(|r| r.get("nodes"))
            .and_then(|n| n.as_array())
        {
            for repo in nodes {
                if let Some(edges) = repo
                    .get("languages")
                    .and_then(|l| l.get("edges"))
                    .and_then(|e| e.as_array())
                {
                    for edge in edges {
                        let size = edge.get("size").and_then(|s| s.as_u64()).unwrap_or(0);
                        if let Some(name) = edge
                            .get("node")
                            .and_then(|n| n.get("name"))
                            .and_then(|nm| nm.as_str())
                        {
                            *language_bytes.entry(name.to_lowercase()).or_insert(0) += size;
                        }
                    }
                }
            }
        }

        Ok(UserContributionData {
            username: username.to_string(),
            total_contributions,
            reporting_period: period.to_string(),
            language_bytes,
        })
    }

    /// Extracts total contribution count from GitHub public profile contributions HTML.
    pub fn parse_public_contributions_html(html: &str) -> Option<u32> {
        if let Some(idx) = html.find("id=\"js-contribution-activity-description\"") {
            let snippet = &html[idx..std::cmp::min(idx + 300, html.len())];
            for line in snippet.lines() {
                let trimmed = line.trim();
                let clean = trimmed.replace(',', "");
                if let Ok(num) = clean.parse::<u32>() {
                    return Some(num);
                }
            }
        }
        if let Some(idx) = html.find("contributions") {
            let start = idx.saturating_sub(60);
            let snippet = &html[start..idx];
            for word in snippet.split_whitespace().rev() {
                let clean = word.replace(',', "");
                if let Ok(num) = clean.parse::<u32>() {
                    return Some(num);
                }
            }
        }
        None
    }
}
