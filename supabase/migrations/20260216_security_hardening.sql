-- ==============================================================================
-- 🛡️ SCRIPT DE BLINDAJE DE SEGURIDAD (SECURITY HARDENING)
-- Fecha: Febrero 2026
-- Objetivo: Corregir políticas RLS permisivas y proteger funciones vulnerables.
-- ==============================================================================

-- 1. PROTEGER FUNCIONES VULNERABLES (Search Path Attack)
-- Evita que usuarios maliciosos inyecten objetos en el search_path.

ALTER FUNCTION public.is_staff() SET search_path = public;
ALTER FUNCTION public.is_admin() SET search_path = public;
ALTER FUNCTION public.can_access_pedido(bigint) SET search_path = public;
ALTER FUNCTION public.slugify(text) SET search_path = public;
ALTER FUNCTION public.handle_new_product_slug() SET search_path = public;

-- Si existen estas funciones (mencionadas en análisis), protegerlas también:
-- ALTER FUNCTION public.admin_procesar_devolucion_parcial() SET search_path = public;
-- ALTER FUNCTION public.log_changes_trigger() SET search_path = public;


-- 2. CORREGIR POLÍTICAS RLS EN TABLAS CRÍTICAS

-- A) CATEGORÍAS ----------------------------------------------------------------
-- Problema: "Allow authenticated full access" (USING true)
-- Solución: Solo lectura pública, escritura solo admin.

DROP POLICY IF EXISTS "Allow authenticated full access" ON public.categorias;
DROP POLICY IF EXISTS "Public read categories" ON public.categorias;
DROP POLICY IF EXISTS "Admin manage categories" ON public.categorias;

CREATE POLICY "Public read categories" ON public.categorias
  FOR SELECT USING (true);

CREATE POLICY "Admin manage categories" ON public.categorias
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- B) CLIENTES ------------------------------------------------------------------
-- Problema: INSERT público necesario (invitados), pero UPDATE/DELETE peligrosos.
-- Solución: Restringir UPDATE/DELETE a Admins o Dueño (si hubiera auth de cliente).

DROP POLICY IF EXISTS "Public creates clients" ON public.clientes;
DROP POLICY IF EXISTS "Public update clients" ON public.clientes;
DROP POLICY IF EXISTS "Public delete clients" ON public.clientes;
-- Eliminar duplicados si existen
DROP POLICY IF EXISTS "Public puede crear clientes" ON public.clientes; 

-- Permitir INSERT a cualquiera (necesario para checkout de invitados)
CREATE POLICY "Public creates clients" ON public.clientes
  FOR INSERT WITH CHECK (true);

-- Restringir UPDATE/DELETE solo a Admins/Staff
CREATE POLICY "Staff manage clients" ON public.clientes
  FOR UPDATE USING (public.is_admin() OR public.is_staff());

CREATE POLICY "Staff delete clients" ON public.clientes
  FOR DELETE USING (public.is_admin());
  
-- Lectura: Staff puede ver todo. Público NO debería ver lista completa de clientes.
-- Si el cliente necesita ver sus datos, se hace por ID o match de sesión.
DROP POLICY IF EXISTS "Staff puede leer clientes" ON public.clientes;
CREATE POLICY "Staff read all clients" ON public.clientes
  FOR SELECT USING (public.is_staff());


-- C) SOCIAL LINKS --------------------------------------------------------------
-- Problema: "Admin full access" con USING (true) dejaba editar a cualquiera auth.

DROP POLICY IF EXISTS "Admin full access social links" ON public.social_links;
DROP POLICY IF EXISTS "Public read social links" ON public.social_links;

CREATE POLICY "Public read social links" ON public.social_links
  FOR SELECT USING (true);

CREATE POLICY "Admin manage social links" ON public.social_links
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- D) PEDIDO LOGS ---------------------------------------------------------------
-- Problema: "Enable insert access for authenticated users" permite falsificar logs.
-- Solución: Solo el sistema (triggers) o admins deberían insertar logs.

DROP POLICY IF EXISTS "Enable insert access for authenticated users" ON public.pedido_logs;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.pedido_logs;

-- Lectura: Solo staff/admin o dueño del pedido
CREATE POLICY "Staff read logs" ON public.pedido_logs
  FOR SELECT USING (public.is_staff());

-- Escritura: Normalmente los logs se crean por trigger con 'security definer', 
-- pero si se crean desde API, solo staff.
CREATE POLICY "Staff create logs" ON public.pedido_logs
  FOR INSERT WITH CHECK (public.is_staff());


-- E) SYSTEM AUDIT LOGS ---------------------------------------------------------
-- Asegurar que nadie borre auditoría

ALTER TABLE public.system_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins read audit logs" ON public.system_audit_logs
  FOR SELECT USING (public.is_admin());

-- Nadie debería poder hacer UPDATE o DELETE en logs de auditoría nunca.
-- No creamos policies de UPDATE/DELETE = Deny All implícito.


-- 3. LIMPIEZA DE POLÍTICAS DUPLICADAS (Housekeeping)
-- El análisis detectó muchas reglas repetidas. Borramos las viejas versiones en español/inglés mezclado.

-- Cupones
DROP POLICY IF EXISTS "Admin puede leer cupones" ON public.cupones;
DROP POLICY IF EXISTS "Public puede leer cupones activos" ON public.cupones;
-- Dejamos las definidas en auth_roles_setup.sql si son correctas, o las reforzamos aquí.
-- Reforzamos Admin total:
CREATE POLICY "Admin manage cupones" ON public.cupones
  FOR ALL USING (public.is_admin());
  
-- Productos (Asegurar solo lectura pública)
DROP POLICY IF EXISTS "Public read products" ON public.productos;
DROP POLICY IF EXISTS "Staff puede leer productos" ON public.productos; -- Duplicada
CREATE POLICY "Public read products" ON public.productos FOR SELECT USING (true);

-- Variantes
DROP POLICY IF EXISTS "Public puede leer producto_variantes" ON public.producto_variantes;
CREATE POLICY "Public read active variants" ON public.producto_variantes 
  FOR SELECT USING (activo = true);


-- ==============================================================================
-- FIN DEL BLINDAJE
-- ==============================================================================
