-- Remove made-up demo coupons (seeded 2026-07-11, no real landing link)
DELETE FROM public.coupons WHERE created_at::date = '2026-07-11' AND (landing_url IS NULL OR landing_url = '');

-- Hide placeholder Pinterest link that points to pinterest.com homepage, not a real account
UPDATE public.social_links SET enabled = false WHERE url ~* '^https?://(www\.)?pinterest\.com/?$';

-- Real contact form storage
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 5000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT SELECT, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a contact message" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins read contact messages" ON public.contact_messages FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete contact messages" ON public.contact_messages FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));