use neo_pokedex::cache::DiskCache;
use neo_pokedex::github::{GitHubClient, UserContributionData};
use serde_json::json;
use std::collections::HashMap;
use tempfile::tempdir;
use wiremock::matchers::method;
use wiremock::{Mock, MockServer, ResponseTemplate};

#[tokio::test]
async fn test_github_graphql_client_mock() {
    let mock_server = MockServer::start().await;

    let mock_response = json!({
        "data": {
            "user": {
                "contributionsCollection": {
                    "contributionCalendar": {
                        "totalContributions": 542
                    }
                },
                "repositories": {
                    "nodes": [
                        {
                            "languages": {
                                "edges": [
                                    {
                                        "size": 150000,
                                        "node": { "name": "Rust" }
                                    },
                                    {
                                        "size": 50000,
                                        "node": { "name": "TypeScript" }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        }
    });

    Mock::given(method("POST"))
        .respond_with(ResponseTemplate::new(200).set_body_json(mock_response))
        .mount(&mock_server)
        .await;

    let client =
        GitHubClient::new(Some("ghp_dummy_token".to_string())).with_api_url(mock_server.uri());

    let data = client
        .fetch_contributions("octocat", "rolling_year")
        .await
        .expect("GraphQL query must succeed against mock server");

    assert_eq!(data.username, "octocat");
    assert_eq!(data.total_contributions, 542);
    assert_eq!(data.language_bytes.get("rust"), Some(&150000));
    assert_eq!(data.language_bytes.get("typescript"), Some(&50000));
}

#[test]
fn test_disk_cache_persistence() {
    let temp = tempdir().expect("Failed to create tempdir");
    let cache = DiskCache::new(temp.path(), 3600, true);

    let mut langs = HashMap::new();
    langs.insert("rust".to_string(), 100);

    let data = UserContributionData {
        username: "testuser".to_string(),
        total_contributions: 350,
        reporting_period: "rolling_year".to_string(),
        language_bytes: langs,
    };

    cache
        .set("testuser", &data)
        .expect("Cache write must succeed");

    let retrieved = cache.get("testuser").expect("Cache read must find entry");
    assert_eq!(retrieved.username, "testuser");
    assert_eq!(retrieved.total_contributions, 350);
}
