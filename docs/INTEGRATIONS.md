# 🔌 Guía de Integraciones y Configuración (.env)

El proyecto depende de ciertas APIs externas para funcionar. Todas las credenciales deben ubicarse en un archivo llamado `.env.local` en la raíz del proyecto.

## 1. Variables de Entorno

Plantilla a copiar en tu `.env.local`:

```env
# 1. Base de Datos & Autenticación (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui

# 2. Servicios de Mapa (Autocompletado Checkout)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_google_maps

# 3. Contacto y Notificaciones
# Ingresar los números sin el signo "+"
NEXT_PUBLIC_WHATSAPP_TIENDA=51982432561
NEXT_PUBLIC_WHATSAPP_ADMIN=51982432561
```

## 2. Activación de Google Maps API

Tu llave `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` requiere 3 servicios activos en la Consola de Google Cloud:

1. **Maps JavaScript API:** Necesario para renderizar componentes basados en mapas y el script base.
2. **Places API:** Usado en el formulario de Checkout para el autocompletado inteligente de calles.
3. **Geocoding API:** Usado internamente para convertir las direcciones de texto en coordenadas precisas y evitar fallos logísticos de ubicación.

**¿Cómo habilitarlas?**
- Entra a [Google Cloud Console](https://console.cloud.google.com).
- Ve a *APIs y Servicios* > *Credenciales*.
- Haz clic en tu llave API y en "Restricciones de API" marca estrictamente esas 3 APIs de la lista para evitar que hackers abusen de tu cuota de consultas.
