import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Bell, User as UserIcon, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Brands Era" }] }),
  component: Dashboard,
});

function Dashboard() {
  const [displayName, setDisplayName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      setEmail(user.email ?? "");
      const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", user.id).maybeSingle();
      setDisplayName(profile?.display_name ?? user.email?.split("@")[0] ?? "");
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      setIsAdmin(!!roles?.some((r) => r.role === "admin"));
    })();
  }, []);

  const savedQ = useQuery({
    queryKey: ["favorites-count", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { count } = await supabase.from("favorites").select("id", { count: "exact", head: true }).eq("user_id", userId!);
      return count ?? 0;
    },
  });
  const alertsQ = useQuery({
    queryKey: ["alerts-count", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { count } = await (supabase.from("alerts" as any) as any).select("id", { count: "exact", head: true }).eq("user_id", userId!).eq("read", false);
      return count ?? 0;
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-black uppercase tracking-tight">Hey, {displayName || "there"} 👋</h1>
        <p className="mt-1 text-sm text-muted-foreground">{email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashCard icon={Heart} title="Saved coupons" value={String(savedQ.data ?? 0)} href="/dashboard/saved" />
        <DashCard icon={Bell} title="Alerts" value={String(alertsQ.data ?? 0)} href="/dashboard/alerts" />
        <DashCard icon={UserIcon} title="Profile" value="Edit" href="/dashboard/profile" />
        {isAdmin && <DashCard icon={ShieldCheck} title="Admin panel" value="Open" href="/admin" accent />}
      </div>
    </div>
  );
}

function DashCard({ icon: Icon, title, value, href, accent }: { icon: typeof Heart; title: string; value: string; href: string; accent?: boolean }) {
  return (
    <Link
      to={href as any}
      className="rounded-lg border-2 border-foreground bg-card p-5 hover:-translate-y-0.5 transition"
      style={{ boxShadow: "var(--shadow-card)", background: accent ? "hsl(var(--primary))" : undefined, color: accent ? "hsl(var(--primary-foreground))" : undefined }}
    >
      <Icon className="h-6 w-6" />
      <div className="mt-3 text-xs font-bold uppercase tracking-wide opacity-80">{title}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </Link>
  );
}