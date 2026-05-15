export type BudgetLine = {
  label: string;
  monthly: number;
  note?: string;
};

export const BUDGET_BREAKDOWN: BudgetLine[] = [
  { label: "Rent (hacker house, shared)", monthly: 1100, note: "PowelHouse, Hardware Residency, HF0 etc." },
  { label: "Food (Costco diet)", monthly: 250, note: "$7.25/day, breakdown on /diet" },
  { label: "Transit (Clipper + Bay Wheels)", monthly: 80, note: "BART + unlimited e-bikes" },
  { label: "Phone (Visible)", monthly: 25, note: "Unlimited hotspot, Verizon network" },
  { label: "Gym + misc", monthly: 140, note: "YMCA scholarship or Crunch base" },
];

export const BUDGET_TOTAL = BUDGET_BREAKDOWN.reduce((sum, l) => sum + l.monthly, 0);

export const BUDGET_HEADLINE = `$${BUDGET_TOTAL.toLocaleString()}/month`;
