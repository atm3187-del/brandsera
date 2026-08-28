-- 1. Social links (editable by admins, shown in footer)
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  label text NOT NULL DEFAULT '',
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.social_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.social_links TO authenticated;
GRANT ALL ON public.social_links TO service_role;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Social links are viewable by everyone" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Admins insert social links" ON public.social_links FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update social links" ON public.social_links FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete social links" ON public.social_links FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_social_links_updated_at BEFORE UPDATE ON public.social_links FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.social_links (platform, label, url, sort_order) VALUES
  ('pinterest', 'Pinterest', 'https://www.pinterest.com/', 1);

-- 2. Brand sections (categories inside a brand page, e.g. Shoes, Apparel)
CREATE TABLE public.brand_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL DEFAULT '',
  about text NOT NULL DEFAULT '',
  image_url text,
  landing_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (store_id, slug)
);
GRANT SELECT ON public.brand_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brand_sections TO authenticated;
GRANT ALL ON public.brand_sections TO service_role;
ALTER TABLE public.brand_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Brand sections are viewable by everyone" ON public.brand_sections FOR SELECT USING (true);
CREATE POLICY "Admins insert brand sections" ON public.brand_sections FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update brand sections" ON public.brand_sections FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete brand sections" ON public.brand_sections FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER set_brand_sections_updated_at BEFORE UPDATE ON public.brand_sections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Attach coupons and blog posts to a brand section (optional)
ALTER TABLE public.coupons ADD COLUMN section_id uuid REFERENCES public.brand_sections(id) ON DELETE SET NULL;
ALTER TABLE public.blog_posts ADD COLUMN section_id uuid REFERENCES public.brand_sections(id) ON DELETE SET NULL;
CREATE INDEX idx_coupons_section ON public.coupons(section_id);
CREATE INDEX idx_blog_posts_section ON public.blog_posts(section_id);
CREATE INDEX idx_brand_sections_store ON public.brand_sections(store_id);