import json
import re
import os

brain_dir = r"C:\Users\Administrador\.gemini\antigravity-ide\brain\4b5d206f-9a4b-4a16-a04b-090f6516bb31"
steps_dir = os.path.join(brain_dir, ".system_generated", "steps")

def extract_json_from_file(step_num):
    file_path = os.path.join(steps_dir, str(step_num), "output.txt")
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract result JSON
    data = json.loads(content)
    result_str = data["result"]
    
    # Extract string inside untrusted-data boundaries
    match = re.search(r"<untrusted-data-[a-f0-9\-]+>\n(.*?)\n</untrusted-data-[a-f0-9\-]+>", result_str, re.DOTALL)
    if match:
        json_str = match.group(1).strip()
        return json.loads(json_str)
    else:
        raise ValueError(f"Could not find untrusted data boundaries in step {step_num}")

# 1. Load Categories (Step 146)
categories = extract_json_from_file(146)

# 2. Load Products (Step 150)
products = extract_json_from_file(150)

# 3. Inline Variants
variants = [
    {"id":628,"producto_id":119,"etiqueta":"COLOR VERDE","talla":None,"color":None,"modelo":None,"precio":"31","precio_antes":"49","stock":100,"activo":True,"created_at":"2026-02-16 18:44:09.458844+00"},
    {"id":629,"producto_id":119,"etiqueta":"COLOR ROSADO","talla":None,"color":None,"modelo":None,"precio":"31","precio_antes":"49","stock":100,"activo":True,"created_at":"2026-02-16 18:44:09.458844+00"},
    {"id":630,"producto_id":119,"etiqueta":"COLOR AMARILLO","talla":None,"color":None,"modelo":None,"precio":"31","precio_antes":"49","stock":100,"activo":True,"created_at":"2026-02-16 18:44:09.458844+00"},
    {"id":631,"producto_id":119,"etiqueta":"COLOR TURQUESA","talla":None,"color":None,"modelo":None,"precio":"31","precio_antes":"49","stock":100,"activo":True,"created_at":"2026-02-16 18:44:09.458844+00"}
]

# 4. Inline Metadata
metadata = {
    "producto_especificaciones": [
        {"id":1380,"producto_id":114,"clave":"Filtro","valor":"Malla ultra fina que retiene hasta las partículas más pequeñas.","orden":0,"created_at":"2026-01-30T08:32:08.659325+00:00"},
        {"id":1381,"producto_id":114,"clave":"Tapa","valor":"Incluye tapa hermética que protege el aceite del polvo e insectos.","orden":1,"created_at":"2026-01-30T08:32:08.659325+00:00"},
        {"id":1382,"producto_id":114,"clave":"Base","valor":"Incluye base de apoyo antideslizante para proteger tus superficies del calor.","orden":2,"created_at":"2026-01-30T08:32:08.659325+00:00"},
        {"id":1383,"producto_id":114,"clave":"Boquilla","valor":"Diseño especial antigoteo para evitar derrames y manchas en la cocina.","orden":3,"created_at":"2026-01-30T08:32:08.659325+00:00"},
        {"id":1434,"producto_id":117,"clave":"Potencia","valor":"350W","orden":0,"created_at":"2026-04-22T23:10:07.749704+00:00"},
        {"id":1435,"producto_id":117,"clave":"Superficie","valor":"Revestimiento antiadherente de alta calidad","orden":1,"created_at":"2026-04-22T23:10:07.749704+00:00"},
        {"id":1436,"producto_id":117,"clave":"Indicador","valor":"Luz LED de encendido/listo","orden":2,"created_at":"2026-04-22T23:10:07.749704+00:00"},
        {"id":1437,"producto_id":117,"clave":"Diámetro de cocción","valor":"105 mm","orden":3,"created_at":"2026-04-22T23:10:07.749704+00:00"},
        {"id":1438,"producto_id":117,"clave":"Dimensiones","valor":"160 mm x 120 mm x 80 mm","orden":4,"created_at":"2026-04-22T23:10:07.749704+00:00"}
    ],
    "almacenes": [
        {"id":1,"nombre":"Almacén Principal","direccion":"Dirección por defecto","activo":True,"created_at":"2026-04-26T01:13:28.379638+00:00"}
    ],
    "social_links": [
        {"id":3,"platform":"instagram","url":"https://www.instagram.com/blamashop/","active":True,"orden":3,"created_at":"2026-01-30T02:37:49.97387+00:00"},
        {"id":2,"platform":"facebook","url":"https://www.facebook.com/profile.php?id=61586913042393#","active":True,"orden":2,"created_at":"2026-01-30T02:37:49.97387+00:00"},
        {"id":1,"platform":"tiktok","url":"https://www.tiktok.com/@blamashop","active":True,"orden":1,"created_at":"2026-01-30T02:37:49.97387+00:00"}
    ],
    "home_banners": [
        {"id":8,"title":"Ofertas rápidas","subtitle":"Aprovecha precios especiales por tiempo limitado.","cta":"Ver ofertas","href":"/productos?sort=price-asc&stock=1","orden":1,"activo":True,"created_at":"2026-01-06T23:05:19.453196+00:00","countdown_end":None}
    ]
}

