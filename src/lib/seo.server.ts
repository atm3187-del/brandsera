import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** Publishable-key client for public, RLS-respecting reads on the server (no session). */
export function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export async function fetchStoreSeo(slug: string) {
  const sb = publicClient();
  const { data: store } = await sb
    .from("stores")
    .select("id,name,slug,category,description,logo_url,website_url,updated_at")
    .eq("slug", slug)
    .maybeSingle();
  if (!store) return null;
  const [{ data: coupons }, { data: sections }] = await Promise.all([
    sb.from("coupons").select("id,title,description,type,code,expires_at,updated_at").eq("store_id", store.id),
    sb.from("brand_sections").select("name,slug").eq("store_id", store.id).order("sort_order"),
  ]);
  return { store, coupons: coupons ?? [], sections: sections ?? [] };
}

export async function fetchSectionSeo(storeSlug: string, sectionSlug: string) {
  const sb = publicClient();
  const { data: store } = await sb.from("stores").select("id,name,slug,category,logo_url").eq("slug", storeSlug).maybeSingle();
  if (!store) return null;
  const { data: section } = await sb
    .from("brand_sections")
    .select("id,name,slug,description,about,image_url,updated_at")
    .eq("store_id", store.id)
    .eq("slug", sectionSlug)
    .maybeSingle();
  if (!section) return null;
  const { count } = await sb.from("coupons").select("id", { count: "exact", head: true }).eq("section_id", section.id);
  return { store, section, offerCount: count ?? 0 };
}

export async function fetchPostSeo(slug: string) {
  const sb = publicClient();
  const { data } = await sb
    .from("blog_posts")
    .select("title,slug,excerpt,cover_url,created_at,updated_at,stores(name,slug)")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data ?? null;
}

export async function fetchSitemapData() {
  const sb = publicClient();
  const pageSize = 1000;

  async function all<T>(run: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>) {
    const out: T[] = [];
    for (let offset = 0; ; offset += pageSize) {
      const { data, error } = await run(offset, offset + pageSize - 1);
      if (error) throw error;
      out.push(...(data ?? []));
      if (!data || data.length < pageSize) break;
    }
    return out;
  }

  const [stores, sections, posts] = await Promise.all([
    all<{ slug: string; updated_at: string }>((a, b) => sb.from("stores").select("slug,updated_at").order("id").range(a, b)),
    all<{ slug: string; updated_at: string; stores: { slug: string } | null }>((a, b) =>
      sb.from("brand_sections").select("slug,updated_at,stores(slug)").order("id").range(a, b),
    ),
    all<{ slug: string; updated_at: string }>((a, b) =>
      sb.from("blog_posts").select("slug,updated_at").eq("published", true).order("id").range(a, b),
    ),
  ]);

  return { stores, sections, posts };
}
