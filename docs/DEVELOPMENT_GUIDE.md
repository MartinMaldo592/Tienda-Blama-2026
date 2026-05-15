# Guía para Desarrolladores

Bienvenido al código fuente de Tienda Blama 2026. Sigue estos estándares para asegurar la calidad y escalabilidad del proyecto.

## 🚀 Instalación Local

Para arrancar el proyecto en tu máquina local:

1. Clona el repositorio y ubícate en la carpeta.
2. Crea el archivo `.env.local` basado en las variables ubicadas en `docs/INTEGRATIONS.md`.
3. Instala dependencias usando `npm install`.
4. Corre el servidor de desarrollo en modo Turbopack:
   ```bash
   npm run dev
   ```

## 📐 Convenciones de Código

### 1. Server Components por defecto
Next.js usa Server Components por defecto. Si un componente solo necesita leer datos y renderizar HTML, **NO** le pongas `"use client"`. Mantenlo en el servidor para mejorar el SEO y reducir el JavaScript del cliente.
Usa `"use client"` únicamente cuando necesites usar `useState`, `useEffect` o eventos como `onClick`.

### 2. Manejo de Estados (React Query)
Evita usar `useEffect` para hacer fetch de datos. Todo el Data Fetching que ocurre en el cliente (como el dashboard administrativo o paginaciones interactivas) debe usar **Tanstack React Query**.
Ejemplo: `useQuery({ queryKey: ["adminPedidos"], queryFn: fetchPedidos })`

### 3. Feature-Sliced Design (FSD) Adaptado
No pongas todos los componentes en una carpeta gigante `/components`. 
Si creas un botón o una tabla específica para los administradores, métela en `features/admin/components/`. 
Reserva `/components/ui/` únicamente para los componentes genéricos base (Shadcn UI).

## 🌳 Git Workflow Estricto

Este repositorio sigue una rama de desarrollo `develop` como zona de pruebas, y una `main` para producción.

1. Estando en `develop`, realiza tus cambios.
2. Agrega y haz commit: `git commit -m "feat: agrega nueva funcionalidad de carrito"`
3. Empuja a develop: `git push origin develop`
4. Revisa que todo funcione. Luego haz un PR o Merge manual hacia la rama `main` para que Vercel inicie el despliegue a producción automáticamente.
