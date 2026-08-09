# Graph Report - Tienda-Blama-2026  (2026-08-09)

## Corpus Check
- 314 files · ~167,735 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1472 nodes · 3272 edges · 165 communities (85 shown, 80 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `66e9fb47`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- button.tsx
- ajuste-stock-modal.tsx
- useCheckoutForm.ts
- input.tsx
- newsletter-welcome.tsx
- sendGTMEvent
- createClient
- devDependencies
- order-confirmation.tsx
- header.tsx
- products.ts
- compilerOptions
- libro-reclamaciones/page.tsx
- producto-detalle-client.tsx
- utils.ts
- cn
- email.ts
- components.json
- uploadToR2
- @aws-sdk/client-s3
- rate-limit.ts
- admin/types.ts
- Architecture Decision Records
- useProductDetail.ts
- Changelog
- Writing Guidelines for Postgres References
- app/page.tsx
- checkout/index.ts
- dependencies
- ADR-0001: Unificación del Motor de Checkout, Marketing Event Bus y Capa de Datos Supabase
- products.server.ts
- productos/[id]/page.tsx
- HTML Report Format
- app/productos/page.tsx
- pedidos/[id]/page.tsx
- pedidos/page.tsx
- 🔑 Guía de Accesos y Automatización de Google Tag Manager (GTM)
- opengraph-image.tsx
- twitter-image.tsx
- Section Definitions
- checkout/culqi/route.ts
- proxy.ts
- webhooks/culqi/route.ts
- @builder.io/partytown
- class-variance-authority
- clsx
- database.types.ts
- eslint.config.mjs
- exceljs
- framer-motion
- @hookform/resolvers
- jspdf
- app/layout.tsx
- lottie-react
- lucide-react
- next.config.ts
- next-themes
- nextjs-toploader
- qrcode
- radix-ui
- @radix-ui/react-dialog
- @radix-ui/react-label
- @radix-ui/react-radio-group
- @radix-ui/react-scroll-area
- @radix-ui/react-select
- @radix-ui/react-slot
- react
- react-dom
- @react-email/components
- @react-google-maps/api
- react-hook-form
- recharts
- checkout/types.ts
- sharp
- sonner
- @supabase/ssr
- @supabase/supabase-js
- tailwind-merge
- use-places-autocomplete
- @vercel/speed-insights
- zod
- zustand
- postcss.config.mjs
- Fase 6: Optimización de Cabecera, Navegación Móvil y Carruseles Interactivos Premium (UX/UI)
- Find Skills
- quick-checkout-modal.tsx
- ⚡ Casos de Falla Identificados & Propuestas de Solución
- 🔌 Guía de Integraciones y Configuración (.env)
- 🛠️ Mejoras y Cambios Detallados
- 🔄 Flujo de Trabajo Diario
- 🛠️ 2. Tecnologías Clave e Integraciones Recientes
- 📦 Instrucciones Paso a Paso
- Arquitectura Técnica - Tienda Blama 2026
- README.md
- 🚀 Historial y Resumen de Mejoras Técnicas (Mayo 2026)
- Lógica de Negocio y Flujo de Operaciones
- Fase 10: Centralización de Analíticas, Atribución de Tráfico y Optimización de Medios (Junio 2026)
- Fase 9: Sistema de Suscripción al Newsletter con Generación de Cupones Únicos y No Transferibles
- whatsapp/route.ts
- Fase 5: Optimización del Flujo Logístico a Provincias y Control Multicourier (Shalom / Olva)
- Fase 3: Mitigación de Riesgos y Control de Fallos Operativos (AMFE)
- Informe de Mejoras e Implementaciones - Tienda Blama 2026
- Fase 8: Filtros Multiselección Inteligentes en Gestión de Pedidos (CRM Admin)
- Fase 4: Consolidación, Mapeo y Seguridad de Base de Datos (Supabase)
- Fase 2: Escalabilidad, Media y Correos Transaccionales (Enterprise)
- frontend-design.md
- rules/graphify.md
- workflows/graphify.md
- GEMINI.md
- cart/types.ts
- Supabase Postgres Best Practices
- home-scroll-reveal.tsx
- 6. Analíticas, Píxeles (Meta, TikTok) y Atribución
- questions/actions/submit.ts
- marketing-pixels.tsx
- MarketingEventBusImpl
- order-label-generator.tsx
- lenis
- advanced-full-text-search.md
- advanced-jsonb-indexing.md
- conn-idle-timeout.md
- conn-limits.md
- conn-pooling.md
- conn-prepared-statements.md
- data-batch-inserts.md
- data-n-plus-one.md
- data-pagination.md
- data-upsert.md
- lock-advisory.md
- lock-deadlock-prevention.md
- lock-short-transactions.md
- lock-skip-locked.md
- monitor-explain-analyze.md
- monitor-pg-stat-statements.md
- monitor-vacuum-analyze.md
- query-composite-indexes.md
- query-covering-indexes.md
- query-index-types.md
- query-missing-indexes.md
- query-partial-indexes.md
- schema-constraints.md
- schema-data-types.md
- schema-foreign-key-indexes.md
- schema-lowercase-identifiers.md
- schema-partitioning.md
- schema-primary-keys.md
- security-privileges.md
- security-rls-basics.md
- security-rls-performance.md
- _template.md
- date-fns

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 108 edges
2. `cn()` - 81 edges
3. `Button()` - 67 edges
4. `formatCurrency()` - 51 edges
5. `useRoleGuard()` - 48 edges
6. `Input()` - 43 edges
7. `Label()` - 31 edges
8. `AccessDenied()` - 24 edges
9. `SelectTrigger()` - 20 edges
10. `SelectContent()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `ClientesPage()` --indirect_call--> `fetchAdminClientes()`  [INFERRED]
  app/admin/clientes/page.tsx → features/admin/services/clientes.client.ts
- `InventarioPage()` --indirect_call--> `fetchAdminInventory()`  [INFERRED]
  app/admin/inventario/page.tsx → features/admin/services/inventario.client.ts
- `UsuariosPage()` --indirect_call--> `fetchAdminProfiles()`  [INFERRED]
  app/admin/usuarios/page.tsx → features/admin/services/usuarios.client.ts
- `ForgotPasswordPage()` --calls--> `createClient()`  [EXTRACTED]
  app/auth/forgot-password/page.tsx → lib/supabase.client.ts
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  components/ui/card.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (165 total, 80 thin omitted)

### Community 0 - "button.tsx"
Cohesion: 0.08
Nodes (74): AdminAnnouncementBarPage(), normalizeMessages(), parseBoolVal(), toBoolVal(), AuditPage(), ClientesPage(), CouponRow, CouponType (+66 more)

### Community 1 - "ajuste-stock-modal.tsx"
Cohesion: 0.17
Nodes (16): DialogContent, DialogDescription, DialogFooter(), DialogHeader(), DialogTitle, ItemData, CreateOrderModalProps, SelectedItem (+8 more)

### Community 2 - "useCheckoutForm.ts"
Cohesion: 0.18
Nodes (15): QuickForm(), CheckoutDraft, useCheckoutDraft(), checkoutFormSchema, CheckoutFormValues, useCheckoutForm(), UseCheckoutFormOptions, createCheckoutOrder() (+7 more)

### Community 3 - "input.tsx"
Cohesion: 0.09
Nodes (32): clearLockout(), getAdminClient(), loginWithLockout(), ForgotPasswordPage(), LoginPage(), UpdatePasswordPage(), NewsletterSection, Input() (+24 more)

### Community 4 - "newsletter-welcome.tsx"
Cohesion: 0.04
Nodes (47): bodyStyle, containerStyle, contentSection, couponBox, couponBoxSection, couponCode, couponExpiry, couponLabel (+39 more)

### Community 5 - "sendGTMEvent"
Cohesion: 0.12
Nodes (18): ContactoPage(), ContactSection, AnnouncementBar(), AnnouncementBarProps, ContactSection(), AnnouncementData, LayoutShell(), LayoutShellProps (+10 more)

### Community 6 - "createClient"
Cohesion: 0.10
Nodes (27): AdminPreguntasPage(), AdminSocialLinksPage(), AdminResenasPage(), AdminSidebar(), AdminSidebarProps, AnnouncementBarConfig, AuditLog, fetchAuditLogs() (+19 more)

### Community 7 - "devDependencies"
Cohesion: 0.06
Nodes (35): eslint, eslint-config-next, googleapis, devDependencies, eslint, eslint-config-next, googleapis, @playwright/test (+27 more)

### Community 8 - "order-confirmation.tsx"
Cohesion: 0.06
Nodes (34): bodyStyle, checkCircleStyle, containerStyle, ctaButton, ctaSection, ctaText, dividerStyle, footerStyle (+26 more)

### Community 9 - "header.tsx"
Cohesion: 0.24
Nodes (5): Footer(), SocialLink, Header(), PeruFlag(), getAutocompleteResults()

### Community 10 - "products.ts"
Cohesion: 0.06
Nodes (49): ProductosPage(), UsuariosPage(), POST(), POST(), POST(), POST(), ALLOWED_CONTENT_TYPES, GET() (+41 more)

### Community 11 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 12 - "libro-reclamaciones/page.tsx"
Cohesion: 0.09
Nodes (30): AdminDashboard(), DashboardSalesChart(), useCurrentUserId(), AdminMarketingPage(), formSchema, FormValues, Card(), CardAction() (+22 more)

### Community 13 - "producto-detalle-client.tsx"
Cohesion: 0.19
Nodes (15): ProductoDetalleClientProps, Product, ProductCard(), ProductCardProps, ProductImageCarousel(), ProductImageCarouselProps, ProductSocialProof(), QuestionRow (+7 more)

### Community 14 - "utils.ts"
Cohesion: 0.14
Nodes (16): PedidoTicketPage(), revalidate, sitemap(), OrderItemsCard(), OrderItemsCardProps, PedidoItemRow, CheckoutSummary, CheckoutSummaryProps (+8 more)

### Community 15 - "cn"
Cohesion: 0.06
Nodes (47): AdminLayout(), CheckoutPage(), CartButton(), emptyCartAnimation, Lottie, CartButton, DialogOverlay, RadioGroup (+39 more)

### Community 16 - "email.ts"
Cohesion: 0.18
Nodes (15): POST(), runtime, NewsletterWelcomeEmail(), formatCurrency(), OrderConfirmationEmail(), OrderStatusEmail(), getResend(), OrderItem (+7 more)

### Community 17 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 18 - "uploadToR2"
Cohesion: 0.22
Nodes (11): IncidenciasPage(), createIncidencia(), deleteIncidencia(), fetchIncidencias(), fetchPedidosForIncidencias(), uploadIncidenciaImages(), uploadProductImages(), uploadProductVideos() (+3 more)

### Community 20 - "rate-limit.ts"
Cohesion: 0.18
Nodes (15): generateCouponCode(), getEnv(), POST(), runtime, SubscribeBodySchema, POST(), buildHeaders(), checkRateLimit() (+7 more)

### Community 21 - "admin/types.ts"
Cohesion: 0.13
Nodes (19): ACTION_STYLES, getActionStyle(), OrderHistoryCard(), OrderHistoryCardProps, createAdminCategoria(), fetchAdminProductos(), AdminPedido, AdminPedidoItem (+11 more)

### Community 22 - "Architecture Decision Records"
Cohesion: 0.10
Nodes (20): 1. What is an ADR?, 2. When to Write an ADR, 3. ADR Lifecycle, ADR Index (README.md), ADR Management, Architecture Decision Records, Automation (adr-tools), Best Practices (+12 more)

### Community 23 - "useProductDetail.ts"
Cohesion: 0.20
Nodes (8): ProductoDetalleClient(), ProductoDetalleClient(), parseProductIdentifier(), useProductDetail(), VideoGroup, VideoSource, getProductDetail(), getRecommendedProducts()

### Community 24 - "Changelog"
Cohesion: 0.12
Nodes (16): [1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02), [1.3.0](https://github.com/supabase/agent-skills/compare/v1.2.0...v1.3.0) (2026-06-05), [1.4.0](https://github.com/supabase/agent-skills/compare/v1.3.0...v1.4.0) (2026-07-10), [1.5.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.4.0...supabase-postgres-best-practices-v1.5.0) (2026-07-30), [1.6.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.5.0...supabase-postgres-best-practices-v1.6.0) (2026-07-30), Bug Fixes, Bug Fixes, Bug Fixes (+8 more)

### Community 25 - "Writing Guidelines for Postgres References"
Cohesion: 0.12
Nodes (15): 1. Concrete Transformation Patterns, 2. Error-First Structure, 3. Quantified Impact, 4. Self-Contained Examples, 5. Semantic Naming, Code Example Standards, Comments, Impact Level Guidelines (+7 more)

### Community 26 - "app/page.tsx"
Cohesion: 0.17
Nodes (11): NotFound(), Home(), HomePageProps, metadata, revalidate, BenefitsBar(), Category, CategoryGrid() (+3 more)

### Community 27 - "checkout/index.ts"
Cohesion: 0.24
Nodes (7): CheckoutEngine, CheckoutEngineItem, CheckoutEngineOptions, CheckoutEnginePayload, CheckoutEngineResult, OrderChannel, validateAndCalculateTotals()

### Community 28 - "dependencies"
Cohesion: 0.18
Nodes (11): @aws-sdk/s3-request-presigner, next, dependencies, @aws-sdk/s3-request-presigner, next, @react-email/render, resend, @tanstack/react-query (+3 more)

### Community 29 - "ADR-0001: Unificación del Motor de Checkout, Marketing Event Bus y Capa de Datos Supabase"
Cohesion: 0.15
Nodes (12): 1. Contexto y Problema del Negocio, 2. Factores Clave de la Decisión (Decision Drivers), 3. Opciones Consideradas, 4. Decisión Propuesta, 5. Consecuencias, 6. Plan de Ejecución, ADR-0001: Unificación del Motor de Checkout, Marketing Event Bus y Capa de Datos Supabase, Estatus (+4 more)

### Community 30 - "products.server.ts"
Cohesion: 0.17
Nodes (18): ProductosClientProps, countProducts(), CountProductsParams, listCategories(), listProducts(), ListProductsParams, ListProductsResult, ProductDetailResult (+10 more)

### Community 31 - "productos/[id]/page.tsx"
Cohesion: 0.33
Nodes (11): buildDescription(), buildProductUrl(), generateMetadata(), generateStaticParams(), parseProductIdentifier(), ProductoDetallePage(), revalidate, createAnonServerClient() (+3 more)

### Community 32 - "HTML Report Format"
Cohesion: 0.10
Nodes (18): Call-graph collapse, Candidate card, Cross-section (good for layered shallowness), Diagram patterns, Hand-built boxes-and-arrows (when Mermaid's layout fights you), Header, HTML Report Format, Mass diagram (good for "interface as wide as implementation") (+10 more)

### Community 33 - "app/productos/page.tsx"
Cohesion: 0.25
Nodes (9): Loading(), metadata, PageProps, ProductosPage(), revalidate, ProductosClient(), listCategories, listProducts() (+1 more)

### Community 34 - "pedidos/[id]/page.tsx"
Cohesion: 0.12
Nodes (19): PedidoDetallePage(), OrderCustomerCard(), OrderCustomerCardProps, OrderNotesCard(), METODO_ICONS, METODOS_REQUIEREN_COMPROBANTE, OrderPaymentCard(), OrderPaymentCardProps (+11 more)

### Community 35 - "pedidos/page.tsx"
Cohesion: 0.18
Nodes (16): PedidosPageContent(), CreateOrderModal(), OrdersBulkActions(), OrdersFilterBar(), assignPedidoToWorker(), BulkStockError, checkBulkStockSufficient(), createManualPedido() (+8 more)

### Community 36 - "🔑 Guía de Accesos y Automatización de Google Tag Manager (GTM)"
Cohesion: 0.12
Nodes (16): 1. Cuenta de Servicio de Google Cloud (Service Account), 2. Permisos Requeridos en la Consola de GTM, 3. Configuración de Scopes en el Código de la API (OAuth Scopes), 4. Estructura y Parámetros del Contenedor de Producción, 5. ⚠️ Lecciones Aprendidas y Diagnóstico de Errores (Crítico para IA), A. Falso Negativo de Permisos (Fallo de Compilación 403), A. Nivel de Cuenta:, B. Evitar IDs de Workspace Hardcodeados (+8 more)

### Community 37 - "opengraph-image.tsx"
Cohesion: 0.40
Nodes (3): contentType, runtime, size

### Community 38 - "twitter-image.tsx"
Cohesion: 0.40
Nodes (3): contentType, runtime, size

### Community 39 - "Section Definitions"
Cohesion: 0.20
Nodes (9): 1. Query Performance (query), 2. Connection Management (conn), 3. Security & RLS (security), 4. Schema Design (schema), 5. Concurrency & Locking (lock), 6. Data Access Patterns (data), 7. Monitoring & Diagnostics (monitor), 8. Advanced Features (advanced) (+1 more)

### Community 40 - "checkout/culqi/route.ts"
Cohesion: 0.24
Nodes (8): CheckoutItemSchema, CulqiCheckoutSchema, getEnv(), POST(), runtime, addressSchema, checkoutBaseFields, identitySchema

### Community 53 - "database.types.ts"
Cohesion: 0.20
Nodes (9): CompositeTypes, Constants, DatabaseWithoutInternals, DefaultSchema, Enums, Json, Tables, TablesInsert (+1 more)

### Community 59 - "app/layout.tsx"
Cohesion: 0.21
Nodes (9): geistMono, geistSans, getAnnouncementData, metadata, RootLayout(), Providers(), SmoothScroll(), Toaster() (+1 more)

### Community 79 - "checkout/types.ts"
Cohesion: 0.31
Nodes (6): CheckoutItem, CreateOrderError, CreateOrderPayload, CreateOrderResponse, CreateOrderSuccess, ValidateCouponResult

### Community 97 - "Fase 6: Optimización de Cabecera, Navegación Móvil y Carruseles Interactivos Premium (UX/UI)"
Cohesion: 0.13
Nodes (15): 10. Botón de WhatsApp Flotante Adaptativo e Interactivo Premium, 11. Colapsado por Defecto del Acordeón de Descripción del Producto, 12. Remoción Completa de Dirección Física (Modelo 100% Tienda Virtual), 13. Reemplazo del Icono de Compartir Producto (Estilo Tradicional), 14. Modificación de Título de Newsletter (Suscripción), 14. Modificación de Título de Newsletter (Suscripción), 1. Centrado Absoluto del Logotipo y Limpieza de Cabecera, 2. Optimización Móvil y del Menú Hamburguesa (+7 more)

### Community 98 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 99 - "quick-checkout-modal.tsx"
Cohesion: 0.16
Nodes (11): QuickCheckoutModal, QuickCheckoutModal, SuccessPage(), SuccessCheckmark(), QuickCheckoutModal(), QuickCheckoutModalProps, QuickAddress(), QuickCustomer() (+3 more)

### Community 100 - "⚡ Casos de Falla Identificados & Propuestas de Solución"
Cohesion: 0.15
Nodes (12): 📦 Análisis Técnico y Logístico: Optimización de Envíos a Provincia (Tienda Blama 2026), Caso 1: Claridad de Envío a Agencia en Provincia sin Fricción en el Checkout, Caso 2: El Costo del Flete en Provincia (Flete Pago en Destino), Caso 3: Flujo Flexible de Pagos en Provincia (Coordinación CRM & Recaudo Shalom), Caso 4: Intentos de Evasión de Tarifa de Provincia (Estratagema "Lima-Falso"), Caso 5: Paquetes Olvidados en la Agencia de Destino, Caso 6: Cliente de Lima que Solicita Retiro en Agencia Shalom, Caso 7: Cliente de Provincia que Solicita Entrega a Domicilio (Olva Courier) (+4 more)

### Community 101 - "🔌 Guía de Integraciones y Configuración (.env)"
Cohesion: 0.17
Nodes (12): 1. Variables de Entorno, 2. Correos de Autenticación — Resend SMTP + Supabase, 3. Activación de Google Maps API, 4. Pasarela de Pagos — Culqi, 5. Lista de Verificación de Producción (Production Checklist), A. Upstash Redis (Rate Limiting Global), Arquitectura, B. SSL y Redirección en Vercel (+4 more)

### Community 102 - "🛠️ Mejoras y Cambios Detallados"
Cohesion: 0.18
Nodes (11): 10. Mini-reproductores de Video en Panel de Administración, 1. Centralización del Detalle de Productos, 2. Refactorización y Modularidad del Formulario de Checkout, 3. Carga Dinámica en el Panel de Administración (División de Código), 4. Limpieza del Entorno de Desarrollo y Configuración, 5. Centralización de Analíticas, Atribución y Optimización de Medios (Fase 10), 6. Optimización de Textos Persuasivos de Conversión, 7. Resiliencia de Imágenes y Compresión en Navegador (Performance) (+3 more)

### Community 103 - "🔄 Flujo de Trabajo Diario"
Cohesion: 0.18
Nodes (10): 1. Vincular el Proyecto Local, 2. Realizar los cambios en la Consola Web de DEV, 3. Generar la Migración Declarativa, 4. Guardar en el Repositorio (Git), 5. Aplicar Cambios a Producción (PROD), 💡 Consejos de Buenas Prácticas, 📁 Estructura de Entornos, 🔄 Flujo de Trabajo Diario (+2 more)

### Community 104 - "🛠️ 2. Tecnologías Clave e Integraciones Recientes"
Cohesion: 0.15
Nodes (13): 🧠 1.1 Herramientas de IA y Grafo de Conocimiento (Graphify & Vercel Skills), 🚀 1. Instalación y Configuración Local, 🛠️ 2. Tecnologías Clave e Integraciones Recientes, 📐 3. Convenciones de Código y Estructura FSD, 🤖 4. Manual de Operación para Agentes de IA (Instrucciones Estrictas), A. Graphify (Grafo de Conocimiento del Código), A. Píxeles de Marketing y Google Tag Manager (GTM), B. Almacenamiento y CDN de Imágenes (Cloudflare R2 + Cloudinary Fetch) (+5 more)

### Community 105 - "📦 Instrucciones Paso a Paso"
Cohesion: 0.22
Nodes (8): 1. Ingreso de Órdenes, 2. Comprobación de Pagos, 3. Envíos y Agencia Shalom, 4. Entregas Parciales (Devoluciones Rápidas), 🔄 Flujo de Gestión Diaria, 📦 Instrucciones Paso a Paso, 📘 Manual de Operaciones Administrativo, ⚠️ Reglas y Seguridad

### Community 106 - "Arquitectura Técnica - Tienda Blama 2026"
Cohesion: 0.25
Nodes (7): Arquitectura Técnica - Tienda Blama 2026, 🔒 Capa de Seguridad y Acceso a Datos, 📁 Estructura del Proyecto, Inyección de Supabase, Proxys y Guardias de Roles, Server Components vs Client Components, 🏗️ Topología Serverless (Next.js + Supabase)

### Community 107 - "README.md"
Cohesion: 0.29
Nodes (4): Características e Integridad:, 🚀 Quick Start (Inicio Rápido), 🌀 Scroll Suave con Lenis, 📚 Índice de Documentación

### Community 108 - "🚀 Historial y Resumen de Mejoras Técnicas (Mayo 2026)"
Cohesion: 0.25
Nodes (8): 1. Seguimiento Dinámico de Porcentaje (XHR Native), 1. Transición Seguro a `.maybeSingle()`, 2. Estándar Next.js 16 Edge Proxy, 2. Panel Multitarea de Progreso en Panel de Administración, Fase 1: Robustez y Resiliencia en Consultas del Core (PostgREST), Fase 7: Sistema Profesional de Carga de Medios y Feedback en Tiempo Real (UX/UI Admin), 🚀 Historial y Resumen de Mejoras Técnicas (Mayo 2026), 📂 Índice de Mejoras por Fases

### Community 109 - "Lógica de Negocio y Flujo de Operaciones"
Cohesion: 0.29
Nodes (6): 🔐 Descuento Atómico de Stock (El problema de concurrencia), 📦 El Ciclo de Vida de un Pedido (Máquina de Estados), Flujo de Concurrencia:, 🏢 Jerarquía de Roles del Sistema, Lógica de Negocio y Flujo de Operaciones, 🛡️ Seguridad Transaccional "Cero Confianza" (Zero-Trust)

### Community 110 - "Fase 10: Centralización de Analíticas, Atribución de Tráfico y Optimización de Medios (Junio 2026)"
Cohesion: 0.29
Nodes (7): 1. Rastreador de Atribución Global & Persistencia de Cookies, 2. Arquitectura de 4 Píxeles Unificada (Meta & TikTok), 3. Solución a Alerta de TikTok (Advanced Matching en Conversiones), 4. Solución a Bloqueo de Navegación en TikTok WebViews, 5. Incremental Static Regeneration (ISR) y Carga de Scripts Diferida, 6. Almacenamiento Optimizado (Cloudflare R2 y Doble Formato de Video), Fase 10: Centralización de Analíticas, Atribución de Tráfico y Optimización de Medios (Junio 2026)

### Community 111 - "Fase 9: Sistema de Suscripción al Newsletter con Generación de Cupones Únicos y No Transferibles"
Cohesion: 0.33
Nodes (6): 1. Base de Datos & Seguridad (Supabase), 2. Plantilla de Correo de Bienvenida Premium (React-Email & Resend), 3. Endpoint de Registro & Prevención de Spam, 4. Componente de UI Frontend, 5. Validación de Propiedad del Cupón en Checkout (No Transferencia), Fase 9: Sistema de Suscripción al Newsletter con Generación de Cupones Únicos y No Transferibles

### Community 112 - "whatsapp/route.ts"
Cohesion: 0.38
Nodes (6): CheckoutBodySchema, CheckoutItemSchema, GET(), getEnv(), POST(), runtime

### Community 113 - "Fase 5: Optimización del Flujo Logístico a Provincias y Control Multicourier (Shalom / Olva)"
Cohesion: 0.40
Nodes (5): 1. Robustez de Base de Datos y Sincronización Remota (DEV & PROD), 2. Checkout Adaptativo de Alta Conversión (Sin Fricción), 3. Ficha CRM Logística Flexible e Interactiva, 4. Emails Transaccionales Adaptativos (Alta Fidelidad), Fase 5: Optimización del Flujo Logístico a Provincias y Control Multicourier (Shalom / Olva)

### Community 114 - "Fase 3: Mitigación de Riesgos y Control de Fallos Operativos (AMFE)"
Cohesion: 0.40
Nodes (5): 1. Robustez e Idempotencia en Pasarela Culqi (Webhook), 2. Sincronización CRM de Panel de Administración en Tiempo Real (Supabase Realtime), 3. Mitigación del Cansancio Operativo (Verificación Manual Shalom), 4. Maximización en Captura de Correos, Fase 3: Mitigación de Riesgos y Control de Fallos Operativos (AMFE)

### Community 115 - "Informe de Mejoras e Implementaciones - Tienda Blama 2026"
Cohesion: 0.40
Nodes (4): 🚀 Despliegue en Producción, Informe de Mejoras e Implementaciones - Tienda Blama 2026, 🚦 Pruebas de Calidad Ejecutadas, 📈 Resumen General del Estado del Proyecto

### Community 116 - "Fase 8: Filtros Multiselección Inteligentes en Gestión de Pedidos (CRM Admin)"
Cohesion: 0.50
Nodes (4): 1. Desplegables Interactivos Multiselección, 2. Soporte en el Backend y consultas a Supabase, 3. Filtro de Estado de Pago del Pedido (`pago_status`), Fase 8: Filtros Multiselección Inteligentes en Gestión de Pedidos (CRM Admin)

### Community 117 - "Fase 4: Consolidación, Mapeo y Seguridad de Base de Datos (Supabase)"
Cohesion: 0.50
Nodes (4): 1. Esquema Maestro Unificado y Declarativo, 2. Semilla de Prueba Optimizada, 3. Archivo del Historial y Limpieza de Raíz, Fase 4: Consolidación, Mapeo y Seguridad de Base de Datos (Supabase)

### Community 118 - "Fase 2: Escalabilidad, Media y Correos Transaccionales (Enterprise)"
Cohesion: 0.50
Nodes (4): 1. Rate Limiting Serverless Inteligente (Upstash Redis), 2. Pipeline de Compresión y Optimización de Imágenes (Sharp + R2), 3. Correos Transaccionales Interactivos con Validación de Shalom, Fase 2: Escalabilidad, Media y Correos Transaccionales (Enterprise)

### Community 123 - "cart/types.ts"
Cohesion: 0.38
Nodes (4): CartItem, CartState, Product, ProductVariant

### Community 124 - "Supabase Postgres Best Practices"
Cohesion: 0.33
Nodes (5): How to Use, References, Rule Categories by Priority, Supabase Postgres Best Practices, When to Apply

### Community 125 - "home-scroll-reveal.tsx"
Cohesion: 0.40
Nodes (4): HomeScrollReveal(), Direction, ScrollReveal(), ScrollRevealProps

### Community 126 - "6. Analíticas, Píxeles (Meta, TikTok) y Atribución"
Cohesion: 0.40
Nodes (5): 6. Analíticas, Píxeles (Meta, TikTok) y Atribución, Arquitectura de 4 Píxeles, Coincidencia Avanzada (Advanced Matching), Instrucciones para la Importación Rápida en GTM, Rastreo y Atribución de Campañas

### Community 127 - "questions/actions/submit.ts"
Cohesion: 0.70
Nodes (4): getEnv(), normalizePhone(), normalizeText(), submitQuestionAction()

### Community 128 - "marketing-pixels.tsx"
Cohesion: 0.40
Nodes (4): ATTRIBUTION_PARAMS, AttributionTracker(), ActivePixel, MarketingPixels()

## Knowledge Gaps
- **599 isolated node(s):** `CouponType`, `CouponRow`, `PROCESS_STATUSES`, `ProcessStatus`, `StatusFilter` (+594 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **80 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `button.tsx`, `marketing-pixels.tsx`, `pedidos/[id]/page.tsx`, `pedidos/page.tsx`, `input.tsx`, `quick-checkout-modal.tsx`, `useCheckoutForm.ts`, `header.tsx`, `products.ts`, `libro-reclamaciones/page.tsx`, `producto-detalle-client.tsx`, `cn`, `checkout/types.ts`, `uploadToR2`, `admin/types.ts`, `useProductDetail.ts`, `products.server.ts`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `ajuste-stock-modal.tsx`, `pedidos/[id]/page.tsx`, `pedidos/page.tsx`, `input.tsx`, `quick-checkout-modal.tsx`, `sendGTMEvent`, `order-label-generator.tsx`, `libro-reclamaciones/page.tsx`, `producto-detalle-client.tsx`, `utils.ts`, `cn`, `app/page.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `formatCurrency()` connect `utils.ts` to `button.tsx`, `ajuste-stock-modal.tsx`, `pedidos/[id]/page.tsx`, `quick-checkout-modal.tsx`, `pedidos/page.tsx`, `useCheckoutForm.ts`, `header.tsx`, `products.ts`, `libro-reclamaciones/page.tsx`, `producto-detalle-client.tsx`, `cn`, `useProductDetail.ts`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `CouponType`, `CouponRow`, `PROCESS_STATUSES` to the rest of the system?**
  _599 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07856598016781083 - nodes in this community are weakly interconnected._
- **Should `input.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08735150244584207 - nodes in this community are weakly interconnected._
- **Should `newsletter-welcome.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.039965986394557826 - nodes in this community are weakly interconnected._