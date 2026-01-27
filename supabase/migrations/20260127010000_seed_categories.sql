
-- Clean up existing categories
UPDATE productos SET categoria_id = NULL;
DELETE FROM categorias;

-- Reset sequence if needed (optional, assuming id is serial/generated)
-- ALTER SEQUENCE categorias_id_seq RESTART WITH 1; 

-- Helper function or just direct inserts. We use DO block for variables if needed, or CTEs.
-- Using CTEs for insertions is cleaner.

WITH 
-- PARENT CATEGORIES
parents AS (
    INSERT INTO categorias (nombre, slug, parent_id) VALUES
    ('Antigüedades y artículos de colección', 'antiguedades-coleccion', NULL),
    ('Arte y manualidades', 'arte-manualidades', NULL),
    ('Artículos deportivos', 'articulos-deportivos', NULL),
    ('Casa', 'casa', NULL),
    ('Comida y bebida', 'comida-bebida', NULL),
    ('Contenido multimedia', 'contenido-multimedia', NULL),
    ('Electrónica', 'electronica', NULL),
    ('Instrumentos musicales', 'instrumentos-musicales', NULL),
    ('Joyas y relojes', 'joyas-relojes', NULL),
    ('Juguetes y juegos', 'juguetes-juegos', NULL),
    ('Otro', 'otro', NULL),
    ('Patio y jardín', 'patio-jardin', NULL),
    ('Productos para bebés', 'productos-bebes', NULL),
    ('Productos para mascotas', 'productos-mascotas', NULL),
    ('Remodelaciones', 'remodelaciones', NULL),
    ('Repuestos y accesorios de automóviles', 'repuestos-autos', NULL),
    ('Ropa y accesorios', 'ropa-accesorios', NULL),
    ('Salud y belleza', 'salud-belleza', NULL),
    ('Suministros de oficina', 'suministros-oficina', NULL),
    ('Viajes y equipaje', 'viajes-equipaje', NULL)
    RETURNING id, slug
)
-- SUB CATEGORIES
INSERT INTO categorias (nombre, slug, parent_id) 
SELECT 'Artículos electrónicos coleccionables', 'art-electronicos-coleccion', id FROM parents WHERE slug='antiguedades-coleccion'
UNION ALL SELECT 'Artículos para el hogar coleccionables', 'art-hogar-coleccion', id FROM parents WHERE slug='antiguedades-coleccion'
UNION ALL SELECT 'Electrodomésticos coleccionables', 'electro-coleccion', id FROM parents WHERE slug='antiguedades-coleccion'
UNION ALL SELECT 'Estampillas coleccionables', 'estampillas-coleccion', id FROM parents WHERE slug='antiguedades-coleccion'
UNION ALL SELECT 'Juguetes coleccionables', 'juguetes-coleccion', id FROM parents WHERE slug='antiguedades-coleccion'
UNION ALL SELECT 'Monedas y billetes coleccionables', 'monedas-billetes', id FROM parents WHERE slug='antiguedades-coleccion'
UNION ALL SELECT 'Muebles coleccionables', 'muebles-coleccion', id FROM parents WHERE slug='antiguedades-coleccion'
UNION ALL SELECT 'Recuerdos deportivos coleccionables', 'recuerdos-deportivos', id FROM parents WHERE slug='antiguedades-coleccion'

UNION ALL SELECT 'Artículos de arte', 'articulos-arte', id FROM parents WHERE slug='arte-manualidades'
UNION ALL SELECT 'Costura', 'costura', id FROM parents WHERE slug='arte-manualidades'
UNION ALL SELECT 'Costura e hilado', 'costura-hilado', id FROM parents WHERE slug='arte-manualidades'
UNION ALL SELECT 'Suministros para manualidades', 'suministros-manualidades', id FROM parents WHERE slug='arte-manualidades'
UNION ALL SELECT 'Trabajos en piedra y diseño de joyas', 'piedra-joyas', id FROM parents WHERE slug='arte-manualidades'

