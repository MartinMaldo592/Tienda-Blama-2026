-- 1. Agregar columna para rastrear devoluciones parciales
ALTER TABLE pedido_items 
ADD COLUMN IF NOT EXISTS cantidad_devuelta int DEFAULT 0;

-- 2. Función SEGURA para procesar devoluciones parciales
-- Esta función maneja la lógica de negocio en el servidor para evitar errores de frontend
CREATE OR REPLACE FUNCTION admin_procesar_devolucion_parcial(
  p_item_id bigint,
  p_cantidad_a_devolver int,
  p_usuario_nombre text,
  p_pedido_id bigint -- Lo pasamos para el log
) 
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER -- Se ejecuta con permisos de admin
AS $$
DECLARE
  v_producto_id bigint;
  v_cantidad_actual int;
  v_cantidad_ya_devuelta int;
  v_stock_descontado boolean;
BEGIN
  -- A. Obtener datos actuales del item y del pedido
  SELECT 
    pi.producto_id, 
    pi.cantidad, 
    pi.cantidad_devuelta,
    p.stock_descontado
  INTO 
    v_producto_id, 
    v_cantidad_actual, 
    v_cantidad_ya_devuelta,
    v_stock_descontado
  FROM pedido_items pi
  JOIN pedidos p ON p.id = pi.pedido_id
  WHERE pi.id = p_item_id;

  -- B. Validaciones de Seguridad
  IF v_producto_id IS NULL THEN
    RAISE EXCEPTION 'El item no existe';
  END IF;

  IF (v_cantidad_ya_devuelta + p_cantidad_a_devolver) > v_cantidad_actual THEN
    RAISE EXCEPTION 'No puedes devolver más productos de los que se compraron';
  END IF;

  -- C. Actualizar el registro del item
  UPDATE pedido_items
  SET cantidad_devuelta = cantidad_devuelta + p_cantidad_a_devolver
  WHERE id = p_item_id;

  -- D. Devolver Stock (SOLO si el pedido original ya había descontado stock)
  IF v_stock_descontado THEN
    UPDATE productos
    SET stock = stock + p_cantidad_a_devolver
    WHERE id = v_producto_id;
  END IF;

  -- E. Registrar en el Audit Log (Historial)
  INSERT INTO pedido_logs (pedido_id, usuario_nombre, accion, detalles)
  VALUES (
    p_pedido_id, 
    p_usuario_nombre, 
    'Devolución Parcial', 
    'Se devolvieron ' || p_cantidad_a_devolver || ' unidad(es) del producto ID ' || v_producto_id
  );

END;
$$;
