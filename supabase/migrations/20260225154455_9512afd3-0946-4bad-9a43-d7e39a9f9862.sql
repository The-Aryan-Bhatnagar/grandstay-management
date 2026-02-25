
-- Drop all existing restrictive policies and recreate as permissive

-- ROOMS
DROP POLICY IF EXISTS "Anyone can view rooms" ON public.rooms;
DROP POLICY IF EXISTS "Admins can insert rooms" ON public.rooms;
DROP POLICY IF EXISTS "Admins can update rooms" ON public.rooms;
DROP POLICY IF EXISTS "Admins can delete rooms" ON public.rooms;

CREATE POLICY "Anyone can view rooms" ON public.rooms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert rooms" ON public.rooms FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update rooms" ON public.rooms FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete rooms" ON public.rooms FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- BOOKINGS
DROP POLICY IF EXISTS "Anyone can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can delete bookings" ON public.bookings;

CREATE POLICY "Anyone can insert bookings" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view bookings" ON public.bookings FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete bookings" ON public.bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- CUSTOMERS
DROP POLICY IF EXISTS "Anyone can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Admins can view customers" ON public.customers;
DROP POLICY IF EXISTS "Admins can update customers" ON public.customers;

CREATE POLICY "Anyone can insert customers" ON public.customers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view customers" ON public.customers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update customers" ON public.customers FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- STAFF
DROP POLICY IF EXISTS "Admins can view staff" ON public.staff;
DROP POLICY IF EXISTS "Admins can insert staff" ON public.staff;
DROP POLICY IF EXISTS "Admins can update staff" ON public.staff;
DROP POLICY IF EXISTS "Admins can delete staff" ON public.staff;

CREATE POLICY "Admins can view staff" ON public.staff FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert staff" ON public.staff FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update staff" ON public.staff FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete staff" ON public.staff FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- USER_ROLES
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
