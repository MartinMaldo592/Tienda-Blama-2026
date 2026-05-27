-- ============================================================
-- ACTUALIZACIÓN: Ampliar los métodos de pago aceptados financieramente
-- Objetivo: Añadir "Tarjeta" y "Pasarela Culqi" para evitar que use "Otro"
-- ============================================================

DO $$
BEGIN
    -- 1. Intentamos remover la restricción actual si existe
    ALTER TABLE public.pedido_pagos DROP CONSTRAINT IF EXISTS pedido_pagos_metodo_pago_check;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- 2. Agregamos la nueva regla de métodos de pago ampliada
ALTER TABLE public.pedido_pagos ADD CONSTRAINT pedido_pagos_metodo_pago_check CHECK (
    metodo_pago IN (
        'Efectivo', 
        'Yape', 
        'Plin', 
        'Transferencia BCP', 
        'Transferencia Interbank', 
        'Tarjeta',          -- <-- NUEVO
        'Pasarela Culqi',   -- <-- NUEVO
        'Otro'
    )
);

-- ============================================================
-- Inyectar UUID ZERO si se va a requerir para el sistema
-- ============================================================
-- No es estrictamente necesario ya que la BD lo puede admitir de forma nativa sin crearlo en usuarios, 
-- pero nos aseguramos de que el UUID de Sistema referenciado no rompa llaves foráneas.
-- Revisamos si existe la foreign key de autor_id a public.usuarios en pedido_notas.
-- (Si es así, no podemos inyectar un UUID fantasma. Tendremos que quitar esa obligación en pedido_notas).
--
-- NOTA: Si `pedido_notas.autor_id` no tiene Foreign Key, el webhook funcionará sin problemas.
