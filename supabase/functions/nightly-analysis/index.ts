import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabase.ts";
import { requireServiceRole } from "../_shared/auth.ts";
import { errorResponse } from "../_shared/errors.ts";

interface BudgetAlert {
  user_id: string;
  category: string;
  pct_used: number;
  spent: number;
  amount_limit: number;
  message: string;
}

interface GoalAlert {
  user_id: string;
  goal_name: string;
  current_amount: number;
  target_amount: number;
  target_date: string;
  message: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only callable with the service-role key (from cron / admin)
  const denied = requireServiceRole(req);
  if (denied) return denied;

  try {
    const budgetAlerts: BudgetAlert[] = [];
    const goalAlerts: GoalAlert[] = [];

    // ---- Budget overspend alerts ----
    const { data: overBudget, error: budgetError } = await supabaseAdmin
      .from("budget_status")
      .select("*")
      .gte("pct_used", 80);

    if (budgetError) throw budgetError;

    for (const row of overBudget ?? []) {
      const message = `You have spent ${row.pct_used}% of your ${row.category} budget ($${row.spent}/$${row.amount_limit})`;

      budgetAlerts.push({
        user_id: row.user_id,
        category: row.category,
        pct_used: row.pct_used,
        spent: row.spent,
        amount_limit: row.amount_limit,
        message,
      });

      await supabaseAdmin.from("notifications").insert({
        user_id: row.user_id,
        type: "budget_warning",
        message,
      });
    }

    // ---- Savings goal deadline alerts ----
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const cutoffDate = thirtyDaysFromNow.toISOString().split("T")[0];

    const { data: atRiskGoals, error: goalsError } = await supabaseAdmin
      .from("savings_goals")
      .select("*")
      .not("target_date", "is", null)
      .lte("target_date", cutoffDate);

    if (goalsError) throw goalsError;

    for (const goal of atRiskGoals ?? []) {
      if (goal.current_amount >= goal.target_amount * 0.8) continue;

      const message = `Your savings goal "${goal.name}" is due on ${goal.target_date} but you've only saved $${goal.current_amount} of $${goal.target_amount}`;

      goalAlerts.push({
        user_id: goal.user_id,
        goal_name: goal.name,
        current_amount: goal.current_amount,
        target_amount: goal.target_amount,
        target_date: goal.target_date,
        message,
      });

      await supabaseAdmin.from("notifications").insert({
        user_id: goal.user_id,
        type: "goal_warning",
        message,
      });
    }

    return new Response(
      JSON.stringify({
        budget_alerts: budgetAlerts,
        goal_alerts: goalAlerts,
        total: budgetAlerts.length + goalAlerts.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return errorResponse(error, 500, "Analysis failed");
  }
});