# 5. Load transaction tables (Step 158)
transactions_raw = extract_json_from_file(158)
transactions = {row["table_name"]: row["data"] for row in transactions_raw}

# Prepare scratch directory
scratch_dir = os.path.join(brain_dir, "scratch")
os.makedirs(scratch_dir, exist_ok=True)

# ----------------- FILE 1: CATEGORIES -----------------
parents = [c for c in categories if c["parent_id"] is None]
children = [c for c in categories if c["parent_id"] is not None]

parents_json = json.dumps(parents, ensure_ascii=False).replace("'", "''")
children_json = json.dumps(children, ensure_ascii=False).replace("'", "''")

f1_sql = f"""-- IMPORT PART 1: CATEGORIES
BEGIN;
ALTER TABLE public.categorias DISABLE TRIGGER audit_categorias;

INSERT INTO public.categorias (id, nombre, slug, created_at, parent_id)
SELECT id, nombre, slug, created_at, parent_id
FROM json_populate_recordset(null::public.categorias, '{parents_json}'::json);

INSERT INTO public.categorias (id, nombre, slug, created_at, parent_id)
SELECT id, nombre, slug, created_at, parent_id
FROM json_populate_recordset(null::public.categorias, '{children_json}'::json);

ALTER TABLE public.categorias ENABLE TRIGGER audit_categorias;
COMMIT;
"""

with open(os.path.join(scratch_dir, "import_1_categories.sql"), "w", encoding="utf-8") as f:
    f.write(f1_sql)

# ----------------- FILE 2: PRODUCTS & META -----------------
products_json = json.dumps(products, ensure_ascii=False).replace("'", "''")
variants_json = json.dumps(variants, ensure_ascii=False).replace("'", "''")

specs = metadata.get("producto_especificaciones")
specs_json = json.dumps(specs, ensure_ascii=False).replace("'", "''") if specs else "[]"

warehouses = metadata.get("almacenes")
warehouses_json = json.dumps(warehouses, ensure_ascii=False).replace("'", "''") if warehouses else "[]"

banners = metadata.get("home_banners")
banners_json = json.dumps(banners, ensure_ascii=False).replace("'", "''") if banners else "[]"

social = metadata.get("social_links")
social_json = json.dumps(social, ensure_ascii=False).replace("'", "''") if social else "[]"

