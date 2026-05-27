
-- =============================================
-- SISTEMA DE DELEGACIÓN DE PEDIDOS A TRABAJADORES
-- =============================================

-- 1. Agregar columna para asignar pedidos a trabajadores
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS asignado_a UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Agregar columna para fecha de asignación
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS fecha_asignacion TIMESTAMP WITH TIME ZONE;

-- 3. Agregar nombre completo a profiles para mostrar en UI
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS nombre TEXT;

-- 4. Índice para búsquedas rápidas de pedidos por trabajador
CREATE INDEX IF NOT EXISTS idx_pedidos_asignado ON pedidos(asignado_a);

-- INSTRUCCIONES:
-- 1. Ejecuta este SQL en Supabase SQL Editor
-- 2. Ve a Authentication > Users y crea usuarios para tus trabajadores
-- 3. En la tabla 'profiles', asigna rol='worker' y nombre a cada trabajador
-- 4. Desde el panel admin, podrás asignar pedidos a trabajadores
