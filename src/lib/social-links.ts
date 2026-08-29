import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SocialLink {
  id: string;
  platform: string;
  label: string;
  url: string;
  sortOrder: number;
  enabled: boolean;
}

/** Platforms we offer in the admin picker. Anything else falls back to a globe icon. */
export const socialPlatforms = [
  "pinterest",
  "instagram",
  "facebook",
  "twitter",
  "youtube",
  "linkedin",
  "tiktok",
  "website",
] as const;

export async function fetchSocialLinks(): Promise<SocialLink[]> {
  const { data, error } = await supabase
    .from("social_links")
    .select("id,platform,label,url,sort_order,enabled")
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    platform: r.platform,
    label: r.label,
    url: r.url,
    sortOrder: r.sort_order,
    enabled: r.enabled,
  }));
}

export function useSocialLinks() {
  return useQuery({ queryKey: ["social-links"], queryFn: fetchSocialLinks, staleTime: 60_000 });
}
