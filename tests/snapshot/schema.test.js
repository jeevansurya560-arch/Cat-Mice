import { describe, it, expect } from "vitest";
import { validateSnapshot } from "../../src/snapshot/schema.js";

describe("Snapshot Schema Validation", () => {
  const validSnapshot = {
    version: 1,
    timestamp: "2026-11-07T12:00:00.000Z",
    user: {
      id: "MDQ6VXNlcjEyMzQ1",
      login: "test-dev",
      createdAt: "2023-01-01T00:00:00.000Z"
    },
    metrics: {
      totalContributions: 150,
      calendarDays: [
        { date: "2026-11-01", contributionCount: 5, color: "#0e4429" },
        { date: "2026-11-02", contributionCount: 10, color: "#26a641" }
      ],
      languages: [
        { name: "JavaScript", bytes: 10000, color: "#f1e05a" },
        { name: "Rust", bytes: 5000, color: "#dea584" }
      ]
    }
  };

  it("should successfully validate a conformant snapshot object", () => {
    const result = validateSnapshot(validSnapshot);
    expect(result.success).toBe(true);
    expect(result.data.user.login).toBe("test-dev");
    expect(result.data.metrics.totalContributions).toBe(150);
  });

  it("should reject an invalid snapshot version", () => {
    const invalid = { ...validSnapshot, version: 2 };
    const result = validateSnapshot(invalid);
    expect(result.success).toBe(false);
    expect(result.errors.some((err) => err.includes("version"))).toBe(true);
  });

  it("should reject negative contribution counts", () => {
    const invalid = {
      ...validSnapshot,
      metrics: {
        ...validSnapshot.metrics,
        totalContributions: -5
      }
    };
    const result = validateSnapshot(invalid);
    expect(result.success).toBe(false);
    expect(result.summary).toContain("negative");
  });

  it("should reject invalid calendar date formats", () => {
    const invalid = {
      ...validSnapshot,
      metrics: {
        ...validSnapshot.metrics,
        calendarDays: [{ date: "01-11-2026", contributionCount: 5 }]
      }
    };
    const result = validateSnapshot(invalid);
    expect(result.success).toBe(false);
    expect(result.summary).toContain("YYYY-MM-DD");
  });

  it("should reject invalid language hex colors", () => {
    const invalid = {
      ...validSnapshot,
      metrics: {
        ...validSnapshot.metrics,
        languages: [{ name: "JS", bytes: 100, color: "not-a-color" }]
      }
    };
    const result = validateSnapshot(invalid);
    expect(result.success).toBe(false);
    expect(result.summary).toContain("hex code");
  });

  it("should reject missing required user fields", () => {
    const invalid = {
      ...validSnapshot,
      user: {
        id: "MDQ6VXNlcjEyMzQ1"
        // missing login and createdAt
      }
    };
    const result = validateSnapshot(invalid);
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });
});
