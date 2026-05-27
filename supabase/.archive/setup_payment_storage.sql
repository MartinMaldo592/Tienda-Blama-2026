-- 1. Agregar columna para la URL del comprobante de pago
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS comprobante_pago_url text;

-- 2. Crear el bucket de almacenamiento 'pagos'
INSERT INTO storage.buckets (id, name, public)
VALUES ('pagos', 'pagos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Configurar políticas de seguridad para el bucket 'pagos'
CREATE POLICY "Public Access Pagos"
ON storage.objects FOR SELECT
USING ( bucket_id = 'pagos' );

CREATE POLICY "Auth Upload Pagos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'pagos' );

CREATE POLICY "Auth Update Pagos"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'pagos' );

CREATE POLICY "Auth Delete Pagos"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'pagos' );