UNION ALL SELECT 'Ejercicio y fitness', 'ejercicio-fitness', id FROM parents WHERE slug='articulos-deportivos'
UNION ALL SELECT 'Equipamiento deportivo', 'equipamiento-deportivo', id FROM parents WHERE slug='articulos-deportivos'
UNION ALL SELECT 'Juegos de interior', 'juegos-interior', id FROM parents WHERE slug='articulos-deportivos'
UNION ALL SELECT 'Preparación para emergencias', 'emergencias', id FROM parents WHERE slug='articulos-deportivos'
UNION ALL SELECT 'Recreación al aire libre', 'recreacion-aire-libre', id FROM parents WHERE slug='articulos-deportivos'

UNION ALL SELECT 'Artículos para el hogar', 'articulos-hogar', id FROM parents WHERE slug='casa'
UNION ALL SELECT 'Electrodomésticos grandes', 'electro-grandes', id FROM parents WHERE slug='casa'
UNION ALL SELECT 'Muebles', 'muebles', id FROM parents WHERE slug='casa'
UNION ALL SELECT 'Productos de limpieza', 'productos-limpieza', id FROM parents WHERE slug='casa'
UNION ALL SELECT 'Ropa de cama', 'ropa-cama', id FROM parents WHERE slug='casa'

UNION ALL SELECT 'Bebidas', 'bebidas', id FROM parents WHERE slug='comida-bebida'
UNION ALL SELECT 'Comida', 'comida', id FROM parents WHERE slug='comida-bebida'

UNION ALL SELECT 'Libros', 'libros', id FROM parents WHERE slug='contenido-multimedia'
UNION ALL SELECT 'Música', 'musica', id FROM parents WHERE slug='contenido-multimedia'
UNION ALL SELECT 'Películas y programas TV', 'peliculas-tv', id FROM parents WHERE slug='contenido-multimedia'
UNION ALL SELECT 'Periódicos', 'periodicos', id FROM parents WHERE slug='contenido-multimedia'
UNION ALL SELECT 'Revistas y catálogos', 'revistas-catalogos', id FROM parents WHERE slug='contenido-multimedia'

UNION ALL SELECT 'Accesorios', 'electronica-accesorios', id FROM parents WHERE slug='electronica'
UNION ALL SELECT 'Automatización y seguridad en el hogar', 'domotica', id FROM parents WHERE slug='electronica'
UNION ALL SELECT 'Cámaras', 'camaras', id FROM parents WHERE slug='electronica'
UNION ALL SELECT 'Celulares y relojes inteligentes', 'celulares-smartwatch', id FROM parents WHERE slug='electronica'
UNION ALL SELECT 'Computadoras y tabletas', 'computadoras-tabletas', id FROM parents WHERE slug='electronica'
UNION ALL SELECT 'Consolas de videojuegos y videojuegos', 'videojuegos', id FROM parents WHERE slug='electronica'
UNION ALL SELECT 'Impresoras y escáneres', 'impresoras', id FROM parents WHERE slug='electronica'
UNION ALL SELECT 'Proyectores', 'proyectores', id FROM parents WHERE slug='electronica'
UNION ALL SELECT 'Reproductores de audio y video portátiles', 'audio-video-portatil', id FROM parents WHERE slug='electronica'
UNION ALL SELECT 'Sistemas de audio y video para el hogar', 'audio-video-hogar', id FROM parents WHERE slug='electronica'
UNION ALL SELECT 'Software', 'software', id FROM parents WHERE slug='electronica'
UNION ALL SELECT 'Televisores y monitores', 'tv-monitores', id FROM parents WHERE slug='electronica'

UNION ALL SELECT 'Accesorios para música', 'musica-accesorios', id FROM parents WHERE slug='instrumentos-musicales'
UNION ALL SELECT 'Batería e instrumentos de percusión', 'bateria-percusion', id FROM parents WHERE slug='instrumentos-musicales'
UNION ALL SELECT 'Equipo de audio profesional', 'audio-pro', id FROM parents WHERE slug='instrumentos-musicales'
UNION ALL SELECT 'Guitarras y bajos', 'guitarras-bajos', id FROM parents WHERE slug='instrumentos-musicales'
UNION ALL SELECT 'Instrumentos de cuerda', 'cuerda', id FROM parents WHERE slug='instrumentos-musicales'
UNION ALL SELECT 'Instrumentos de viento madera', 'viento-madera', id FROM parents WHERE slug='instrumentos-musicales'
UNION ALL SELECT 'Instrumentos de viento metal', 'viento-metal', id FROM parents WHERE slug='instrumentos-musicales'
UNION ALL SELECT 'Pianos e instrumentos de teclado', 'pianos-teclados', id FROM parents WHERE slug='instrumentos-musicales'

