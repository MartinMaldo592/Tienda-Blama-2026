-- 002_user_module_relations.sql
-- Migración para el módulo de usuarios clientes y vinculación de pedidos/perfil

-- 1. Campos adicionales para perfiles de cliente en tabla usuarios
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS dni text;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS departamento text;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS provincia text;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS distrito text;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS direccion text;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS referencia text;
ALTER TABLE public.usuarios ADD COLUMN IF NOT EXISTS puntos integer DEFAULT 0;

-- 2. Vincular usuario_id (UUID) en clientes y pedidos
ALTER TABLE public.clientes ADD COLUMN IF NOT EXISTS usuario_id uuid REFERENCES public.usuarios(id) ON DELETE SET NULL;
ALTER TABLE public.pedidos ADD COLUMN IF NOT EXISTS usuario_id uuid REFERENCES public.usuarios(id) ON DELETE SET NULL;

-- 3. Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_clientes_usuario_id ON public.clientes(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_usuario_id ON public.pedidos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_email_contacto ON public.pedidos(email_contacto);

-- 4. Función para vincular compras pasadas de invitados al registrarse
CREATE OR REPLACE FUNCTION public.vincular_pedidos_usuario(p_usuario_id uuid, p_email text)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_pedidos_actualizados integer := 0;
BEGIN
  IF p_usuario_id IS NULL OR p_email IS NULL OR trim(p_email) = '' THEN
    RETURN 0;
  END IF;

  -- Vincular pedidos por email
  UPDATE public.pedidos
  SET usuario_id = p_usuario_id
  WHERE lower(email_contacto) = lower(trim(p_email))
    AND usuario_id IS NULL;
    
  GET DIAGNOSTICS v_pedidos_actualizados = ROW_COUNT;

  -- Vincular cliente por email
  UPDATE public.clientes
  SET usuario_id = p_usuario_id
  WHERE lower(email) = lower(trim(p_email))
    AND usuario_id IS NULL;

  RETURN v_pedidos_actualizados;
END;
$$;
