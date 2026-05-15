import { describe, it, expect } from "vitest";
import { BUDGET_BREAKDOWN, BUDGET_TOTAL, BUDGET_HEADLINE } from "./budget";

describe("BUDGET_BREAKDOWN", () => {
  it("has at least one line item", () => {
    expect(BUDGET_BREAKDOWN.length).toBeGreaterThan(0);
  });

  it("every line has a positive monthly value", () => {
    for (const line of BUDGET_BREAKDOWN) {
      expect(line.monthly).toBeGreaterThan(0);
      expect(line.label.length).toBeGreaterThan(0);
    }
  });

  it("BUDGET_TOTAL equals the sum of all line items", () => {
    const sum = BUDGET_BREAKDOWN.reduce((acc, l) => acc + l.monthly, 0);
    expect(BUDGET_TOTAL).toBe(sum);
  });

  it("BUDGET_HEADLINE formats with thousands separator and /month suffix", () => {
    expect(BUDGET_HEADLINE).toMatch(/^\$[\d,]+\/month$/);
    expect(BUDGET_HEADLINE).toContain(BUDGET_TOTAL.toLocaleString());
  });

  it("total stays in a believable founder-budget range", () => {
    expect(BUDGET_TOTAL).toBeGreaterThanOrEqual(1000);
    expect(BUDGET_TOTAL).toBeLessThanOrEqual(3500);
  });
});
