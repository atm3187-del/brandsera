import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, ShieldCheck, ArrowLeft, BarChart3, Users, Store as StoreIcon, Ticket } from "lucide-react";
import { categories } from "@/lib/store-data";
import { useAllBrandSections, type BrandSection } from "@/lib/section-data";
import { useSocialLinks, socialPlatforms } from "@/lib/social-links";
import { slugify } from "@/lib/blog-data";
import { BlogContent } from "@/components/BlogContent";
import { ImageDropField } from "@/components/ImageDropField";
import { BrandLogo } from "@/components/BrandLogo";

/** Upload an image to the private blog-images bucket and return its public proxy URL. */
async function uploadBlogImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Only image files can be uploaded.");
  if (file.size > 5 * 1024 * 1024) throw new Error("Image must be 5MB or smaller.");
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("blog-images").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return `/api/public/blog-image/${path}`;
}

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Brands Era" }, { name: "robots", content: "noindex, nofollow" }] }),
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
  website_url: string | null;
  logo_url: string | null;
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
  const [tab, setTab] = useState<"analytics" | "stores" | "sections" | "coupons" | "blogs" | "socials">("analytics");
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

      <div className="mb-6 flex flex-wrap gap-2 border-b-2 border-foreground">
        {(["analytics", "stores", "sections", "coupons", "blogs", "socials"] as const).map((t) => (
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
      {tab === "sections" && <SectionsAdmin stores={storesQ.data ?? []} />}
      {tab === "blogs" && <BlogsAdmin stores={storesQ.data ?? []} />}
      {tab === "socials" && <SocialsAdmin />}

    </div>
  );
}

function StoresAdmin({ stores, loading, onChange }: { stores: StoreRow[]; loading: boolean; onChange: () => void }) {
  return <_StoresAdmin stores={stores} loading={loading} onChange={onChange} />;
}

function AnalyticsAdmin() {
  const analyticsQ = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const [storesRes, couponsRes, usersRes, favsRes, alertsRes, topRes] = await Promise.all([
        supabase.from("stores").select("id", { count: "exact", head: true }),
        supabase.from("coupons").select("id, uses"),
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("favorites").select("id", { count: "exact", head: true }),
        supabase.from("alerts").select("id", { count: "exact", head: true }),
        supabase.from("coupons").select("store_id, uses, stores(name, slug)").order("uses", { ascending: false }).limit(5),
      ]);
      const coupons = couponsRes.data ?? [];
      const totalUses = coupons.reduce((s, c: any) => s + (c.uses ?? 0), 0);
      return {
        stores: storesRes.count ?? 0,
        coupons: coupons.length,
        users: usersRes.count ?? 0,
        favorites: favsRes.count ?? 0,
        alerts: alertsRes.count ?? 0,
        totalUses,
        top: (topRes.data ?? []) as any[],
      };
    },
  });

  const d = analyticsQ.data;
  const stats = [
    { label: "Stores", value: d?.stores ?? 0, Icon: StoreIcon },
    { label: "Coupons", value: d?.coupons ?? 0, Icon: Ticket },
    { label: "Users", value: d?.users ?? 0, Icon: Users },
    { label: "Favorites", value: d?.favorites ?? 0, Icon: BarChart3 },
    { label: "Alerts sent", value: d?.alerts ?? 0, Icon: BarChart3 },
    { label: "Total coupon uses", value: d?.totalUses ?? 0, Icon: BarChart3 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-md border-2 border-foreground bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center justify-between">
              <div className="text-xs font-black uppercase tracking-wide text-muted-foreground">{s.label}</div>
              <s.Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="mt-2 font-display text-4xl font-black">{s.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      <div className="rounded-md border-2 border-foreground bg-card" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="border-b-2 border-foreground p-4">
          <h2 className="font-display text-xl font-black uppercase">Top Coupons by Uses</h2>
        </div>
        {analyticsQ.isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : (d?.top ?? []).length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No data yet.</div>
        ) : (
          <div className="divide-y-2 divide-foreground/20">
            {(d?.top ?? []).map((c, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="font-display text-2xl font-black w-8 text-primary">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-black uppercase truncate">{c.stores?.name ?? "—"}</div>
                  <div className="text-xs font-bold uppercase text-muted-foreground truncate">/{c.stores?.slug}</div>
                </div>
                <div className="font-display text-xl font-black">{(c.uses ?? 0).toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function _StoresAdmin({ stores, loading, onChange }: { stores: StoreRow[]; loading: boolean; onChange: () => void }) {
  const [form, setForm] = useState({ id: "", name: "", slug: "", category: categories[0], description: "", website_url: "", logo_url: "", featured: false, popular: false, premium: false });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: async () => {
      setErr(null);
      const { id, ...rest } = form;
      const payload = { ...rest, website_url: rest.website_url || null, logo_url: rest.logo_url || null };
      const { error } = id
        ? await supabase.from("stores").update(payload).eq("id", id)
        : await supabase.from("stores").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      setForm({ id: "", name: "", slug: "", category: categories[0], description: "", website_url: "", logo_url: "", featured: false, popular: false, premium: false });
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
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-black uppercase">{form.id ? `Edit Store — ${form.name}` : "Add Store"}</h2>
          {form.id && (
            <button type="button" onClick={() => setForm({ id: "", name: "", slug: "", category: categories[0], description: "", website_url: "", logo_url: "", featured: false, popular: false, premium: false })} className="rounded-md border-2 border-foreground bg-card px-3 py-1.5 text-xs font-black uppercase">
              Cancel edit
            </button>
          )}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.id ? form.slug : slugify(e.target.value) })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
          <input required placeholder="slug-like-this" value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />

          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm">
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
          <input type="url" placeholder="https://brand-official-site.com" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm md:col-span-2" />
          <ImageDropField label="Store logo" value={form.logo_url} onChange={(url) => setForm((f) => ({ ...f, logo_url: url }))} className="md:col-span-2" />
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-bold">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })} /> Popular</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.premium} onChange={(e) => setForm({ ...form, premium: e.target.checked })} /> Premium</label>
        </div>
        {err && <div className="text-sm font-bold text-destructive">{err}</div>}
        <button disabled={saving} className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-5 py-2 text-sm font-black uppercase text-primary-foreground disabled:opacity-50">
          <Plus className="h-4 w-4" /> {saving ? "Saving…" : form.id ? "Save Changes" : "Add Store"}
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
                <BrandLogo name={s.name} src={s.logo_url} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-black uppercase">{s.name}</div>
                  <div className="text-xs font-bold uppercase text-muted-foreground truncate">
                    /{s.slug} · {s.category}
                    {s.featured && " · Featured"}
                    {s.popular && " · Popular"}
                    {s.premium && " · Premium"}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setForm({ id: s.id, name: s.name, slug: s.slug, category: s.category, description: s.description, website_url: s.website_url ?? "", logo_url: s.logo_url ?? "", featured: s.featured, popular: s.popular, premium: s.premium });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="rounded-md border-2 border-foreground bg-secondary px-3 py-1.5 text-xs font-black uppercase"
                >
                  Edit
                </button>
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
  const [form, setForm] = useState({ store_id: "", section_id: "", title: "", description: "", type: "deal" as "code" | "deal", code: "", landing_url: "", uses: 0, verified: true });
  const [err, setErr] = useState<string | null>(null);
  const { data: allSections = [] } = useAllBrandSections();
  const formSections = allSections.filter((s) => s.storeId === form.store_id);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    const { error } = await supabase.from("coupons").insert({
      store_id: form.store_id,
      section_id: form.section_id || null,
      title: form.title,
      description: form.description,
      type: form.type,
      code: form.type === "code" ? form.code : null,
      landing_url: form.landing_url || null,
      uses: form.uses,
      verified: form.verified,
    });
    if (error) return setErr(error.message);
    setForm({ store_id: form.store_id, section_id: "", title: "", description: "", type: "deal", code: "", landing_url: "", uses: 0, verified: true });
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
          <select required value={form.store_id} onChange={(e) => setForm({ ...form, store_id: e.target.value, section_id: "" })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm">
            <option value="">Select store…</option>
            {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "code" | "deal" })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm">
            <option value="deal">Deal</option>
            <option value="code">Code</option>
          </select>
          <select value={form.section_id} onChange={(e) => setForm({ ...form, section_id: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm md:col-span-2">
            <option value="">Whole brand (no section)</option>
            {formSections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm md:col-span-2" />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm md:col-span-2" />
          {form.type === "code" && (
            <input required placeholder="CODE" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm font-mono" />
          )}
          <input type="number" min={0} placeholder="Uses" value={form.uses} onChange={(e) => setForm({ ...form, uses: parseInt(e.target.value) || 0 })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
          <input type="url" placeholder="Deal landing URL (optional)" value={form.landing_url} onChange={(e) => setForm({ ...form, landing_url: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm md:col-span-2" />
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
type BlogRow = {
  id: string;
  store_id: string | null;
  section_id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  published: boolean;
  created_at: string;
};

function BlogsAdmin({ stores }: { stores: StoreRow[] }) {
  const qc = useQueryClient();
  const { data: allSections = [] } = useAllBrandSections();
  const empty = { id: "", store_id: "", section_id: "", title: "", slug: "", excerpt: "", content: "", cover_url: "", published: true };
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(false);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  /** Insert text at the cursor position of the content textarea. */
  const insertAtCursor = (text: string) => {
    const el = contentRef.current;
    setForm((s) => {
      const start = el?.selectionStart ?? s.content.length;
      const end = el?.selectionEnd ?? s.content.length;
      const next = s.content.slice(0, start) + text + s.content.slice(end);
      requestAnimationFrame(() => {
        if (!el) return;
        el.focus();
        el.selectionStart = el.selectionEnd = start + text.length;
      });
      return { ...s, content: next };
    });
  };

  const insertLink = () => {
    const el = contentRef.current;
    const selected = el ? el.value.slice(el.selectionStart, el.selectionEnd) : "";
    const url = window.prompt("Link URL (https://…)");
    if (!url) return;
    const label = selected || window.prompt("Link text", url) || url;
    insertAtCursor(`[${label}](${url.trim()})`);
  };

  const insertImages = async (files: File[]) => {
    if (files.length === 0) return;
    setErr(null);
    setUploading(true);
    try {
      for (const f of files) {
        const url = await uploadBlogImage(f);
        const alt = f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
        insertAtCursor(`\n\n![${alt}](${url})\n\n`);
      }
    } catch (er) {
      setErr((er as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const postsQ = useQuery({
    queryKey: ["admin-blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as BlogRow[];
    },
  });

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin-blog-posts"] });
    qc.invalidateQueries({ queryKey: ["blog-posts"] });
    qc.invalidateQueries({ queryKey: ["blog-posts-store"] });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    const payload = {
      store_id: form.store_id || null,
      section_id: form.section_id || null,
      title: form.title,
      slug: form.slug || slugify(form.title),
      excerpt: form.excerpt,
      content: form.content,
      cover_url: form.cover_url || null,
      published: form.published,
    };
    const { error } = form.id
      ? await supabase.from("blog_posts").update(payload).eq("id", form.id)
      : await supabase.from("blog_posts").insert(payload);
    setSaving(false);
    if (error) return setErr(error.message);
    setForm(empty);
    refresh();
  };

  const del = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return alert(error.message);
    refresh();
  };

  const edit = (p: BlogRow) =>
    setForm({
      id: p.id,
      store_id: p.store_id ?? "",
      section_id: p.section_id ?? "",
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      content: p.content,
      cover_url: p.cover_url ?? "",
      published: p.published,
    });

  const posts = postsQ.data ?? [];

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="rounded-md border-2 border-foreground bg-card p-6 space-y-4" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="font-display text-xl font-black uppercase">{form.id ? "Edit Blog Post" : "Write a Blog Post"}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <select value={form.store_id} onChange={(e) => setForm({ ...form, store_id: e.target.value, section_id: "" })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm">
            <option value="">No brand (general post)</option>
            {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={form.section_id} onChange={(e) => setForm({ ...form, section_id: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm">
            <option value="">Whole brand (no section)</option>
            {allSections.filter((s) => s.storeId === form.store_id).map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input
            placeholder="url-slug (auto from title)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Post title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.id ? form.slug : slugify(e.target.value) })}
            className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm md:col-span-2"
          />
          <input placeholder="Short excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm md:col-span-2" />
          <div className="flex gap-2 md:col-span-2">
            <input type="url" placeholder="Cover image URL (optional) — or drop an image here" value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
              onDragOver={(e) => e.preventDefault()}
              onDrop={async (e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (!f) return;
                try { setUploading(true); setForm((s) => ({ ...s, cover_url: "" })); const url = await uploadBlogImage(f); setForm((s) => ({ ...s, cover_url: url })); }
                catch (er) { setErr((er as Error).message); } finally { setUploading(false); }
              }}
              className="flex-1 rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
            <label className="cursor-pointer rounded-md border-2 border-foreground bg-secondary px-3 py-2 text-xs font-black uppercase">
              Upload
              <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                const f = e.target.files?.[0]; if (!f) return;
                try { setUploading(true); const url = await uploadBlogImage(f); setForm((s) => ({ ...s, cover_url: url })); }
                catch (er) { setErr((er as Error).message); } finally { setUploading(false); e.target.value = ""; }
              }} />
            </label>
          </div>
          {form.cover_url && <img src={form.cover_url} alt="Cover preview" className="max-h-40 rounded-md border-2 border-foreground object-cover md:col-span-2" />}

          <div className="md:col-span-2 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <button type="button" onClick={insertLink} className="rounded-md border-2 border-foreground bg-secondary px-3 py-1.5 text-xs font-black uppercase">
                + Link
              </button>
              <label className="cursor-pointer rounded-md border-2 border-foreground bg-secondary px-3 py-1.5 text-xs font-black uppercase">
                + Image
                <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
                  const files = Array.from(e.target.files ?? []);
                  await insertImages(files);
                  e.target.value = "";
                }} />
              </label>
              <button type="button" onClick={() => setPreview((p) => !p)} className="rounded-md border-2 border-foreground bg-card px-3 py-1.5 text-xs font-black uppercase">
                {preview ? "Edit" : "Preview"}
              </button>
              <span className="text-xs text-muted-foreground">
                {uploading ? "Uploading image…" : "Drag & drop images into the editor. Links: [text](https://url)"}
              </span>
            </div>
            {preview ? (
              <div className="rounded-md border-2 border-dashed border-foreground p-4">
                <BlogContent content={form.content || "_Nothing to preview yet._"} />
              </div>
            ) : (
              <textarea
                ref={contentRef}
                required
                rows={14}
                placeholder="Write your blog post here. Leave a blank line between paragraphs. Use [text](https://example.com) for links, or the + Link button."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={async (e) => {
                  e.preventDefault();
                  setDragging(false);
                  const files = Array.from(e.dataTransfer.files ?? []).filter((f) => f.type.startsWith("image/"));
                  await insertImages(files);
                }}
                className={`w-full rounded-md border-2 bg-background px-3 py-2 text-sm font-mono ${dragging ? "border-primary bg-accent" : "border-foreground"}`}
              />
            )}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
        </label>
        {err && <div className="text-sm font-bold text-destructive">{err}</div>}
        <div className="flex gap-3">
          <button disabled={saving} className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-5 py-2 text-sm font-black uppercase text-primary-foreground disabled:opacity-50">
            <Plus className="h-4 w-4" /> {saving ? "Saving…" : form.id ? "Save changes" : "Publish post"}
          </button>
          {form.id && (
            <button type="button" onClick={() => setForm(empty)} className="rounded-md border-2 border-foreground bg-card px-5 py-2 text-sm font-black uppercase">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="rounded-md border-2 border-foreground bg-card" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="border-b-2 border-foreground p-4">
          <h2 className="font-display text-xl font-black uppercase">Blog Posts ({posts.length})</h2>
        </div>
        {postsQ.isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : posts.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No posts yet.</div>
        ) : (
          <div className="divide-y-2 divide-foreground/20">
            {posts.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="font-display font-black">{p.title}</div>
                  <div className="truncate text-xs font-bold uppercase text-muted-foreground">
                    /blog/{p.slug} · {stores.find((s) => s.id === p.store_id)?.name ?? "General"} · {p.published ? "Published" : "Draft"}
                  </div>
                </div>
                <button onClick={() => edit(p)} className="rounded-md border-2 border-foreground bg-card px-3 py-1.5 text-xs font-black uppercase">
                  Edit
                </button>
                <button onClick={() => del(p.id)} className="rounded-md border-2 border-foreground bg-destructive px-3 py-1.5 text-xs font-black uppercase text-destructive-foreground">
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

/* ---------------- Brand sections ---------------- */

function SectionsAdmin({ stores }: { stores: StoreRow[] }) {
  const qc = useQueryClient();
  const empty = { id: "", store_id: "", name: "", slug: "", description: "", about: "", image_url: "", landing_url: "", sort_order: 0 };
  const [form, setForm] = useState(empty);
  const [filter, setFilter] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { data: sections = [], isLoading } = useAllBrandSections();

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["brand-sections-all"] });
    qc.invalidateQueries({ queryKey: ["brand-sections"] });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    const payload = {
      store_id: form.store_id,
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      about: form.about,
      image_url: form.image_url || null,
      landing_url: form.landing_url || null,
      sort_order: form.sort_order,
    };
    const { error } = form.id
      ? await supabase.from("brand_sections").update(payload).eq("id", form.id)
      : await supabase.from("brand_sections").insert(payload);
    setSaving(false);
    if (error) return setErr(error.message);
    setForm({ ...empty, store_id: form.store_id });
    refresh();
  };

  const edit = (s: BrandSection) =>
    setForm({
      id: s.id,
      store_id: s.storeId,
      name: s.name,
      slug: s.slug,
      description: s.description,
      about: s.about,
      image_url: s.imageUrl ?? "",
      landing_url: s.landingUrl ?? "",
      sort_order: s.sortOrder,
    });

  const del = async (id: string) => {
    if (!confirm("Delete this section? Its coupons and posts stay, but lose the section tag.")) return;
    const { error } = await supabase.from("brand_sections").delete().eq("id", id);
    if (error) return alert(error.message);
    refresh();
  };

  const storeName = (id: string) => stores.find((s) => s.id === id)?.name ?? "—";
  const shown = filter ? sections.filter((s) => s.storeId === filter) : sections;

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="space-y-4 rounded-md border-2 border-foreground bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="font-display text-xl font-black uppercase">{form.id ? "Edit Section" : "Add Brand Section"}</h2>
        <p className="text-sm text-muted-foreground">
          Sections are sub-pages inside a brand — e.g. Adidas → Shoes, Apparel, T-Shirts. Each gets its own page with about text,
          offers, top searches and blog posts.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <select required value={form.store_id} onChange={(e) => setForm({ ...form, store_id: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm">
            <option value="">Select brand…</option>
            {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
          <input required placeholder="Section name (e.g. Shoes)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: form.id ? form.slug : slugify(e.target.value) })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
          <input placeholder="url-slug (auto)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
          <input placeholder="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm md:col-span-2" />
          <ImageDropField label="Section image" value={form.image_url} onChange={(url) => setForm((f) => ({ ...f, image_url: url }))} className="md:col-span-2" />
          <input type="url" placeholder="Shop URL for this section (optional)" value={form.landing_url} onChange={(e) => setForm({ ...form, landing_url: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
          <textarea rows={6} placeholder="About this section (shown on the section page)" value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm md:col-span-2" />
        </div>
        {err && <div className="text-sm font-bold text-destructive">{err}</div>}
        <div className="flex gap-3">
          <button disabled={saving} className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-5 py-2 text-sm font-black uppercase text-primary-foreground disabled:opacity-50">
            <Plus className="h-4 w-4" /> {saving ? "Saving…" : form.id ? "Save changes" : "Add section"}
          </button>
          {form.id && (
            <button type="button" onClick={() => setForm(empty)} className="rounded-md border-2 border-foreground bg-card px-5 py-2 text-sm font-black uppercase">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="rounded-md border-2 border-foreground bg-card" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex flex-wrap items-center gap-3 border-b-2 border-foreground p-4">
          <h2 className="font-display text-xl font-black uppercase">Sections ({shown.length})</h2>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="ml-auto rounded-md border-2 border-foreground bg-background px-3 py-1.5 text-xs font-bold">
            <option value="">All brands</option>
            {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : shown.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No sections yet.</div>
        ) : (
          <div className="divide-y-2 divide-foreground/20">
            {shown.map((s) => (
              <div key={s.id} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="font-display font-black uppercase">{s.name}</div>
                  <div className="truncate text-xs font-bold uppercase text-muted-foreground">
                    {storeName(s.storeId)} · /{s.slug}
                  </div>
                </div>
                <button onClick={() => edit(s)} className="rounded-md border-2 border-foreground bg-card px-3 py-1.5 text-xs font-black uppercase">Edit</button>
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

/* ---------------- Social links ---------------- */

function SocialsAdmin() {
  const qc = useQueryClient();
  const empty = { id: "", platform: "pinterest", label: "Pinterest", url: "", sort_order: 0, enabled: true };
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { data: links = [], isLoading } = useSocialLinks();

  const refresh = () => qc.invalidateQueries({ queryKey: ["social-links"] });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    const payload = {
      platform: form.platform,
      label: form.label || form.platform,
      url: form.url,
      sort_order: form.sort_order,
      enabled: form.enabled,
    };
    const { error } = form.id
      ? await supabase.from("social_links").update(payload).eq("id", form.id)
      : await supabase.from("social_links").insert(payload);
    setSaving(false);
    if (error) return setErr(error.message);
    setForm(empty);
    refresh();
  };

  const del = async (id: string) => {
    if (!confirm("Remove this social link?")) return;
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) return alert(error.message);
    refresh();
  };

  const toggle = async (id: string, enabled: boolean) => {
    const { error } = await supabase.from("social_links").update({ enabled }).eq("id", id);
    if (error) return alert(error.message);
    refresh();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="space-y-4 rounded-md border-2 border-foreground bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="font-display text-xl font-black uppercase">{form.id ? "Edit Social Link" : "Add Social Link"}</h2>
        <p className="text-sm text-muted-foreground">These appear under “Follow us” in the site footer. Add more whenever you open a new account.</p>
        <div className="grid gap-3 md:grid-cols-2">
          <select
            value={form.platform}
            onChange={(e) => setForm({ ...form, platform: e.target.value, label: e.target.value[0].toUpperCase() + e.target.value.slice(1) })}
            className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm"
          >
            {socialPlatforms.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <input placeholder="Label" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
          <input required type="url" placeholder="https://www.pinterest.com/yourprofile" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm md:col-span-2" />
          <input type="number" placeholder="Sort order" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="rounded-md border-2 border-foreground bg-background px-3 py-2 text-sm" />
          <label className="flex items-center gap-2 text-sm font-bold">
            <input type="checkbox" checked={form.enabled} onChange={(e) => setForm({ ...form, enabled: e.target.checked })} /> Show in footer
          </label>
        </div>
        {err && <div className="text-sm font-bold text-destructive">{err}</div>}
        <div className="flex gap-3">
          <button disabled={saving} className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-5 py-2 text-sm font-black uppercase text-primary-foreground disabled:opacity-50">
            <Plus className="h-4 w-4" /> {saving ? "Saving…" : form.id ? "Save changes" : "Add link"}
          </button>
          {form.id && (
            <button type="button" onClick={() => setForm(empty)} className="rounded-md border-2 border-foreground bg-card px-5 py-2 text-sm font-black uppercase">Cancel</button>
          )}
        </div>
      </form>

      <div className="rounded-md border-2 border-foreground bg-card" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="border-b-2 border-foreground p-4">
          <h2 className="font-display text-xl font-black uppercase">Social Links ({links.length})</h2>
        </div>
        {isLoading ? (
          <div className="p-6 text-sm text-muted-foreground">Loading…</div>
        ) : links.length === 0 ? (
          <div className="p-6 text-sm text-muted-foreground">No social links yet.</div>
        ) : (
          <div className="divide-y-2 divide-foreground/20">
            {links.map((l) => (
              <div key={l.id} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <div className="font-display font-black uppercase">{l.label || l.platform}</div>
                  <div className="truncate text-xs font-bold text-muted-foreground">{l.url}</div>
                </div>
                <label className="flex items-center gap-2 text-xs font-black uppercase">
                  <input type="checkbox" checked={l.enabled} onChange={(e) => toggle(l.id, e.target.checked)} /> Live
                </label>
                <button
                  onClick={() => setForm({ id: l.id, platform: l.platform, label: l.label, url: l.url, sort_order: l.sortOrder, enabled: l.enabled })}
                  className="rounded-md border-2 border-foreground bg-card px-3 py-1.5 text-xs font-black uppercase"
                >
                  Edit
                </button>
                <button onClick={() => del(l.id)} className="rounded-md border-2 border-foreground bg-destructive px-3 py-1.5 text-xs font-black uppercase text-destructive-foreground">
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
