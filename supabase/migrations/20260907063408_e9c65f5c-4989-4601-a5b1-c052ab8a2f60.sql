CREATE TABLE IF NOT EXISTS public.store_slug_redirects (
  old_slug text PRIMARY KEY,
  new_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.store_slug_redirects TO anon;
GRANT SELECT ON public.store_slug_redirects TO authenticated;
GRANT ALL ON public.store_slug_redirects TO service_role;
ALTER TABLE public.store_slug_redirects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Redirects are publicly readable" ON public.store_slug_redirects FOR SELECT USING (true);

-- Compute clean slugs from store names and record redirects
WITH cleaned AS (
  SELECT id, slug AS old_slug,
    trim(both '-' from regexp_replace(regexp_replace(lower(replace(name, '&', ' and ')), '[^a-z0-9]+', '-', 'g'), '-+', '-', 'g')) AS base
  FROM public.stores
),
final AS (
  SELECT id, old_slug,
    CASE WHEN row_number() OVER (PARTITION BY base ORDER BY old_slug) = 1 THEN base
         ELSE base || '-' || row_number() OVER (PARTITION BY base ORDER BY old_slug) END AS new_slug
  FROM cleaned
),
changed AS (
  SELECT * FROM final WHERE new_slug <> old_slug
),
ins AS (
  INSERT INTO public.store_slug_redirects (old_slug, new_slug)
  SELECT old_slug, new_slug FROM changed
  ON CONFLICT (old_slug) DO UPDATE SET new_slug = EXCLUDED.new_slug
  RETURNING 1
)
UPDATE public.stores s SET slug = c.new_slug FROM changed c WHERE s.id = c.id;

-- Keep redirect targets current if a slug is later chained
UPDATE public.store_slug_redirects r SET new_slug = s.slug
FROM public.stores s WHERE s.id = (SELECT id FROM public.stores WHERE slug = r.new_slug LIMIT 1) AND s.slug <> r.new_slug;