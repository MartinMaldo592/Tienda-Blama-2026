# Arquitectura Técnica - Tienda Blama 2026

Este documento detalla la estructura técnica del proyecto, su flujo de datos y las tecnologías clave que sustentan la escalabilidad de la plataforma.

## 🏗️ Topología Serverless (Next.js + Supabase)

El sistema utiliza un enfoque moderno *Serverless* desacoplado, lo que significa que no gestionamos servidores Node.js persistentes. Todo se ejecuta bajo demanda a través de Vercel y el backend se delega a Supabase (BaaS).

```mermaid
graph TD
    %% Usuarios
    Client((Navegador / Dispositivo Móvil))
    
    %% Capa Frontend (Next.js)
    subgraph Vercel ["Capa de Presentación (Next.js 16)"]
        UI[React UI Components]
        SC[Server Components / SSR]
        SA[Server Actions]
        Proxy[Proxy.ts / Middleware]
    end
    
    %% Capa Backend (Supabase)
    subgraph Supabase ["Capa de Datos y Autenticación (Supabase)"]
        Auth[GoTrue Auth / JWT]
        DB[(PostgreSQL)]
        RPC[Remote Procedure Calls / Funciones SQL]
        Storage[S3 Bucket - Imágenes]
    end
    
    %% Pasarelas
    subgraph Externo ["Servicios Externos"]
        Culqi[Pasarela Culqi]
        GMap[Google Maps Geocoding]
    end

    %% Relaciones
    Client <-->|Interacción| UI
    Client -->|Navegación / Rutas| Proxy
    Proxy -->|Redirección Segura| SC
    UI <-->|Fetch / Mutate (React Query)| SA
    SC -->|Lectura Rápida RLS| DB
    SA -->|Transacciones / Mutaciones| DB
    SA -->|Descuento Atómico| RPC
    UI -->|Petición Pago| Culqi
    UI -->|Direcciones| GMap
    Proxy <-->|Validar Sesión| Auth
```

## 📁 Estructura del Proyecto

El código fuente sigue un patrón mixto de "Feature-Sliced Design" (Diseño basado en funcionalidades) y "App Router" clásico:

```text
Tienda-Blama-2026/
├── app/                  # Sistema de enrutamiento y páginas de Next.js
│   ├── (public)/         # Rutas públicas (Tienda, Checkout, Contacto)
│   ├── admin/            # Panel administrativo (Rutas privadas)
│   ├── api/              # Endpoints (Webhooks de Culqi, Uploads)
│   ├── auth/             # Pantallas de login/registro
│   └── layout.tsx        # Contenedor raíz global
├── features/             # Lógica encapsulada por "Dominio de Negocio"
│   ├── admin/            # Lógica, servicios y componentes exclusivos del dashboard
│   ├── cart/             # Manejador de estado global del carrito
│   ├── checkout/         # Formularios de envío y lógica transaccional
│   ├── emails/           # Plantillas React-Email
│   └── products/         # Endpoints y UI de listado/búsqueda de productos
├── components/           # Componentes reutilizables genéricos (Botones, Inputs)
│   └── ui/               # Componentes Shadcn UI
├── hooks/                # Custom React Hooks
├── lib/                  # Utilidades globales (Supabase Client, Formateadores)
├── proxy.ts              # Interceptor Edge para proteger rutas y refrezcar JWT
└── types/                # Definiciones de TypeScript y Base de Datos (Supabase)
```

## 🔒 Capa de Seguridad y Acceso a Datos

### Server Components vs Client Components
1. **Server Components (`app/admin/page.tsx`)**: Se utilizan para lectura de datos rápida y segura (Data Fetching). Ocultan las consultas a la base de datos para que nunca lleguen al navegador.
2. **Client Components (`"use client"`)**: Exclusivos para interactividad (formularios, clicks, estados locales como el Carrito).

### Proxys y Guardias de Roles
Para evitar que clientes normales entren al panel administrativo:
- `proxy.ts`: Intercepta la petición al inicio para asegurar que el JWT sea válido a nivel de Edge.
- `useRoleGuard`: Un hook estricto dentro de `app/admin/layout.tsx` que consulta si el usuario tiene rol de `admin`, `superadmin` o `worker`. Si no, muestra el componente `<AccessDenied />`.

### Inyección de Supabase
Utilizamos la librería `@supabase/ssr` en la capa de utilidades (`lib/supabase.server.ts` y `lib/supabase.client.ts`). La base de datos está fuertemente protegida por **RLS (Row Level Security)**, asegurando que un usuario solo pueda editar lo que le corresponde, incluso si lograran burlar la interfaz.
