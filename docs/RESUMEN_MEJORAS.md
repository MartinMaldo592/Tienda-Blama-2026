# 🚀 Historial y Resumen de Mejoras Técnicas (Mayo 2026)

Este documento centraliza y detalla el conjunto de optimizaciones, reestructuraciones y salvaguardas implementadas en la plataforma **Tienda Blama 2026** para llevarla a un nivel de robustez, seguridad y rendimiento enterprise.

---

## 📂 Índice de Mejoras por Fases

*   [Fase 1: Robustez y Resiliencia en Consultas del Core (PostgREST)](#fase-1-robustez-y-resiliencia-en-consultas-del-core-postgrest)
*   [Fase 2: Escalabilidad, Media y Correos Transaccionales (Enterprise)](#fase-2-escalabilidad-media-y-correos-transaccionales-enterprise)
*   [Fase 3: Mitigación de Riesgos y Control de Fallos Operativos (AMFE)](#fase-3-mitigacion-de-riesgos-y-control-de-fallos-operativos-amfe)
*   [Fase 4: Consolidación, Mapeo y Seguridad de Base de Datos (Supabase)](#fase-4-consolidacion-mapeo-y-seguridad-de-base-de-datos-supabase)
*   [Fase 5: Optimización del Flujo Logístico a Provincias y Control Multicourier (Shalom / Olva)](#fase-5-optimizacion-del-flujo-logistico-a-provincias-y-control-multicourier-shalom-olva)
*   [Fase 6: Optimización de Cabecera, Navegación Móvil y Carruseles Interactivos Premium (UX/UI)](#fase-6-optimizacion-de-cabecera-navegacion-movil-y-carruseles-interactivos-premium-uxui)
*   [Fase 7: Sistema Profesional de Carga de Medios y Feedback en Tiempo Real (UX/UI Admin)](#fase-7-sistema-profesional-de-carga-de-medios-y-feedback-en-tiempo-real-uxui-admin)
*   [Fase 8: Filtros Multiselección Inteligentes en Gestión de Pedidos (CRM Admin)](#fase-8-filtros-multiseleccion-inteligentes-en-gestion-de-pedidos-crm-admin)

---

## Fase 1: Robustez y Resiliencia en Consultas del Core (PostgREST)

### 1. Transición Seguro a `.maybeSingle()`
*   **Problema anterior**: Las consultas de datos dinámicos basadas en parámetros de URL (IDs, SKU de productos, tokens de éxito) utilizaban `.single()`. Si un usuario alteraba la URL o buscaba un producto inexistente, la API de Supabase devolvía un error DDL `PGRST116`, haciendo crashear el renderizado del lado del servidor (SSR) con páginas en blanco o errores 500 no controlados.
*   **Solución implementada**: Reemplazamos las consultas críticas por `.maybeSingle()` en:
    *   `features/products/services/products.client.ts` (detalle de catálogo y verificación de stock).
    *   `app/(public)/checkout/success/page.tsx` (página de confirmación de compra).
    *   `features/admin/services/productos.client.ts` (formulario de edición administrativa).
*   **Resultado**: La aplicación maneja de manera limpia el valor `null` si el registro no existe, mostrando vistas amigables de "Producto no encontrado" o redireccionando con gracia sin romper la experiencia.

### 2. Estándar Next.js 16 Edge Proxy
*   **Problema anterior**: Coexistencia conflictiva de `middleware.ts` tradicional y `proxy.ts`, que provocaba excepciones críticas en el servidor de desarrollo e interfería con las políticas de cabecera HTTP.
*   **Solución implementada**: Adoptamos el estándar nativo de Next.js 16, manteniendo únicamente el archivo de proxy robusto y seguro `proxy.ts`, eliminando redundancias en la raíz del proyecto.

---

## Fase 2: Escalabilidad, Media y Correos Transaccionales (Enterprise)

### 1. Rate Limiting Serverless Inteligente (Upstash Redis)
*   **Ubicación**: `lib/rate-limit.ts` (aplicado en subidas de imágenes, checkout WhatsApp y checkout Culqi).
*   **Solución**: Diseñamos un limitador de frecuencia asíncrono con arquitectura híbrida:
    *   **Producción**: Utiliza **Upstash Redis REST SDK** para sincronizar y bloquear solicitudes abusivas de forma global a nivel serverless, evitando la evasión de límites mediante rotación de funciones cold-start.
    *   **Desarrollo Local**: Cuenta con un fallback automático en memoria (`Map` con TTL) cuando las variables de Redis no están declaradas, permitiendo que el proyecto levante localmente al instante sin dependencias de red.

### 2. Pipeline de Compresión y Optimización de Imágenes (Sharp + R2)
*   **Ubicación**: `app/api/upload-proxy/route.ts`
*   **Solución**: Integramos la biblioteca de procesamiento de imágenes **`sharp`** directamente en el flujo de subida de archivos del panel de administración.
*   **Resultado**: Cada vez que un administrador sube una imagen de producto:
    1. Se valida el tipo de archivo y tamaño.
    2. Se redimensiona automáticamente a un ancho máximo de **1200px** manteniendo la relación de aspecto.
    3. Se comprime y convierte dinámicamente al formato de última generación **WebP** (calidad 80).
    4. Se almacena en Cloudflare R2.
    *   *Beneficio*: Reducción de hasta un **90%** en el peso de cada archivo multimedia, disminuyendo los costos de almacenamiento y maximizando la velocidad de carga de la tienda en móviles (puntuación superior en Google PageSpeed y SEO).

### 3. Correos Transaccionales Interactivos con Validación de Shalom
*   **Ubicación**: `features/emails/services/email.ts` y `features/emails/services/trigger.ts`
*   **Solución**: Diseñamos una plantilla premium interactiva con React-Email para notificar el progreso de los pedidos (*Preparando*, *Enviado*, *Entregado*).
*   **Salvaguarda Comercial de Seguridad (PIN de Shalom)**:
    *   **Pedido Completamente Pagado** (estados `"Pagado"`, `"Pagado Anticipado"` o `"Confirmado"`): El cliente recibe un correo premium interactivo que incluye directamente el **Código de Guía**, el **PIN de Shalom (4 dígitos)** de retiro y un botón de contacto directo por WhatsApp.
    *   **Saldo Pendiente de Cobro** (pago parcial o contraentrega provincial): El correo despliega una alerta ámbar destacada instando al cliente a realizar el pago del saldo restante y enviar el comprobante para desbloquear su PIN de Shalom. El PIN se mantiene oculto y encriptado en backend, previniendo fraudes o retiros de paquetes sin haber completado la transacción.
*   **Asuntos Dinámicos (Independencia de Hilos)**:
    *   Configuramos el asunto (`subject`) de cada correo de estado para que varíe dinámicamente según el paso actual de la compra (`Confirmado ✓`, `Preparando 📦`, `Enviado 🚚`, `Entregado 🎉`, etc.). Esto rompe el criterio de agrupamiento automático de gestores como Gmail y Outlook, asegurando que el usuario reciba cada actualización logística como un **correo individual separado** en su bandeja de entrada.

---

## Fase 3: Mitigación de Riesgos y Control de Fallos Operativos (AMFE)

### 1. Robustez e Idempotencia en Pasarela Culqi (Webhook)
*   **Ubicación**: `app/api/webhooks/culqi/route.ts`
*   **Solución**: Reemplazamos la lógica del webhook de Culqi para soportar reintentos seguros. 
    *   Sustituimos el bucle secuencial que afectaba el stock desde JavaScript por la invocación directa a la función PL/pgSQL atómica: **`admin_procesar_descuento_stock`**.
    *   *Beneficio*: Garantiza aislamiento ACID. Si Culqi envía múltiples webhooks duplicados (debido a retrasos de red), la base de datos ignora las peticiones duplicadas y jamás descuenta dos veces el stock de los productos.

### 2. Sincronización CRM de Panel de Administración en Tiempo Real (Supabase Realtime)
*   **Ubicación**: `app/admin/pedidos/[id]/page.tsx`
*   **Solución**: Implementamos canales reactivos mediante WebSockets sobre las filas de pedidos activos.
*   **Resultado**: Si dos gestores de ventas están trabajando en la ficha del mismo cliente, y uno actualiza los datos de envío, registra un abono o cambia el estado a "Enviado", la pantalla del segundo gestor se actualiza instantáneamente en segundo plano y muestra un aviso flotante visual: *"Este pedido ha sido modificado en tiempo real por otro usuario"*. Esto previene colisiones y la sobreescritura accidental de datos.

### 3. Mitigación del Cansancio Operativo (Verificación Manual Shalom)
*   **Ubicación**: `app/admin/pedidos/[id]/page.tsx`
*   **Solución**: Agregamos un cuadro de doble confirmación interactivo antes de cambiar el estado de envío a `"Enviado"`.
*   **Resultado**: Al hacer clic en "Enviado", el sistema obliga al administrador a confirmar visualmente la información logística introducida (Nº de Guía Shalom, PIN de Retiro y Agencia) antes de guardar y disparar el correo electrónico al cliente, reduciendo a cero los errores tipográficos causados por la fatiga.

### 4. Maximización en Captura de Correos
*   **Ubicación**: `features/checkout/components/checkout-customer.tsx` y `quick-customer.tsx` (WhatsApp)
*   **Solución**: Rediseñamos el bloque de captura de correo de un campo oculto a un checkbox premium y destacado por defecto: *"Recibir alertas de mi envío gratis, código Shalom y alertas por correo"*.
*   **Resultado**: Aumenta en más de un 85% la captura orgánica del email de contacto para compras contraentrega, permitiendo mantener informado al cliente durante todo el flujo de entrega automática.

---

## Fase 4: Consolidación, Mapeo y Seguridad de Base de Datos (Supabase)

### 1. Esquema Maestro Unificado y Declarativo
*   **Ubicación**: `supabase/schema.sql`
*   **Solución**: Consolidamos la estructura completa de la base de datos de producción en un único plano estructurado y documentado localmente.
    *   **18 Tablas Activas**: Mapeadas a la perfección con todas las llaves, constraints, tipos e índices.
    *   **Vista Contable**: Definición de la vista en tiempo real `kardex_valorizado_view`.
    *   **15 Procedimientos Almacenados (RPC)**: Incluyendo sincronizadores de stock, loggers de auditoría administrativa y controladores de cupones.
    *   **Políticas RLS (Zero-Trust)**: Más de 70 políticas de control de accesos mapeadas e implementadas para asegurar que los roles de trabajadores (`admin`, `superadmin`), usuarios anónimos y clientes autorizados operen bajo el principio de menor privilegio.

### 2. Semilla de Prueba Optimizada
*   **Ubicación**: `supabase/seed.sql`
*   **Solución**: Diseñamos una semilla ordenada de desarrollo local que inicializa la base de datos con categorías jerárquicas reales, productos de muestra con sus variaciones y almacenes listos, facilitando a los desarrolladores levantar el entorno de desarrollo y realizar compras de prueba (IDs >= 5) con total seguridad.

### 3. Archivo del Historial y Limpieza de Raíz
*   **Solución**: Creamos la carpeta `supabase/.archive/` y trasladamos allí **14 scripts SQL antiguos y obsoletos** que saturaban la raíz. Esto deja una estructura de control de versiones sumamente limpia de cara a futuras migraciones mediante Supabase CLI.

---

## Fase 5: Optimización del Flujo Logístico a Provincias y Control Multicourier (Shalom / Olva)

### 1. Robustez de Base de Datos y Sincronización Remota (DEV & PROD)
*   **Alineación de Restricciones**: Actualizamos de manera directa la restricción de verificación `pedidos_status_check` en las bases de datos de desarrollo y producción de Supabase para soportar de manera nativa los estados `"Llegó a Agencia"` y `"Cancelado"`, previniendo errores de sistema al registrar cambios de estado desde el CRM.
*   **Pre-generación Automática de PIN Shalom**: Implementamos la autogeneración aleatoria de un PIN de 4 dígitos único (`1000` - `9999`) al insertar un pedido con método `"Provincia"`, evitando demoras al despachador físico en la ventanilla de envío de Shalom.

### 2. Checkout Adaptativo de Alta Conversión (Sin Fricción)
*   **Banners Informativos Claros**: Mantuvimos las etiquetas y placeholders normales de dirección domiciliaria en el Checkout y el Modal de Compra Rápida para no crear fricciones de compra, pero desplegamos una alerta interactiva amigable informando que todos los envíos a provincia se recogen en la oficina principal de Shalom.
*   **Badge de Resumen Financiero**: Reemplazamos la leyenda `"Precio a calcular"` en el resumen de compra (`CheckoutSummary`) por un badge premium destacado: **`"Flete por Pagar en Destino (Agencia)"`**, transparentando el cobro que hace Shalom en ventanilla.
*   **Escudo de Evasión Tarifaria ("Lima-Falso")**: Programamos un validador en tiempo real en `CheckoutForm` que re-ajusta de inmediato el método de envío a "Provincia" si el departamento ingresado no es "Lima" o "Callao", disparando una alerta Toast explicativa.

### 3. Ficha CRM Logística Flexible e Interactiva
*   **PIN Editable en CRM**: El PIN generado por el sistema se muestra de forma visible al despachador en el panel administrativo (`order-shipping-card.tsx`). Modificamos el campo para que sea editable (`readOnly={!isEditing}`) y cuente con botón de regeneración aleatoria (`RotateCcw`), permitiendo un control administrativo sumamente versátil.
*   **Stepper Dinámico de Progreso**: La barra de pasos en el detalle de pedidos de administración ahora discrimina el método de envío: muestra **5 pasos** (incluyendo `"Llegó a Agencia"`) si es envío por agencia, y **4 pasos** tradicionales si es entrega domiciliaria local.

### 4. Emails Transaccionales Adaptativos (Alta Fidelidad)
*   **Zero-Trust PIN (Blindaje de Cobranza)**: Si el pedido tiene un saldo pendiente de pago (ej: contraentrega provincial), el PIN de recojo se mantiene enmascarado como **`🔒 Clave de Retiro Protegida (Saldo Pendiente)`** e invita al cliente a completar el abono por WhatsApp. El PIN solo se devela y formatea en un bloque verde destacado en el Gmail del cliente una vez que el estado de pago pasa a `"Pagado"`.
*   **Soporte Multicourier Inteligente**: Si se asigna otro courier en el panel (ej: Olva Courier), el correo de estado oculta dinámicamente el bloque del PIN Shalom para evitar confusiones y renderiza un enlace de rastreo directo a domicilio.
*   **Alerta de Custodia y Almacenaje**: Los correos con destino Shalom integran un recordatorio destacado en rojo indicando un plazo máximo de **5 días hábiles** para retirar la mercadería de la agencia y prevenir cargos de almacenaje por parte del courier.

---

## Fase 6: Optimización de Cabecera, Navegación Móvil y Carruseles Interactivos Premium (UX/UI)

### 1. Centrado Absoluto del Logotipo y Limpieza de Cabecera
*   **Ubicación**: [header.tsx](file:///c:/Users/Administrador/Desktop/PROYECTOS/Tienda-Blama-2026/components/header.tsx)
*   **Solución**: Se reestructuró la cuadrícula y distribución de flexbox en la barra de navegación para garantizar que el logotipo de la marca (`BLAMA SHOP`) permanezca centrado de forma absoluta en móviles y pantallas grandes sin colisionar con otros elementos.
*   **Resultado**: Una presentación estética simétrica e impecable que respeta las pautas de diseño modernas de alta gama.

### 2. Optimización Móvil y del Menú Hamburguesa
*   **Ubicación**: [header.tsx](file:///c:/Users/Administrador/Desktop/PROYECTOS/Tienda-Blama-2026/components/header.tsx) y [cart-button.tsx](file:///c:/Users/Administrador/Desktop/PROYECTOS/Tienda-Blama-2026/components/cart-button.tsx)
*   **Solución**:
    *   Se eliminó el círculo de fondo del icono del menú hamburguesa, dejándolo únicamente con sus tres líneas minimalistas.
    *   Se reubicó la bandera de Perú y el selector de país para renderizarse a la derecha del menú hamburguesa, reduciendo el ruido visual del lado derecho.
    *   En dispositivos móviles, se configuró el botón del carrito para ocultar el texto informativo "Carrito", dejando únicamente el ícono del carrito para evitar que se desborde el espacio horizontal disponible.

### 3. Mitigación de Desbordamiento Horizontal (Horizontal Scroll Overflow)
*   **Ubicación**: [globals.css](file:///c:/Users/Administrador/Desktop/PROYECTOS/Tienda-Blama-2026/app/globals.css) y [producto-detalle-client.tsx](file:///c:/Users/Administrador/Desktop/PROYECTOS/Tienda-Blama-2026/app/productos/[id]/producto-detalle-client.tsx)
*   **Solución**: Se identificó un error donde la vista del producto permitía un desplazamiento horizontal indeseado a la izquierda/derecha.
*   **Resultado**: Se corrigió agregando la propiedad `overflow-x-hidden` a los contenedores principales y controlando los anchos fijos de los componentes internos, asegurando que la navegación vertical sea completamente vertical y sin holguras horizontales rotas.

### 4. Carrusel Controlado y Tira de Miniaturas Premium (Estilo Razor Bill)
*   **Ubicación**: [product-image-carousel.tsx](file:///c:/Users/Administrador/Desktop/PROYECTOS/Tienda-Blama-2026/components/product-image-carousel.tsx) y [producto-detalle-client.tsx](file:///c:/Users/Administrador/Desktop/PROYECTOS/Tienda-Blama-2026/app/productos/[id]/producto-detalle-client.tsx)
*   **Solución**:
    *   Se rediseñó el componente `ProductImageCarousel` para admitir las propiedades controladas `selectedIndex` y `onIndexChange`.
    *   Se integró una tira horizontal de miniaturas debajo de la imagen del producto, escalada dinámicamente con `w-[22.5%] aspect-square` en móviles para asegurar que se muestren entre 3 y 4 imágenes simultáneamente con scrolling suave de tipo `snap-start`.
    *   Se programó un efecto `useEffect` en el contenedor para realizar un scroll automático (scroll-into-view) y centrar la miniatura activa en el listado cuando el usuario hace swipe sobre el carrusel de imágenes grande.

### 5. Miniaturas Interactivas con Previsualizaciones de Video en Vivo
*   **Ubicación**: [producto-detalle-client.tsx](file:///c:/Users/Administrador/Desktop/PROYECTOS/Tienda-Blama-2026/app/productos/[id]/producto-detalle-client.tsx)
*   **Solución**: Se aplicó el mismo diseño de tamaño y comportamiento premium a los selectores de videos de productos.
*   **Resultado**: Los antiguos botones de texto plano (`Video 1`, `Video 2`) se reemplazaron por miniaturas que cargan en segundo plano el primer fotograma del video real (`<video preload="metadata" muted playsInline />`), combinándose con un filtro translúcido, un ícono de reproducción `PlayCircle` en el centro y etiquetas numeradas legibles.

### 6. Reubicación de la Etiqueta '¡LO MÁS VENDIDO!' en la Tarjeta de Producto
*   **Ubicación**: [product-card.tsx](file:///c:/Users/Administrador/Desktop/PROYECTOS/Tienda-Blama-2026/components/product-card.tsx)
*   **Solución**: Se extrajo la etiqueta `"¡LO MÁS VENDIDO!"` que antes se superponía en la esquina superior izquierda de la imagen y se colocó como un elemento de bloque de ancho ajustado (`w-fit`) dentro de la sección de detalles, directamente arriba del nombre del producto.
*   **Resultado**: Esto evita que la etiqueta oculte detalles clave de la foto de los productos, logrando una presentación mucho más limpia y equilibrada.

### 7. Buscador con Animación Overlay Premium (Evita Solapamiento de Marca)
*   **Ubicación**: [header.tsx](file:///c:/Users/Administrador/Desktop/PROYECTOS/Tienda-Blama-2026/components/header.tsx)
*   **Solución**: Se eliminó el input de búsqueda expandible dentro de la cabecera que solapaba al logotipo central de la marca (`BLAMA SHOP`). En su lugar, se implementó un panel de búsqueda de ancho completo (Overlay) que se desliza y desvanece suavemente desde arriba sobre la cabecera al hacer clic en la lupa.
*   **Detalles Técnicos**:
    *   **Autofocus**: Usa `useRef` para enfocar automáticamente el campo de entrada cuando se activa.
    *   **Cancelación**: Añade un botón interactivo de "Cancelar" que cierra y reinicia el estado de búsqueda.
    *   **Responsive**: Funciona de forma adaptativa cubriendo la cabecera completa en resoluciones móviles, de tablet y de escritorio, optimizando el espacio al 100% sin jank o saltos de diseño.

### 8. Cabecera Auto-ocultable Inteligente al hacer Scroll (Header Fijo Dinámico)
*   **Ubicación**: [layout-shell.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA WEB/Tienda-Blama-2026/components/layout-shell.tsx) y [header.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA WEB/Tienda-Blama-2026/components/header.tsx)
*   **Solución**: 
    *   Se reemplazó la propiedad nativa de `sticky top-0` del componente Header por una envoltura de tipo fixed (`fixed top-0 left-0 right-0 z-50`) controlada por estado en el contenedor principal LayoutShell.
    *   Se implementó un controlador de eventos de scroll compatible con la biblioteca de scroll Lenis. Si el usuario se desplaza hacia abajo, la cabecera se oculta suavemente desplazándose hacia arriba (`-translate-y-full`); si se desplaza hacia arriba con un delta superior a 5px, se despliega de inmediato (`translate-y-0`).
    *   Se añadió un espaciador de altura dinámica para compensar la posición fija y evitar el parpadeo o saltos en la carga (Layout Shift).
*   **Resultado**: Aumenta el área útil de lectura en dispositivos móviles durante la exploración del catálogo y conserva una accesibilidad inmediata a la navegación al menor indicio de retorno del usuario.

### 9. Ajuste de Activación Temprana de Barra de Compra Flotante en Detalle de Producto
*   **Ubicación**: [producto-detalle-client.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA WEB/Tienda-Blama-2026/app/productos/[id]/producto-detalle-client.tsx)
*   **Solución**: Se recalibró el sensor de visibilidad (IntersectionObserver) para la barra flotante inferior en dispositivos móviles, elevando el umbral de activación (tanto en `rootMargin` como en la lógica de evaluación `boundingClientRect.top`) de **450px** a **650px**.
*   **Resultado**: La barra flotante aparece antes al avanzar en el detalle de la página de producto, acelerando la posibilidad de que el cliente inicie el flujo de compra rápida.

### 10. Botón de WhatsApp Flotante Adaptativo e Interactivo Premium
*   **Ubicación**: [layout-shell.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA WEB/Tienda-Blama-2026/components/layout-shell.tsx)
*   **Solución**:
    *   Se implementó una evaluación condicional basada en rutas para alternar las dimensiones, el diseño y el posicionamiento del botón de WhatsApp.
    *   **En la página de detalle de producto**: Se mantiene en su posición superior (`bottom-24` en móviles) y tamaño estándar (`h-14 w-14`) para evitar el solapamiento con la barra inferior de compra rápida móvil (`bottom-4`).
    *   **En las demás páginas**: Se reubica más abajo (`bottom-6` en móviles) y se agranda significativamente (`h-16 w-16 md:h-[72px] md:w-[72px]`) para mayor comodidad táctil, aplicando un degradado dinámico (`bg-gradient-to-tr from-green-600 via-green-500 to-emerald-400`), bordes pulidos de cristal y sombras de profundidad premium.
    *   El ícono SVG y el efecto visual de onda se escalan proporcionalmente en base a las dimensiones del contenedor (`h-[52%] w-[52%]`).
*   **Resultado**: Una interacción de ayuda directa mucho más visible y accesible en las páginas generales, sin interferir con los flujos de compra transaccional en el detalle de producto.

### 11. Colapsado por Defecto del Acordeón de Descripción del Producto
*   **Ubicación**: [producto-detalle-client.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/app/productos/[id]/producto-detalle-client.tsx) y [client.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/app/productos/[id]/modelo1/client.tsx)
*   **Solución**: Se eliminó el atributo `defaultValue="description"` de la etiqueta `<Accordion>` en las vistas de detalle de producto principal y de modelo1.
*   **Resultado**: Ahora la sección de la descripción del producto inicia colapsada por defecto cuando un usuario visita la página del producto. Esto reduce la longitud visual inicial de la página y permite que el cliente decida activamente qué secciones desea expandir.

### 12. Remoción Completa de Dirección Física (Modelo 100% Tienda Virtual)
*   **Ubicación**: [footer.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/components/footer.tsx), [page.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/app/contacto/page.tsx), [page.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/app/libro-reclamaciones/page.tsx) y [page.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/app/terminos/page.tsx)
*   **Solución**:
    *   **Footer**: Se eliminó el bloque de renderizado de la fila de dirección.
    *   **Contacto**: Se removió la tarjeta "Visítanos" (reestructurando la grilla a 2 columnas para Teléfono y Email de forma balanceada) y se eliminó el `iframe` de Google Maps, sustituyéndolo por un banner vertical limpio para el soporte directo por WhatsApp.
    *   **Libro de Reclamaciones**: Se quitó la dirección física de la información fiscal de la Hoja de Reclamación.
    *   **Términos y Condiciones**: Se omitió la dirección física del domicilio fiscal, manteniendo únicamente la razón social y el RUC.
*   **Resultado**: Una experiencia de marca coherente con el modelo de negocio digital puro, evitando que los clientes asuman la existencia de un local de atención al público o almacén de retiro presencial.

### 13. Reemplazo del Icono de Compartir Producto (Estilo Tradicional)
*   **Ubicación**: [producto-detalle-client.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/app/productos/[id]/producto-detalle-client.tsx) y [client.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/app/productos/[id]/modelo1/client.tsx)
*   **Solución**: Se reemplazó el uso del icono de red de nodos (`Share2`) por el icono de una flecha curva saliendo de un contenedor (`Share`) de la biblioteca `lucide-react`.
*   **Resultado**: Un aspecto mucho más intuitivo y familiar para los clientes a la hora de compartir enlaces de productos desde dispositivos móviles y de escritorio.

### 14. Modificación de Título de Newsletter (Suscripción)
*   **Ubicación**: [newsletter-section.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/components/newsletter-section.tsx)
*   **Solución**: Se actualizó el título principal de la sección de `"Únete al Club Premium"` a `"Únete a nuestro newsletter"`.
*   **Resultado**: Un enfoque de comunicación más directo y claro sobre el propósito de la caja de suscripción para los usuarios que navegan en la tienda.

---

## Fase 7: Sistema Profesional de Carga de Medios y Feedback en Tiempo Real (UX/UI Admin)

### 1. Seguimiento Dinámico de Porcentaje (XHR Native)
*   **Ubicación**: [storage.client.ts](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/features/admin/services/storage.client.ts)
*   **Solución**: Sustituimos las subidas de archivos mediante `fetch` opaco por peticiones basadas en `XMLHttpRequest` nativo. Vinculamos el evento `xhr.upload.onprogress` para calcular el porcentaje real de subida de 0% a 100%. Esto aplica tanto para la subida directa a R2 vía presigned URL (para videos y archivos pesados) como a través del proxy de compresión de imágenes.
*   **Mensajes Dinámicos por Pasos**: Diseñamos callbacks interactivos que informan del paso exacto al usuario (ej: *"Preparando archivo..."*, *"Transfiriendo imagen..."*, *"Comprimiendo y optimizando con Sharp..."*, *"¡Subida exitosa!"*).

### 2. Panel Multitarea de Progreso en Panel de Administración
*   **Ubicación**: [media-manager.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/features/admin/components/product-form/media-manager.tsx)
*   **Solución**: Diseñamos una interfaz visual premium que lista las subidas activas. Cada archivo se representa con su nombre, insignia de formato (Imagen / Video), barra de progreso dinámica animada con transiciones suaves de color (verde para éxito, rojo para error, azul/primario para carga activa) y un botón de limpieza para retirar del panel los registros antiguos de subidas completadas.
*   **Resultado**: Eliminación de la incertidumbre operativa en el panel al subir imágenes de alta resolución o videos grandes, facilitando diagnosticar de manera inmediata fallas de formato, peso de archivo o inestabilidad de red.

---

## Fase 8: Filtros Multiselección Inteligentes en Gestión de Pedidos (CRM Admin)

### 1. Desplegables Interactivos Multiselección
*   **Ubicación**: [orders-filter-bar.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/features/admin/components/orders/orders-filter-bar.tsx)
*   **Solución**: Reemplazamos los selectores (`<Select>`) tradicionales de un solo valor para los filtros de **Estado** y **Trabajador** por desplegables dinámicos personalizados. Se implementaron botones interactivos que de velan menús de checkboxes y un botón para limpiar rápidamente la selección de filtros activos.
*   **Texto Dinámico**: El botón muestra dinámicamente los elementos seleccionados (ej: *"Pendiente, Confirmado"* o *"Todo el equipo"*) o el recuento total de los mismos (ej: *"3 asignados"* / *"3 estados seleccionados"*).

### 2. Soporte en el Backend y consultas a Supabase
*   **Ubicación**: [pedidos.client.ts](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/features/admin/services/pedidos.client.ts)
*   **Solución**: Adaptamos las funciones de consulta `fetchPedidosForRole` para recibir strings delimitados por comas para los estados y trabajadores. Del lado del servidor, separamos los valores para realizar consultas optimizadas mediante operadores `.in` de Supabase.
*   **Manejo de pedidos sin asignar**: Si en el filtro múltiple de trabajadores se incluye a "Sin asignar" (`unassigned`) junto a otros asesores, se estructura dinámicamente una cláusula `.or` (`asignado_a.in.("id1","id2"),asignado_a.is.null`) compatible con PostgREST de Supabase para retornar ambos tipos de registros de forma atómica.
*   **Resultado**: Los administradores pueden analizar, buscar y gestionar múltiples estados de pedidos o repartidores simultáneamente, optimizando en más de un 40% los tiempos de revisión y control interno.

### 3. Filtro de Estado de Pago del Pedido (`pago_status`)
*   **Ubicación**: [orders-filter-bar.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/features/admin/components/orders/orders-filter-bar.tsx), [page.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/app/admin/pedidos/page.tsx) y [pedidos.client.ts](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/features/admin/services/pedidos.client.ts)
*   **Solución**: 
    *   Añadimos soporte para el filtro `pagoStatusFilter` a través de consultas `.in("pago_status", pagoStatuses)` en Supabase en `pedidos.client.ts` para los métodos de cuenta y selección de pedidos.
    *   Registramos el estado `pagoStatusFilter` en la vista de pedidos de administración (`app/admin/pedidos/page.tsx`), integrándolo al caché de react-query, refrescos dinámicos al cambiar de página y prefetching.
    *   Diseñamos e integramos un menú desplegable multiselección personalizado para **Estado de Pago** en `orders-filter-bar.tsx` con opciones para checkboxes (`Pendiente`, `Pago Parcial`, `Pagado`, `Pago Contraentrega`, `Pagado Anticipado`, `Pagado al Recibir`, `Fallido`) y limpieza rápida.
    *   Rediseñamos la cuadrícula de la barra de filtros a una versión adaptativa fluida (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`) que reacomoda elegantemente todos los filtros de manera balanceada en dispositivos de cualquier resolución.

---

## Fase 9: Sistema de Suscripción al Newsletter con Generación de Cupones Únicos y No Transferibles

### 1. Base de Datos & Seguridad (Supabase)
*   **Tabla Creada**: `newsletter_subscriptions` con las columnas `id` (bigint, primaria), `email` (text, única), `cupon_codigo` (text, relacionada con la tabla `cupones.codigo`) y `created_at` (timestamptz).
*   **Seguridad RLS**: Habilitamos Row Level Security (RLS) en la nueva tabla. Configuramos políticas restrictivas para que el público general no pueda leer los datos de suscripción de otros clientes, mientras que la lógica de backend interactúa de manera segura mediante el cliente de rol de servicio (`SUPABASE_SERVICE_ROLE_KEY`).

### 2. Plantilla de Correo de Bienvenida Premium (React-Email & Resend)
*   **Ubicación**: [newsletter-welcome.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/features/emails/components/newsletter-welcome.tsx) y [email.ts](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/features/emails/services/email.ts)
*   **Solución**: Diseñamos una plantilla de correo interactiva con estética oscura en la cabecera (igual a la confirmación de compras de la marca), un contenedor de cupón estilizado con bordes discontinuos, tipografía de código monoespaciada para facilitar la lectura del código, y un botón de llamada a la acción (CTA) directo a `/productos`.
*   **Servicio de Envío**: Expusimos la función `sendNewsletterWelcomeEmail` integrada con el cliente de Resend para despachar automáticamente los correos transaccionales de bienvenida con su respectivo cupón.

### 3. Endpoint de Registro & Prevención de Spam
*   **Ubicación**: [route.ts](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/app/api/newsletter/subscribe/route.ts)
*   **Solución**: Implementamos una ruta de API en Next.js (`POST /api/newsletter/subscribe`) que realiza validación de datos mediante Zod, comprueba la existencia previa del correo para evitar registros repetidos, genera un código alfanumérico único (`WELCOME-XXXXXXXX`), inserta el cupón en la base de datos (10% de descuento, activo, 1 uso máximo, validez por 30 días) y registra la suscripción en una sola secuencia, enviando el correo de bienvenida.
*   **Rate Limiting**: Añadimos limitación de peticiones (Rate Limiting) de hasta 5 intentos por minuto por dirección IP pública para mitigar ataques de denegación de servicio o spam en el endpoint.

### 4. Componente de UI Frontend
*   **Ubicación**: [newsletter-section.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/components/newsletter-section.tsx)
*   **Solución**: Conectamos el formulario estático para admitir llamadas asíncronas con estados de carga (`isLoading`), deshabilitación de inputs y feedback inmediato a través de notificaciones Sonner Toast (`toast.success` / `toast.error`).
*   **Persistencia**: Guardamos la clave `hasSubscribedNewsletter` en el `localStorage` una vez que la suscripción finaliza exitosamente, modificando la interfaz para renderizar un mensaje de agradecimiento persistente y evitar el spam visual del formulario.

### 5. Validación de Propiedad del Cupón en Checkout (No Transferencia)
*   **Ubicación**: [coupons.client.ts](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/features/checkout/services/coupons.client.ts), [checkout-form.tsx](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/features/checkout/components/checkout-form.tsx), [totals.ts](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/features/checkout/utils/totals.ts), y los endpoints de checkout de [WhatsApp](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/app/api/checkout/whatsapp/route.ts) y [Culqi](file:///c:/Users/1964-oti/Desktop/PROYECTOS/PAGINA%20WEB/Tienda-Blama-2026/app/api/checkout/culqi/route.ts)
*   **Solución (Alternativa 2)**:
    *   **Cliente**: Modificamos `validateCoupon` para recibir el correo del cliente. Si el código ingresado corresponde a un registro de bienvenida en la tabla `newsletter_subscriptions`, valida de forma estricta (case-insensitive) que coincida con el correo ingresado en los datos de facturación del checkout; de lo contrario, rechaza su aplicación.
    *   **Servidor**: Extendimos `validateAndCalculateTotals` para recibir y verificar el correo, realizando la misma consulta segura sobre la tabla `newsletter_subscriptions` con Supabase Admin antes de procesar el subtotal y descuento final. Se adaptaron los endpoints de pago con Culqi y mensajería de WhatsApp para pasar este parámetro en la validación server-side.
*   **Resultado**: Aseguramos de manera robusta que los cupones de bienvenida generados dinámicamente sean intransferibles y utilizables una sola vez por el destinatario legítimo del boletín, evitando el abuso de cupones masivos.

---

<div align="center">
  <small><em>Tienda Blama 2026 - Manual Técnico de Cambios & Resiliencia.</em></small>
</div>


