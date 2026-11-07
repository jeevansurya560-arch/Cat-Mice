import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { loadSnapshotFromFile, loadSnapshotFromMemory } from "../../src/snapshot/loader.js";

describe("Snapshot Loader & Normalizer", () => {
  const sampleFixturePath = resolve(process.cwd(), "fixtures/sample-snapshot.json");

  it("should successfully load and normalize the sample snapshot fixture", async () => {
    const result = await loadSnapshotFromFile(sampleFixturePath);
    expect(result.success).toBe(true);
    expect(result.data.user.login).toBe("pixel-developer");
    expect(result.data.metrics.totalContributions).toBe(1842);
    expect(result.data.metrics.calendarDays.length).toBe(7);
  });

  it("should ensure calendar days are chronologically sorted", async () => {
    const unorderedData = {
      version: 1,
      timestamp: "2026-11-07T12:00:00.000Z",
      user: {
        id: "1",
        login: "dev",
        createdAt: "2024-01-01T00:00:00.000Z"
      },
      metrics: {
        totalContributions: 20,
        calendarDays: [
          { date: "2026-11-05", contributionCount: 5 },
          { date: "2026-11-01", contributionCount: 2 },
          { date: "2026-11-03", contributionCount: 3 }
        ],
        languages: [{ name: "JS", bytes: 100 }]
      }
    };

    const result = loadSnapshotFromMemory(unorderedData);
    expect(result.data.metrics.calendarDays[0].date).toBe("2026-11-01");
    expect(result.data.metrics.calendarDays[1].date).toBe("2026-11-03");
    expect(result.data.metrics.calendarDays[2].date).toBe("2026-11-05");
  });

  it("should sort languages by bytes descending", async () => {
    const unorderedLanguages = {
      version: 1,
      timestamp: "2026-11-07T12:00:00.000Z",
      user: {
        id: "1",
        login: "dev",
        createdAt: "2024-01-01T00:00:00.000Z"
      },
      metrics: {
        totalContributions: 10,
        calendarDays: [{ date: "2026-11-01", contributionCount: 10 }],
        languages: [
          { name: "Ruby", bytes: 50 },
          { name: "Python", bytes: 500 },
          { name: "C", bytes: 250 }
        ]
      }
    };

    const result = loadSnapshotFromMemory(unorderedLanguages);
    expect(result.data.metrics.languages[0].name).toBe("Python");
    expect(result.data.metrics.languages[1].name).toBe("C");
    expect(result.data.metrics.languages[2].name).toBe("Ruby");
  });

  it("should fail gracefully when file does not exist", async () => {
    await expect(loadSnapshotFromFile("fixtures/non-existent-file.json")).rejects.toThrow(
      /Failed to read snapshot file/
    );
  });

  it("should fail when loading invalid in-memory data", () => {
    expect(() => loadSnapshotFromMemory({ invalid: true })).toThrow(/Snapshot validation failed/);
  });
});
