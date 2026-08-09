# Graph Report - Tienda-Blama-2026  (2026-08-08)

## Corpus Check
- 276 files · ~157,172 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1320 nodes · 3148 edges · 132 communities (84 shown, 48 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7d7e3c01`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- button.tsx
- pedidos/[id]/page.tsx
- useCheckoutForm.ts
- product-form.tsx
- newsletter-welcome.tsx
- header.tsx
- createClient
- devDependencies
- order-confirmation.tsx
- upload/route.ts
- products.ts
- compilerOptions
- dashboard.client.ts
- producto-detalle-client.tsx
- formatCurrency
- cn
- email.ts
- components.json
- productos.client.ts
- app/page.tsx
- rate-limit.ts
- admin/types.ts
- cart-button.tsx
- useProductDetail.ts
- order-status.tsx
- productos/[id]/page.tsx
- ProductosClient.tsx
- whatsapp/route.ts
- dependencies
- products.server.ts
- database.types.ts
- checkout-form.tsx
- HTML Report Format
- checkout/culqi/route.ts
- PedidoRow
- pedidos/page.tsx
- 🔑 Guía de Accesos y Automatización de Google Tag Manager (GTM)
- opengraph-image.tsx
- twitter-image.tsx
- questions/actions/submit.ts
- input.tsx
- proxy.ts
- webhooks/culqi/route.ts
- @builder.io/partytown
- class-variance-authority
- clsx
- date-fns
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
- resend
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
- checkout/index.ts
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
- 2. Correos de Autenticación — Resend SMTP + Supabase
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
- createClient
- order-file-card.tsx
- gtm.ts
- login/page.tsx
- social-links.client.ts
- marketing-pixels.tsx
- MarketingEventBusImpl
- order-label-generator.tsx
- lenis

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 107 edges
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
- `POST()` --calls--> `createClient()`  [EXTRACTED]
  app/api/upload-proxy/route.ts → lib/supabase.server.ts
- `CardAction()` --calls--> `cn()`  [EXTRACTED]
  components/ui/card.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (132 total, 48 thin omitted)

### Community 0 - "button.tsx"
Cohesion: 0.07
Nodes (74): AuditPage(), ClientesPage(), CouponRow, CouponType, AdminDashboard(), useCurrentUserId(), DashboardPedidosEnProcesoPage(), PROCESS_STATUSES (+66 more)

### Community 1 - "pedidos/[id]/page.tsx"
Cohesion: 0.14
Nodes (21): DialogContent, DialogDescription, DialogFooter(), DialogHeader(), DialogTitle, Tabs(), TabsContent(), TabsList() (+13 more)

### Community 2 - "useCheckoutForm.ts"
Cohesion: 0.13
Nodes (19): FormContent(), checkoutFormSchema, CheckoutFormValues, useCheckoutForm(), UseCheckoutFormOptions, createCheckoutOrder(), isCouponRelatedError(), validateCoupon() (+11 more)

### Community 3 - "product-form.tsx"
Cohesion: 0.15
Nodes (17): Textarea(), CategorySelector(), DEFAULT_CATEGORIES, ProductAttributes(), ProductAttributesProps, ProductBasics(), ProductBasicsProps, ProductPricing() (+9 more)

### Community 4 - "newsletter-welcome.tsx"
Cohesion: 0.08
Nodes (24): bodyStyle, containerStyle, contentSection, couponBox, couponBoxSection, couponCode, couponExpiry, couponLabel (+16 more)

### Community 5 - "header.tsx"
Cohesion: 0.13
Nodes (13): revalidate, sitemap(), AnnouncementBar(), AnnouncementBarProps, Footer(), SocialLink, CartButton, Header() (+5 more)

### Community 6 - "createClient"
Cohesion: 0.09
Nodes (30): CuponesAdminPage(), toDateVal(), toIsoEnd(), toIsoStart(), AdminPreguntasPage(), AdminResenasPage(), ForgotPasswordPage(), AdminSidebar() (+22 more)

### Community 7 - "devDependencies"
Cohesion: 0.06
Nodes (35): eslint, eslint-config-next, googleapis, devDependencies, eslint, eslint-config-next, googleapis, @playwright/test (+27 more)

### Community 8 - "order-confirmation.tsx"
Cohesion: 0.06
Nodes (34): bodyStyle, checkCircleStyle, containerStyle, ctaButton, ctaSection, ctaText, dividerStyle, footerStyle (+26 more)

### Community 9 - "upload/route.ts"
Cohesion: 0.31
Nodes (9): POST(), ALLOWED_CONTENT_TYPES, getEnv(), normalizeDigits(), normalizeText(), submitReviewAction(), R2_BUCKET_NAME, R2_PUBLIC_DOMAIN (+1 more)

### Community 10 - "products.ts"
Cohesion: 0.09
Nodes (35): AdminAnnouncementBarPage(), normalizeMessages(), parseBoolVal(), toBoolVal(), AdminMarketingPage(), UsuariosPage(), AnnouncementBarConfig, getAnnouncementBarConfigAction() (+27 more)

### Community 11 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 12 - "dashboard.client.ts"
Cohesion: 0.23
Nodes (11): DashboardSalesChart(), SalesDataPoint, useDashboardStats(), useSalesChart(), fetchAdminDashboardStats(), fetchAdminSalesChart(), PROCESS_STATUSES, ProcessStatus (+3 more)

### Community 13 - "producto-detalle-client.tsx"
Cohesion: 0.19
Nodes (14): ProductoDetalleClient(), ProductoDetalleClientProps, Product, ProductCard(), ProductCardProps, ProductImageCarousel(), ProductImageCarouselProps, ProductSocialProof() (+6 more)

### Community 14 - "formatCurrency"
Cohesion: 0.15
Nodes (15): QuickCheckoutModal, QuickCheckoutModal, SuccessPage(), SalesChart(), OrdersTable(), renderOriginBadge(), QuickCheckoutModal(), QuickCheckoutModalProps (+7 more)

### Community 15 - "cn"
Cohesion: 0.11
Nodes (24): DialogOverlay, Label(), RadioGroup, RadioGroupItem, ScrollArea(), ScrollBar(), SelectLabel(), SelectScrollDownButton() (+16 more)

### Community 16 - "email.ts"
Cohesion: 0.23
Nodes (12): NewsletterWelcomeEmail(), formatCurrency(), OrderConfirmationEmail(), OrderStatusEmail(), getResend(), OrderItem, sendNewsletterWelcomeEmail(), SendNewsletterWelcomeParams (+4 more)

### Community 17 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 18 - "productos.client.ts"
Cohesion: 0.12
Nodes (21): IncidenciasPage(), ProductosPage(), deleteProductAction(), ProductForm(), createIncidencia(), deleteIncidencia(), fetchIncidencias(), fetchPedidosForIncidencias() (+13 more)

### Community 19 - "app/page.tsx"
Cohesion: 0.14
Nodes (12): HomePageProps, metadata, NewsletterSection, revalidate, BenefitsBar(), Category, CategoryGrid(), HomeScrollReveal() (+4 more)

### Community 20 - "rate-limit.ts"
Cohesion: 0.18
Nodes (15): generateCouponCode(), getEnv(), POST(), runtime, SubscribeBodySchema, POST(), buildHeaders(), checkRateLimit() (+7 more)

### Community 21 - "admin/types.ts"
Cohesion: 0.12
Nodes (19): ACTION_STYLES, getActionStyle(), OrderHistoryCard(), OrderHistoryCardProps, OrdersBulkActionsProps, OrdersFilterBarProps, OrdersTableProps, fetchAdminProfiles() (+11 more)

### Community 22 - "cart-button.tsx"
Cohesion: 0.11
Nodes (21): AdminLayout(), CheckoutPage(), CartButton(), emptyCartAnimation, Lottie, Sheet(), SheetClose(), SheetContent() (+13 more)

### Community 23 - "useProductDetail.ts"
Cohesion: 0.18
Nodes (13): ContactoPage(), ContactSection, ProductoDetalleClient(), ContactSection(), LayoutShell(), useWhatsAppStore, parseProductIdentifier(), useProductDetail() (+5 more)

### Community 24 - "order-status.tsx"
Cohesion: 0.08
Nodes (23): badgeStyle, bodyStyle, containerStyle, ctaButton, ctaSection, ctaText, dividerStyle, footerStyle (+15 more)

### Community 25 - "productos/[id]/page.tsx"
Cohesion: 0.35
Nodes (10): buildDescription(), buildProductUrl(), generateMetadata(), generateStaticParams(), parseProductIdentifier(), ProductoDetallePage(), revalidate, fetchProductForMeta() (+2 more)

### Community 26 - "ProductosClient.tsx"
Cohesion: 0.18
Nodes (16): ProductosClient(), ProductosClientProps, countProducts(), CountProductsParams, listCategories(), listProducts(), ListProductsParams, ListProductsResult (+8 more)

### Community 27 - "whatsapp/route.ts"
Cohesion: 0.22
Nodes (9): CheckoutBodySchema, CheckoutItemSchema, GET(), getEnv(), POST(), runtime, POST(), runtime (+1 more)

### Community 28 - "dependencies"
Cohesion: 0.18
Nodes (11): @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, next, dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, next, @react-email/render (+3 more)

### Community 29 - "products.server.ts"
Cohesion: 0.18
Nodes (15): NotFound(), Home(), Loading(), metadata, PageProps, ProductosPage(), revalidate, createAnonServerClient() (+7 more)

### Community 30 - "database.types.ts"
Cohesion: 0.13
Nodes (14): CartItem, CartState, Product, ProductVariant, CompositeTypes, Constants, Database, DatabaseWithoutInternals (+6 more)

### Community 31 - "checkout-form.tsx"
Cohesion: 0.15
Nodes (11): CheckoutCustomer(), CheckoutCustomerProps, CheckoutFormProps, libraries, CheckoutPayment(), CheckoutShipping(), CheckoutSummary, CheckoutSummaryProps (+3 more)

### Community 32 - "HTML Report Format"
Cohesion: 0.10
Nodes (18): Call-graph collapse, Candidate card, Cross-section (good for layered shallowness), Diagram patterns, Hand-built boxes-and-arrows (when Mermaid's layout fights you), Header, HTML Report Format, Mass diagram (good for "interface as wide as implementation") (+10 more)

### Community 33 - "checkout/culqi/route.ts"
Cohesion: 0.24
Nodes (8): CheckoutItemSchema, CulqiCheckoutSchema, getEnv(), POST(), runtime, addressSchema, checkoutBaseFields, identitySchema

### Community 34 - "PedidoRow"
Cohesion: 0.20
Nodes (10): PedidoTicketPage(), OrderCustomerCardProps, OrderItemsCard(), OrderItemsCardProps, OrderPaymentCardProps, OrderShippingCard(), OrderShippingCardProps, fetchPedidoDetail() (+2 more)

### Community 35 - "pedidos/page.tsx"
Cohesion: 0.16
Nodes (17): PedidoDetallePage(), PedidosPageContent(), CreateOrderModal(), OrdersBulkActions(), OrdersFilterBar(), assignPedidoToWorker(), BulkStockError, checkBulkStockSufficient() (+9 more)

### Community 36 - "🔑 Guía de Accesos y Automatización de Google Tag Manager (GTM)"
Cohesion: 0.12
Nodes (16): 1. Cuenta de Servicio de Google Cloud (Service Account), 2. Permisos Requeridos en la Consola de GTM, 3. Configuración de Scopes en el Código de la API (OAuth Scopes), 4. Estructura y Parámetros del Contenedor de Producción, 5. ⚠️ Lecciones Aprendidas y Diagnóstico de Errores (Crítico para IA), A. Falso Negativo de Permisos (Fallo de Compilación 403), A. Nivel de Cuenta:, B. Evitar IDs de Workspace Hardcodeados (+8 more)

### Community 37 - "opengraph-image.tsx"
Cohesion: 0.40
Nodes (3): contentType, runtime, size

### Community 38 - "twitter-image.tsx"
Cohesion: 0.40
Nodes (3): contentType, runtime, size

### Community 39 - "questions/actions/submit.ts"
Cohesion: 0.70
Nodes (4): getEnv(), normalizePhone(), normalizeText(), submitQuestionAction()

### Community 40 - "input.tsx"
Cohesion: 0.21
Nodes (6): QuestionRow, ReviewRow, Input(), MediaManager(), MediaManagerProps, UploadProgressInfo

### Community 59 - "app/layout.tsx"
Cohesion: 0.21
Nodes (9): geistMono, geistSans, getAnnouncementData, metadata, RootLayout(), Providers(), SmoothScroll(), Toaster() (+1 more)

### Community 97 - "Fase 6: Optimización de Cabecera, Navegación Móvil y Carruseles Interactivos Premium (UX/UI)"
Cohesion: 0.13
Nodes (15): 10. Botón de WhatsApp Flotante Adaptativo e Interactivo Premium, 11. Colapsado por Defecto del Acordeón de Descripción del Producto, 12. Remoción Completa de Dirección Física (Modelo 100% Tienda Virtual), 13. Reemplazo del Icono de Compartir Producto (Estilo Tradicional), 14. Modificación de Título de Newsletter (Suscripción), 14. Modificación de Título de Newsletter (Suscripción), 1. Centrado Absoluto del Logotipo y Limpieza de Cabecera, 2. Optimización Móvil y del Menú Hamburguesa (+7 more)

### Community 98 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 99 - "checkout/index.ts"
Cohesion: 0.20
Nodes (8): CheckoutEngine, CheckoutEngineItem, CheckoutEngineOptions, CheckoutEnginePayload, CheckoutEngineResult, OrderChannel, WhatsAppState, validateAndCalculateTotals()

### Community 100 - "⚡ Casos de Falla Identificados & Propuestas de Solución"
Cohesion: 0.15
Nodes (12): 📦 Análisis Técnico y Logístico: Optimización de Envíos a Provincia (Tienda Blama 2026), Caso 1: Claridad de Envío a Agencia en Provincia sin Fricción en el Checkout, Caso 2: El Costo del Flete en Provincia (Flete Pago en Destino), Caso 3: Flujo Flexible de Pagos en Provincia (Coordinación CRM & Recaudo Shalom), Caso 4: Intentos de Evasión de Tarifa de Provincia (Estratagema "Lima-Falso"), Caso 5: Paquetes Olvidados en la Agencia de Destino, Caso 6: Cliente de Lima que Solicita Retiro en Agencia Shalom, Caso 7: Cliente de Provincia que Solicita Entrega a Domicilio (Olva Courier) (+4 more)

### Community 101 - "🔌 Guía de Integraciones y Configuración (.env)"
Cohesion: 0.17
Nodes (12): 1. Variables de Entorno, 3. Activación de Google Maps API, 4. Pasarela de Pagos — Culqi, 5. Lista de Verificación de Producción (Production Checklist), 6. Analíticas, Píxeles (Meta, TikTok) y Atribución, A. Upstash Redis (Rate Limiting Global), Arquitectura de 4 Píxeles, B. SSL y Redirección en Vercel (+4 more)

### Community 102 - "🛠️ Mejoras y Cambios Detallados"
Cohesion: 0.18
Nodes (11): 10. Mini-reproductores de Video en Panel de Administración, 1. Centralización del Detalle de Productos, 2. Refactorización y Modularidad del Formulario de Checkout, 3. Carga Dinámica en el Panel de Administración (División de Código), 4. Limpieza del Entorno de Desarrollo y Configuración, 5. Centralización de Analíticas, Atribución y Optimización de Medios (Fase 10), 6. Optimización de Textos Persuasivos de Conversión, 7. Resiliencia de Imágenes y Compresión en Navegador (Performance) (+3 more)

### Community 103 - "🔄 Flujo de Trabajo Diario"
Cohesion: 0.18
Nodes (10): 1. Vincular el Proyecto Local, 2. Realizar los cambios en la Consola Web de DEV, 3. Generar la Migración Declarativa, 4. Guardar en el Repositorio (Git), 5. Aplicar Cambios a Producción (PROD), 💡 Consejos de Buenas Prácticas, 📁 Estructura de Entornos, 🔄 Flujo de Trabajo Diario (+2 more)

### Community 104 - "🛠️ 2. Tecnologías Clave e Integraciones Recientes"
Cohesion: 0.20
Nodes (10): 🚀 1. Instalación y Configuración Local, 🛠️ 2. Tecnologías Clave e Integraciones Recientes, 📐 3. Convenciones de Código y Estructura FSD, 🤖 4. Manual de Operación para Agentes de IA (Instrucciones Estrictas), A. Píxeles de Marketing y Google Tag Manager (GTM), B. Almacenamiento y CDN de Imágenes (Cloudflare R2 + Cloudinary Fetch), C. Navegación en Webviews e In-App Browsers (TikTok/Instagram/Facebook), D. Carga de Videos en Panel Admin (+2 more)

### Community 105 - "📦 Instrucciones Paso a Paso"
Cohesion: 0.22
Nodes (8): 1. Ingreso de Órdenes, 2. Comprobación de Pagos, 3. Envíos y Agencia Shalom, 4. Entregas Parciales (Devoluciones Rápidas), 🔄 Flujo de Gestión Diaria, 📦 Instrucciones Paso a Paso, 📘 Manual de Operaciones Administrativo, ⚠️ Reglas y Seguridad

### Community 106 - "Arquitectura Técnica - Tienda Blama 2026"
Cohesion: 0.25
Nodes (7): Arquitectura Técnica - Tienda Blama 2026, 🔒 Capa de Seguridad y Acceso a Datos, 📁 Estructura del Proyecto, Inyección de Supabase, Proxys y Guardias de Roles, Server Components vs Client Components, 🏗️ Topología Serverless (Next.js + Supabase)

### Community 107 - "README.md"
Cohesion: 0.33
Nodes (4): Características e Integridad:, 🚀 Quick Start (Inicio Rápido), 🌀 Scroll Suave con Lenis, 📚 Índice de Documentación

### Community 108 - "🚀 Historial y Resumen de Mejoras Técnicas (Mayo 2026)"
Cohesion: 0.22
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

### Community 112 - "2. Correos de Autenticación — Resend SMTP + Supabase"
Cohesion: 0.40
Nodes (5): 2. Correos de Autenticación — Resend SMTP + Supabase, Arquitectura, Configuración SMTP en Supabase Dashboard, Plantillas de Email, Requisitos DNS (Resend)

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

### Community 123 - "createClient"
Cohesion: 0.35
Nodes (6): POST(), POST(), POST(), GET(), triggerOrderStatusEmail(), createClient()

### Community 124 - "order-file-card.tsx"
Cohesion: 0.29
Nodes (8): ACCENT_MAP, inputId(), isImage(), isPdf(), OrderFileCard(), OrderFileCardProps, PDFPreviewModal(), PDFPreviewModalProps

### Community 125 - "gtm.ts"
Cohesion: 0.31
Nodes (7): GA4Product, GTMEvent, EventListener, MarketingEventBus, MarketingEventPayload, MarketingItem, recentEvents

### Community 126 - "login/page.tsx"
Cohesion: 0.46
Nodes (5): clearLockout(), getAdminClient(), loginWithLockout(), LoginPage(), UpdatePasswordPage()

### Community 127 - "social-links.client.ts"
Cohesion: 0.47
Nodes (5): AdminSocialLinksPage(), deleteSocialLink(), fetchSocialLinks(), saveSocialLink(), SocialLink

### Community 128 - "marketing-pixels.tsx"
Cohesion: 0.40
Nodes (4): ATTRIBUTION_PARAMS, AttributionTracker(), ActivePixel, MarketingPixels()

## Knowledge Gaps
- **507 isolated node(s):** `CouponType`, `CouponRow`, `PROCESS_STATUSES`, `ProcessStatus`, `StatusFilter` (+502 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `button.tsx`, `pedidos/[id]/page.tsx`, `marketing-pixels.tsx`, `pedidos/page.tsx`, `PedidoRow`, `header.tsx`, `useCheckoutForm.ts`, `input.tsx`, `dashboard.client.ts`, `formatCurrency`, `productos.client.ts`, `admin/types.ts`, `cart-button.tsx`, `useProductDetail.ts`, `ProductosClient.tsx`, `login/page.tsx`, `social-links.client.ts`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `pedidos/[id]/page.tsx`, `PedidoRow`, `pedidos/page.tsx`, `order-label-generator.tsx`, `product-form.tsx`, `input.tsx`, `producto-detalle-client.tsx`, `formatCurrency`, `cn`, `app/page.tsx`, `cart-button.tsx`, `useProductDetail.ts`, `ProductosClient.tsx`, `order-file-card.tsx`, `products.server.ts`, `login/page.tsx`, `checkout-form.tsx`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `formatCurrency()` connect `formatCurrency` to `button.tsx`, `pedidos/[id]/page.tsx`, `PedidoRow`, `pedidos/page.tsx`, `useCheckoutForm.ts`, `header.tsx`, `producto-detalle-client.tsx`, `cn`, `productos.client.ts`, `cart-button.tsx`, `useProductDetail.ts`, `checkout-form.tsx`?**
  _High betweenness centrality (0.029) - this node is a cross-community bridge._
- **What connects `CouponType`, `CouponRow`, `PROCESS_STATUSES` to the rest of the system?**
  _507 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `button.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07486564179477566 - nodes in this community are weakly interconnected._
- **Should `pedidos/[id]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13763440860215054 - nodes in this community are weakly interconnected._
- **Should `useCheckoutForm.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._