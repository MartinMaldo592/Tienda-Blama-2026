-- ============================================================
-- Migration: Crear tabla pedido_pagos para control de pagos parciales
-- Fecha: 2026-02-11
-- ============================================================

-- 1. Crear tabla pedido_pagos
CREATE TABLE IF NOT EXISTS public.pedido_pagos (
    id BIGSERIAL PRIMARY KEY,
    pedido_id BIGINT NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
    monto NUMERIC(10, 2) NOT NULL CHECK (monto > 0),
    metodo_pago TEXT NOT NULL CHECK (metodo_pago IN ('Efectivo', 'Yape', 'Plin', 'Transferencia BCP', 'Transferencia Interbank', 'Otro')),
    tipo_pago TEXT NOT NULL CHECK (tipo_pago IN ('Adelanto', 'Abono', 'Pago Final', 'Reembolso')),
    comprobante_url TEXT,
    nota TEXT,
    registrado_por TEXT NOT NULL DEFAULT 'Sistema',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Índice para consultas por pedido
CREATE INDEX IF NOT EXISTS idx_pedido_pagos_pedido_id ON public.pedido_pagos(pedido_id);

-- 3. Actualizar constraint de pago_status en pedidos para nuevos valores
DO $$
BEGIN
    ALTER TABLE public.pedidos DROP CONSTRAINT IF EXISTS pedidos_pago_status_check;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

ALTER TABLE public.pedidos ALTER COLUMN pago_status SET DEFAULT 'Pendiente';

ALTER TABLE public.pedidos ADD CONSTRAINT pedidos_pago_status_check CHECK (
    pago_status IN (
        'Pendiente',
        'Pago Parcial',
        'Pagado',
        'Pago Contraentrega',      -- legacy
        'Pagado Anticipado',       -- legacy
        'Pagado al Recibir'        -- legacy
    )
);

-- 4. Habilitar RLS en la nueva tabla
ALTER TABLE public.pedido_pagos ENABLE ROW LEVEL SECURITY;

-- 5. Políticas RLS para pedido_pagos usando tabla 'usuarios'
-- (Corregido para usar public.usuarios en lugar de public.profiles)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pedido_pagos' AND policyname = 'Admins y workers pueden ver pagos') THEN
        CREATE POLICY "Admins y workers pueden ver pagos" ON public.pedido_pagos FOR SELECT USING (EXISTS (SELECT 1 FROM public.usuarios WHERE usuarios.id = auth.uid() AND usuarios.role IN ('admin', 'worker')));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pedido_pagos' AND policyname = 'Admins y workers pueden insertar pagos') THEN
        CREATE POLICY "Admins y workers pueden insertar pagos" ON public.pedido_pagos FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.usuarios WHERE usuarios.id = auth.uid() AND usuarios.role IN ('admin', 'worker')));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pedido_pagos' AND policyname = 'Solo admins pueden eliminar pagos') THEN
        CREATE POLICY "Solo admins pueden eliminar pagos" ON public.pedido_pagos FOR DELETE USING (EXISTS (SELECT 1 FROM public.usuarios WHERE usuarios.id = auth.uid() AND usuarios.role = 'admin'));
    END IF;
END $$;

-- 6. Grant para service role (para operaciones desde API)
GRANT ALL ON public.pedido_pagos TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.pedido_pagos_id_seq TO service_role;
