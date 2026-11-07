import { describe, it, expect, vi } from "vitest";
import { fetchUserProfile } from "../../src/github/account.js";

describe("GitHub: User Profile Retrieval", () => {
  it("should fetch and extract user profile attributes", async () => {
    const mockOctokit = {
      rest: {
        users: {
          getByUsername: vi.fn().mockResolvedValue({
            data: {
              node_id: "MDQ6VXNlcjE=",
              login: "octocat",
              created_at: "2011-01-25T18:44:36Z"
            }
          })
        }
      }
    };

    const profile = await fetchUserProfile(mockOctokit, "octocat");
    expect(profile.id).toBe("MDQ6VXNlcjE=");
    expect(profile.login).toBe("octocat");
    expect(profile.createdAt).toBe("2011-01-25T18:44:36Z");
  });
});
