-- Trigger para generar Slugs automáticamente al crear productos
-- Intenta usar el nombre limpio. Si ya existe, le agrega numeros aleatorios el final.

CREATE OR REPLACE FUNCTION public.handle_new_product_slug() 
RETURNS trigger AS $$
DECLARE
  base_slug text;
  new_slug text;
BEGIN
  -- Si ya viene con slug, lo respetamos (solo lo limpiamos)
  IF NEW.slug IS NOT NULL AND NEW.slug <> '' THEN
    NEW.slug := public.slugify(NEW.slug);
  ELSE
    -- Generar slug base del nombre
    base_slug := public.slugify(NEW.nombre);
    new_slug := base_slug;
    
    -- Verificar si existe. Si existe, agregamos sufijo random para evitar error de duplicado
    IF EXISTS (SELECT 1 FROM public.productos WHERE slug = new_slug) THEN
       new_slug := base_slug || '-' || floor(random() * 10000)::text;
    END IF;
    
    NEW.slug := new_slug;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Eliminar trigger anterior si existiera para evitar duplicados
DROP TRIGGER IF EXISTS on_product_created_set_slug ON public.productos;

-- Crear el trigger que se ejecuta ANTES de insertar un nuevo producto
CREATE TRIGGER on_product_created_set_slug
BEFORE INSERT ON public.productos
FOR EACH ROW EXECUTE FUNCTION public.handle_new_product_slug();
