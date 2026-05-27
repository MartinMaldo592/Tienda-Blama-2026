-- Add metodo_envio column to pedidos table
ALTER TABLE public.pedidos 
ADD COLUMN IF NOT EXISTS metodo_envio text;
