# Guía de Desarrollo y Manual Operativo para Agentes de IA

Esta guía contiene los estándares técnicos, flujos de datos y la arquitectura operativa de **Tienda Blama 2026**. Ha sido diseñada especialmente para que desarrolladores humanos y **agentes de Inteligencia Artificial (IA)** puedan comprender el sistema rápidamente y realizar cambios con total seguridad y estabilidad.

---

## 🚀 1. Instalación y Configuración Local

1.  **Clonar y configurar dependencias:**
    ```bash
    npm install
    ```
2.  **Variables de Entorno:**
    Crea un archivo `.env.local` en la raíz del proyecto. Las claves críticas de Supabase, Cloudflare R2, Culqi y Google Tag Manager se detallan en [docs/INTEGRATIONS.md](./INTEGRATIONS.md).
3.  **Iniciar Servidor de Desarrollo:**
    ```bash
    npm run dev
    ```

---

## 🛠️ 2. Tecnologías Clave e Integraciones Recientes

### A. Píxeles de Marketing y Google Tag Manager (GTM)
*   **Estrategia de Carga:** Google Tag Manager (GTM) se carga utilizando la estrategia estándar `strategy="lazyOnload"` en el hilo principal del navegador.
*   **Nota de Arquitectura (Partytown):** Se evaluó el uso de `@builder.io/partytown` para derivar la ejecución de los píxeles a Web Workers. Sin embargo, se descartó y revirtió debido a que las extensiones de depuración de navegadores (como *Meta Pixel Helper* y *TikTok Pixel Helper*) no pueden auditar ni detectar los píxeles que corren dentro del sandbox del Web Worker (marcando falsos negativos de "Píxel no detectado"), y ciertos scripts de rastreo fallan al requerir acceso directo al DOM de la ventana principal. Por estabilidad y fiabilidad de atribución en campañas publicitarias, GTM debe permanecer en el hilo principal.

### B. Almacenamiento y CDN de Imágenes (Cloudflare R2 + Cloudinary Fetch)
*   **Almacenamiento (Origen):** Las imágenes originales se almacenan en **Cloudflare R2** y se sincronizan bajo el dominio `https://assets.blama.shop`.
*   **Entrega y Optimización (Cloudinary Fetch):** Para el cliente final, las imágenes se sirven a través del CDN de Cloudinary utilizando la tecnología de *Fetch* (sin necesidad de subir imágenes directamente a Cloudinary). La URL final se compone así:
    `https://res.cloudinary.com/<cloud_name>/image/fetch/f_auto,q_auto,w_<width>/https://assets.blama.shop/<file>`
*   **Next.js Loader:** El helper central [lib/cloudinary.ts](./lib/cloudinary.ts) provee el `cloudinaryLoader` que intercepta las peticiones de los componentes `<Image>` públicos para automatizar:
    *   **f_auto:** Conversión automática a formatos modernos súper ligeros (AVIF o WebP) según el soporte del navegador del usuario.
    *   **q_auto:** Compresión inteligente que reduce el peso visual en un 40-70% sin pérdidas perceptibles.
    *   **w_width:** Redimensionamiento exacto basado en el viewport del dispositivo (móvil, tablet, desktop).
*   **Sin compresión en la subida:** Para conservar los archivos originales con la máxima calidad, se ha desactivado la conversión automática a WebP tanto en el navegador (cliente) como en el servidor. Las imágenes se almacenan en su formato (JPG, PNG, WebP) y tamaño original en Cloudflare R2, y es **Cloudinary Fetch** el que se encarga de la optimización, compresión y redimensionamiento dinámico en la entrega.
*   **Experiencia de Carga (UX):** Los carruseles e imágenes muestran skeletons/shimmers animados durante la descarga y cuentan con refs de carga completada (`img.complete` en un callback ref) que resuelven problemas de visibilidad en imágenes cacheadas por navegadores internos.