UNION ALL SELECT 'Joyas', 'joyas', id FROM parents WHERE slug='joyas-relojes'
UNION ALL SELECT 'Relojes', 'relojes', id FROM parents WHERE slug='joyas-relojes'

UNION ALL SELECT 'Animales y juguetes de peluche', 'peluches', id FROM parents WHERE slug='juguetes-juegos'
UNION ALL SELECT 'Figuras de acción', 'figuras-accion', id FROM parents WHERE slug='juguetes-juegos'
UNION ALL SELECT 'Juegos', 'juegos-mesa', id FROM parents WHERE slug='juguetes-juegos'
UNION ALL SELECT 'Juguetes a control remoto', 'control-remoto', id FROM parents WHERE slug='juguetes-juegos'
UNION ALL SELECT 'Juguetes de construcción', 'construccion', id FROM parents WHERE slug='juguetes-juegos'
UNION ALL SELECT 'Juguetes de exterior', 'juguetes-exterior', id FROM parents WHERE slug='juguetes-juegos'
UNION ALL SELECT 'Juguetes de simulación', 'simulacion', id FROM parents WHERE slug='juguetes-juegos'
UNION ALL SELECT 'Juguetes educativos', 'educativos', id FROM parents WHERE slug='juguetes-juegos'
UNION ALL SELECT 'Juguetes electrónicos', 'juguetes-electronicos', id FROM parents WHERE slug='juguetes-juegos'
UNION ALL SELECT 'Juguetes para montar', 'montables', id FROM parents WHERE slug='juguetes-juegos'
UNION ALL SELECT 'Muñecas y casas de muñecas', 'munecas', id FROM parents WHERE slug='juguetes-juegos'
UNION ALL SELECT 'Rompecabezas', 'rompecabezas', id FROM parents WHERE slug='juguetes-juegos'
UNION ALL SELECT 'Vehículos de juguete', 'vehiculos-juguete', id FROM parents WHERE slug='juguetes-juegos'

UNION ALL SELECT 'Accesorios para aves y vida silvestre', 'aves-silvestre', id FROM parents WHERE slug='patio-jardin'
UNION ALL SELECT 'Artículos para jardinería', 'articulos-jardineria', id FROM parents WHERE slug='patio-jardin'
UNION ALL SELECT 'Cercas', 'cercas', id FROM parents WHERE slug='patio-jardin'
UNION ALL SELECT 'Cuidados de plantas, tierra y accesorios', 'plantas-tierra', id FROM parents WHERE slug='patio-jardin'
UNION ALL SELECT 'Decoración de jardines', 'decoracion-jardin', id FROM parents WHERE slug='patio-jardin'
UNION ALL SELECT 'Equipamiento y herramientas de mano para jardín', 'herramientas-jardin', id FROM parents WHERE slug='patio-jardin'
UNION ALL SELECT 'Equipo de riego', 'riego', id FROM parents WHERE slug='patio-jardin'
UNION ALL SELECT 'Equipo eléctrico para exteriores', 'electrico-exterior', id FROM parents WHERE slug='patio-jardin'
UNION ALL SELECT 'Estanques y fuentes ornamentales', 'estanques-fuentes', id FROM parents WHERE slug='patio-jardin'
UNION ALL SELECT 'Estructuras', 'estructuras-jardin', id FROM parents WHERE slug='patio-jardin'
UNION ALL SELECT 'Iluminación para exteriores', 'iluminacion-exterior', id FROM parents WHERE slug='patio-jardin'
UNION ALL SELECT 'Muebles para exteriores', 'muebles-exterior', id FROM parents WHERE slug='patio-jardin'
UNION ALL SELECT 'Parrillas y cocina para exteriores', 'parrillas', id FROM parents WHERE slug='patio-jardin'
UNION ALL SELECT 'Piscinas y spas', 'piscinas', id FROM parents WHERE slug='patio-jardin'
UNION ALL SELECT 'Plantas, semillas y bulbos', 'plantas-semillas', id FROM parents WHERE slug='patio-jardin'