f2_sql = f"""-- IMPORT PART 2: PRODUCTS & METADATA
BEGIN;
ALTER TABLE public.productos DISABLE TRIGGER on_product_created_set_slug;
ALTER TABLE public.productos DISABLE TRIGGER audit_productos;
ALTER TABLE public.home_banners DISABLE TRIGGER audit_home_banners;

INSERT INTO public.productos (id, nombre, precio, stock, imagen_url, categoria_id, created_at, imagenes, precio_antes, descripcion, materiales, tamano, color, cuidados, uso, videos, calificacion, slug)
SELECT id, nombre, precio, stock, imagen_url, categoria_id, created_at, imagenes, precio_antes, descripcion, materiales, tamano, color, cuidados, uso, videos, calificacion, slug
FROM json_populate_recordset(null::public.productos, '{products_json}'::json);

INSERT INTO public.producto_variantes (id, producto_id, etiqueta, talla, color, modelo, precio, precio_antes, stock, activo, created_at)
SELECT id, producto_id, etiqueta, talla, color, modelo, precio, precio_antes, stock, activo, created_at
FROM json_populate_recordset(null::public.producto_variantes, '{variants_json}'::json);

INSERT INTO public.producto_especificaciones (id, producto_id, clave, valor, orden, created_at)
SELECT id, producto_id, clave, valor, orden, created_at
FROM json_populate_recordset(null::public.producto_especificaciones, '{specs_json}'::json);

INSERT INTO public.almacenes (id, nombre, direccion, activo, created_at)
SELECT id, nombre, direccion, activo, created_at
FROM json_populate_recordset(null::public.almacenes, '{warehouses_json}'::json);

INSERT INTO public.home_banners (id, title, subtitle, cta, href, orden, activo, created_at, countdown_end)
SELECT id, title, subtitle, cta, href, orden, activo, created_at, countdown_end
FROM json_populate_recordset(null::public.home_banners, '{banners_json}'::json);

INSERT INTO public.social_links (id, platform, url, active, orden, created_at)
SELECT id, platform, url, active, orden, created_at
FROM json_populate_recordset(null::public.social_links, '{social_json}'::json);

ALTER TABLE public.productos ENABLE TRIGGER on_product_created_set_slug;
ALTER TABLE public.productos ENABLE TRIGGER audit_productos;
ALTER TABLE public.home_banners ENABLE TRIGGER audit_home_banners;
COMMIT;
"""

with open(os.path.join(scratch_dir, "import_2_products.sql"), "w", encoding="utf-8") as f:
    f.write(f2_sql)

# ----------------- FILE 3: TRANSACTIONS & SEQUENCES -----------------
clients = transactions.get("clientes")
clients_json = json.dumps(clients, ensure_ascii=False).replace("'", "''") if clients else "[]"

pedidos = transactions.get("pedidos")
if pedidos:
    for p in pedidos:
        p["asignado_a"] = None
pedidos_json = json.dumps(pedidos, ensure_ascii=False).replace("'", "''") if pedidos else "[]"

items = transactions.get("pedido_items")
items_json = json.dumps(items, ensure_ascii=False).replace("'", "''") if items else "[]"

pagos = transactions.get("pedido_pagos")
if pagos:
    for p in pagos:
        p["registrado_por_id"] = None
pagos_json = json.dumps(pagos, ensure_ascii=False).replace("'", "''") if pagos else "[]"

logs = transactions.get("pedido_logs")
logs_json = json.dumps(logs, ensure_ascii=False).replace("'", "''") if logs else "[]"

