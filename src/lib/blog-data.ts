import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BlogPost {
  id: string;
  storeId: string | null;
  sectionId: string | null;
  storeName: string | null;
  storeSlug: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string | null;
  published: boolean;
  createdAt: string;
}

type Row = {
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
  stores?: { name: string; slug: string } | null;
};

function map(r: Row): BlogPost {
  return {
    id: r.id,
    storeId: r.store_id,
    sectionId: r.section_id,
    storeName: r.stores?.name ?? null,
    storeSlug: r.stores?.slug ?? null,
    title: r.title,
    slug: r.slug,
    excerpt: r.excerpt,
    content: r.content,
    coverUrl: r.cover_url,
    published: r.published,
    createdAt: r.created_at,
  };
}

export async function fetchPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id,store_id,section_id,title,slug,excerpt,content,cover_url,published,created_at,stores(name,slug)")
    .eq("published", true)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as unknown as Row[]).map(map);
}

export function useBlogPosts() {
  return useQuery({ queryKey: ["blog-posts"], queryFn: fetchPosts, staleTime: 30_000 });
}

export function useBlogPost(slug: string) {
  return useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,store_id,section_id,title,slug,excerpt,content,cover_url,published,created_at,stores(name,slug)")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data ? map(data as unknown as Row) : null;
    },
  });
}

/** Posts written for one brand. */
export function useStoreBlogPosts(storeId: string | undefined) {
  return useQuery({
    enabled: !!storeId,
    queryKey: ["blog-posts-store", storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,store_id,section_id,title,slug,excerpt,content,cover_url,published,created_at,stores(name,slug)")
        .eq("store_id", storeId!)
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as unknown as Row[]).map(map);
    },
  });
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/** Posts written for one section of a brand. */
export function useSectionBlogPosts(sectionId: string | undefined) {
  return useQuery({
    enabled: !!sectionId,
    queryKey: ["blog-posts-section", sectionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("id,store_id,section_id,title,slug,excerpt,content,cover_url,published,created_at,stores(name,slug)")
        .eq("section_id", sectionId!)
        .eq("published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as unknown as Row[]).map(map);
    },
  });
}