### C. Navegación en Webviews e In-App Browsers (TikTok/Instagram/Facebook)
*   **Enrutamiento SPA:** La navegación en el catálogo principal utiliza el componente de Next.js `<Link>` con enrutamiento del lado del cliente (`history.pushState`). 
*   **Prevención de Advertencias de Seguridad:** No uses etiquetas nativas `<a>` para redirecciones internas en páginas públicas, ya que los sandboxes estrictos (especialmente el navegador interno de **TikTok**) detectan la recarga de página a nivel de navegador e interrumpen la navegación mostrando alertas de seguridad ("abre este enlace en el navegador").
*   **Estabilidad en Transiciones:** Cualquier error de congelamiento de pantalla durante el enrutamiento se previene mediante la protección y sanitización en los callbacks `ref` de las imágenes (evitando bucles infinitos de actualización de estado).

### D. Estrategia de Caché del Servidor (Next.js unstable_cache)
*   *Importante:* En [products.server.ts](./features/products/services/products.server.ts), las funciones de obtención de datos del producto (`fetchProductForMeta` y `getProductDetailServer`) utilizan claves de caché dinámicas compuestas:
    ```typescript
    [`product-detail-server-${identifier}`]
    ```
    **Nunca uses una clave estática** (como `['product-detail-server']`), ya que causará colisiones en el catálogo (devolviendo el primer producto para todas las páginas) cuando la tienda registre múltiples productos.

### D. Carga de Videos en Panel Admin
*   El componente [media-manager.tsx](./features/admin/components/product-form/media-manager.tsx) renderiza reproductores HTML5 (`<video controls preload="metadata" />`) para que el administrador pueda validar y visualizar el material en vivo directamente en el CRM antes de guardar el producto.

---

## 📐 3. Convenciones de Código y Estructura FSD

1.  **Componentes del Servidor por Defecto:**
    Los componentes son Server Components por defecto en Next.js App Router. Solo declara `"use client"` si usas hooks de interactividad o listeners de eventos del navegador.
2.  **Tanstack React Query:**
    Las peticiones interactivas del cliente (dashboard, listados dinámicos) deben encapsularse usando React Query para un manejo de estado y caché uniforme.
3.  **Feature-Sliced Design (FSD) Adaptado:**
    La lógica de negocio está segregada en carpetas bajo la raíz `/features`. Si una funcionalidad es exclusiva de un módulo (ej. Checkout, Carrito, Administración), debe crearse en su respectivo subdirectorio `/features/{modulo}`.

---

## 🤖 4. Manual de Operación para Agentes de IA (Instrucciones Estrictas)

Si eres una IA trabajando en este repositorio, **debes seguir estas reglas de seguridad:**

1.  **Verificación de Tipos Obligatoria:**
    Antes de confirmar cualquier cambio al usuario o solicitar un merge de ramas, **SIEMPRE** ejecuta en la terminal el comando:
    ```bash
    npx tsc --noEmit
    ```
    Si el comando falla, corrige todos los errores de tipado antes de dar tu respuesta final.
2.  **No Commitear Variables Locales:**
    El archivo `.env.local` está listado en `.gitignore` por seguridad. Si editas este archivo para pruebas del usuario, **no lo fuerces en git**. En su lugar, recuérdale explícitamente al usuario que debe ir al panel web de **Vercel** para actualizar el valor correspondiente en producción.
3.  **Git Workflow de Integración:**
    Trabaja siempre en la rama local `develop`. Cuando termines una tarea y la verifiques exitosamente, sube los cambios a `develop`, cámbiate a `main`, mezcla `develop`, sube `main` a GitHub y regresa tu workspace local a la rama `develop`.
    *   *Comandos:*
        ```bash
        git add .
        git commit -m "tipo(alcance): descripcion"
        git push origin develop
        git checkout main
        git merge develop
        git push origin main
        git checkout develop
        ```
