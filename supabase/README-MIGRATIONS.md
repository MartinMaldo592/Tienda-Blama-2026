# 🚀 Guía de Migraciones y Control de Versiones con Supabase CLI

Esta guía detalla el estándar del proyecto para gestionar los cambios de la base de datos de forma controlada y segura, asegurando que el entorno de desarrollo (**DEV**) y el de producción (**PROD**) permanezcan perfectamente sincronizados.

---

## 🛠️ Requisitos Previos

1.  **Instalar Supabase CLI**:
    Asegúrate de tener la CLI instalada en tu sistema.
    *   **macOS / Linux**: `brew install supabase/tap/supabase`
    *   **Windows (Scoop)**: `scoop bucket add supabase https://github.com/supabase/scoop-bucket.git` y luego `scoop install supabase`
    *   **npm (Universal)**: `npm install -g supabase` o usando `npx supabase` directamente.

---

## 📁 Estructura de Entornos

*   **DEV (Desarrollo)**: Ref `gzytvmwpzqzzhkguckuc`
*   **PROD (Producción)**: Ref `pvgghvcqoxhcozlyagwz`

---

## 🔄 Flujo de Trabajo Diario

Cuando necesites hacer cambios en la estructura de la base de datos (crear tablas, agregar columnas, modificar triggers, etc.), sigue estos pasos:

### 1. Vincular el Proyecto Local
Para comenzar a trabajar, vincula la carpeta del proyecto local con tu base de datos de desarrollo (DEV):
```bash
supabase link --project-ref gzytvmwpzqzzhkguckuc
```
*(Te solicitará la contraseña de la base de datos de DEV).*

### 2. Realizar los cambios en la Consola Web de DEV
Ve al panel web de Supabase de tu proyecto de DEV y realiza los cambios necesarios (crear una tabla, modificar columnas, agregar RLS, etc.).

### 3. Generar la Migración Declarativa
Una vez que tus cambios funcionen en DEV, ejecuta el siguiente comando local para calcular la diferencia y generar el archivo de migración SQL automáticamente:
```bash
supabase db diff --local -f nombre_de_tu_migracion
```
Esto creará un archivo con la marca de tiempo actual y tu nombre descriptivo dentro de la carpeta:
`supabase/migrations/YYYYMMDDHHMMSS_nombre_de_tu_migracion.sql`

### 4. Guardar en el Repositorio (Git)
Añade y confirma el archivo de migración en Git para que todo el equipo disponga de él:
```bash
git add supabase/migrations/
git commit -m "db: agrega tabla de cupones y RLS"
```

### 5. Aplicar Cambios a Producción (PROD)
Cuando estés listo para desplegar los cambios al entorno real (PROD):
1.  Vincula el proyecto local a la referencia de producción:
    ```bash
    supabase link --project-ref pvgghvcqoxhcozlyagwz
    ```
2.  Empuja las nuevas migraciones acumuladas hacia el servidor de producción:
    ```bash
    supabase db push
    ```

---

## 💡 Consejos de Buenas Prácticas

*   **Políticas RLS**: Recuerda que las políticas RLS y triggers creados en la interfaz web de Supabase son parte del esquema y se capturarán automáticamente con `supabase db diff`.
*   **Nunca Modifiques Migraciones Antiguas**: Si necesitas cambiar algo de una migración que ya fue aplicada a producción, crea una **nueva migración** que aplique la corrección (ej: `ALTER TABLE ...`). Nunca edites un archivo SQL antiguo en Git.
*   **Datos Semilla (Seed)**: El archivo `supabase/seed.sql` puede contener inserciones iniciales (como categorías básicas o productos muestra) que puedes cargar automáticamente en tu base local o de DEV usando `supabase db reset`.
