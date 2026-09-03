import { useEffect, useState, type FormEvent } from "react";
import { seoHead } from "@/lib/seo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () =>
    seoHead({
    path: '/reset-password',
    title: 'Reset password — Brands Era',
    description: 'Choose a new Brands Era password.',
    noindex: true
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase parses the recovery token in the URL hash and fires PASSWORD_RECOVERY.
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setReady(true);
      }
    });
    // Also check existing session (in case event fired before mount).
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate({ to: "/dashboard" }), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-lg border-2 border-foreground bg-card p-6 md:p-8" style={{ boxShadow: "var(--shadow-card)" }}>
        <h1 className="font-display text-3xl font-black uppercase tracking-tight">Set new password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Choose a strong password you haven't used before.</p>

        {done ? (
          <div className="mt-6 rounded-md border-2 border-foreground bg-accent/40 p-4 text-sm">
            Password updated. Redirecting to your dashboard…
          </div>
        ) : !ready ? (
          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Verifying reset link…
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-3">
            <div>
              <label className="text-xs font-bold uppercase">New password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase">Confirm password</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 w-full rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm"
                placeholder="••••••••"
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
              Update password
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