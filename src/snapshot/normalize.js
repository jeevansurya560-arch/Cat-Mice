/**
 * @file Data Snapshot normalizer.
 * Cleans, sorts, and structures validated snapshot data for internal engine consumption.
 */

/**
 * Normalizes validated snapshot data into a deterministic, immutable structure.
 *
 * @param {import("./schema.js").SnapshotSchema} validatedData
 * @returns {Readonly<import("./schema.js").SnapshotSchema>}
 */
export function normalizeSnapshot(validatedData) {
  // 1. Sort calendar days chronologically
  const sortedCalendarDays = [...validatedData.metrics.calendarDays].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  // 2. Aggregate and sort languages by bytes descending
  const languageMap = new Map();
  for (const lang of validatedData.metrics.languages) {
    if (languageMap.has(lang.name)) {
      const existing = languageMap.get(lang.name);
      existing.bytes += lang.bytes;
      if (!existing.color && lang.color) {
        existing.color = lang.color;
      }
    } else {
      languageMap.set(lang.name, { ...lang });
    }
  }

  const sortedLanguages = Array.from(languageMap.values()).sort((a, b) => b.bytes - a.bytes);

  // 3. Construct clean normalized snapshot DTO
  const normalized = {
    version: validatedData.version,
    timestamp: validatedData.timestamp,
    user: {
      id: String(validatedData.user.id).trim(),
      login: String(validatedData.user.login).trim(),
      createdAt: validatedData.user.createdAt
    },
    metrics: {
      totalContributions: validatedData.metrics.totalContributions,
      calendarDays: sortedCalendarDays,
      languages: sortedLanguages
    }
  };

  return Object.freeze(normalized);
}
