"use client";

import Link from "next/link";

type Ingredient = {
  name: string;
  costPerServing: number;
  source: string;
  note?: string;
};

type Meal = {
  name: string;
  time: string;
  emoji: string;
  description: string;
  ingredients: Ingredient[];
};

const MEALS: Meal[] = [
  {
    name: "Breakfast",
    time: "Morning",
    emoji: "🍳",
    description: "4 eggs with guac and bread. High protein, healthy fats, simple and fast.",
    ingredients: [
      { name: "4 large eggs", costPerServing: 1.00, source: "Costco (60ct)", note: "~$0.25/egg" },
      { name: "Guacamole", costPerServing: 0.75, source: "Costco", note: "Pre-made tubs" },
      { name: "Bread (2 slices)", costPerServing: 0.30, source: "Costco", note: "Whole wheat" },
    ],
  },
  {
    name: "Lunch",
    time: "Midday",
    emoji: "🐟",
    description: "Wild-caught frozen salmon heated up with bread. Omega-3s, easy prep, no cooking skill needed.",
    ingredients: [
      { name: "Wild-caught salmon fillet", costPerServing: 3.50, source: "Costco (frozen)", note: "~$14/bag, 4 fillets" },
      { name: "Bread (2 slices)", costPerServing: 0.30, source: "Costco" },
    ],
  },
  {
    name: "Dinner",
    time: "Evening",
    emoji: "🥣",
    description: "Greek yogurt bowl loaded with nuts and seeds. Plus a protein smoothie.",
    ingredients: [
      { name: "Greek yogurt", costPerServing: 1.00, source: "Costco", note: "Large tub" },
      { name: "Cashews", costPerServing: 0.50, source: "Costco", note: "Bulk bag" },
      { name: "Walnuts", costPerServing: 0.40, source: "Costco", note: "Bulk bag" },
      { name: "Almonds", costPerServing: 0.35, source: "Costco", note: "Bulk bag" },
      { name: "Chia seeds", costPerServing: 0.20, source: "Costco" },
      { name: "Pumpkin seeds", costPerServing: 0.25, source: "Costco" },
    ],
  },
  {
    name: "Protein Smoothie",
    time: "With dinner",
    emoji: "🥤",
    description: "Milk, protein powder, blueberries, and banana. Recovery fuel.",
    ingredients: [
      { name: "Milk (1 cup)", costPerServing: 0.40, source: "Costco" },
      { name: "Protein powder (1 scoop)", costPerServing: 0.80, source: "Costco", note: "Whey or plant-based" },
      { name: "Blueberries (1/2 cup)", costPerServing: 0.75, source: "Costco (frozen)", note: "Frozen is cheaper" },
      { name: "Banana (1)", costPerServing: 0.25, source: "Costco" },
    ],
  },
];

function getMealCost(meal: Meal): number {
  return meal.ingredients.reduce((sum, ing) => sum + ing.costPerServing, 0);
}

const dailyCost = MEALS.reduce((sum, meal) => sum + getMealCost(meal), 0);
const weeklyCost = dailyCost * 7;
const monthlyCost = dailyCost * 30;

export default function DietPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-accent flex items-center justify-center text-white font-bold text-[10px]">
                SF
              </div>
              <span className="font-semibold text-sm text-foreground">
                BudgetSF
              </span>
            </Link>
            <span className="text-muted text-xs">/ Diet</span>
          </div>
          <Link href="/picks" className="text-xs text-accent hover:underline">
            Back to Picks
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] via-transparent to-warm/40" />
        <div className="relative max-w-4xl mx-auto px-4 pt-10 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light text-accent-dark text-xs font-medium mb-4 slide-up">
            <span>🥗</span> Eat well, spend less
          </div>
          <h1
            className="text-3xl sm:text-4xl text-foreground mb-3 slide-up"
            style={{
              fontFamily: "var(--font-dm-serif)",
              animationDelay: "0.05s",
              animationFillMode: "both",
            }}
          >
            My Budget Diet
          </h1>
          <p
            className="text-sm sm:text-base text-muted max-w-lg mx-auto leading-relaxed slide-up"
            style={{ animationDelay: "0.1s", animationFillMode: "both" }}
          >
            How I eat healthy in SF for under ${monthlyCost.toFixed(0)}/month.
            Everything from Costco. No cooking talent required.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Cost summary */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          <div className="bg-white rounded-2xl border border-border p-5 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-accent">
              ${dailyCost.toFixed(2)}
            </p>
            <p className="text-xs text-muted mt-1">per day</p>
          </div>
          <div className="bg-white rounded-2xl border border-border p-5 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-accent">
              ${weeklyCost.toFixed(0)}
            </p>
            <p className="text-xs text-muted mt-1">per week</p>
          </div>
          <div className="bg-white rounded-2xl border border-border p-5 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-accent">
              ${monthlyCost.toFixed(0)}
            </p>
            <p className="text-xs text-muted mt-1">per month</p>
          </div>
        </div>

        {/* Meals */}
        <div className="space-y-4 mb-10">
          {MEALS.map((meal) => {
            const mealTotal = getMealCost(meal);
            return (
              <div
                key={meal.name}
                className="bg-white rounded-2xl border border-border p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{meal.emoji}</span>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {meal.name}
                      </h3>
                      <p className="text-xs text-muted">{meal.time}</p>
                    </div>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded-full bg-accent-light text-accent-dark text-[11px] font-bold">
                    ${mealTotal.toFixed(2)}/day
                  </span>
                </div>

                <p className="text-sm text-foreground mb-4 leading-relaxed">
                  {meal.description}
                </p>

                <div className="rounded-xl bg-background border border-border/60 overflow-hidden">
                  <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 px-4 py-2 border-b border-border/60 text-[10px] font-semibold text-muted uppercase tracking-wider">
                    <span>Item</span>
                    <span>Cost</span>
                    <span>Source</span>
                  </div>
                  {meal.ingredients.map((ing) => (
                    <div
                      key={ing.name}
                      className="grid grid-cols-[1fr_auto_auto] gap-x-4 px-4 py-2.5 border-b border-border/30 last:border-b-0 text-xs"
                    >
                      <span className="text-foreground">
                        {ing.name}
                        {ing.note && (
                          <span className="text-muted ml-1.5">
                            ({ing.note})
                          </span>
                        )}
                      </span>
                      <span className="text-foreground font-medium">
                        ${ing.costPerServing.toFixed(2)}
                      </span>
                      <span className="text-muted">{ing.source}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl border border-border p-5 mb-10">
          <h2
            className="text-lg text-foreground mb-3"
            style={{ fontFamily: "var(--font-dm-serif)" }}
          >
            Budget Diet Tips
          </h2>
          <ul className="space-y-2">
            {[
              "Costco membership ($65/yr) pays for itself in 2 weeks of groceries",
              "Frozen salmon and frozen blueberries are just as nutritious as fresh — and way cheaper",
              "Buy nuts and seeds in bulk — Costco bags last a month+",
              "Meal prep Sunday: cook salmon and hard-boil eggs for the week",
              "This diet hits ~130g+ protein/day without eating out",
              "Total grocery bill: ~$250-300/month for one person",
              "No Uber Eats, no DoorDash — that's where SF food budgets die",
            ].map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2 text-xs text-muted"
              >
                <span className="text-accent mt-0.5 shrink-0">-</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center text-[11px] text-muted">
          Prices are approximate Costco SF prices as of 2025. Your costs may
          vary slightly.
        </div>
      </div>
    </div>
  );
}
