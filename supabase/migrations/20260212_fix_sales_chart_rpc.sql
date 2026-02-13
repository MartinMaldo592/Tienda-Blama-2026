-- Función RPC actualizada para obtener datos de ventas graficables
-- AHORA FILTRA CORRECTAMENTE SOLO PEDIDOS 'Entregado'

CREATE OR REPLACE FUNCTION public.get_sales_chart_data(
  p_start_date date,
  p_end_date date,
  p_interval text DEFAULT 'day'
)
RETURNS TABLE (
  period_label text,
  total_sales numeric,
  order_count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  WITH series AS (
    SELECT generate_series(
      p_start_date::timestamp, 
      p_end_date::timestamp, 
      ('1 ' || p_interval)::interval
    )::date as day
  ),
  sales AS (
    -- IMPORTANTE: Aquí está la clave
    -- Solo contamos pedidos con status = 'Entregado'
    -- Y usamos created_at como fecha de referencia (podría cambiarse a updated_at si prefieres fecha de entrega real)
    SELECT 
      date_trunc(p_interval, created_at)::date as sales_day,
      SUM(total) as total,
      COUNT(*) as cnt
    FROM pedidos
    WHERE status = 'Entregado' -- Filtro CRÍTICO
      AND created_at >= p_start_date
      AND created_at < p_end_date + interval '1 day'
    GROUP BY 1
  )
  SELECT 
    to_char(s.day, 'YYYY-MM-DD'),
    COALESCE(sl.total, 0),
    COALESCE(sl.cnt, 0)
  FROM series s
  LEFT JOIN sales sl ON s.day = sl.sales_day
  ORDER BY s.day;
END;
$$;
