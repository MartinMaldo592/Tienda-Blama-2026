-- ============================================================
-- MIGRACIÓN: Corregir rol 'staff' por 'worker' en políticas RLS
-- Fecha: 2026-05-01
-- Objetivo: Asegurar que los trabajadores puedan ver pagos y notas.
-- ============================================================

-- 1. PEDIDO_PAGOS
DROP POLICY IF EXISTS "Admins y workers pueden ver pagos" ON public.pedido_pagos;
CREATE POLICY "Admins y workers pueden ver pagos" 
ON public.pedido_pagos FOR SELECT 
TO authenticated
USING (
    public.can_access_pedido(pedido_id)
);

DROP POLICY IF EXISTS "Admins y workers pueden insertar pagos" ON public.pedido_pagos;
CREATE POLICY "Admins y workers pueden insertar pagos" 
ON public.pedido_pagos FOR INSERT 
TO authenticated
WITH CHECK (
    public.can_access_pedido(pedido_id)
);

-- 2. PEDIDO_NOTAS
DROP POLICY IF EXISTS "Permitir lectura staff" ON public.pedido_notas;
CREATE POLICY "Permitir lectura staff" 
ON public.pedido_notas FOR SELECT 
TO authenticated
USING (
    public.can_access_pedido(pedido_id)
);

DROP POLICY IF EXISTS "Permitir escritura staff" ON public.pedido_notas;
CREATE POLICY "Permitir escritura staff" 
ON public.pedido_notas FOR INSERT 
TO authenticated
WITH CHECK (
    public.can_access_pedido(pedido_id)
);

-- 3. PEDIDOS
DROP POLICY IF EXISTS "Admins ven todos, Workers ven asignados" ON public.pedidos;
CREATE POLICY "Admins ven todos, Workers ven asignados" 
ON public.pedidos FOR SELECT 
TO authenticated
USING (
    public.is_admin()
    OR (public.is_staff() AND asignado_a = auth.uid())
);

