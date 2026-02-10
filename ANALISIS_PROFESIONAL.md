# 📊 Análisis Profesional — Tienda Blama 2026

> **Fecha:** Febrero 2026  
> **Proyecto:** Tienda Blama — E-commerce con CRM Administrativo  
> **Dominio:** www.blama.shop  
> **Stack:** Next.js 15 · React 19 · Supabase · Tailwind CSS · Cloudflare R2  

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Arquitectura General](#2-arquitectura-general)
3. [Base de Datos & Supabase](#3-base-de-datos--supabase)
4. [Seguridad — Hallazgos Críticos](#4-seguridad--hallazgos-críticos)
5. [Rendimiento — Hallazgos](#5-rendimiento--hallazgos)
6. [Calidad del Código](#6-calidad-del-código)
7. [SEO & Marketing](#7-seo--marketing)
8. [Flujo de Negocio & Lógica Comercial](#8-flujo-de-negocio--lógica-comercial)
9. [DevOps & Infraestructura](#9-devops--infraestructura)
10. [Plan de Acción Priorizado](#10-plan-de-acción-priorizado)

---

## 1. Resumen Ejecutivo

### ✅ Fortalezas
| Área | Detalle |
|------|---------|
| **Stack moderno** | Next.js 15 con App Router + React 19 + Supabase — excelente elección para e-commerce |
| **RLS habilitado** | Todas las tablas tienen Row Level Security activado |
| **Sistema de roles** | Roles `admin` y `worker` correctamente implementados con funciones helper |
| **SEO técnico** | Sitemap dinámico, robots.txt, meta tags, canonical URLs |
| **Flujo de pedidos** | Ciclo de vida completo: Pendiente → Confirmado → Preparando → Enviado → Entregado |
| **Auditoría** | Sistema de `system_audit_logs` y `pedido_logs` para trazabilidad |
| **Variantes** | Soporte para variantes de producto (talla, color, modelo) |

### ⚠️ Áreas de Riesgo
| Prioridad | Área | Impacto |
|-----------|------|---------|
| 🔴 Crítico | 9 alertas de seguridad en Supabase | Exposición de datos |
| 🔴 Crítico | Políticas RLS duplicadas (70+ warnings) | Rendimiento + mantenimiento |
| 🟡 Alto | 9 foreign keys sin índice | Consultas lentas a escala |
| 🟡 Alto | API checkout sin rate limiting | Vulnerable a abuso |
| 🟠 Medio | Endpoint `/api/upload` sin autenticación | Subida no autorizada de archivos |
| 🟠 Medio | `search_path` mutable en 4 funciones | Posible inyección SQL |

---

## 2. Arquitectura General

### 2.1 Estructura del Proyecto

```
Tienda-Blama-2026/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage con productos destacados
│   ├── layout.tsx                # Root layout con GTM, fonts, providers
│   ├── sitemap.ts                # Sitemap dinámico
│   ├── robots.ts                 # Robots.txt
│   ├── globals.css               # Estilos globales + Tailwind
│   ├── admin/                    # Panel administrativo (CRM)
│   │   ├── layout.tsx            # Layout protegido con useRoleGuard
│   │   └── pedidos/[id]/         # Detalle de pedido
│   ├── api/
│   │   ├── checkout/whatsapp/    # API de checkout
│   │   ├── upload/               # Presigned URLs para R2
│   │   └── notify-admin/         # DEPRECADO (410 Gone)
│   └── auth/                     # Login/registro
├── components/
│   ├── product-card.tsx          # Card de producto con GTM
│   ├── admin/sidebar.tsx         # Navegación admin
│   ├── layout-shell.tsx          # Shell principal
│   └── ui/                       # Componentes base (Radix UI)
├── features/
│   ├── admin/
│   │   ├── services/             # Servicios del admin
│   │   │   ├── pedidos.client.ts # Gestión de pedidos
│   │   │   └── dashboard.client.ts # Estadísticas
│   │   └── types.ts              # Tipos admin
│   ├── checkout/types.ts         # Tipos checkout
│   └── cart/                     # Carrito de compras
├── hooks/
│   └── use-file-upload.ts        # Hook de subida de archivos
├── lib/
│   ├── supabase.client.ts        # Cliente Supabase (browser)
│   ├── supabase.server.ts        # Cliente Supabase (server)
│   ├── store.ts                  # Zustand store (carrito)
│   └── use-role-guard.ts         # Guard de roles
├── types/
│   └── database.types.ts         # Tipos generados de Supabase
├── supabase/
│   ├── schema.sql                # Esquema de BD
│   └── auth_roles_setup.sql      # Roles y políticas RLS
├── middleware.ts                  # Auth + protección admin + SEO
└── next.config.ts                # Config de Next.js
```

### 2.2 Diagrama de Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENTE (Browser)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Homepage │  │ Producto │  │ Carrito  │  │  Checkout  │  │
│  │ (SSR)    │  │ (SSR)    │  │ (Zustand)│  │ (WhatsApp) │  │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘  └──────┬─────┘  │
└────────┼─────────────┼────────────┼──────────────┼──────────┘
         │             │            │              │
    ┌────▼─────────────▼────────────▼──────────────▼────┐
    │              MIDDLEWARE (Next.js)                   │
    │  • Auth check (Supabase SSR)                       │
    │  • Admin route protection                          │
    │  • SEO headers (canonical, noindex)                │
    └────────────────────┬──────────────────────────────┘
                         │
    ┌────────────────────▼──────────────────────────────┐
    │              NEXT.JS API ROUTES                    │
    │  • /api/checkout/whatsapp → Crear pedido           │
    │  • /api/upload → Presigned URLs (R2)               │
    └────────────────────┬──────────────────────────────┘
                         │
    ┌────────────────────▼──────────────────────────────┐
    │                  SUPABASE                          │
    │  ┌────────┐  ┌────────┐  ┌──────────┐             │
    │  │  Auth  │  │  RLS   │  │ Postgres │             │
    │  │(roles) │  │Policies│  │  (17 TBL)│             │
    │  └────────┘  └────────┘  └──────────┘             │
    └───────────────────────────────────────────────────┘
                         │
    ┌────────────────────▼──────────────────────────────┐
    │              CLOUDFLARE R2                          │
    │  • Imágenes de productos                           │
    │  • Vouchers de pago                                │
    │  • Guías de envío                                  │
    └───────────────────────────────────────────────────┘
```

### 2.3 Evaluación Arquitectónica

| Aspecto | Calificación | Comentario |
|---------|:------------:|------------|
| Separación de responsabilidades | ⭐⭐⭐⭐ | Buena separación `features/` vs `components/` vs `lib/` |
| Server vs Client components | ⭐⭐⭐ | Podría optimizarse — `admin/layout.tsx` es `"use client"` completo |
| Manejo de estado | ⭐⭐⭐⭐ | Zustand para carrito es la decisión correcta |
| Tipado TypeScript | ⭐⭐⭐ | Tipos generados de Supabase pero hay inconsistencias manuales |
| Manejo de errores | ⭐⭐ | Inconsistente — algunos try/catch, otros silenciosos |
| Testing | ⭐ | No se detectó infraestructura de tests |

---

## 3. Base de Datos & Supabase

### 3.1 Esquema de Tablas (17 tablas en producción)

```
┌─────────────────────────┐     ┌──────────────────────┐
│      categorias (160)    │     │   productos (3)       │
│ ─────────────────────── │◄────│ ───────────────────── │
│ id, nombre, slug,        │     │ id, nombre, precio,   │
│ parent_id (self-ref)     │     │ stock, imagen_url,    │
│                          │     │ categoria_id,         │
│                          │     │ calificacion (5.0)    │
└─────────────────────────┘     └───────┬──────────────┘
                                        │
                         ┌──────────────┼───────────────┐
                         │              │               │
              ┌──────────▼──┐ ┌────────▼──────┐ ┌─────▼──────────────┐
              │ producto_    │ │ product_      │ │ producto_          │
              │ variantes(0) │ │ reviews (0)   │ │ especificaciones(9)│
              │              │ │               │ │                    │
              │ talla, color,│ │ rating 1-5,   │ │ clave, valor,      │
              │ modelo, stock│ │ verified,     │ │ orden              │
              └──────────────┘ │ approved      │ └────────────────────┘
                               └───────────────┘

┌──────────────┐     ┌─────────────────────┐     ┌───────────────────┐
│ clientes (9)  │◄────│    pedidos (12)       │────►│ pedido_items (12) │
│ ──────────── │     │ ─────────────────── │     │ ───────────────── │
│ nombre, tel,  │     │ status, pago_status, │     │ producto_id,      │
│ dni, depto,   │     │ total, subtotal,     │     │ cantidad,         │
│ provincia,    │     │ descuento, cupon,    │     │ precio_unitario,  │
│ distrito      │     │ asignado_a (UUID),   │     │ variante_id       │
└──────────────┘     │ metodo_envio,        │     └───────────────────┘
                     │ shalom_orden/clave   │
                     └───────┬─────────────┘
                             │
                    ┌────────▼────────┐   ┌──────────────────┐
                    │ pedido_logs (18) │   │ incidencias (0)  │
                    │ accion, detalles │   │ tipo, comentario │
                    └─────────────────┘   └──────────────────┘

┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│  cupones (2)      │   │  usuarios (4)     │   │ home_banners (1) │
│ codigo, tipo,     │   │ email, nombre,    │   │ title, subtitle, │
│ valor, activo,    │   │ role, telefono    │   │ cta, href, orden │
│ min_total, usos   │   │ (→ auth.users)    │   │                  │
└──────────────────┘   └──────────────────┘   └──────────────────┘

┌──────────────────┐   ┌──────────────────┐   ┌───────────────────┐
│ announcement_bar  │   │ social_links (3)  │   │ system_audit_logs │
│ (1)               │   │ platform, url,    │   │ (0)               │
│ enabled, messages │   │ active, orden     │   │ table_name, action│
│ interval_ms       │   │                   │   │ old_data, new_data│
└──────────────────┘   └──────────────────┘   └───────────────────┘

product_questions (0)  ←→  product_answers (0)
```

### 3.2 Observaciones de Datos

| Métrica | Valor | Evaluación |
|---------|-------|------------|
| Productos activos | **3** | 🟡 Muy pocos — ¿tienda nueva o datos de prueba? |
| Categorías | **160** | 🔴 Desproporcionado vs 3 productos — posible data de prueba |
| Clientes | **9** | 🟡 Esperado si es una tienda nueva |
| Pedidos | **12** | ✅ Normal para fase inicial |
| Variantes | **0** | ⚠️ Sistema implementado pero sin datos |
| Reviews | **0** | ⚠️ Sistema implementado pero sin datos |
| Audit logs | **0** | ⚠️ Trigger creado recientemente, aún sin registros |

### 3.3 Recomendaciones de Esquema

#### 🔴 Problema: No hay tabla de `slug` en `productos`

```diff
-- Los productos no tienen slug, lo cual es fundamental para SEO
-- El sitemap.ts actualmente usa: /producto/${producto.id}

+ ALTER TABLE public.productos ADD COLUMN slug text UNIQUE;
+ CREATE INDEX idx_productos_slug ON public.productos(slug);
```

**Impacto:** Las URLs tipo `/producto/123` tienen peor SEO que `/producto/collar-de-plata-925`.

#### 🟡 Problema: Campo `Cancelado` falta en el CHECK constraint de `status`

El schema SQL incluye `'Cancelado'` como estado válido, pero el CHECK constraint real en producción NO lo incluye:

```sql
-- EN PRODUCCIÓN (faltan Cancelado):
check (status in ('Pendiente','Confirmado','Preparando','Enviado','Entregado','Fallido','Devuelto'))
```

#### 🟡 Problema: No hay campo `updated_at` en las tablas principales

Las tablas `productos`, `pedidos`, `clientes` solo tienen `created_at`. Agregar `updated_at` con trigger automático es esencial para sincronización y caché.

---

## 4. Seguridad — Hallazgos Críticos

### 4.1 Alertas del Linter de Seguridad de Supabase

El análisis automatizado de Supabase detectó **9 alertas de seguridad**:

#### 🔴 1. Protección contra Contraseñas Filtradas DESHABILITADA

```
Auth Leaked Password Protection: DISABLED
```

**Riesgo:** Los usuarios pueden registrarse con contraseñas que ya fueron expuestas en brechas de datos conocidas (HaveIBeenPwned).

**Solución:** Habilitarla desde el [Dashboard de Supabase → Auth → Security](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection).

---

#### 🔴 2. Funciones con `search_path` mutable (4 funciones)

| Función | Riesgo |
|---------|--------|
| `public.is_staff()` | Podría ser redirigida a un schema malicioso |
| `public.can_access_pedido()` | Misma vulnerabilidad |
| `public.admin_procesar_devolucion_parcial()` | Manipulación de devoluciones |
| `public.log_changes_trigger()` | Bypassear auditoría |

**Solución:**
```sql
ALTER FUNCTION public.is_staff() SET search_path = public;
ALTER FUNCTION public.can_access_pedido() SET search_path = public;
ALTER FUNCTION public.admin_procesar_devolucion_parcial() SET search_path = public;
ALTER FUNCTION public.log_changes_trigger() SET search_path = public;
```

---

#### 🔴 3. Políticas RLS Siempre Verdaderas (4 políticas)

| Tabla | Política | Problema |
|-------|----------|----------|
| `categorias` | `Allow authenticated full access` | `USING (true)` para ALL → cualquier usuario autenticado puede modificar/eliminar categorías |
| `clientes` | `Public creates clients` | `WITH CHECK (true)` para INSERT → CUALQUIER visitante puede crear filas de clientes arbitrarias |
| `pedido_logs` | `Enable insert access for authenticated users` | Cualquier usuario autenticado puede insertar logs falsos |
| `social_links` | `Admin full access social links` | `USING (true)` para ALL sin filtro de rol |

**Solución para `categorias`:**
```sql
DROP POLICY "Allow authenticated full access" ON public.categorias;
-- Mantener solo la política de lectura pública y crear una de escritura para admins
CREATE POLICY "Admin manage categorias" ON public.categorias
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());
```

---

#### 🟡 4. Endpoint `/api/upload` sin autenticación

```typescript
// app/api/upload/route.ts — ACTUAL
export async function POST(req: Request) {
  const { filename, contentType } = await req.json();
  // ⚠️ NO verifica que el usuario esté autenticado
  // Cualquiera puede generar URLs de subida a R2
```

**Solución:**
```typescript
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  // ... resto del código
}
```

---

#### 🟡 5. API de Checkout sin protección contra abuso

```typescript
// app/api/checkout/whatsapp/route.ts
// ⚠️ Sin rate limiting, sin CAPTCHA, sin validación de origen
// Un bot podría crear miles de pedidos falsos
```

**Solución recomendada:**
- Implementar rate limiting con `@upstash/ratelimit` o similar
- Agregar verificación de origen (CORS restrictivo)
- Considerar reCAPTCHA para el formulario de checkout

---

### 4.2 Variables de Entorno

| Variable | Uso | Seguridad |
|----------|-----|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente público | ✅ Correcto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente público | ✅ Correcto (siempre que RLS funcione bien) |
| `R2_ACCESS_KEY_ID` | Server-side | ✅ No expuesta |
| `R2_SECRET_ACCESS_KEY` | Server-side | ✅ No expuesta |
| `NEXT_PUBLIC_SITE_URL` | Público | ✅ Correcto |

---

## 5. Rendimiento — Hallazgos

### 5.1 Foreign Keys sin Índice (9 encontradas)

Estas foreign keys generarán **full table scans** cuando Postgres necesite verificar integridad referencial:

| Tabla | Foreign Key | Impacto Esperado |
|-------|-------------|------------------|
| `pedido_items` → `pedidos` | `pedido_items_pedido_id_fkey` | 🔴 Alto — tabla más consultada |
| `pedido_items` → `productos` | `pedido_items_producto_id_fkey` | 🔴 Alto |
| `pedido_items` → `producto_variantes` | `pedido_items_producto_variante_id_fkey` | 🟡 Medio |
| `pedidos` → `clientes` | `pedidos_cliente_id_fkey` | 🔴 Alto |
| `pedido_logs` → `pedidos` | `pedido_logs_pedido_id_fkey` | 🟡 Medio |
| `incidencias` → `pedidos` | `incidencias_pedido_id_fkey` | 🟢 Bajo (0 filas) |
| `productos` → `categorias` | `productos_categoria_id_fkey` | 🟡 Medio |
| `product_reviews` → `pedidos` | `product_reviews_order_id_fkey` | 🟢 Bajo (0 filas) |
| `system_audit_logs` → `auth.users` | `system_audit_logs_changed_by_fkey` | 🟢 Bajo |

**Solución (migración SQL):**
```sql
CREATE INDEX idx_pedido_items_pedido_id ON public.pedido_items(pedido_id);
CREATE INDEX idx_pedido_items_producto_id ON public.pedido_items(producto_id);
CREATE INDEX idx_pedido_items_variante_id ON public.pedido_items(producto_variante_id);
CREATE INDEX idx_pedidos_cliente_id ON public.pedidos(cliente_id);
CREATE INDEX idx_pedido_logs_pedido_id ON public.pedido_logs(pedido_id);
CREATE INDEX idx_incidencias_pedido_id ON public.incidencias(pedido_id);
CREATE INDEX idx_productos_categoria_id ON public.productos(categoria_id);
CREATE INDEX idx_product_reviews_order_id ON public.product_reviews(order_id);
CREATE INDEX idx_system_audit_logs_changed_by ON public.system_audit_logs(changed_by);
```

### 5.2 Políticas RLS que re-evalúan `auth.*()` por cada fila

| Tabla | Política | Solución |
|-------|----------|----------|
| `productos` | `Staff puede actualizar productos` | Cambiar `auth.uid()` → `(select auth.uid())` |
| `producto_variantes` | `Staff puede actualizar producto_variantes` | Idem |
| `usuarios` | `Usuarios pueden ver sus propios datos` | Idem |
| `system_audit_logs` | `Admins can view audit logs` | Idem |

**Ejemplo de fix:**
```sql
-- ANTES (lento):
CREATE POLICY "..." ON productos FOR UPDATE USING (auth.uid() = ...);

-- DESPUÉS (optimizado):
CREATE POLICY "..." ON productos FOR UPDATE USING ((select auth.uid()) = ...);
```

### 5.3 Políticas RLS Duplicadas (70+ warnings)

**Este es el problema de rendimiento más grande.** Hay decenas de políticas duplicadas porque se fueron creando en diferentes momentos sin limpiar las anteriores:

| Tabla | Ejemplo de duplicación |
|-------|----------------------|
| `cupones` | `"Admin puede leer cupones"` + `"Admins read cupones"` + `"Public puede leer cupones activos"` + `"Public read cupones by code"` — **4 políticas SELECT superpuestas** |
| `incidencias` | `"Admin puede eliminar incidencias"` + `"Admins delete incidencias"` — duplicados exactos |
| `productos` | `"Public read products"` + `"Staff puede leer productos"` — duplicados |
| `producto_variantes` | `"Public puede leer..."` + `"Staff puede leer..."` — duplicados |
| `clientes` | `"Public creates clients"` + `"Public puede crear clientes"` — duplicados para INSERT |

**Impacto:** Cada consulta ejecuta TODAS las políticas permisivas antes de devolver resultados. Con 4 policies duplicadas en `cupones`, cada SELECT ejecuta 4 evaluaciones innecesarias.

**Solución:** Consolidar a una sola política por tabla/acción:
```sql
-- Ejemplo para cupones SELECT:
DROP POLICY "Admin puede leer cupones" ON public.cupones;
DROP POLICY "Public puede leer cupones activos" ON public.cupones;
DROP POLICY "Public read cupones by code" ON public.cupones;
-- Mantener SOLO "Admins read cupones" con lógica combinada
```

### 5.4 Índices No Utilizados

| Índice | Tabla | Recomendación |
|--------|-------|---------------|
| `product_reviews_product_id_idx` | `product_reviews` | 🟡 Mantener — se usará cuando haya reviews |
| `product_questions_product_id_idx` | `product_questions` | 🟡 Mantener — idem |
| `product_answers_question_id_idx` | `product_answers` | 🟡 Mantener — idem |
| `idx_categorias_parent_id` | `categorias` | 🟡 Revisar — 160 categorías sin consultas que lo usen |

### 5.5 Rendimiento del Frontend

| Aspecto | Estado | Mejora |
|---------|--------|--------|
| Image optimization | ✅ `next/image` configurado | Agregar `priority` a imágenes above-the-fold |
| Font loading | ✅ Google Fonts via `next/font` | Correcto — no bloquea render |
| Bundle splitting | ✅ Automático con App Router | — |
| Static caching | ✅ Headers de caché en `next.config.ts` | `max-age=31536000` para assets |
| GTM loading | ⚠️ Scripts inline en layout | Considerar `afterInteractive` strategy |
| Speed Insights | ✅ Vercel Speed Insights activo | — |

---

## 6. Calidad del Código

### 6.1 Puntos Positivos

- ✅ **Estructura Feature-Based** (`features/admin/`, `features/checkout/`) — escalable
- ✅ **Tipos TypeScript** generados de Supabase + tipos manuales complementarios
- ✅ **Separación client/server** de Supabase (`supabase.client.ts` vs `supabase.server.ts`)
- ✅ **Estado global mínimo** — solo el carrito usa Zustand, el resto son queries directas
- ✅ **Componentes UI reutilizables** en `components/ui/` (basados en Radix UI)

### 6.2 Puntos a Mejorar

#### 🔴 No hay tests

```
No se encontraron archivos de test (*.test.ts, *.spec.ts, __tests__/)
```

**Impacto:** Cada cambio en la lógica de checkout, gestión de stock o cupones puede introducir regresiones sin ser detectadas.

**Recomendación mínima:**
1. Tests unitarios para `lib/store.ts` (lógica del carrito)
2. Tests de integración para `/api/checkout/whatsapp/route.ts`
3. Test E2E básico del flujo de compra (Playwright)

---

#### 🟡 Manejo de errores inconsistente

```typescript
// ❌ Error silencioso en layout.tsx
} catch (err) {
  console.error("Error fetching announcement:", err)
  return null  // Falla silenciosamente
}

// ❌ Error genérico en checkout
} catch (error: unknown) {
  return NextResponse.json(
    { success: false, error: "Error interno del servidor" },
    { status: 500 }
  );
  // No logea el error real
}
```

**Recomendación:** Implementar un servicio centralizado de logging (Sentry, LogRocket, o al menos un helper de logging consistente).

---

#### 🟡 Hook `use-file-upload.ts` demasiado largo

Con **2,645 líneas**, este archivo maneja demasiadas responsabilidades:
- Subida a R2
- Redimensionamiento de imágenes
- Gestión de estado de archivos
- Validación

**Recomendación:** Dividir en módulos:
- `hooks/use-file-upload.ts` — orquestación
- `lib/upload/r2-uploader.ts` — lógica de subida
- `lib/upload/image-processor.ts` — procesamiento de imágenes
- `lib/upload/validators.ts` — validación

---

#### 🟡 Endpoint deprecado sin eliminar

```typescript
// app/api/notify-admin/route.ts
export async function POST() {
  return NextResponse.json(
    { error: "This endpoint has been deprecated." },
    { status: 410 }
  );
}
```

**Recomendación:** Eliminar después de verificar que ningún cliente externo lo consume.

---

### 6.3 Dependencias

| Categoría | Dependencias | Estado |
|-----------|-------------|--------|
| Framework | Next.js 15.1.6, React 19 | ✅ Actualizado |
| Backend | @supabase/ssr 0.5.2, @supabase/supabase-js 2.48.1 | ✅ Actualizado |
| UI | Radix UI (múltiples), Tailwind CSS 3.4.x | ✅ |
| Estado | Zustand 5.0.3 | ✅ |
| Almacenamiento | @aws-sdk/client-s3, @aws-sdk/s3-request-presigner | ✅ |
| Analytics | @vercel/speed-insights 1.1.0 | ✅ |
| Otros | class-variance-authority, lucide-react, embla-carousel | ✅ |

**⚠️ No se detectó:** `next-sitemap`, `@sentry/nextjs`, ni `zod` para validación de schemas.

---

## 7. SEO & Marketing

### 7.1 Lo que está bien

| Aspecto | Implementación |
|---------|---------------|
| Sitemap dinámico | ✅ `app/sitemap.ts` genera rutas de productos automáticamente |
| Robots.txt | ✅ Bloquea `/admin`, `/checkout`, `/auth`, `/api` |
| Meta tags | ✅ Configurados en `layout.tsx` |
| Canonical URLs | ✅ Middleware agrega canonical en homepage y productos |
| `noindex` para filtros | ✅ Middleware agrega noindex cuando hay query params |
| Dominio | ✅ Redirect `blama.shop` → `www.blama.shop` |
| GTM | ✅ Google Tag Manager integrado |
| Idioma | ✅ `<html lang="es">` |

### 7.2 Lo que falta

| Aspecto | Prioridad | Recomendación |
|---------|-----------|---------------|
| URLs semánticas | 🔴 Alta | Implementar slugs en productos (`/producto/collar-de-plata` vs `/producto/123`) |
| Open Graph | 🟡 Media | Agregar `og:image`, `og:title`, `og:description` por producto |
| Schema.org / JSON-LD | 🟡 Media | Agregar Product schema para rich snippets en Google |
| Twitter Cards | 🟠 Baja | Meta tags para compartir en redes |
| Breadcrumbs | 🟡 Media | Implementar breadcrumbs con schema markup |
| Alt text en imágenes | 🟡 Media | Verificar que `product-card.tsx` use `alt` descriptivo |

### 7.3 Google Tag Manager

```typescript
// layout.tsx — GTM implementado pero sin data layer completo
// Eventos detectados en product-card.tsx:
window.dataLayer?.push({
  event: "add_to_cart",
  ecommerce: {
    items: [{ item_id, item_name, price, quantity }]
  }
});
```

**Recomendación:** Agregar eventos adicionales:
- `view_item` — al ver un producto
- `begin_checkout` — al iniciar checkout
- `purchase` — al confirmar pedido
- `view_cart` — al ver el carrito

---

## 8. Flujo de Negocio & Lógica Comercial

### 8.1 Flujo de Compra

```
Visitante                  Tienda                 Supabase                WhatsApp
    │                        │                       │                       │
    │  Navega productos      │                       │                       │
    │───────────────────────>│                       │                       │
    │                        │  Fetch productos      │                       │
    │                        │──────────────────────>│                       │
    │  Ver producto          │<─────────────────────│                       │
    │<──────────────────────│                       │                       │
    │                        │                       │                       │
    │  Agregar al carrito    │                       │                       │
    │───────────────────────>│                       │                       │
    │  (Zustand + localStorage)                      │                       │
    │                        │                       │                       │
    │  Completar checkout    │                       │                       │
    │───────────────────────>│                       │                       │
    │                        │  POST /api/checkout   │                       │
    │                        │──────────────────────>│                       │
    │                        │  1. Crear/buscar      │                       │
    │                        │     cliente            │                       │
    │                        │  2. Validar cupón     │                       │
    │                        │  3. Crear pedido      │                       │
    │                        │  4. Crear items       │                       │
    │                        │  5. Incrementar usos  │                       │
    │                        │     del cupón          │                       │
    │                        │<─────────────────────│                       │
    │                        │                       │                       │
    │  Redirigir a WhatsApp  │                       │                       │
    │<──────────────────────│──────────────────────────────────────────────>│
    │                        │                       │                       │
```

### 8.2 Gestión de Pedidos (Admin CRM)

```
Estado del Pedido:
┌──────────┐   ┌───────────┐   ┌───────────┐   ┌────────┐   ┌───────────┐
│Pendiente │──>│Confirmado │──>│Preparando │──>│Enviado │──>│Entregado  │
└──────────┘   └───────────┘   └───────────┘   └────────┘   └───────────┘
     │                                              │              │
     │              ┌────────┐                      │              │
     └─────────────>│Fallido │<─────────────────────┘              │
                    └────────┘                                     │
                                               ┌─────────┐        │
                                               │Devuelto │<───────┘
                                               └─────────┘

Stock Management:
• Stock se descuenta al pasar a "Confirmado" (stock_descontado = true)
• Stock se restaura al pasar a "Fallido" o "Devuelto"
• Soporte para devoluciones parciales (cantidad_devuelta en pedido_items)
```

### 8.3 Sistema de Cupones

| Campo | Descripción | Estado |
|-------|-------------|--------|
| `tipo` | `porcentaje` o `monto` | ✅ |
| `valor` | Porcentaje o monto fijo | ✅ |
| `activo` | Boolean | ✅ |
| `min_total` | Monto mínimo para aplicar | ✅ |
| `max_usos` | Límite de usos | ✅ |
| `starts_at` / `expires_at` | Ventana temporal | ✅ |
| `usos` | Contador de usos | ✅ |

**⚠️ Problema detectado:** La validación de cupones en el checkout tiene un fallback que podría aplicar descuentos incorrectamente si la primera query falla.

### 8.4 Integración con Shalom (Courier)

La tabla `pedidos` tiene campos específicos para el courier Shalom:
- `shalom_orden` — Número de orden Shalom
- `shalom_clave` — Clave de acceso
- `shalom_pin` — PIN de entrega

**⚠️ Estos datos son sensibles** y deberían tener RLS más restrictivo o estar en una tabla separada.

---

## 9. DevOps & Infraestructura

### 9.1 Deployment

| Aspecto | Estado |
|---------|--------|
| Hosting | Vercel (detectado por Speed Insights) |
| CI/CD | GitHub → Vercel (auto-deploy) |
| Base de datos | Supabase Cloud |
| Almacenamiento | Cloudflare R2 |
| DNS/CDN | Probablemente Vercel Edge |

### 9.2 Lo que falta

| Elemento | Prioridad | Recomendación |
|----------|-----------|---------------|
| Monitoring | 🔴 Alta | Integrar Sentry para captura de errores |
| Backups de BD | 🔴 Alta | Verificar que los backups de Supabase estén habilitados |
| Staging environment | 🟡 Media | Usar Supabase Branching para testing |
| Rate limiting | 🔴 Alta | Proteger endpoints públicos |
| Health check | 🟡 Media | Endpoint `/api/health` para monitoreo |
| Logs centralizados | 🟡 Media | Más allá de `console.error` |

---

## 10. Plan de Acción Priorizado

### 🔴 Sprint 1: Seguridad Crítica (1-2 días)

| # | Acción | Esfuerzo | Impacto |
|---|--------|----------|---------|
| 1 | Habilitar Leaked Password Protection en Supabase Auth | 5 min | Alto |
| 2 | Fijar `search_path` en las 4 funciones vulnerables | 15 min | Alto |
| 3 | Corregir políticas RLS `USING (true)` en `categorias`, `clientes`, `pedido_logs`, `social_links` | 1 hora | Crítico |
| 4 | Agregar autenticación al endpoint `/api/upload` | 30 min | Alto |
| 5 | Agregar rate limiting al checkout | 2 horas | Alto |

### 🟡 Sprint 2: Rendimiento de Base de Datos (1 día)

| # | Acción | Esfuerzo | Impacto |
|---|--------|----------|---------|
| 6 | Crear índices para las 9 foreign keys | 30 min | Alto a escala |
| 7 | Consolidar políticas RLS duplicadas (de ~70+ a ~20) | 3 horas | Alto |
| 8 | Optimizar `auth.uid()` → `(select auth.uid())` en 4 políticas | 30 min | Medio |
| 9 | Agregar estado "Cancelado" al CHECK constraint | 15 min | Medio |

### 🟠 Sprint 3: SEO & Crecimiento (2-3 días)

| # | Acción | Esfuerzo | Impacto |
|---|--------|----------|---------|
| 10 | Implementar slugs en productos | 3 horas | Alto |
| 11 | Agregar JSON-LD schema para productos | 2 horas | Alto |
| 12 | Implementar Open Graph tags por producto | 1 hora | Medio |
| 13 | Completar eventos de GTM (view_item, purchase, etc.) | 2 horas | Medio |

### 🟢 Sprint 4: Calidad & Mantenibilidad (ongoing)

| # | Acción | Esfuerzo | Impacto |
|---|--------|----------|---------|
| 14 | Agregar `updated_at` con trigger en tablas principales | 1 hora | Medio |
| 15 | Implementar Sentry para monitoreo de errores | 2 horas | Alto |
| 16 | Refactorizar `use-file-upload.ts` (2,645 líneas) | 4 horas | Medio |
| 17 | Crear tests unitarios para carrito y checkout | 1 día | Alto |
| 18 | Eliminar endpoint deprecado `/api/notify-admin` | 5 min | Bajo |
| 19 | Implementar validación con Zod en API routes | 3 horas | Medio |

---

## Resumen de Calificaciones

| Área | Nota | Justificación |
|------|:----:|---------------|
| **Arquitectura** | 7.5/10 | Sólida base, buena separación de concerns |
| **Seguridad** | 5/10 | RLS habilitado pero mal configurado, endpoints sin protección |
| **Rendimiento** | 6/10 | Funcional ahora, degradará significativamente a escala |
| **Base de Datos** | 6.5/10 | Buen diseño pero falta limpieza de políticas y índices |
| **SEO** | 7/10 | Buenos fundamentos, faltan rich snippets y slugs |
| **Código** | 6.5/10 | Limpio pero sin tests ni manejo de errores consistente |
| **DevOps** | 5.5/10 | Funcional pero sin monitoring ni staging |
| **Negocio** | 8/10 | Flujo completo de e-commerce con roles y auditoría |
| **PROMEDIO** | **6.5/10** | **Producto funcional que necesita hardening antes de escalar** |

---

> 📌 **Conclusión:** Tienda Blama tiene una arquitectura fundamentalmente sólida y bien pensada para un e-commerce con CRM administrativo. La prioridad inmediata debe ser el **hardening de seguridad** (especialmente las políticas RLS) y la **creación de índices** antes de escalar el catálogo de productos y el tráfico. Una vez resueltos estos temas, el proyecto está bien posicionado para crecer.
