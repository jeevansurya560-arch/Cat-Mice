import { describe, it, expect } from "vitest";
import { detectMilestones } from "../../src/progression/milestones.js";
import { MILESTONE_IDS } from "../../src/core/constants.js";

describe("Progression: Milestone Detection", () => {
  it("should return empty array for 0 contributions and no streaks", () => {
    const milestones = detectMilestones({
      totalContributions: 0,
      streaks: { longestStreak: 0 },
      languages: { languageCount: 0 }
    });
    expect(milestones).toEqual([]);
  });

  it("should award FIRST_COMMIT, CENTURY_CLUB, and KILO_CODER for 1200 contributions", () => {
    const milestones = detectMilestones({
      totalContributions: 1200,
      streaks: { longestStreak: 5 },
      languages: { languageCount: 1 }
    });

    const ids = milestones.map((m) => m.id);
    expect(ids).toContain(MILESTONE_IDS.FIRST_COMMIT);
    expect(ids).toContain(MILESTONE_IDS.CENTURY_CLUB);
    expect(ids).toContain(MILESTONE_IDS.KILO_CODER);
    expect(ids).not.toContain(MILESTONE_IDS.LEGENDARY_DEV);
  });

  it("should award streak badges when thresholds are met", () => {
    const milestones = detectMilestones({
      totalContributions: 500,
      streaks: { longestStreak: 35 },
      languages: { languageCount: 2 }
    });

    const ids = milestones.map((m) => m.id);
    expect(ids).toContain(MILESTONE_IDS.STREAK_BRONZE);
    expect(ids).toContain(MILESTONE_IDS.STREAK_SILVER);
    expect(ids).not.toContain(MILESTONE_IDS.STREAK_GOLD);
  });

  it("should award POLYGLOT and MASTER_POLYGLOT for diverse language counts", () => {
    const milestones = detectMilestones({
      totalContributions: 800,
      streaks: { longestStreak: 4 },
      languages: { languageCount: 6 }
    });

    const ids = milestones.map((m) => m.id);
    expect(ids).toContain(MILESTONE_IDS.POLYGLOT);
    expect(ids).toContain(MILESTONE_IDS.MASTER_POLYGLOT);
  });
});
