import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Bell, Check, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/alerts")({
  head: () => ({ meta: [{ title: "Alerts — Brands Era" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AlertsPage,
});

type Alert = { id: string; title: string; body: string | null; link: string | null; read: boolean; created_at: string };

function AlertsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["alerts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await (supabase.from("alerts" as any) as any)
        .select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Alert[];
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from("alerts" as any) as any).update({ read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts", user?.id] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase.from("alerts" as any) as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts", user?.id] }),
  });

  const alerts = q.data ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-card px-3 py-1.5 text-xs font-black uppercase mb-6">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <div className="mb-8 flex items-center gap-3">
        <Bell className="h-8 w-8 text-primary" />
        <h1 className="font-display text-4xl font-black uppercase tracking-tight">Alerts</h1>
      </div>
      {q.isLoading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : alerts.length === 0 ? (
        <div className="rounded-md border-2 border-dashed border-foreground/40 bg-card p-10 text-center">
          <p className="text-sm font-bold uppercase text-muted-foreground">No alerts</p>
          <p className="mt-2 text-sm text-muted-foreground">We'll notify you here when new deals from your favorite stores arrive.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <div key={a.id} className={`rounded-md border-2 border-foreground bg-card p-4 ${!a.read ? "ring-2 ring-primary" : ""}`} style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-display text-lg font-black">{a.title}</div>
                  {a.body && <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>}
                  <div className="mt-1 text-[10px] font-bold uppercase text-muted-foreground">{new Date(a.created_at).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  {!a.read && (
                    <button onClick={() => markRead.mutate(a.id)} className="rounded-md border-2 border-foreground bg-accent p-1.5" aria-label="Mark read">
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button onClick={() => del.mutate(a.id)} className="rounded-md border-2 border-foreground bg-destructive p-1.5 text-destructive-foreground" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}