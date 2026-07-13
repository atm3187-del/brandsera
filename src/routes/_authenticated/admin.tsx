import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, ShieldCheck, ArrowLeft, BarChart3, Users, Store as StoreIcon, Ticket } from "lucide-react";
import { categories } from "@/lib/store-data";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Brands Era" }] }),
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/auth" });
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    if (!roles?.some((r) => r.role === "admin")) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AdminPage,
});

type StoreRow = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  featured: boolean;
  popular: boolean;
  premium: boolean;
};

type CouponRow = {
  id: string;
  store_id: string;
  title: string;
  description: string;
  type: "code" | "deal";
  code: string | null;
  uses: number;
  verified: boolean;
};

function AdminPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<"analytics" | "stores" | "coupons">("analytics");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const storesQ = useQuery({
    queryKey: ["admin-stores"],
    queryFn: async () => {
      const { data, error } = await supabase.from("stores").select("*").order("name");
      if (error) throw error;
      return data as StoreRow[];
    },
  });

  const couponsQ = useQuery({
    queryKey: ["admin-coupons"],
    queryFn: async () => {
      const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as CouponRow[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-stores"] });
    qc.invalidateQueries({ queryKey: ["admin-coupons"] });
    qc.invalidateQueries({ queryKey: ["stores-all"] });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-card px-3 py-1.5 text-xs font-black uppercase">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
      </div>
      <div className="mb-8 flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-primary" />
        <h1 className="font-display text-4xl font-black uppercase tracking-tight">Admin Panel</h1>
      </div>

      <div className="mb-6 flex gap-2 border-b-2 border-foreground">
        {(["analytics", "stores", "coupons"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-black uppercase tracking-wide ${tab === t ? "border-b-4 border-primary text-primary" : "text-muted-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "analytics" && <AnalyticsAdmin />}
      {tab === "stores" && (
        <StoresAdmin stores={storesQ.data ?? []} loading={storesQ.isLoading} onChange={invalidate} />
      )}
      {tab === "coupons" && (
        <CouponsAdmin
          coupons={couponsQ.data ?? []}
          stores={storesQ.data ?? []}
          loading={couponsQ.isLoading}
          selectedStore={selectedStore}
          setSelectedStore={setSelectedStore}
          onChange={invalidate}
        />
      )}
    </div>
  );
}

function StoresAdmin({ stores, loading, onChange }: { stores: StoreRow[]; loading: boolean; onChange: () => void }) {
  const [form, setForm] = useState({ name: "", slug: "", category: categories[0], description: "", featured: false, popular: false, premium: false });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: async () => {
      setErr(null);
      const { error } = await supabase.from("stores").insert({ ...form });
      if (error) throw error;
    },
    onSuccess: () => {
      setForm({ name: "", slug: "", category: categories[0], description: "", featured: false, popular: false, premium: false });
      onChange();
    },
    onError: (e: any) => setErr(e.message),
  });

  const del = async (id: string) => {
    if (!confirm("Delete this store and all its coupons?")) return;
    const { error } = await supabase.from("stores").delete().eq("id", id);
    if (error) return alert(error.message);
    onChange();
  };

  return (
    <div className="space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSaving(true);
          create.mutate(undefined, { onSettled: () => setSaving(false) });
        }}
        className="rounded-md border-2 border-foreground bg-card p-6 space-y-4"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <h2 className="font-display text-xl font-black uppercase">Add Store</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
          <input required placeholder="slug-like-this" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-bold">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} /> Popular</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.premium} onChange={(e) => setForm({ ...form, premium: e.target.checked })} /> Premium</label>
        </div>
        {err && <div className="text-sm font-bold text-destructive">{err}</div>}
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-5 py-2 text-sm font-black uppercase text-primary-foreground disabled:opacity-50">
          <Plus className="h-4 w-4" /> {saving ? "Adding…" : "Add Store"}
        </button>
      </form>

      <div className="rounded-md border-2 border-foreground bg-card" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="border-b-2 border-foreground p-4">
          <h2 className="font-display text-xl font-black uppercase">All Stores ({stores.length})</h2>
        </div>
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : (
          <div className="divide-y-2 divide-foreground/20">
            {stores.map((s) => (
              <div key={s.id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="font-display font-black uppercase">{s.name}</div>
                  <div className="text-xs font-bold uppercase text-muted-foreground truncate">
                    /{s.slug} · {s.category}
                    {s.featured && " · Featured"}
                    {s.popular && " · Popular"}
                    {s.premium && " · Premium"}
                  </div>
                </div>
                <button onClick={() => del(s.id)} className="rounded-md border-2 border-foreground bg-destructive px-3 py-1.5 text-xs font-black uppercase text-destructive-foreground">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CouponsAdmin({
  coupons, stores, loading, selectedStore, setSelectedStore, onChange,
}: {
  coupons: CouponRow[]; stores: StoreRow[]; loading: boolean;
  selectedStore: string | null; setSelectedStore: (v: string | null) => void; onChange: () => void;
}) {
  const [form, setForm] = useState({ store_id: "", title: "", description: "", type: "deal" as "code" | "deal", code: "", uses: 0, verified: true });
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const { error } = await supabase.from("coupons").insert({
      store_id: form.store_id,
      title: form.title,
      description: form.description,
      type: form.type,
      code: form.type === "code" ? form.code : null,
      uses: form.uses,
      verified: form.verified,
    });
    if (error) return setErr(error.message);
    setForm({ store_id: form.store_id, title: "", description: "", type: "deal", code: "", uses: 0, verified: true });
    onChange();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    const { error } = await supabase.from("coupons").delete().eq("id", id);
    if (error) return alert(error.message);
    onChange();
  };

  const filtered = selectedStore ? coupons.filter((c) => c.store_id === selectedStore) : coupons;
  const storeName = (id: string) => stores.find((s) => s.id === id)?.name ?? "—";

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="rounded-md border-2 border-foreground bg-card p-6 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="font-display text-xl font-black uppercase">Add Coupon</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <select required value={form.store_id} onChange={(e) => setForm({ ...form, store_id: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm">
            <option value="">Select store…</option>
            {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "code" | "deal" })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm">
            <option value="deal">Deal</option>
            <option value="code">Code</option>
          </select>
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm md:col-span-2" />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm md:col-span-2" />
          {form.type === "code" && (
            <input required placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm font-mono" />
          )}
          <input type="number" min={0} placeholder="Uses" value={form.uses} onChange={(e) => setForm({ ...form, uses: parseInt(e.target.value) || 0 })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
        </div>
        {err && <div className="text-sm font-bold text-destructive">{err}</div>}
        <button className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-5 py-2 text-sm font-black uppercase text-primary-foreground">
          <Plus className="h-4 w-4" /> Add Coupon
        </button>
      </form>

      <div className="rounded-md border-2 border-foreground bg-card" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex flex-wrap items-center gap-3 border-b-2 border-foreground p-4">
          <h2 className="font-display text-xl font-black uppercase">Coupons ({filtered.length})</h2>
          <select value={selectedStore ?? ""} onChange={(e) => setSelectedStore(e.target.value || null)} className="ml-auto rounded-md border-2 border-foreground bg-background px-3 py-1.5 text-xs font-bold">
            <option value="">All stores</option>
            {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        {loading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : (
          <div className="divide-y-2 divide-foreground/20">
            {filtered.map((c) => (
              <div key={c.id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <div className="font-display font-black">{c.title}</div>
                  <div className="text-xs font-bold uppercase text-muted-foreground truncate">
                    {storeName(c.store_id)} · {c.type}{c.code ? ` · ${c.code}` : ""} · {c.uses} uses
                  </div>
                </div>
                <button onClick={() => del(c.id)} className="rounded-md border-2 border-foreground bg-destructive px-3 py-1.5 text-xs font-black uppercase text-destructive-foreground">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}