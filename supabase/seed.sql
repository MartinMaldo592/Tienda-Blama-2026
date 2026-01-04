
-- Insertar Categorias
insert into categorias (nombre, slug) values
('Electrónica', 'electronica'),
('Ropa', 'ropa'),
('Hogar', 'hogar');

-- Insertar Productos de Ejemplo
insert into productos (nombre, precio, stock, imagen_url, categoria_id) values
('Auriculares Bluetooth Pro', 120.00, 50, null, 1),
('Smartwatch Series 5', 250.00, 30, null, 1),
('Camiseta Dry-Fit', 35.50, 100, null, 2),
('Zapatillas Urbanas', 85.00, 25, null, 2),
('Lámpara de Escritorio LED', 45.00, 40, null, 3),
('Botella Térmica 1L', 20.00, 60, null, 3);
