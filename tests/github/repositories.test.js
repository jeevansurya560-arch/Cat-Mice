import { describe, it, expect, vi } from "vitest";
import { fetchLanguageStats } from "../../src/github/repositories.js";

describe("GitHub: Repository Language Aggregation", () => {
  it("should aggregate and sort language byte usage across repositories", async () => {
    const mockOctokit = {
      graphql: vi.fn().mockResolvedValue({
        user: {
          repositories: {
            nodes: [
              {
                languages: {
                  edges: [
                    { size: 5000, node: { name: "JavaScript", color: "#f1e05a" } },
                    { size: 3000, node: { name: "Rust", color: "#dea584" } }
                  ]
                }
              },
              {
                languages: {
                  edges: [
                    { size: 7000, node: { name: "JavaScript", color: "#f1e05a" } },
                    { size: 2000, node: { name: "Python", color: "#3572a5" } }
                  ]
                }
              }
            ]
          }
        }
      })
    };

    const languages = await fetchLanguageStats(mockOctokit, "octocat");
    expect(languages).toHaveLength(3);
    expect(languages[0].name).toBe("JavaScript");
    expect(languages[0].bytes).toBe(12000); // 5000 + 7000
    expect(languages[1].name).toBe("Rust");
    expect(languages[1].bytes).toBe(3000);
    expect(languages[2].name).toBe("Python");
    expect(languages[2].bytes).toBe(2000);
  });
});
