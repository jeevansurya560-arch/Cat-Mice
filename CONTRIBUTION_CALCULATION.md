# GitHub Contribution Calculation & Metrics Specification

## 1. GitHub Contribution Accounting

GitHub's official contribution metrics encompass specific developer actions. Neo-Pokédex adheres strictly to GitHub's formal definitions:

| Activity Type | Included in Calendar | Qualification Criteria |
|---|---|---|
| **Commits** | Yes | Pushed to default branch or `gh-pages` branch; commit author email matches verified GitHub email. |
| **Pull Requests** | Yes | Opened by the user (independent of whether merged). |
| **Issues** | Yes | Opened in any public repository (or private when authenticated with `repo` scope). |
| **Code Reviews** | Yes | Formal pull request reviews submitted. |
| **Repository Creations**| No | Not counted by GitHub's contribution calendar. |
| **Forks & Stars** | No | Community interaction, not code contribution. |

---

## 2. GraphQL Schema & Query Architecture

Neo-Pokédex queries GitHub GraphQL v4 using the following query:

```graphql
query GetUserContributions($username: String!, $from: DateTime, $to: DateTime) {
  user(login: $username) {
    name
    login
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            color
          }
        }
      }
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
    }
  }
}
```

### Reporting Period Options:
In `config/default.toml`, users configure:
```toml
[contributions]
# Options: "rolling_year" (past 365 days) | "calendar_year" | "lifetime"
period = "rolling_year"
include_private = true
```

- **`rolling_year` (Default):** Evaluates activity over the previous 365 days from the execution timestamp. This reflects the user's active momentum.
- **`lifetime`:** Iterates across historical contribution collections from `user.createdAt` to the present date, summing all calendar years.
- **`include_private`:** When a GitHub Personal Access Token (PAT) with `read:user` or `repo` scope is provided, private contributions are included in the aggregated sum without exposing private repository names or code.

---

## 3. Rate-Limit Budget & Token Management

1. **GraphQL Cost Efficiency:**
   - A single GraphQL query costs **1 point** against GitHub's 5,000 points/hour limit.
   - Contrast with REST, which requires paginating through events (consuming dozens of requests).
2. **Exponential Backoff:**
   - If response header `x-ratelimit-remaining` reaches $< 10$, the client enters backoff mode until `x-ratelimit-reset`.
3. **Unauthenticated Fallback:**
   - Unauthenticated requests have a 60 requests/hour limit.
   - Neo-Pokédex supports unauthenticated queries for public users, but strongly recommends passing `GH_TOKEN` or `GITHUB_TOKEN` in CI.
4. **Offline Snapshot Caching:**
   - Local runs cache GraphQL responses in `.cache/contributions.json` with a configurable TTL (default 1 hour) to avoid burning API rate limits during rapid testing.

