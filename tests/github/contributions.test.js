import { describe, it, expect, vi } from "vitest";
import { fetchContributions } from "../../src/github/contributions.js";

describe("GitHub: Contribution Calendar Extraction", () => {
  it("should parse GraphQL contribution calendar response", async () => {
    const mockOctokit = {
      graphql: vi.fn().mockResolvedValue({
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: 42,
              weeks: [
                {
                  contributionDays: [
                    { date: "2026-11-01", contributionCount: 5, color: "#0e4429" },
                    { date: "2026-11-02", contributionCount: 10, color: "#26a641" }
                  ]
                }
              ]
            }
          }
        }
      })
    };

    const result = await fetchContributions(mockOctokit, "octocat");
    expect(result.totalContributions).toBe(42);
    expect(result.calendarDays).toHaveLength(2);
    expect(result.calendarDays[0].date).toBe("2026-11-01");
    expect(result.calendarDays[0].contributionCount).toBe(5);
  });
});
