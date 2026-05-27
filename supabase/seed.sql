-- =====================================================================
-- 🛡️ Tienda Blama 2026 - Datos de Semilla de Inicialización (seed.sql)
-- =====================================================================
-- Este archivo contiene la semilla de datos iniciales necesarios para
-- poblar localmente las categorías del catálogo y algunos productos demo.
-- =====================================================================

-- 1. Insertar Categorías Principales Demo
INSERT INTO public.categorias (id, nombre, slug, parent_id) VALUES
(1, 'Hogar & Cocina', 'hogar-y-cocina', NULL),
(2, 'Tecnología & Gadgets', 'tecnologia-y-gadgets', NULL),
(3, 'Moda & Accesorios', 'moda-y-accesorios', NULL)
ON CONFLICT (id) DO NOTHING;

-- 2. Insertar Subcategorías Demo
INSERT INTO public.categorias (id, nombre, slug, parent_id) VALUES
(4, 'Utensilios de Cocina', 'utensilios-de-cocina', 1),
(5, 'Iluminación Decorativa', 'iluminacion-decorativa', 1),
(6, 'Auriculares & Audio', 'auriculares-y-audio', 2),
(7, 'Relojes Inteligentes', 'relojes-inteligentes', 2)
ON CONFLICT (id) DO NOTHING;

-- 3. Insertar Productos de Ejemplo
INSERT INTO public.productos (id, nombre, precio, precio_antes, stock, imagen_url, categoria_id, descripcion, materiales, tamano, color, calificacion, slug) VALUES
(1, 'Olla Multifuncional Premium con Filtro', 159.90, 220.00, 45, NULL, 4, 'Olla multifuncional de alta gama con filtro de acero inoxidable integrado.', 'Acero Inoxidable y Teflón', 'Mediana - 3 Litros', 'Plateado', 4.8, 'olla-multifuncional-premium'),
(2, 'Mini Wafflera Eléctrica de Alta Potencia', 79.90, 110.00, 30, NULL, 4, 'Prepara deliciosos waffles en minutos con esta mini wafflera antiadherente.', 'Aluminio y Plástico ABS', 'Compacta', 'Rojo', 4.7, 'mini-wafflera-electrica'),
(3, 'Auriculares Pro Cancelación Activa de Ruido', 249.90, 350.00, 15, NULL, 6, 'Auriculares inalámbricos de alta fidelidad con cancelación de ruido de 40dB.', 'Policarbonato y Almohadillas de Cuero', 'Estándar', 'Negro', 4.9, 'auriculares-pro-cancelacion-ruido')
ON CONFLICT (id) DO NOTHING;

-- 4. Insertar Variantes Demo
INSERT INTO public.producto_variantes (id, producto_id, etiqueta, talla, color, modelo, precio, precio_antes, stock, activo) VALUES
(1, 3, 'Color Negro Mate', NULL, 'Negro', 'Pro Edition', 249.90, 350.00, 10, true),
(2, 3, 'Color Blanco Glaciar', NULL, 'Blanco', 'Pro Edition', 249.90, 350.00, 5, true)
ON CONFLICT (id) DO NOTHING;

-- 5. Insertar Especificaciones Técnicas Demo
INSERT INTO public.producto_especificaciones (id, producto_id, clave, valor, orden) VALUES
(1, 1, 'Capacidad', '3 Litros', 0),
(2, 1, 'Material', 'Acero Inoxidable AISI 304', 1),
(3, 2, 'Potencia', '350 Watts', 0),
(4, 3, 'Batería', 'Hasta 30 horas con ANC', 0),
(5, 3, 'Conectividad', 'Bluetooth 5.3', 1)
ON CONFLICT (id) DO NOTHING;

-- 6. Insertar Almacén por Defecto
INSERT INTO public.almacenes (id, nombre, direccion, activo) VALUES
(1, 'Almacén Principal Lima', 'Av. Aviación 1450, La Victoria, Lima', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Insertar Movimientos de Kardex Iniciales
INSERT INTO public.inventario_movimientos (producto_id, variante_id, almacen_id, tipo_movimiento, cantidad, costo_unitario, referencia, notas) VALUES
(1, NULL, 1, 'AJUSTE_INICIAL', 45, 95.00, 'KARDEX-INIT', 'Carga inicial del producto 1'),
(2, NULL, 1, 'AJUSTE_INICIAL', 30, 45.00, 'KARDEX-INIT', 'Carga inicial del producto 2'),
(3, 1, 1, 'AJUSTE_INICIAL', 10, 120.00, 'KARDEX-INIT', 'Carga inicial de variante 1'),
(3, 2, 1, 'AJUSTE_INICIAL', 5, 120.00, 'KARDEX-INIT', 'Carga inicial de variante 2')
ON CONFLICT DO NOTHING;

-- 8. Insertar Banners de Inicio Demo
INSERT INTO public.home_banners (id, title, subtitle, cta, href, orden, activo) VALUES
(1, 'Gran Liquidación de Temporada', 'Hasta 40% de descuento en utensilios premium', 'Comprar Ahora', '/productos', 0, true)
ON CONFLICT (id) DO NOTHING;

-- 9. Enlaces Sociales por Defecto
INSERT INTO public.social_links (id, platform, url, active, orden) VALUES
(1, 'Facebook', 'https://facebook.com/tiendablama', true, 0),
(2, 'Instagram', 'https://instagram.com/tiendablama', true, 1),
(3, 'WhatsApp', 'https://wa.me/51958279604', true, 2)
ON CONFLICT (id) DO NOTHING;
