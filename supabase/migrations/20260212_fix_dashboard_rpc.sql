-- Función para eliminar la versión anterior de la RPC (TABLE return)
-- Y crear la versión nueva (JSON return)

BEGIN;

-- 1. Eliminar la función anterior si existe
-- Es importante especificar la firma exacta para que Postgres sepa cuál borrar
DROP FUNCTION IF EXISTS public.get_admin_dashboard_stats(uuid);

-- 2. Crear la nueva función optimizada que devuelve JSON
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_stats(p_user_id uuid DEFAULT NULL)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result json;
BEGIN
  SELECT json_build_object(
    'totalVentasReales', COALESCE((SELECT SUM(total) FROM pedidos WHERE status = 'Entregado'), 0),
    'ventasHoy', COALESCE((SELECT SUM(total) FROM pedidos WHERE status = 'Entregado' AND created_at >= CURRENT_DATE), 0),
    'pedidosPendientes', (SELECT COUNT(*) FROM pedidos WHERE status = 'Pendiente'),
    'pedidosEnProceso', (SELECT COUNT(*) FROM pedidos WHERE status IN ('Confirmado', 'Enviado', 'Preparando')),
    'pedidosEntregados', (SELECT COUNT(*) FROM pedidos WHERE status = 'Entregado'),
    'pedidosAsignados', (SELECT COUNT(*) FROM pedidos WHERE asignado_a = p_user_id AND status NOT IN ('Fallido', 'Devuelto', 'Entregado')),
    'totalClientes', (SELECT COUNT(*) FROM clientes),
    'productosLowStock', (SELECT COUNT(*) FROM productos WHERE stock < 5)
  ) INTO v_result;
  
  RETURN v_result;
END;
$$;

COMMIT;
