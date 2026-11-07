import { describe, it, expect } from "vitest";
import { createGitHubClient } from "../../src/github/client.js";

describe("GitHub: Client Factory", () => {
  it("should instantiate Octokit client with custom user agent", () => {
    const client = createGitHubClient("test-token");
    expect(client).toBeDefined();
    expect(client.rest).toBeDefined();
    expect(client.graphql).toBeDefined();
  });
});
