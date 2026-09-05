-- Move has_role out of the API-exposed public schema so signed-in users cannot call it via RPC,
-- while RLS policies keep working through private.has_role.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;
REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Repoint every policy that references public.has_role
DO $$
DECLARE r record; q text; wc text;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname, qual, with_check
    FROM pg_policies
    WHERE qual ILIKE '%has_role(%' OR with_check ILIKE '%has_role(%'
  LOOP
    q  := CASE WHEN r.qual IS NULL THEN NULL ELSE regexp_replace(r.qual, '(public\.)?has_role\(', 'private.has_role(', 'g') END;
    wc := CASE WHEN r.with_check IS NULL THEN NULL ELSE regexp_replace(r.with_check, '(public\.)?has_role\(', 'private.has_role(', 'g') END;
    EXECUTE format('ALTER POLICY %I ON %I.%I %s %s',
      r.policyname, r.schemaname, r.tablename,
      CASE WHEN q  IS NULL THEN '' ELSE 'USING (' || q || ')' END,
      CASE WHEN wc IS NULL THEN '' ELSE 'WITH CHECK (' || wc || ')' END);
  END LOOP;
END $$;

DROP FUNCTION public.has_role(uuid, public.app_role);