UNION ALL SELECT 'Alimentación del bebé', 'alimentacion-bebe', id FROM parents WHERE slug='productos-bebes'
UNION ALL SELECT 'Artículos para bebés', 'articulos-bebes', id FROM parents WHERE slug='productos-bebes'
UNION ALL SELECT 'Artículos para el cambio de pañales', 'panales', id FROM parents WHERE slug='productos-bebes'
UNION ALL SELECT 'Cuarto de bebé', 'cuarto-bebe', id FROM parents WHERE slug='productos-bebes'
UNION ALL SELECT 'Juguetes', 'juguetes-bebe', id FROM parents WHERE slug='productos-bebes'
UNION ALL SELECT 'Productos de higiene para bebés', 'higiene-bebe', id FROM parents WHERE slug='productos-bebes'
UNION ALL SELECT 'Recuerdos y conjuntos de regalo', 'recuerdos-regalo', id FROM parents WHERE slug='productos-bebes'
UNION ALL SELECT 'Seguridad y salud del bebé', 'seguridad-bebe', id FROM parents WHERE slug='productos-bebes'
UNION ALL SELECT 'Transporte de bebés', 'transporte-bebe', id FROM parents WHERE slug='productos-bebes'

UNION ALL SELECT 'Artículos para animales pequeños', 'animales-pequenos', id FROM parents WHERE slug='productos-mascotas'
UNION ALL SELECT 'Artículos para comida y agua', 'comida-mascotas', id FROM parents WHERE slug='productos-mascotas'
UNION ALL SELECT 'Artículos para peces', 'peces', id FROM parents WHERE slug='productos-mascotas'
UNION ALL SELECT 'Camas y cuchas para mascotas', 'camas-mascotas', id FROM parents WHERE slug='productos-mascotas'
UNION ALL SELECT 'Collares, arneses y correas', 'collares-correas', id FROM parents WHERE slug='productos-mascotas'
UNION ALL SELECT 'Cuidado y salud de las mascotas', 'cuidado-mascotas', id FROM parents WHERE slug='productos-mascotas'
UNION ALL SELECT 'Productos de higiene para mascotas', 'higiene-mascotas', id FROM parents WHERE slug='productos-mascotas'
UNION ALL SELECT 'Productos para gatos', 'gatos', id FROM parents WHERE slug='productos-mascotas'
UNION ALL SELECT 'Productos para pájaros', 'pajaros', id FROM parents WHERE slug='productos-mascotas'
UNION ALL SELECT 'Productos para perros', 'perros', id FROM parents WHERE slug='productos-mascotas'
UNION ALL SELECT 'Productos para reptiles y anfibios', 'reptiles', id FROM parents WHERE slug='productos-mascotas'
UNION ALL SELECT 'Rampas y escalones para mascotas', 'rampas', id FROM parents WHERE slug='productos-mascotas'
UNION ALL SELECT 'Transportadores y contención', 'transportadores', id FROM parents WHERE slug='productos-mascotas'

UNION ALL SELECT 'Climatización del hogar', 'climatizacion', id FROM parents WHERE slug='remodelaciones'
UNION ALL SELECT 'Elementos de plomería', 'plomeria', id FROM parents WHERE slug='remodelaciones'
UNION ALL SELECT 'Herramientas', 'herramientas', id FROM parents WHERE slug='remodelaciones'
UNION ALL SELECT 'Herramientas y suministros de construcción', 'construccion-suministros', id FROM parents WHERE slug='remodelaciones'

