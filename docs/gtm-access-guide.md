# 🔑 Guía de Accesos y Automatización de Google Tag Manager (GTM)

Este documento describe la configuración de accesos, permisos y requerimientos de API necesarios para permitir que desarrolladores o agentes de Inteligencia Artificial (IA) se conecten y actualicen de forma automatizada las etiquetas de conversión de Google Tag Manager.

---

## 1. Cuenta de Servicio de Google Cloud (Service Account)

La autenticación se realiza mediante una cuenta de servicio de Google Cloud. La llave de acceso en formato JSON se encuentra en la raíz del proyecto con el nombre:
*   `tienda-blama-b9786a6539e4.json`

### Datos de la cuenta de servicio:
*   **Email:** `tienda-blama-gtm@tienda-blama.iam.gserviceaccount.com`
*   **Proyecto GCP:** `tienda-blama`

---

## 2. Permisos Requeridos en la Consola de GTM

Para que el agente de IA o un script automático pueda realizar cambios y lanzarlos a producción, se deben configurar los siguientes permisos en la consola web de [Google Tag Manager](https://tagmanager.google.com/):

### A. Nivel de Cuenta:
*   **Rol:** `Administrador` (o `Usuario` con permisos delegados). Esto permite listar y ver los contenedores y espacios de trabajo.

### B. Nivel de Contenedor (para `GTM-PCKTWQM3`):
*   **Permiso:** `Publicación` (Publish). 
*   *Nota Crítica:* Si solo se asigna el permiso de "Edición", la API fallará al intentar crear versiones de contenedor o publicar cambios a producción, devolviendo errores de permisos del backend.

---

## 3. Configuración de Scopes en el Código de la API (OAuth Scopes)

Al programar la conexión del cliente de GTM en Node.js (utilizando la biblioteca `googleapis`), es **estrictamente obligatorio** solicitar la lista completa de ámbitos (scopes). 

Si se omite el scope de versiones de contenedor, Google bloqueará las acciones de empaquetado y publicación con el error `insufficient authentication scopes` (403 Forbidden).

### Scopes obligatorios a incluir en el cliente de GoogleAuth:
```javascript
const GTM_SCOPES = [
  // Lectura básica de la cuenta
  'https://www.googleapis.com/auth/tagmanager.readonly',
  // Creación y edición de etiquetas, activadores y variables
  'https://www.googleapis.com/auth/tagmanager.edit.containers',
  // Eliminación de espacios de trabajo temporales
  'https://www.googleapis.com/auth/tagmanager.delete.containers',
  // Administración de cuentas
  'https://www.googleapis.com/auth/tagmanager.manage.accounts',
  // Publicación final en producción
  'https://www.googleapis.com/auth/tagmanager.publish',
  // ¡CRÍTICO! Permiso específico necesario para crear versiones de contenedor sin error de scopes
  'https://www.googleapis.com/auth/tagmanager.edit.containerversions'
];
```

---

## 4. Estructura y Parámetros del Contenedor de Producción

*   **GTM Public ID:** `GTM-PCKTWQM3`
*   **GTM Account ID:** `6336487505`
*   **GTM Container ID:** `242018047`

### Variables de la Capa de Datos (Data Layer Variables) en GTM:
Cuando construyas Custom HTML tags, asegúrate de referenciar las variables del contenedor por sus nombres exactos. En el contenedor en vivo, se llaman:
*   `{{dlv - email}}` (Variable de Capa de Datos para el correo electrónico del cliente)
*   `{{dlv - phone}}` (Variable de Capa de Datos para el celular del cliente)
*   `{{ecommerce}}` (Objeto principal de comercio electrónico estándar de GA4)

### Variables Clave de Redirección (Lookup Tables):
El contenedor utiliza variables de tipo *Lookup Table* basadas en el hostname del navegador (`{{Page Hostname}}`) para dirigir los datos:
*   **`Lookup - ID Meta Pixel`** (ID de Variable GTM: **61**):
    *   `localhost` $\rightarrow$ `986967067666281` (Desarrollo/Pruebas)
    *   `blama.shop` / `www.blama.shop` $\rightarrow$ `4026169770853490` (Producción Real)
*   **`Lookup - ID TikTok Pixel`** (ID de Variable GTM: **62**):
    *   `localhost` $\rightarrow$ `D8UK603C77U4748KH5LG` (Desarrollo/Pruebas)
    *   `blama.shop` / `www.blama.shop` $\rightarrow$ `D922UFRC77U4748KJP2G` (Producción Real)

### Etiquetas Clave en el Contenedor (Tags):
*   **`Meta - Event - Purchase`** (ID de Tag GTM: **70**): Custom HTML Tag que dispara el píxel de compra de Meta Ads.
*   **`TikTok - Event - Purchase`** (ID de Tag GTM: **74**): Custom HTML Tag que dispara el píxel de compra de TikTok Ads.
*   **`GA4 Config`** (ID de Tag GTM: **45**): Etiqueta de configuración global de Google Analytics 4 (`G-6CN78M9MQM`).

---

## 5. ⚠️ Lecciones Aprendidas y Diagnóstico de Errores (Crítico para IA)

### A. Falso Negativo de Permisos (Fallo de Compilación 403)
*   **El Problema:** Al intentar crear una versión (`create_version`) o publicar (`publish`), la API de GTM puede arrojar un error genérico `Not found or permission denied` (403 Forbidden).
*   **La Causa Real:** Este error a menudo **NO** es por falta de permisos. GTM arroja este mismo error si el espacio de trabajo tiene **errores de compilación o validación** (por ejemplo, si una etiqueta Custom HTML hace referencia a una variable inexistente como `{{Data Layer - phone}}` en lugar de `{{dlv - phone}}`).
*   **Solución:** Revisa siempre el estado del espacio de trabajo con `getStatus()` y asegúrate de que todas las variables referenciadas en tus tags existan en el contenedor antes de crear la versión.

### B. Evitar IDs de Workspace Hardcodeados
*   **El Problema:** El ID de los espacios de trabajo en GTM cambia de forma dinámica (por ejemplo, de `25` a `26`) cada vez que se crea y publica una versión de contenedor, ya que GTM regenera el `Default Workspace`.
*   **Solución:** Los scripts siempre deben buscar el workspace por su nombre (`Default Workspace`) de manera dinámica:
    ```javascript
    const workspacesResponse = await tagmanager.accounts.containers.workspaces.list({ parent: ... });
    const workspace = workspacesResponse.data.workspace.find(w => w.name === 'Default Workspace');
    ```

### C. Solución de Conflictos en GTM (Merge Conflicts)
Si al intentar actualizar la API devuelve errores de conflicto (debido a que se han hecho cambios manuales fuera de sincronización con la versión activa), la estrategia de recuperación automática recomendada es:
1.  Crear un espacio de trabajo temporal `TempWorkspace`.
2.  Eliminar el `Default Workspace` en conflicto.
3.  Volver a crear el `Default Workspace` limpio (esto lo sincroniza automáticamente y al 100% con la última versión publicada en producción, resolviendo todo conflicto).
4.  Eliminar `TempWorkspace`.
5.  Re-aplicar las variables y etiquetas mediante el script utilizando los nombres unificados.
