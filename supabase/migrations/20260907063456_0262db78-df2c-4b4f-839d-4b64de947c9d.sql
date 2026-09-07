UPDATE public.stores SET slug = 'ba-sh' WHERE slug = 'ba-and-sh';
DELETE FROM public.store_slug_redirects WHERE old_slug = 'ba-sh';