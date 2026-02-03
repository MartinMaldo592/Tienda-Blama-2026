-- 1. Modificar columna para que sea un array de texto en lugar de texto simple
-- Si ya existe como text, necesitamos convertirla. Si está vacía es fácil.
-- Si tiene datos, los convertimos a un array de un solo elemento.

DO $$ 
BEGIN 
    -- Verificar si la columna existe y es de tipo text
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pedidos' AND column_name = 'comprobante_pago_url' AND data_type = 'text') THEN
        ALTER TABLE pedidos 
        ALTER COLUMN comprobante_pago_url TYPE text[] USING CASE WHEN comprobante_pago_url IS NULL THEN NULL ELSE ARRAY[comprobante_pago_url] END;
    
    -- Si no existe, crearla directamente como text[]
    ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pedidos' AND column_name = 'comprobante_pago_url') THEN
        ALTER TABLE pedidos 
        ADD COLUMN comprobante_pago_url text[];
    END IF;
END $$;

-- 2. Asegurar bucket (esto es idempotente, no daña nada si ya corriste el anterior)
INSERT INTO storage.buckets (id, name, public)
VALUES ('pagos', 'pagos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas (idempotentes si usas IF NOT EXISTS o las recreas, pero como ya las tienes, no es necesario re-ejecutarlas si no han cambiado, 
-- pero por seguridad dejamos esto comentado o asume que el usuario sabe.
-- Simplemente nos aseguramos que las políticas existan. Si ya corriste el script anterior, esto ya está listo.)
