-- Add logistics fields to pedidos table
ALTER TABLE public.pedidos
ADD COLUMN IF NOT EXISTS agencia_origen text,
ADD COLUMN IF NOT EXISTS agencia_destino text;

-- Add comment for documentation
COMMENT ON COLUMN public.pedidos.agencia_origen IS 'Agencia de despacho (ej: Shalom La Victoria)';
COMMENT ON COLUMN public.pedidos.agencia_destino IS 'Agencia de destino o dirección (ej: Shalom Trujillo Centro)';
