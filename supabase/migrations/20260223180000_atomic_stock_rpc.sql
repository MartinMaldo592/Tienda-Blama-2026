-- Función para descontar stock de forma atómica para un pedido
CREATE OR REPLACE FUNCTION admin_procesar_descuento_stock(
  p_pedido_id BIGINT,
  p_revertir BOOLEAN DEFAULT false
) RETURNS BOOLEAN AS $$
DECLARE
  v_item RECORD;
BEGIN
  -- Verificar si el pedido ya tiene el stock descontado y si la acción coincide
  -- Evitar doble descuento o doble reversión
  
  -- Para cada item del pedido
  FOR v_item IN 
    SELECT producto_id, producto_variante_id, cantidad 
    FROM pedido_items 
    WHERE pedido_id = p_pedido_id
  LOOP
    IF NOT p_revertir THEN
      -- Descontar stock
      IF v_item.producto_variante_id IS NOT NULL THEN
        UPDATE producto_variantes 
        SET stock = stock - v_item.cantidad
        WHERE id = v_item.producto_variante_id AND stock >= v_item.cantidad;
        
        IF NOT FOUND THEN
          RAISE EXCEPTION 'Stock insuficiente para la variante ID %', v_item.producto_variante_id;
        END IF;
      ELSE
        UPDATE productos 
        SET stock = stock - v_item.cantidad
        WHERE id = v_item.producto_id AND stock >= v_item.cantidad;
        
        IF NOT FOUND THEN
          RAISE EXCEPTION 'Stock insuficiente para el producto ID %', v_item.producto_id;
        END IF;
      END IF;
    ELSE
      -- Revertir descuento (sumar stock)
      IF v_item.producto_variante_id IS NOT NULL THEN
        UPDATE producto_variantes 
        SET stock = stock + v_item.cantidad
        WHERE id = v_item.producto_variante_id;
      ELSE
        UPDATE productos 
        SET stock = stock + v_item.cantidad
        WHERE id = v_item.producto_id;
      END IF;
    END IF;
  END LOOP;

  -- Actualizar estado de stock en el pedido
  UPDATE pedidos 
  SET stock_descontado = NOT p_revertir 
  WHERE id = p_pedido_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
