import { describe, it, expect } from "vitest";
import { calculateLanguages } from "../../src/analytics/languages.js";

describe("Analytics: Language Distribution", () => {
  it("should handle empty language arrays", () => {
    const res = calculateLanguages([]);
    expect(res.totalBytes).toBe(0);
    expect(res.languageCount).toBe(0);
    expect(res.primaryLanguage).toBeNull();
    expect(res.secondaryLanguage).toBeNull();
    expect(res.primaryAccentColor).toBeDefined();
  });

  it("should calculate percentages and identify primary/secondary languages", () => {
    const languages = [
      { name: "TypeScript", bytes: 60000, color: "#3178c6" },
      { name: "Rust", bytes: 30000, color: "#dea584" },
      { name: "HTML", bytes: 10000, color: "#e34c26" }
    ];

    const res = calculateLanguages(languages);
    expect(res.totalBytes).toBe(100000);
    expect(res.languageCount).toBe(3);
    expect(res.primaryLanguage.name).toBe("TypeScript");
    expect(res.primaryLanguage.percentage).toBe(0.6);
    expect(res.secondaryLanguage.name).toBe("Rust");
    expect(res.secondaryLanguage.percentage).toBe(0.3);
    expect(res.primaryAccentColor).toBe("#3178c6");
  });
});
