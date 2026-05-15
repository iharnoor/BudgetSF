import { describe, it, expect } from "vitest";
import { OG_VERSION } from "./og-version";

describe("OG_VERSION", () => {
  it("is a positive integer", () => {
    expect(Number.isInteger(OG_VERSION)).toBe(true);
    expect(OG_VERSION).toBeGreaterThan(0);
  });
});
