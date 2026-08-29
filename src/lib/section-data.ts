import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface BrandSection {
  id: string;
  storeId: string;
  name: string;
  slug: string;
  description: string;
  about: string;
  imageUrl: string | null;
  landingUrl: string | null;
  sortOrder: number;
}

const SELECT = "id,store_id,name,slug,description,about,image_url,landing_url,sort_order";

type Row = {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  description: string;
  about: string;
  image_url: string | null;
  landing_url: string | null;
  sort_order: number;
};

function map(r: Row): BrandSection {
  return {
    id: r.id,
    storeId: r.store_id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    about: r.about,
    imageUrl: r.image_url,
    landingUrl: r.landing_url,
    sortOrder: r.sort_order,
  };
}

/** All sections belonging to one brand. */
export function useBrandSections(storeId: string | undefined) {
  return useQuery({
    enabled: !!storeId,
    queryKey: ["brand-sections", storeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("brand_sections")
        .select(SELECT)
        .eq("store_id", storeId!)
        .order("sort_order")
        .order("name");
      if (error) throw error;
      return ((data ?? []) as Row[]).map(map);
    },
    staleTime: 60_000,
  });
}

/** Every section across all brands (admin panel). */
export function useAllBrandSections() {
  return useQuery({
    queryKey: ["brand-sections-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("brand_sections").select(SELECT).order("name");
      if (error) throw error;
      return ((data ?? []) as Row[]).map(map);
    },
  });
}
