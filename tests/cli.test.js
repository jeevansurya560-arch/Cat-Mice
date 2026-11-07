import { describe, it, expect, vi } from "vitest";
import { main, parseArgs } from "../src/cli.js";

describe("CLI Foundation & Arguments", () => {
  it("should parse default flags when no arguments provided", () => {
    const opts = parseArgs([]);
    expect(opts.mode).toBe("offline");
    expect(opts.snapshot).toBe("fixtures/sample-snapshot.json");
    expect(opts.details).toBe(false);
    expect(opts.help).toBe(false);
  });

  it("should parse explicit --mode and --snapshot flags", () => {
    const opts = parseArgs(["--mode=offline", "--snapshot=fixtures/custom.json"]);
    expect(opts.mode).toBe("offline");
    expect(opts.snapshot).toBe("fixtures/custom.json");
  });

  it("should handle separated flag syntax", () => {
    const opts = parseArgs(["--mode", "offline", "--snapshot", "my-data.json", "--details"]);
    expect(opts.mode).toBe("offline");
    expect(opts.snapshot).toBe("my-data.json");
    expect(opts.details).toBe(true);
  });

  it("should successfully execute offline initialization with sample fixture", async () => {
    const stdout = vi.fn();
    const stderr = vi.fn();

    const code = await main(["--mode=offline", "--snapshot=fixtures/sample-snapshot.json"], {
      stdout,
      stderr
    });

    expect(code).toBe(0);
    expect(stderr).not.toHaveBeenCalled();
    expect(stdout).toHaveBeenCalled();

    const output = stdout.mock.calls[0][0];
    expect(output).toContain("CAT-MICE");
    expect(output).toContain("Execution Mode: Offline");
    expect(output).toContain("Configuration: Loaded");
    expect(output).toContain("Snapshot: Validated");
    expect(output).toContain("Application: Initialized");
    expect(output).toContain("FOUNDATION READY");
  });

  it("should print progression details when --details flag is supplied", async () => {
    const stdout = vi.fn();
    const stderr = vi.fn();

    const code = await main(
      ["--mode=offline", "--snapshot=fixtures/sample-snapshot.json", "--details"],
      { stdout, stderr }
    );

    expect(code).toBe(0);
    const output = stdout.mock.calls[0][0];
    expect(output).toContain("[Progression Summary]");
    expect(output).toContain("Cat: ADULT");
    expect(output).toContain("Mouse: UNLOCKED");
  });

  it("should reject non-offline mode in Phase 0/1", async () => {
    const stdout = vi.fn();
    const stderr = vi.fn();

    const code = await main(["--mode=production"], { stdout, stderr });

    expect(code).toBe(1);
    expect(stderr).toHaveBeenCalledWith(
      expect.stringContaining('Mode "production" is not supported in Phase 0')
    );
  });

  it("should reject execution if snapshot file does not exist", async () => {
    const stdout = vi.fn();
    const stderr = vi.fn();

    const code = await main(["--mode=offline", "--snapshot=fixtures/missing.json"], {
      stdout,
      stderr
    });

    expect(code).toBe(1);
    expect(stderr).toHaveBeenCalledWith(expect.stringContaining("Snapshot Loading Error"));
  });

  it("should print help and exit with code 0 on --help", async () => {
    const stdout = vi.fn();
    const stderr = vi.fn();
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    const code = await main(["--help"], { stdout, stderr });
    expect(code).toBe(0);
    consoleSpy.mockRestore();
  });

  it("should print version on --version", async () => {
    const stdout = vi.fn();
    const stderr = vi.fn();

    const code = await main(["--version"], { stdout, stderr });
    expect(code).toBe(0);
    expect(stdout).toHaveBeenCalledWith("v0.1.0");
  });
});
