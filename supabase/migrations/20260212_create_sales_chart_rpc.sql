-- Función RPC para obtener datos de ventas graficables
-- Permite agrupar por día o por mes para vistas semanales/mensuales/anuales

CREATE OR REPLACE FUNCTION public.get_admin_sales_chart_data(
  p_start_date date,
  p_end_date date,
  p_interval text DEFAULT 'day' -- 'day' or 'month'
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
  -- Validación básica de intervalo
  IF p_interval NOT IN ('day', 'month') THEN
    RAISE EXCEPTION 'Invalid interval: %. Must be "day" or "month"', p_interval;
  END IF;

  RETURN QUERY
  WITH date_series AS (
    -- Generar serie de fechas para asegurar que no haya huecos (días con 0 ventas)
    SELECT generate_series(
      date_trunc(p_interval, p_start_date),
      date_trunc(p_interval, p_end_date),
      ('1 ' || p_interval)::interval
    )::date as series_date
  ),
  sales_data AS (
    -- Agrupar ventas reales
    SELECT 
      date_trunc(p_interval, created_at)::date as sales_date,
      SUM(total) as total,
      COUNT(*) as count
    FROM pedidos
    WHERE 
      status = 'Entregado' 
      AND created_at >= p_start_date 
      AND created_at <= (p_end_date + interval '1 day') -- Incluir todo el último día
    GROUP BY 1
  )
  SELECT
    -- Formatear fecha para el frontend (ISO string es lo más seguro)
    to_char(ds.series_date, 'YYYY-MM-DD') as period_label,
    COALESCE(sd.total, 0) as total_sales,
    COALESCE(sd.count, 0) as order_count
  FROM date_series ds
  LEFT JOIN sales_data sd ON ds.series_date = sd.sales_date
  ORDER BY ds.series_date ASC;
END;
$$;
