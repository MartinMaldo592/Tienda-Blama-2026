ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS nombre_contacto text,
ADD COLUMN IF NOT EXISTS dni_contacto text,
ADD COLUMN IF NOT EXISTS telefono_contacto text,
ADD COLUMN IF NOT EXISTS departamento text,
ADD COLUMN IF NOT EXISTS provincia text,
ADD COLUMN IF NOT EXISTS distrito text,
ADD COLUMN IF NOT EXISTS direccion_calle text,
ADD COLUMN IF NOT EXISTS referencia_direccion text,
ADD COLUMN IF NOT EXISTS link_ubicacion text;
