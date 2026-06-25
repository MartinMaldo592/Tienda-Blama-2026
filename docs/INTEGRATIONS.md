# 🔌 Guía de Integraciones y Configuración (.env)

El proyecto depende de ciertas APIs externas para funcionar. Todas las credenciales deben ubicarse en un archivo llamado `.env.local` en la raíz del proyecto.

## 1. Variables de Entorno

Plantilla a copiar en tu `.env.local`:

```env
# ── Base de Datos & Autenticación (Supabase) ──
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key  # Solo server-side (admin)

# ── Pasarela de Pagos (Culqi) ──
CULQI_PUBLIC_KEY=pk_live_...
CULQI_SECRET_KEY=sk_live_...

# ── Correos Transaccionales (Resend) ──
RESEND_API_KEY=re_...  # También se usa como contraseña SMTP en Supabase

# ── Servicios de Mapa (Autocompletado Checkout) ──
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_google_maps

# ── Contacto y Notificaciones ──
# Ingresar los números sin el signo "+"
NEXT_PUBLIC_WHATSAPP_TIENDA=51982432561
NEXT_PUBLIC_WHATSAPP_ADMIN=51982432561
```

---

## 2. Correos de Autenticación — Resend SMTP + Supabase

### Arquitectura

Los correos de autenticación (confirmación, recuperación de contraseña, magic link, invitaciones) se envían a través de **Resend** como servidor SMTP personalizado conectado a **Supabase Auth**. No se requiere código personalizado — Supabase maneja todo el flujo.

```
Usuario solicita reset → Supabase Auth (GoTrue)
                               ↓
                     SMTP → smtp.resend.com:465
                               ↓
                     Correo llega con branding Blama
```

### Configuración SMTP en Supabase Dashboard

| Campo | Valor |
|---|---|
| **Sender email** | `no-reply@blama.shop` |
| **Sender name** | `Tienda Blama` |
| **Host** | `smtp.resend.com` |
| **Port** | `465` |
| **Username** | `resend` |
| **Password** | Tu `RESEND_API_KEY` |

> **Ubicación:** Supabase Dashboard → Project Settings → Authentication → SMTP Settings

### Plantillas de Email

Las plantillas HTML están en `/email-templates/` del proyecto y se copian al panel de Supabase (Auth → Email Templates):

| Archivo | Tipo en Supabase | Tema de Color | Propósito |
|---|---|---|---|
| `recovery.html` | Reset Password | ⬛ Negro/Ámbar | Restablecimiento de contraseña |
| `confirmation.html` | Confirm signup | 🟢 Verde | Confirmación de nuevo registro |
| `magic-link.html` | Magic Link | 🔵 Azul | Login sin contraseña |
| `invite.html` | Invite user | 🟣 Púrpura | Invitación de administradores |

### Requisitos DNS (Resend)

Para que los correos no caigan en SPAM, tu dominio `blama.shop` debe tener estos registros verificados en Resend:

- **SPF** — Autoriza a Resend a enviar correos en nombre de tu dominio.
- **DKIM** — Firma criptográfica que prueba que el correo no fue alterado.
- **DMARC** — Política que indica qué hacer con correos no autenticados.