UNION ALL SELECT 'Accesorios y piezas para motocicletas', 'motos', id FROM parents WHERE slug='repuestos-autos'
UNION ALL SELECT 'Autopartes y accesorios', 'autopartes', id FROM parents WHERE slug='repuestos-autos'
UNION ALL SELECT 'Herramientas para automóviles', 'herramientas-auto', id FROM parents WHERE slug='repuestos-autos'
UNION ALL SELECT 'Piezas y accesorios de remolques', 'remolques', id FROM parents WHERE slug='repuestos-autos'
UNION ALL SELECT 'Piezas y accesorios de vehículos todoterreno', '4x4', id FROM parents WHERE slug='repuestos-autos'
UNION ALL SELECT 'Piezas y accesorios para barcos', 'barcos', id FROM parents WHERE slug='repuestos-autos'
UNION ALL SELECT 'Piezas y accesorios para casas rodantes', 'casas-rodantes', id FROM parents WHERE slug='repuestos-autos'

UNION ALL SELECT 'Accesorios de vestir', 'accesorios-vestir', id FROM parents WHERE slug='ropa-accesorios'
UNION ALL SELECT 'Disfraces', 'disfraces', id FROM parents WHERE slug='ropa-accesorios'
UNION ALL SELECT 'Ropa', 'ropa', id FROM parents WHERE slug='ropa-accesorios'
UNION ALL SELECT 'Zapato y calzado', 'calzado', id FROM parents WHERE slug='ropa-accesorios'

UNION ALL SELECT 'Belleza', 'belleza', id FROM parents WHERE slug='salud-belleza'
UNION ALL SELECT 'Salud', 'salud', id FROM parents WHERE slug='salud-belleza'

UNION ALL SELECT 'Accesorios de escritura', 'escritura', id FROM parents WHERE slug='suministros-oficina'
UNION ALL SELECT 'Archivado y almacenamiento', 'archivo', id FROM parents WHERE slug='suministros-oficina'
UNION ALL SELECT 'Archivadores y accesorios', 'archivadores', id FROM parents WHERE slug='suministros-oficina'
UNION ALL SELECT 'Calendarios y agendas', 'calendarios', id FROM parents WHERE slug='suministros-oficina'
UNION ALL SELECT 'Cintas y adhesivos', 'cintas', id FROM parents WHERE slug='suministros-oficina'
UNION ALL SELECT 'Engrapadoras y perforadoras', 'engrapadoras', id FROM parents WHERE slug='suministros-oficina'
UNION ALL SELECT 'Etiquetas', 'etiquetas', id FROM parents WHERE slug='suministros-oficina'
UNION ALL SELECT 'Maquinas y equipamiento de oficina', 'maquinas-oficina', id FROM parents WHERE slug='suministros-oficina'
UNION ALL SELECT 'Paneles de presentación y exhibición', 'paneles', id FROM parents WHERE slug='suministros-oficina'
UNION ALL SELECT 'Productos de papel', 'papel', id FROM parents WHERE slug='suministros-oficina'
UNION ALL SELECT 'Proyectores', 'proyectores-oficina', id FROM parents WHERE slug='suministros-oficina'
UNION ALL SELECT 'Sujetapapeles y broches', 'sujetapapeles', id FROM parents WHERE slug='suministros-oficina'
UNION ALL SELECT 'Suministros para el correo', 'correo', id FROM parents WHERE slug='suministros-oficina'

UNION ALL SELECT 'Accesorios para viajes', 'accesorios-viaje', id FROM parents WHERE slug='viajes-equipaje'
UNION ALL SELECT 'Bolsos de lona y para el gimnasio', 'bolsos-gimnasio', id FROM parents WHERE slug='viajes-equipaje'
UNION ALL SELECT 'Carteras y billeteras', 'carteras', id FROM parents WHERE slug='viajes-equipaje'
UNION ALL SELECT 'Fundas para la ropa', 'fundas-ropa', id FROM parents WHERE slug='viajes-equipaje'
UNION ALL SELECT 'Maletas', 'maletas', id FROM parents WHERE slug='viajes-equipaje'
UNION ALL SELECT 'Mochilas', 'mochilas', id FROM parents WHERE slug='viajes-equipaje'
UNION ALL SELECT 'Portafolios y bolsos para laptop', 'portafolios', id FROM parents WHERE slug='viajes-equipaje'
UNION ALL SELECT 'Sets de equipaje', 'sets-equipaje', id FROM parents WHERE slug='viajes-equipaje'
;

