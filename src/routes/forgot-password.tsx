import { useState, type FormEvent } from "react";
import { seoHead } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/forgot-password")({
  head: () =>
    seoHead({
    path: '/forgot-password',
    title: 'Forgot password — Brands Era',
    description: 'Reset your Brands Era password.',
    noindex: true
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-lg border-2 border-foreground bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h1 className="font-display text-3xl font-black uppercase tracking-tight">Reset password</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your account email and we'll send you a reset link.
        </p>

        {sent ? (
          <div className="mt-6 rounded-md border-2 border-foreground bg-accent/40 p-4 text-sm">
            If an account exists for <strong>{email}</strong>, a password reset link is on its way. Check your inbox (and spam folder).
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <div>
              <label className="text-xs font-bold uppercase">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm"
                placeholder="you@example.com"
              />
            </div>

            {error && <div className="rounded-md border-2 border-destructive bg-destructive/10 p-2 text-xs text-destructive">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary border-2 border-foreground px-4 py-2.5 text-sm font-black uppercase text-primary-foreground hover:-translate-y-0.5 transition disabled:opacity-60"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Send reset link
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          <Link to="/auth" className="hover:underline">← Back to sign in</Link>
        </p>
      </div>
    </div>
  );
}