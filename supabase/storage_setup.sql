
-- 1. Crear el Bucket "productos" (Público)
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

-- 2. Eliminar políticas anteriores si existen para evitar conflictos
drop policy if exists "Imagenes Publicas" on storage.objects;
drop policy if exists "Subida Publica" on storage.objects;
drop policy if exists "Actualizar Publica" on storage.objects;
drop policy if exists "Eliminar Publica" on storage.objects;

-- 3. Crear Políticas de Seguridad (RLS)

-- Permitir que CUALQUIERA vea las imágenes (Lectura pública)
create policy "Imagenes Publicas"
  on storage.objects for select
  using ( bucket_id = 'productos' );

-- Permitir subida de imágenes (Para este MVP, permitimos acceso público/anon)
create policy "Subida Publica"
  on storage.objects for insert
  with check ( bucket_id = 'productos' );

-- Permitir actualizar imágenes (opcional)
create policy "Actualizar Publica"
  on storage.objects for update
  using ( bucket_id = 'productos' );

-- Permitir eliminar imágenes
create policy "Eliminar Publica"
  on storage.objects for delete
  using ( bucket_id = 'productos' );
