import { describe, it, expect } from "vitest";
import { evaluateEvolution } from "../../src/engine/evolution.js";
import { EVOLUTION_TIERS, validateRegionWeights } from "../../src/pokemon/definitions.js";

describe("Pokémon Evolution Companion: Five-Stage Progression", () => {
  it("should validate all 5 Pokémon forms have anatomical region weights summing to 1.0", () => {
    for (const form of EVOLUTION_TIERS) {
      expect(validateRegionWeights(form)).toBe(true);
      const totalWeight = form.regions.reduce((sum, r) => sum + r.weight, 0);
      expect(Math.abs(totalWeight - 1.0)).toBeLessThan(1e-4);
    }
  });

  describe("Exact Cumulative Lifetime Thresholds", () => {
    it("should assign Charmander for 0–199 lifetime contributions", () => {
      const at0 = evaluateEvolution(0);
      expect(at0.currentForm.id).toBe("charmander");
      expect(at0.stageProgress).toBe(0);
      expect(at0.colouringProgress).toBe(0);

      const at1 = evaluateEvolution(1);
      expect(at1.currentForm.id).toBe("charmander");

      const at199 = evaluateEvolution(199);
      expect(at199.currentForm.id).toBe("charmander");
      expect(at199.stageContributions).toBe(199);
      expect(at199.requiredContributions).toBe(200);
    });

    it("should evolve into Charmeleon at exactly 200 contributions", () => {
      const at200 = evaluateEvolution(200);
      expect(at200.currentForm.id).toBe("charmeleon");
      expect(at200.stageIndex).toBe(1);
      expect(at200.stageProgress).toBe(0);
      expect(at200.evolutionHistory).toHaveLength(1);
      expect(at200.evolutionHistory[0].id).toBe("charmander");

      const at499 = evaluateEvolution(499);
      expect(at499.currentForm.id).toBe("charmeleon");
      expect(at499.stageContributions).toBe(299);
    });

    it("should evolve into Charizard at exactly 500 contributions", () => {
      const at500 = evaluateEvolution(500);
      expect(at500.currentForm.id).toBe("charizard");
      expect(at500.stageIndex).toBe(2);
      expect(at500.stageProgress).toBe(0);
      expect(at500.evolutionHistory).toHaveLength(2);
      expect(at500.evolutionHistory.map((h) => h.id)).toEqual(["charmander", "charmeleon"]);

      const at999 = evaluateEvolution(999);
      expect(at999.currentForm.id).toBe("charizard");
      expect(at999.stageContributions).toBe(499);
    });

    it("should evolve into Mega Charizard Y at exactly 1000 contributions", () => {
      const at1000 = evaluateEvolution(1000);
      expect(at1000.currentForm.id).toBe("mega-charizard-y");
      expect(at1000.stageIndex).toBe(3);
      expect(at1000.stageProgress).toBe(0);
      expect(at1000.evolutionHistory).toHaveLength(3);

      const at1499 = evaluateEvolution(1499);
      expect(at1499.currentForm.id).toBe("mega-charizard-y");
      expect(at1499.stageContributions).toBe(499);
    });

    it("should evolve into Mega Charizard X at exactly 1500 contributions and trigger Mastery", () => {
      const at1500 = evaluateEvolution(1500);
      expect(at1500.currentForm.id).toBe("mega-charizard-x");
      expect(at1500.stageIndex).toBe(4);
      expect(at1500.isMastery).toBe(true);
      expect(at1500.masteryLevel).toBe(1);
      expect(at1500.stageProgress).toBe(0);
      expect(at1500.evolutionHistory).toHaveLength(4);

      const at2000 = evaluateEvolution(2000);
      expect(at2000.currentForm.id).toBe("mega-charizard-x");
      expect(at2000.isMastery).toBe(true);
      expect(at2000.masteryLevel).toBe(2);
    });
  });

  describe("Lifetime Contribution Preservation", () => {
    it("should never reset or diminish lifetime contributions", () => {
      const testCounts = [0, 50, 199, 200, 350, 499, 500, 750, 999, 1000, 1499, 1500, 2250];
      for (const count of testCounts) {
        const state = evaluateEvolution(count);
        expect(state.lifetimeContributions).toBe(count);
      }
    });
  });
});
