-- ACTUALIZACIÓN FINAL DE SLUGS LIMPIOS
-- Ejecutar SOLO UNA VEZ para limpiar URLs viejas

-- 1. Intentar limpiar los slugs existentes quitando el ID
-- (Solo funciona si no hay nombres duplicados, lo cual es lo ideal)

DO $$
DECLARE
    r RECORD;
    clean_slug text;
BEGIN
    FOR r IN SELECT id, nombre FROM public.productos WHERE slug IS NOT NULL LOOP
        -- Generar slug limpio del nombre
        clean_slug := public.slugify(r.nombre);
        
        -- Si este slug limpio NO está usado por otro producto, lo actualizamos.
        -- Si ya está usado, lo dejamos como está (con el ID o lo que tenga) para evitar errores.
        IF NOT EXISTS (SELECT 1 FROM public.productos WHERE slug = clean_slug AND id <> r.id) THEN
            UPDATE public.productos SET slug = clean_slug WHERE id = r.id;
        END IF;
    END LOOP;
END $$;
