-- Migración para agregar soporte de Slugs a Productos
-- Ejecutar en Supabase > SQL Editor

-- 1. Agregar columna slug si no existe
ALTER TABLE public.productos ADD COLUMN IF NOT EXISTS slug text;

-- 2. Asegurar que sea único
ALTER TABLE public.productos ADD CONSTRAINT productos_slug_key UNIQUE (slug);

-- 3. Función auxiliar para limpiar strings (slugify simple)
CREATE OR REPLACE FUNCTION public.slugify(value text)
RETURNS text AS $$
BEGIN
  -- Convertir a minúsculas, reemplazar no-alfanuméricos por guiones, quitar guiones repetidos/extremos
  RETURN trim(both '-' from regexp_replace(lower(unaccent(value)), '[^a-z0-9]+', '-', 'g'));
EXCEPTION
  -- Fallback si unaccent no está instalado
  WHEN undefined_function THEN
    RETURN trim(both '-' from regexp_replace(lower(value), '[^a-z0-9]+', '-', 'g'));
END;
$$ LANGUAGE plpgsql;

-- 4. Generar slugs para productos existentes que no lo tengan
UPDATE public.productos 
SET slug = slugify(nombre) || '-' || id  -- Agregamos ID temporalmente para garantizar unicidad inicial
WHERE slug IS NULL;

-- 5. Crear índice para busquedas rápidas
CREATE INDEX IF NOT EXISTS idx_productos_slug ON public.productos(slug);
