
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all favorites" ON public.favorites
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can view all alerts" ON public.alerts
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
