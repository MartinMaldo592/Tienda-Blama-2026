-- Agregar columna para el código de seguimiento (Tracking)
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS codigo_seguimiento text;