> Verificar en: [Resend Dashboard → Domains](https://resend.com/domains)

---

## 3. Activación de Google Maps API

Tu llave `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` requiere 3 servicios activos en la Consola de Google Cloud:

1. **Maps JavaScript API:** Necesario para renderizar componentes basados en mapas y el script base.
2. **Places API:** Usado en el formulario de Checkout para el autocompletado inteligente de calles.
3. **Geocoding API:** Usado internamente para convertir las direcciones de texto en coordenadas precisas y evitar fallos logísticos de ubicación.

**¿Cómo habilitarlas?**
- Entra a [Google Cloud Console](https://console.cloud.google.com).
- Ve a *APIs y Servicios* > *Credenciales*.
- Haz clic en tu llave API y en "Restricciones de API" marca estrictamente esas 3 APIs de la lista para evitar que hackers abusen de tu cuota de consultas.

---

## 4. Pasarela de Pagos — Culqi

El proyecto utiliza **Culqi** para procesar pagos con tarjeta de crédito/débito en Perú.

- **Frontend:** `CULQI_PUBLIC_KEY` se usa para tokenizar los datos de la tarjeta.
- **Backend:** `CULQI_SECRET_KEY` se usa en el API route para crear el cargo real.
- El precio **nunca** se confía del lado del cliente — se recalcula desde la base de datos.

> Documentación: [Culqi Docs](https://docs.culqi.com)

---

## 5. Lista de Verificación de Producción (Production Checklist)

Para garantizar la estabilidad, rendimiento y seguridad en el entorno de producción (Vercel Serverless), es **mandatorio** configurar las siguientes variables de entorno adicionales:

### A. Upstash Redis (Rate Limiting Global)
El proyecto utiliza un rate limiter para mitigar ataques DDoS y abusos en subida de archivos y checkouts. En producción, el fallback en memoria **no funciona** de forma distribuida en Serverless debido a contenedores efímeros aislados. Debes configurar:
* `UPSTASH_REDIS_REST_URL` - URL de tu base de datos Upstash Redis.
* `UPSTASH_REDIS_REST_TOKEN` - Token de autorización REST de Upstash Redis.

> **Ubicación:** Upstash Console -> Seleccionar base de datos -> Copiar credenciales REST.

### B. SSL y Redirección en Vercel
Asegurar que `NEXT_PUBLIC_SITE_URL` apunte a `https://www.blama.shop` y esté configurado en las variables de entorno de Vercel para que las rutas del Checkout de WhatsApp y de los correos transaccionales generen links absolutos correctos.

---

## 6. Analíticas, Píxeles (Meta, TikTok) y Atribución

La plataforma utiliza **Google Tag Manager (GTM)** como hub centralizado para disparar y configurar analíticas.

### Arquitectura de 4 Píxeles
Para evitar que las pruebas locales de desarrollo contaminen tus métricas y públicos reales de anuncios, implementamos un sistema dual basado en el hostname (`localhost` vs `blama.shop`):

1. **Meta (Facebook) Pixel:**
   - **ID Desarrollo (Local):** `986967067666281` (Cargado en `localhost:3000`).
   - **ID Producción (Real):** Configurable en GTM mediante la Lookup Table.
2. **TikTok Pixel:**
   - **ID Desarrollo (Local):** `D8UK603C77U4748KH5LG` (Cargado en `localhost:3000`).
   - **ID Producción (Real):** Configurable en GTM mediante la Lookup Table.

### Rastreo y Atribución de Campañas
El componente `<AttributionTracker />` captura automáticamente los siguientes parámetros al entrar a la tienda y los almacena en cookies de origen con 30 días de duración:
* `blama_utm_source`, `blama_utm_medium`, `blama_utm_campaign`, `blama_utm_content`, `blama_utm_term`
* `blama_fbclid` (Meta Click ID)
* `blama_ttclid` (TikTok Click ID)
* `blama_gclid` (Google Click ID)

GTM lee estas cookies y las inyecta en los eventos de conversión para atribución avanzada.

### Coincidencia Avanzada (Advanced Matching)
Para resolver la advertencia crítica de TikTok Ads y mejorar la tasa de coincidencia, el evento `purchase` en el `dataLayer` ahora inyecta dinámicamente:
* **`email`**: Correo electrónico del cliente.
* **`phone`**: Teléfono móvil del cliente.

Las etiquetas de GTM se encargan de procesar (hashear en SHA-256) e identificar al usuario antes de enviar la conversión a las plataformas publicitarias.

### Instrucciones para la Importación Rápida en GTM
Puedes recrear toda la estructura de variables de cookies, activadores de e-commerce y etiquetas de Meta/TikTok importando un solo archivo:

1. Localiza el archivo [gtm-import-pixels.json](../gtm-import-pixels.json) en la raíz del proyecto.
2. Ingresa a tu panel de Google Tag Manager $\rightarrow$ **Administrador** (Admin).
3. Haz clic en **Importar contenedor** (Import container).
4. Elige el archivo `gtm-import-pixels.json`.
5. Selecciona el espacio de trabajo existente (ej. `Default Workspace`).
6. **Fusión:** Selecciona **Fusionar** (Merge) y luego **Cambiar el nombre de las variables, activadores y etiquetas en conflicto** (¡NO elijas Sobrescribir!).
7. Confirma e introduce tus IDs de producción en las variables tipo *Lookup* (`Lookup - ID Meta Pixel` y `Lookup - ID TikTok Pixel`).
8. Publica los cambios.


