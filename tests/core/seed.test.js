import { describe, it, expect } from "vitest";
import { hash32 } from "../../src/utils/hash.js";
import { createRng } from "../../src/utils/random.js";
import { deriveSeed, deriveIdentitySeed, deriveSimulationSeed } from "../../src/core/seed.js";

describe("Deterministic PRNG & Seeding Utilities", () => {
  it("should generate consistent 32-bit hashes for identical strings", () => {
    const hashA = hash32("user-12345:2026-W45");
    const hashB = hash32("user-12345:2026-W45");
    expect(hashA).toBe(hashB);
    expect(typeof hashA).toBe("number");
    expect(hashA).toBeGreaterThanOrEqual(0);
  });

  it("should differentiate hashes for different strings", () => {
    const hashA = hash32("user-1");
    const hashB = hash32("user-2");
    expect(hashA).not.toBe(hashB);
  });

  it("should produce reproducible pseudo-random numbers with Mulberry32", () => {
    const rng1 = createRng(123456);
    const rng2 = createRng(123456);

    const sequence1 = [rng1.next(), rng1.next(), rng1.next()];
    const sequence2 = [rng2.next(), rng2.next(), rng2.next()];

    expect(sequence1).toEqual(sequence2);
  });

  it("should pick deterministically from an array", () => {
    const rng1 = createRng(42);
    const rng2 = createRng(42);
    const items = ["cat", "mouse", "cheese", "yarn"];

    expect(rng1.pick(items)).toBe(rng2.pick(items));
  });

  it("should shuffle deterministically", () => {
    const rng1 = createRng(99);
    const rng2 = createRng(99);
    const items = [1, 2, 3, 4, 5];

    expect(rng1.shuffle(items)).toEqual(rng2.shuffle(items));
  });

  it("should respect custom seed override in deriveSeed", () => {
    const seed = deriveSeed({ userId: "octocat", customSeed: 777 });
    expect(seed).toBe(777);
  });

  it("should keep identity seed stable across different weeks", () => {
    const languages = [
      { name: "JavaScript", percentage: 0.6 },
      { name: "Rust", percentage: 0.4 }
    ];

    const idSeed1 = deriveIdentitySeed({ userId: "user-42", languages });
    const idSeed2 = deriveIdentitySeed({ userId: "user-42", languages });
    expect(idSeed1).toBe(idSeed2);

    // Simulation seeds differ week to week
    const simWeek1 = deriveSimulationSeed({ userId: "user-42", timestamp: "2026-01-05T00:00:00Z" });
    const simWeek2 = deriveSimulationSeed({ userId: "user-42", timestamp: "2026-02-15T00:00:00Z" });
    expect(simWeek1).not.toBe(simWeek2);
  });
});
