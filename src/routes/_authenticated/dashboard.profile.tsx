import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, User as UserIcon, Save } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/profile")({
  head: () => ({ meta: [{ title: "Profile — Brands Era" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setEmail(user.email ?? "");
      const { data } = await supabase.from("profiles").select("display_name,avatar_url").eq("id", user.id).maybeSingle();
      setDisplayName(data?.display_name ?? "");
      setAvatarUrl(data?.avatar_url ?? "");
    })();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true); setErr(null); setMsg(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ display_name: displayName, avatar_url: avatarUrl || null }).eq("id", user.id);
    setSaving(false);
    if (error) setErr(error.message);
    else setMsg("Profile saved");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-6">
      <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-card px-3 py-1.5 text-xs font-black uppercase mb-6">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>
      <div className="mb-8 flex items-center gap-3">
        <UserIcon className="h-8 w-8 text-primary" />
        <h1 className="font-display text-4xl font-black uppercase tracking-tight">Profile</h1>
      </div>
      <form onSubmit={save} className="rounded-md border-2 border-foreground bg-card p-6 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
        <div>
          <label className="text-xs font-black uppercase">Email</label>
          <input value={email} disabled className="mt-1 w-full rounded-md border-2 border-foreground bg-muted px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-black uppercase">Display name</label>
          <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="mt-1 w-full rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-black uppercase">Avatar URL</label>
          <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} placeholder="https://…" className="mt-1 w-full rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
        </div>
        {err && <div className="text-sm font-bold text-destructive">{err}</div>}
        {msg && <div className="text-sm font-bold text-primary">{msg}</div>}
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-5 py-2 text-sm font-black uppercase text-primary-foreground disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}