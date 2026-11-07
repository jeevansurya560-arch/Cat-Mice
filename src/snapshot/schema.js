/**
 * @file Data Snapshot validation schema using Zod.
 * Enforces strict runtime data contracts at boundary layers.
 */

import { z } from "zod";

export const ContributionDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must follow YYYY-MM-DD format"),
  contributionCount: z
    .number()
    .int("Contribution count must be an integer")
    .nonnegative("Contribution count cannot be negative"),
  color: z.string().optional()
});

export const LanguageUsageSchema = z.object({
  name: z.string().min(1, "Language name cannot be empty"),
  bytes: z
    .number()
    .int("Bytes count must be an integer")
    .nonnegative("Bytes count cannot be negative"),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Language color must be a valid 6-character hex code")
    .optional()
});

export const UserSchema = z.object({
  id: z.string().min(1, "User ID cannot be empty"),
  login: z.string().min(1, "Username/login cannot be empty"),
  createdAt: z.string().datetime("User createdAt must be a valid ISO 8601 datetime")
});

export const MetricsSchema = z.object({
  totalContributions: z
    .number()
    .int("Total contributions must be an integer")
    .nonnegative("Total contributions cannot be negative"),
  calendarDays: z.array(ContributionDaySchema),
  languages: z.array(LanguageUsageSchema)
});

export const SnapshotSchema = z.object({
  version: z.literal(1, {
    errorMap: () => ({ message: "Snapshot version must be 1" })
  }),
  timestamp: z.string().datetime("Snapshot timestamp must be a valid ISO 8601 datetime"),
  user: UserSchema,
  metrics: MetricsSchema
});

/**
 * Validates a snapshot object against the Zod SnapshotSchema.
 * Provides clean, actionable error reporting without throwing.
 *
 * @param {unknown} data - The raw snapshot input.
 * @returns {{ success: true, data: z.infer<typeof SnapshotSchema> } | { success: false, errors: string[], summary: string }}
 */
export function validateSnapshot(data) {
  const result = SnapshotSchema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data
    };
  }

  const errors = result.error.errors.map((err) => {
    const path = err.path.join(".");
    return `[${path || "root"}]: ${err.message}`;
  });

  const summary = `Snapshot validation failed with ${errors.length} error(s):\n  - ${errors.join("\n  - ")}`;

  return {
    success: false,
    errors,
    summary
  };
}
