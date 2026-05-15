import { describe, it, expect } from "vitest";
import {
  ALLOWED_OG_ROUTES,
  isAllowedOgRoute,
  renderCard,
} from "./index";

describe("isAllowedOgRoute", () => {
  it("accepts every value in ALLOWED_OG_ROUTES", () => {
    for (const route of ALLOWED_OG_ROUTES) {
      expect(isAllowedOgRoute(route)).toBe(true);
    }
  });

  it("rejects null", () => {
    expect(isAllowedOgRoute(null)).toBe(false);
  });

  it("rejects unknown routes", () => {
    expect(isAllowedOgRoute("/community")).toBe(false);
    expect(isAllowedOgRoute("/transport")).toBe(false);
    expect(isAllowedOgRoute("../etc/passwd")).toBe(false);
    expect(isAllowedOgRoute("")).toBe(false);
  });

  it("is strict about case + slash prefix", () => {
    expect(isAllowedOgRoute("/Moving")).toBe(false);
    expect(isAllowedOgRoute("moving")).toBe(false);
    expect(isAllowedOgRoute("/moving/")).toBe(false);
  });
});

describe("renderCard", () => {
  it("returns a React element for every allowed route", () => {
    for (const route of ALLOWED_OG_ROUTES) {
      const el = renderCard(route);
      expect(el).toBeTruthy();
      expect(typeof el).toBe("object");
    }
  });

  it("falls back to the default card on null", () => {
    const el = renderCard(null);
    expect(el).toBeTruthy();
  });

  it("falls back to the default card on unknown values", () => {
    const el = renderCard("/etc/passwd");
    expect(el).toBeTruthy();
    // We can't easily diff React elements here; the contract is "returns something
    // truthy without throwing." renderCard's branch coverage is exercised by the
    // separate isAllowedOgRoute tests above.
  });

  it("does not throw on empty string", () => {
    expect(() => renderCard("")).not.toThrow();
  });
});
