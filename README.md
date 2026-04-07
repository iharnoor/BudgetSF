# WealthLens

Scan your bank screenshots. Discover cheaper alternatives in San Francisco.

WealthLens is an AI-powered iOS app that reads your bank and credit card screenshots using GPT-4o Vision, extracts transactions automatically, and recommends cheaper local alternatives — starting with San Francisco.

## System Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                       iOS App (SwiftUI)                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │ AuthView │ │ ScanView │ │ ChatView │ │Alts View │ │Settings│ │
│  │ (Apple)  │ │(Camera/  │ │(AI Chat) │ │(SF Recs) │ │(Paywall│ │
│  │          │ │ Photos)  │ │          │ │          │ │        │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘ │
│       │            │            │             │            │      │
│  ┌────┴────────────┴────────────┴─────────────┴────────────┴────┐ │
│  │  AuthService · ScreenshotService · ChatService               │ │
│  │  AlternativesService · BudgetService · GoalService           │ │
│  │  SubscriptionService (RevenueCat)                            │ │
│  └────────────────────────────┬─────────────────────────────────┘ │
└───────────────────────────────┼───────────────────────────────────┘
                                │
          ┌─────────────────────┼──────────────────────┐
          ▼                     ▼                      ▼
 ┌────────────────┐   ┌──────────────────┐   ┌──────────────────┐
 │  Supabase Auth │   │ Supabase Postgres │   │ Supabase Storage │
 │  (Apple OAuth) │   │  + RLS + pgvector │   │ (Screenshots)    │
 └────────────────┘   └──────────────────┘   └──────────────────┘
                       │                │
        ┌──────────────┘                └──────────────┐
        ▼                                              ▼
 ┌──────────────────┐                    ┌─────────────────────┐
 │ Supabase Realtime │                    │ Supabase Edge Fns   │
 │ (postgres_changes)│                    │ (Deno/TypeScript)    │
 │ • transactions    │                    │ • finance-agent      │
 │ • budgets/goals   │                    │ • extract-screenshot │
 │ • alternatives    │                    │ • find-alternatives  │
 └──────────────────┘                    │ • embed-transaction  │
                                          │ • nightly-analysis   │
                                          └──────────┬───────────┘
                                                     │
                                          ┌──────────▼───────────┐
                                          │  OpenAI GPT-4o       │
                                          │  • Vision (OCR)      │
                                          │  • Chat completions  │
                                          │  • Embeddings        │
                                          └──────────────────────┘
```

## Tech Stack

| Layer                | Technology                                    |
|----------------------|-----------------------------------------------|
| UI                   | SwiftUI, iOS 26+                              |
| Auth                 | Sign in with Apple → Supabase Auth             |
| Backend              | Supabase (Postgres, Edge Functions, Realtime, Storage) |
| Screenshot Analysis  | GPT-4o Vision via Edge Function                |
| SF Recommendations   | GPT-4o + curated SF merchant data              |
| AI/Embeddings        | pgvector (1536-dim) + OpenAI text-embedding-3  |
| AI Chat              | GPT-4o via Edge Function streaming              |
| Monetization         | RevenueCat (freemium: Free + Pro $7.99/mo)     |

## Database Schema

- **screenshot_uploads** — User-uploaded bank/credit card screenshots (storage refs, processing status)
- **transactions** — Extracted transactions with pgvector embeddings (merchant, amount, category, date)
- **merchant_alternatives** — SF-local cheaper alternatives per merchant (name, address, avg savings, neighborhood)
- **chat_messages** — AI chat conversation history
- **budgets** — Category spending limits (monthly/weekly)
- **savings_goals** — User savings targets with progress tracking
- **budget_status** (view) — Live budget utilization percentages
- **monthly_spend_by_category** (view) — Aggregated spending rollups

All tables enforce Row Level Security: `auth.uid() = user_id`.

## Project Structure

```
WealthLens/
├── WealthLensApp.swift              # App entry — auth routing
├── ContentView.swift                # TabView (Home, Scan, Chat, Alternatives, Settings)
├── Config/
│   ├── SupabaseClient.swift         # Supabase singleton
│   └── Secrets.swift                # API keys (gitignored)
├── Models/
│   ├── ScreenshotUpload.swift       # Screenshot upload model
│   ├── AppTransaction.swift         # Transaction model
│   ├── MerchantAlternative.swift    # SF alternative model
│   ├── ChatMessage.swift            # Chat message model
│   ├── Budget.swift                 # Budget + BudgetStatus models
│   └── SavingsGoal.swift            # Savings goal model
├── Services/
│   ├── AuthService.swift            # Apple auth + Supabase
│   ├── ScreenshotService.swift      # Camera/photo capture + upload + extraction
│   ├── AlternativesService.swift    # SF merchant alternatives lookup
│   ├── TransactionService.swift     # Transactions + Realtime
│   ├── ChatService.swift            # AI chat streaming
│   ├── BudgetService.swift          # Budget CRUD + status
│   ├── GoalService.swift            # Savings goal CRUD
│   └── SubscriptionService.swift    # RevenueCat entitlements
├── Views/
│   ├── Auth/LoginView.swift         # Login screen
│   ├── Home/HomeView.swift          # Dashboard (spending summary + recent txns)
│   ├── Scan/ScanView.swift          # Camera/photo picker for bank screenshots
│   ├── Chat/ChatView.swift          # AI chat with suggestions
│   ├── Transactions/
│   │   ├── TransactionListView.swift
│   │   └── TransactionRowView.swift
│   ├── Alternatives/
│   │   └── AlternativesView.swift   # SF cheaper alternatives list
│   ├── Budgets/BudgetsView.swift    # Budget cards + progress
│   ├── Goals/GoalsView.swift        # Savings goals + progress
│   ├── Insights/InsightsView.swift  # Spending analysis
│   ├── Paywall/PaywallView.swift    # Pro upgrade screen
│   └── Settings/SettingsView.swift  # Profile + subscription
supabase/
├── migrations/
│   ├── 001_initial_schema.sql       # Tables + RLS policies
│   ├── 002_phase2_helpers.sql       # Upsert functions + Realtime
│   ├── 003_phase3_ai.sql            # pgvector index + chat + match_transactions
│   ├── 004_phase4_budgets.sql       # Budgets + goals + views
│   ├── 005_screenshot_pivot.sql     # screenshot_uploads + merchant_alternatives tables
│   └── 006_sf_alternatives_seed.sql # Initial SF merchant alternatives data
└── functions/
    ├── _shared/                     # Shared CORS, Supabase clients
    ├── extract-screenshot/          # GPT-4o Vision screenshot → transactions
    ├── find-alternatives/           # Match merchants to SF alternatives
    ├── embed-transaction/           # OpenAI embedding pipeline
    ├── finance-agent/               # AI chat (vector search + GPT-4o)
    └── nightly-analysis/            # Budget alerts + goal checks
```

## Setup

1. **Clone** the repo and open `WealthLens.xcodeproj` in Xcode
2. **Secrets** — Copy the example and fill in your Supabase credentials:
   ```bash
   cp WealthLens/Config/Secrets.swift.example WealthLens/Config/Secrets.swift
   ```
   `Secrets.swift` is gitignored and will never be committed.
3. **Resolve packages** — Xcode auto-resolves Supabase Swift SDK via SPM
4. **Supabase** — Run all SQL migrations in `supabase/migrations/` against your project
5. **Sign in with Apple** — Enable the capability in your Apple Developer account and Xcode target
6. **Environment variables** — Set in Supabase Dashboard (Edge Functions):
   - `OPENAI_API_KEY` (for Vision OCR, embeddings, and chat)
7. **Build & Run** on a simulator or device

## Roadmap

- **Phase 1** ✅ Auth + Schema
- **Phase 2** ✅ Realtime balance updates + transaction feed
- **Phase 3** ✅ pgvector semantic search + AI chat
- **Phase 4** ✅ Budgets, goals + proactive nudges
- **Phase 5** ✅ Paywall + subscription management (RevenueCat)
- **Phase 6** 🔄 Screenshot Pivot — Replace bank-linking with screenshot-based transaction extraction via GPT-4o Vision
- **Phase 7** 🔄 SF Recommendations — Curated local alternatives for SF merchants, neighborhood-aware suggestions
- **Phase 8** 🗓️ Multi-city Expansion — Extend alternatives beyond SF (Oakland, LA, NYC, etc.)

## SF-Only Launch Strategy

WealthLens launches exclusively in **San Francisco** to maximize product-market fit before expanding.

**Why SF first:**
- Dense concentration of tech-forward early adopters
- High cost of living makes savings recommendations highly actionable
- Rich local merchant ecosystem with independent alternatives to chains
- Tight geographic scope enables hand-curated, high-quality recommendations

**How it works:**
1. User takes a screenshot of their bank/credit card statement
2. GPT-4o Vision extracts merchant names, amounts, dates, and categories
3. Transactions are matched against a curated SF merchant alternatives database
4. User sees cheaper local options — e.g., "You spent $6.50 at Starbucks on Valencia. Try Ritual Coffee two blocks away — avg $4.75"

**Expansion plan:**
- Phase 7: Launch with ~200 curated SF merchant alternatives across food, coffee, groceries, fitness, and transit
- Phase 8: Expand to Oakland/East Bay, then LA and NYC based on user demand
