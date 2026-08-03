ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS website_url text;
ALTER TABLE public.coupons ADD COLUMN IF NOT EXISTS landing_url text;

UPDATE public.stores SET website_url = v.url FROM (VALUES
 ('adidas','https://www.adidas.com'),
 ('aelfric-eden','https://aelfriceden.com'),
 ('amazon','https://www.amazon.com'),
 ('anbernic','https://anbernic.com'),
 ('ba-sh','https://ba-sh.com'),
 ('circle-dna','https://circledna.com'),
 ('clubhouse-supplements','https://clubhousesupplements.com'),
 ('enjoy-the-wood','https://enjoythewood.com'),
 ('etha-naturals','https://ethanaturals.com'),
 ('expedia','https://www.expedia.com'),
 ('g2a','https://www.g2a.com'),
 ('lavnex','https://lavnex.com'),
 ('lehi-mills','https://lehimills.com'),
 ('nike','https://www.nike.com'),
 ('nycmode','https://nycmode.com'),
 ('performance-golf','https://performancegolf.com'),
 ('regno','https://regno.com'),
 ('shein','https://www.shein.com'),
 ('sirui','https://www.sirui.com'),
 ('the-classic-t-shirt-company','https://www.theclassictshirt.com')
) AS v(slug,url) WHERE public.stores.slug = v.slug;

UPDATE public.stores SET website_url = 'https://ohura.com' WHERE name = 'Ohura' AND website_url IS NULL;