-- Add email fields to customers and orders
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE pedidos ADD COLUMN IF NOT EXISTS email_contacto text;
