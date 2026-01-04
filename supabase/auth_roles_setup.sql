
-- 1. Crear tabla de Perfiles (Profiles) vinculada a auth.users
-- Esta tabla guardará el rol de cada usuario (admin o worker)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  role text default 'worker' check (role in ('admin', 'worker')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Habilitar Seguridad (RLS)
alter table public.profiles enable row level security;

-- Permitir lectura pública de perfiles (necesario para verificar rol al hacer login)
create policy "Ver perfiles" on public.profiles
  for select using (true);

-- Permitir que usuarios actualicen su propio perfil
create policy "Editar propio perfil" on public.profiles
  for update using (auth.uid() = id);

-- 3. Trigger para crear perfil automáticamente al crear usuario
-- Cada vez que crees un usuario en Supabase Auth, se creará una entrada aquí con rol 'worker' por defecto
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'worker');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- INSTRUCCIONES POSTERIORES:
-- 1. Ve a Supabase -> Authentication -> Users.
-- 2. Crea un usuario (ej: admin@tienda.com).
-- 3. Ve al Table Editor -> tabla 'profiles'.
-- 4. Cambia manualmente el rol de ese usuario a 'admin'.

