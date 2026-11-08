import { describe, it, expect, vi } from "vitest";
import { main, parseArgs } from "../src/cli.js";

describe("CLI Foundation & Arguments", () => {
  it("should parse default flags when no arguments provided", () => {
    const opts = parseArgs([]);
    expect(opts.mode).toBe("offline");
    expect(opts.snapshot).toBe("fixtures/sample-snapshot.json");
    expect(opts.details).toBe(false);
    expect(opts.social).toBe(false);
    expect(opts.help).toBe(false);
  });

  it("should parse explicit --mode and --contributions flags", () => {
    const opts = parseArgs(["--mode=offline", "--contributions=750", "--social"]);
    expect(opts.mode).toBe("offline");
    expect(opts.contributions).toBe(750);
    expect(opts.social).toBe(true);
  });

  it("should handle separated flag syntax", () => {
    const opts = parseArgs(["--mode", "offline", "--contributions", "1250", "--details"]);
    expect(opts.mode).toBe("offline");
    expect(opts.contributions).toBe(1250);
    expect(opts.details).toBe(true);
  });

  it("should successfully execute offline initialization with sample fixture", async () => {
    const stdout = vi.fn();
    const stderr = vi.fn();

    const code = await main(["--mode=offline", "--contributions=750"], {
      stdout,
      stderr
    });

    expect(code).toBe(0);
    expect(stderr).not.toHaveBeenCalled();
    expect(stdout).toHaveBeenCalled();

    const output = stdout.mock.calls[0][0];
    expect(output).toContain("GITHUB POKÉMON EVOLUTION COMPANION");
    expect(output).toContain("Companion: Charizard (No. 0006)");
    expect(output).toContain("Lifetime Contributions: 750");
    expect(output).toContain("Stage Colouring: 47.5%");
    expect(output).toContain("Artifacts Generated:");
  });

  it("should print anatomical region allocations when --details flag is supplied", async () => {
    const stdout = vi.fn();
    const stderr = vi.fn();

    const code = await main(["--mode=offline", "--contributions=750", "--details"], {
      stdout,
      stderr
    });

    expect(code).toBe(0);
    const output = stdout.mock.calls[0][0];
    expect(output).toContain("[Anatomical Region Allocations]");
    expect(output).toContain("Tail Flame");
    expect(output).toContain("Dragon Wings & Membranes");
  });

  it("should reject unsupported execution modes", async () => {
    const stdout = vi.fn();
    const stderr = vi.fn();

    const code = await main(["--mode=unsupported"], { stdout, stderr });

    expect(code).toBe(1);
    expect(stderr).toHaveBeenCalledWith(
      expect.stringContaining('Mode "unsupported" is not supported')
    );
  });

  it("should require a username in production mode", async () => {
    const stdout = vi.fn();
    const stderr = vi.fn();

    const code = await main(["--mode=production"], { stdout, stderr });

    expect(code).toBe(1);
    expect(stderr).toHaveBeenCalledWith(
      expect.stringContaining("Production mode requires a GitHub username")
    );
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
    expect(stdout).toHaveBeenCalledWith("v1.0.0");
  });
});
