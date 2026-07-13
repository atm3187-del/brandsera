
CREATE OR REPLACE FUNCTION public.notify_favorited_store_coupon()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_store_name text;
  v_store_slug text;
BEGIN
  SELECT name, slug INTO v_store_name, v_store_slug FROM public.stores WHERE id = NEW.store_id;
  IF v_store_name IS NULL THEN RETURN NEW; END IF;

  INSERT INTO public.alerts (user_id, title, body, link)
  SELECT DISTINCT f.user_id,
                  'New deal from ' || v_store_name,
                  NEW.title,
                  '/store/' || v_store_slug
  FROM public.favorites f
  JOIN public.coupons c ON c.id = f.coupon_id
  WHERE c.store_id = NEW.store_id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_favorited_store_coupon ON public.coupons;
CREATE TRIGGER trg_notify_favorited_store_coupon
AFTER INSERT ON public.coupons
FOR EACH ROW EXECUTE FUNCTION public.notify_favorited_store_coupon();

REVOKE EXECUTE ON FUNCTION public.notify_favorited_store_coupon() FROM PUBLIC, anon, authenticated;
