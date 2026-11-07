/**
 * @file Snapshot loader.
 * Loads, parses, validates, and normalizes snapshot data from disk or memory.
 */

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validateSnapshot } from "./schema.js";
import { normalizeSnapshot } from "./normalize.js";

/**
 * Loads and validates a snapshot from a JSON file.
 *
 * @param {string} filePath - Absolute or relative path to the snapshot JSON file.
 * @returns {Promise<{ success: true, data: ReturnType<typeof normalizeSnapshot>, filePath: string }>}
 * @throws {Error} If the file cannot be read, parsed, or fails schema validation.
 */
export async function loadSnapshotFromFile(filePath) {
  const resolvedPath = resolve(process.cwd(), filePath);

  let fileContent;
  try {
    fileContent = await readFile(resolvedPath, "utf-8");
  } catch (err) {
    throw new Error(`Failed to read snapshot file at "${resolvedPath}": ${err.message}`);
  }

  let rawData;
  try {
    rawData = JSON.parse(fileContent);
  } catch (err) {
    throw new Error(`Failed to parse snapshot JSON at "${resolvedPath}": ${err.message}`);
  }

  return loadSnapshotFromMemory(rawData, resolvedPath);
}

/**
 * Validates and normalizes an in-memory snapshot object.
 *
 * @param {unknown} rawData - Raw JavaScript object representing snapshot data.
 * @param {string} [sourceIdentifier="memory"] - Identifier for error reporting.
 * @returns {{ success: true, data: ReturnType<typeof normalizeSnapshot>, source: string }}
 * @throws {Error} If the object fails schema validation.
 */
export function loadSnapshotFromMemory(rawData, sourceIdentifier = "memory") {
  const validation = validateSnapshot(rawData);

  if (!validation.success) {
    throw new Error(
      `Snapshot validation failed for source "${sourceIdentifier}":\n${validation.summary}`
    );
  }

  const normalized = normalizeSnapshot(validation.data);

  return {
    success: true,
    data: normalized,
    source: sourceIdentifier
  };
}
