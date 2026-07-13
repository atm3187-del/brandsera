
-- Fix 1: restrict profiles SELECT to owner
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Fix 2: revoke EXECUTE on SECURITY DEFINER functions from public/anon/authenticated
-- has_role is called from RLS policies; keep authenticated EXECUTE for policy evaluation
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
