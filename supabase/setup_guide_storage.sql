-- 1. Agregar columna para la URL de la guía en la tabla pedidos
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS guia_archivo_url text;

-- 2. Crear el bucket de almacenamiento 'guias'
-- Nota: Esto inserta el bucket si no existe.
INSERT INTO storage.buckets (id, name, public)
VALUES ('guias', 'guias', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Configurar políticas de seguridad para el bucket 'guias'
-- Permitir acceso público de lectura (opcional, o restringir a autenticados)
CREATE POLICY "Public Access Guias"
ON storage.objects FOR SELECT
USING ( bucket_id = 'guias' );

-- Permitir subir archivos a usuarios autenticados (admin/worker)
CREATE POLICY "Auth Upload Guias"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'guias' );

-- Permitir actualizar/borrar a usuarios autenticados
CREATE POLICY "Auth Update Guias"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'guias' );

CREATE POLICY "Auth Delete Guias"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'guias' );