f3_sql = f"""-- IMPORT PART 3: TRANSACTIONS & SEQUENCES
BEGIN;
ALTER TABLE public.pedidos DISABLE TRIGGER before_insert_apply_coupon;
ALTER TABLE public.inventario_movimientos DISABLE TRIGGER trigger_sync_stock;

INSERT INTO public.clientes (id, nombre, telefono, direccion, es_problematico, created_at, dni, departamento, provincia, distrito, referencia, link_ubicacion, email, updated_at)
SELECT id, nombre, telefono, direccion, es_problematico, created_at, dni, departamento, provincia, distrito, referencia, link_ubicacion, email, updated_at
FROM json_populate_recordset(null::public.clientes, '{clients_json}'::json);

INSERT INTO public.pedidos (id, cliente_id, total, status, pago_status, voucher_url, created_at, asignado_a, fecha_asignacion, subtotal, descuento, cupon_codigo, stock_descontado, metodo_envio, nombre_contacto, dni_contacto, telefono_contacto, departamento, provincia, distrito, direccion_calle, referencia_direccion, link_ubicacion, guia_archivo_url, comprobante_pago_url, codigo_seguimiento, shalom_orden, shalom_clave, evidencia_entrega_url, shalom_pin, agencia_origen, agencia_destino, culqi_charge_id, email_confirmacion_enviado, email_contacto)
SELECT id, cliente_id, total, status, pago_status, voucher_url, created_at, asignado_a, fecha_asignacion, subtotal, descuento, cupon_codigo, stock_descontado, metodo_envio, nombre_contacto, dni_contacto, telefono_contacto, departamento, provincia, distrito, direccion_calle, referencia_direccion, link_ubicacion, guia_archivo_url, comprobante_pago_url, codigo_seguimiento, shalom_orden, shalom_clave, evidencia_entrega_url, shalom_pin, agencia_origen, agencia_destino, culqi_charge_id, email_confirmacion_enviado, email_contacto
FROM json_populate_recordset(null::public.pedidos, '{pedidos_json}'::json);

INSERT INTO public.pedido_items (id, pedido_id, producto_id, cantidad, producto_variante_id, precio_unitario, producto_nombre, variante_nombre, cantidad_devuelta)
SELECT id, pedido_id, producto_id, cantidad, producto_variante_id, precio_unitario, producto_nombre, variante_nombre, cantidad_devuelta
FROM json_populate_recordset(null::public.pedido_items, '{items_json}'::json);

INSERT INTO public.pedido_pagos (id, pedido_id, monto, metodo_pago, tipo_pago, comprobante_url, nota, registrado_por, created_at, registrado_por_id)
SELECT id, pedido_id, monto, metodo_pago, tipo_pago, comprobante_url, nota, registrado_por, created_at, registrado_por_id
FROM json_populate_recordset(null::public.pedido_pagos, '{pagos_json}'::json);

INSERT INTO public.pedido_logs (id, pedido_id, usuario_nombre, accion, detalles, created_at)
SELECT id, pedido_id, usuario_nombre, accion, detalles, created_at
FROM json_populate_recordset(null::public.pedido_logs, '{logs_json}'::json);

-- Reset all sequences
SELECT setval('public.categorias_id_seq', COALESCE((SELECT MAX(id) FROM public.categorias), 1));
SELECT setval('public.productos_id_seq', COALESCE((SELECT MAX(id) FROM public.productos), 1));
SELECT setval('public.producto_variantes_id_seq', COALESCE((SELECT MAX(id) FROM public.producto_variantes), 1));
SELECT setval('public.producto_especificaciones_id_seq', COALESCE((SELECT MAX(id) FROM public.producto_especificaciones), 1));
SELECT setval('public.clientes_id_seq', COALESCE((SELECT MAX(id) FROM public.clientes), 1));
SELECT setval('public.pedidos_id_seq', COALESCE((SELECT MAX(id) FROM public.pedidos), 1));
SELECT setval('public.pedido_items_id_seq', COALESCE((SELECT MAX(id) FROM public.pedido_items), 1));
SELECT setval('public.pedido_pagos_id_seq', COALESCE((SELECT MAX(id) FROM public.pedido_pagos), 1));
SELECT setval('public.pedido_logs_id_seq', COALESCE((SELECT MAX(id) FROM public.pedido_logs), 1));
SELECT setval('public.home_banners_id_seq', COALESCE((SELECT MAX(id) FROM public.home_banners), 1));
SELECT setval('public.social_links_id_seq', COALESCE((SELECT MAX(id) FROM public.social_links), 1));

ALTER TABLE public.pedidos ENABLE TRIGGER before_insert_apply_coupon;
ALTER TABLE public.inventario_movimientos ENABLE TRIGGER trigger_sync_stock;
COMMIT;
"""

with open(os.path.join(scratch_dir, "import_3_transactions.sql"), "w", encoding="utf-8") as f:
    f.write(f3_sql)

print("Fragmented SQL scripts built successfully!")
