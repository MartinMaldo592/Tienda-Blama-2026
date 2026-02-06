# 🗺️ Guía de Activación: Google Maps Geocoding API

Tu tienda usa dos servicios de Google Maps:
1.  **Places API:** Para el autocompletado de direcciones (Ya funcionaba).
2.  **Geocoding API:** Para convertir esa dirección en coordenadas exactas y generar el enlace preciso (Esto es lo que falta activar).

Sigue estos pasos para activarlo. No necesitas tocar el código, ya está listo.

## Paso 1: Activar la API en Google Cloud

1.  Entra a la [Consola de Google Cloud](https://console.cloud.google.com/google/maps-apis/api-list) con la cuenta donde creaste tu API Key.
2.  Asegúrate de estar en el proyecto correcto (selecciónalo en la parte superior izquierda).
3.  En el menú lateral, ve a **"APIs y servicios"** > **"Biblioteca"** (Library).
4.  En el buscador escribe: `Geocoding API`.
5.  Haz clic en el resultado **"Geocoding API"**.
6.  Haz clic en el botón azul **"HABILITAR"** (Enable).

## Paso 2: Actualizar Permisos de tu Llave (API Key)

Es muy probable que tu llave tenga restricciones de seguridad que bloquean esta nueva API.

1.  En la misma consola, ve a **"APIs y servicios"** > **"Credenciales"**.
2.  Haz clic en el nombre de tu API Key (la que usas en tu tienda como `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`).
3.  Baja a la sección **"Restricciones de API"**.
    *   Si está marcado "No restringir clave", ¡listo! Ya debería funcionar.
    *   Si está marcado **"Restringir clave"** (Recomendado), verás una lista de APIs permitidas.
4.  En el menú desplegable, busca y marca **"Geocoding API"**.
5.  Asegúrate de que también estén marcadas:
    *   Build with Google Places (Places API) -> *Para el autocompletado*
    *   Maps JavaScript API -> *Para que cargue el script*
6.  Haz clic en **"Guardar"**.

## Paso 3: ¡Listo!

Tu código ya está programado para usar esta API automáticamente.
-   **Prueba:** Ve al checkout de tu tienda, escribe una dirección y selecciónala.
-   **Resultado:** Ahora el sistema generará internamente un enlace con coordenadas exactas (`maps.google.com/?q=-12.123,-77.123`) en lugar de un enlace de búsqueda genérico.
