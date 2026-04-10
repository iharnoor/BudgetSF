import { signIn, auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] text-muted hover:text-foreground mb-8 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to map
        </Link>

        {/* Card */}
        <div className="bg-surface-warm border border-border/60 rounded-2xl p-8 shadow-lg shadow-black/[0.04]">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white font-bold text-sm mx-auto mb-4 shadow-sm">
              SF
            </div>
            <h1
              className="text-2xl text-foreground mb-2"
              style={{ fontFamily: "var(--font-dm-serif)" }}
            >
              Join BudgetSF
            </h1>
            <p className="text-[13px] text-muted leading-relaxed">
              Sign in to add your favorite cheap spots and vote on
              community submissions.
            </p>
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white border border-border rounded-xl text-[14px] font-medium text-foreground hover:bg-warm hover:border-border transition-all press shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </form>

          <p className="text-[11px] text-muted text-center mt-6 leading-relaxed">
            By signing in, you agree to help keep BudgetSF awesome.
            We only use your name and email to identify your submissions.
          </p>
        </div>
      </div>
    </div>
  );
}
