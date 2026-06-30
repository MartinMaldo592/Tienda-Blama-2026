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

### A. Píxeles de Marketing en Web Workers (Partytown)
*   **Implementación:** Google Tag Manager (GTM) y sus píxeles asociados (Meta Pixel, TikTok Pixel, Google Analytics) están configurados para correr en un hilo secundario utilizando `@builder.io/partytown`.
*   **next.config.ts:** Habilitado con la bandera `experimental: { nextScriptWorkers: true }`.
*   **app/layout.tsx:** GTM se carga con `strategy="worker"` y la cabecera incluye el componente `<Partytown forward={["dataLayer.push"]} />` para el correcto reenvío de eventos.
*   *Nota para IA:* Si TypeScript arroja un error `TS7016` al importar de `@builder.io/partytown/react`, agrega siempre la directiva `// @ts-ignore` encima del import para suprimir la validación de tipado de esta librería externa.

### B. Almacenamiento y CDN de Imágenes (Cloudflare R2)
*   **Servidor CDN:** Las imágenes se sirven en producción bajo el dominio personalizado de marca: `https://assets.blama.shop`.
*   **Pre-conexión:** [layout.tsx](./app/layout.tsx) incluye `<link rel="preconnect" href="https://assets.blama.shop" crossOrigin="anonymous" />` para agilizar la resolución DNS en redes móviles.
*   **Compresión en el Cliente:** Antes de subir cualquier imagen en el panel administrativo, [storage.client.ts](./features/admin/services/storage.client.ts) realiza una pre-compresión mediante un Canvas HTML5 a formato **WebP (82% de calidad)** y redimensiona a un máximo de `1200px` de ancho, previniendo fallos de memoria en el servidor.
*   **Experiencia de Carga (UX):** Los carruseles e imágenes de la tienda muestran skeletons/shimmers animados durante la descarga y cuentan con una directiva `onError` que carga un fallback limpio si el enlace del proveedor falla.

### C. Estrategia de Caché del Servidor (Next.js unstable_cache)
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
