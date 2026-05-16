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
