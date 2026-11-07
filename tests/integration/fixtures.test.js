import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { loadSnapshotFromFile } from "../../src/snapshot/loader.js";
import { computeAnalytics } from "../../src/analytics/index.js";
import { evaluateProgression } from "../../src/progression/index.js";
import { deriveSeed } from "../../src/core/seed.js";
import { CAT_STAGES, MOUSE_TIERS, MILESTONE_IDS } from "../../src/core/constants.js";

describe("Integration: End-to-End Fixture Processing", () => {
  it("should process sample-snapshot.json into an ADULT cat with mouse UNLOCKED", async () => {
    const fixturePath = resolve(process.cwd(), "fixtures/sample-snapshot.json");
    const { data: snapshot } = await loadSnapshotFromFile(fixturePath);

    const analytics = computeAnalytics(snapshot);
    const seed = deriveSeed({ userId: snapshot.user.id, timestamp: snapshot.timestamp });
    const progression = evaluateProgression(analytics, seed);

    expect(analytics.totalContributions).toBe(1842);
    expect(progression.cat.stage).toBe(CAT_STAGES.ADULT);
    expect(progression.mouse.unlocked).toBe(true);
    expect(progression.milestones.map((m) => m.id)).toContain(MILESTONE_IDS.KILO_CODER);
  });

  it("should process zero-contributions.json into a KITTEN with mouse locked", async () => {
    const fixturePath = resolve(process.cwd(), "fixtures/zero-contributions.json");
    const { data: snapshot } = await loadSnapshotFromFile(fixturePath);

    const analytics = computeAnalytics(snapshot);
    const seed = deriveSeed({ userId: snapshot.user.id, timestamp: snapshot.timestamp });
    const progression = evaluateProgression(analytics, seed);

    expect(analytics.totalContributions).toBe(0);
    expect(progression.cat.stage).toBe(CAT_STAGES.KITTEN);
    expect(progression.cat.scale).toBe(1);
    expect(progression.mouse.unlocked).toBe(false);
    expect(progression.mouse.tier).toBe(MOUSE_TIERS.LOCKED);
    expect(progression.milestones).toHaveLength(0);
  });

  it("should process high-streak.json into an ELDER cat with mouse UNLOCKED as NINJA", async () => {
    const fixturePath = resolve(process.cwd(), "fixtures/high-streak.json");
    const { data: snapshot } = await loadSnapshotFromFile(fixturePath);

    const analytics = computeAnalytics(snapshot);
    const seed = deriveSeed({ userId: snapshot.user.id, timestamp: snapshot.timestamp });
    const progression = evaluateProgression(analytics, seed);

    expect(analytics.totalContributions).toBe(18500);
    expect(analytics.streaks.longestStreak).toBe(15);
    expect(progression.cat.stage).toBe(CAT_STAGES.ELDER);
    expect(progression.mouse.unlocked).toBe(true);
    expect(progression.mouse.tier).toBe(MOUSE_TIERS.NINJA);
    expect(progression.milestones.map((m) => m.id)).toContain(MILESTONE_IDS.LEGENDARY_DEV);
  });

  it("should process polyglot.json and award polyglot milestone badges", async () => {
    const fixturePath = resolve(process.cwd(), "fixtures/polyglot.json");
    const { data: snapshot } = await loadSnapshotFromFile(fixturePath);

    const analytics = computeAnalytics(snapshot);
    const seed = deriveSeed({ userId: snapshot.user.id, timestamp: snapshot.timestamp });
    const progression = evaluateProgression(analytics, seed);

    expect(analytics.languages.languageCount).toBe(6);
    expect(progression.milestones.map((m) => m.id)).toContain(MILESTONE_IDS.POLYGLOT);
    expect(progression.milestones.map((m) => m.id)).toContain(MILESTONE_IDS.MASTER_POLYGLOT);
  });
});
