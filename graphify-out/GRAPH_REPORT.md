# Graph Report - Tienda-Blama-2026  (2026-08-10)

## Corpus Check
- 329 files · ~237,128 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1478 nodes · 3402 edges · 160 communities (79 shown, 81 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cfb3747a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- pedidos/page.tsx
- quick-checkout-modal.tsx
- product-form.tsx
- newsletter-welcome.tsx
- PedidoRow
- ProductosClient.tsx
- devDependencies
- order-confirmation.tsx
- app/layout.tsx
- mi-cuenta/page.tsx
- compilerOptions
- dashboard/page.tsx
- producto-detalle-client.tsx
- checkout/culqi/route.ts
- createClient
- email.ts
- components.json
- createClient
- admin/types.ts
- rate-limit.ts
- button.tsx
- Architecture Decision Records
- order-status.tsx
- Changelog
- Writing Guidelines for Postgres References
- formatCurrency
- checkout-engine.ts
- dependencies
- useCheckoutForm.ts
- checkout-form.tsx
- app/page.tsx
- HTML Report Format
- layout-shell.tsx
- order-file-card.tsx
- gtm.ts
- 🔑 Guía de Accesos y Automatización de Google Tag Manager (GTM)
- opengraph-image.tsx
- twitter-image.tsx
- Section Definitions
- products.server.ts
- proxy.ts
- webhooks/culqi/route.ts
- devoluciones/page.tsx
- envios/page.tsx
- uploadToR2
- order-history-card.tsx
- clsx
- success/page.tsx
- eslint.config.mjs
- exceljs
- framer-motion
- @hookform/resolvers
- jspdf
- 2. Correos de Autenticación — Resend SMTP + Supabase
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
- footer.tsx
- sharp
- sonner
- @supabase/ssr
- @supabase/supabase-js
- tailwind-merge
- KPI Dashboard Design
- @vercel/speed-insights
- zod
- zustand
- postcss.config.mjs
- whatsapp/route.ts
- Find Skills
- social-links.client.ts
- ⚡ Casos de Falla Identificados & Propuestas de Solución
- 🔌 Guía de Integraciones y Configuración (.env)
- 🛠️ Mejoras y Cambios Detallados
- 🔄 Flujo de Trabajo Diario
- 🛠️ 2. Tecnologías Clave e Integraciones Recientes
- 📦 Instrucciones Paso a Paso
- Arquitectura Técnica - Tienda Blama 2026
- README.md
- lenis
- Lógica de Negocio y Flujo de Operaciones
- resend
- MarketingEventBusImpl
- Common KPIs by Department
- orders-bulk-actions.tsx
- class-variance-authority
- Informe de Mejoras e Implementaciones - Tienda Blama 2026
- questions/actions/submit.ts
- order-label-generator.tsx
- frontend-design.md
- rules/graphify.md
- workflows/graphify.md
- GEMINI.md
- Supabase Postgres Best Practices
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
- Web Interface Guidelines
- useProductDetail.ts
- use-places-autocomplete
- @builder.io/partytown

## God Nodes (most connected - your core abstractions)
1. `createClient()` - 110 edges
2. `cn()` - 83 edges
3. `Button()` - 75 edges
4. `formatCurrency()` - 50 edges
5. `useRoleGuard()` - 48 edges
6. `Input()` - 47 edges
7. `Label()` - 33 edges
8. `createClient()` - 26 edges
9. `AccessDenied()` - 24 edges
10. `Card()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `ClientesPage()` --indirect_call--> `fetchAdminClientes()`  [INFERRED]
  app/admin/clientes/page.tsx → features/admin/services/clientes.client.ts
- `InventarioPage()` --indirect_call--> `fetchAdminInventory()`  [INFERRED]
  app/admin/inventario/page.tsx → features/admin/services/inventario.client.ts
- `UsuariosPage()` --indirect_call--> `fetchAdminProfiles()`  [INFERRED]
  app/admin/usuarios/page.tsx → features/admin/services/usuarios.client.ts
- `SheetOverlay()` --calls--> `cn()`  [EXTRACTED]
  components/ui/sheet.tsx → lib/utils.ts
- `SheetFooter()` --calls--> `cn()`  [EXTRACTED]
  components/ui/sheet.tsx → lib/utils.ts

## Import Cycles
- None detected.

## Communities (160 total, 81 thin omitted)

### Community 0 - "cn"
Cohesion: 0.06
Nodes (98): ClientesPage(), CouponRow, CouponType, PROCESS_STATUSES, ProcessStatus, StatusFilter, Tipo, TipoFilter (+90 more)

### Community 1 - "pedidos/page.tsx"
Cohesion: 0.16
Nodes (18): PedidosPageContent(), CreateOrderModal(), CreateOrderModalProps, SelectedItem, OrdersFilterBar(), OrdersTable(), renderOriginBadge(), assignPedidoToWorker() (+10 more)

### Community 2 - "quick-checkout-modal.tsx"
Cohesion: 0.17
Nodes (11): QuickCheckoutModal, QuickCheckoutModal, SuccessCheckmark(), QuickCheckoutModal(), QuickCheckoutModalProps, QuickForm(), QuickAddress(), QuickAddressProps (+3 more)

### Community 3 - "product-form.tsx"
Cohesion: 0.13
Nodes (20): upsertProductAction(), CategorySelector(), DEFAULT_CATEGORIES, MediaManager(), ProductAttributes(), ProductAttributesProps, ProductBasics(), ProductBasicsProps (+12 more)

### Community 4 - "newsletter-welcome.tsx"
Cohesion: 0.08
Nodes (24): bodyStyle, containerStyle, contentSection, couponBox, couponBoxSection, couponCode, couponExpiry, couponLabel (+16 more)

### Community 5 - "PedidoRow"
Cohesion: 0.20
Nodes (10): PedidoTicketPage(), OrderCustomerCardProps, OrderItemsCard(), OrderItemsCardProps, OrderPaymentCardProps, OrderShippingCard(), OrderShippingCardProps, fetchPedidoDetail() (+2 more)

### Community 6 - "ProductosClient.tsx"
Cohesion: 0.20
Nodes (15): AdminLayout(), emptyCartAnimation, Lottie, CartButton, Header(), Sheet(), SheetClose(), SheetContent() (+7 more)

### Community 7 - "devDependencies"
Cohesion: 0.06
Nodes (35): eslint, eslint-config-next, googleapis, devDependencies, eslint, eslint-config-next, googleapis, @playwright/test (+27 more)

### Community 8 - "order-confirmation.tsx"
Cohesion: 0.06
Nodes (34): bodyStyle, checkCircleStyle, containerStyle, ctaButton, ctaSection, ctaText, dividerStyle, footerStyle (+26 more)

### Community 9 - "app/layout.tsx"
Cohesion: 0.14
Nodes (13): geistMono, geistSans, getAnnouncementData, metadata, RootLayout(), Providers(), ATTRIBUTION_PARAMS, AttributionTracker() (+5 more)

### Community 10 - "mi-cuenta/page.tsx"
Cohesion: 0.19
Nodes (18): CustomerProfile, getAdminClient(), getCustomerOrdersAction(), getCustomerProfileAction(), loginCustomerAction(), logoutCustomerAction(), registerCustomerAction(), updateCustomerProfileAction() (+10 more)

### Community 11 - "compilerOptions"
Cohesion: 0.07
Nodes (28): dom, dom.iterable, esnext, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules (+20 more)

### Community 12 - "dashboard/page.tsx"
Cohesion: 0.16
Nodes (19): AdminDashboard(), useCurrentUserId(), SalesDataPoint, DashboardStatsSkeleton(), useDashboardStats(), useSalesChart(), fetchAdminDashboardStats(), fetchAdminPedidosEnProceso() (+11 more)

### Community 13 - "producto-detalle-client.tsx"
Cohesion: 0.19
Nodes (15): ProductoDetalleClientProps, Product, ProductCard(), ProductCardProps, ProductImageCarousel(), ProductImageCarouselProps, ProductSocialProof(), QuestionRow (+7 more)

### Community 14 - "checkout/culqi/route.ts"
Cohesion: 0.24
Nodes (8): CheckoutItemSchema, CulqiCheckoutSchema, getEnv(), POST(), runtime, addressSchema, checkoutBaseFields, identitySchema

### Community 15 - "createClient"
Cohesion: 0.05
Nodes (59): AdminAnnouncementBarPage(), normalizeMessages(), parseBoolVal(), toBoolVal(), AdminMarketingPage(), ProductosPage(), UsuariosPage(), POST() (+51 more)

### Community 16 - "email.ts"
Cohesion: 0.19
Nodes (13): POST(), NewsletterWelcomeEmail(), formatCurrency(), OrderConfirmationEmail(), OrderStatusEmail(), getResend(), OrderItem, SendNewsletterWelcomeParams (+5 more)

### Community 17 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 18 - "createClient"
Cohesion: 0.09
Nodes (33): AuditPage(), CuponesAdminPage(), toDateVal(), toIsoEnd(), toIsoStart(), AdminPreguntasPage(), AdminResenasPage(), ForgotPasswordPage() (+25 more)

### Community 19 - "admin/types.ts"
Cohesion: 0.15
Nodes (16): createAdminCategoria(), fetchAdminProductoById(), fetchAdminProductos(), AdminPedido, AdminPedidoItem, Categoria, Cliente, Cupon (+8 more)

### Community 20 - "rate-limit.ts"
Cohesion: 0.16
Nodes (18): CreateOrderSchema, POST(), runtime, generateCouponCode(), getEnv(), POST(), runtime, SubscribeBodySchema (+10 more)

### Community 21 - "button.tsx"
Cohesion: 0.26
Nodes (7): Button(), buttonVariants, Label(), CorporateDashboardProps, MediaManagerProps, UploadProgressInfo, QuickSummaryProps

### Community 22 - "Architecture Decision Records"
Cohesion: 0.10
Nodes (20): 1. What is an ADR?, 2. When to Write an ADR, 3. ADR Lifecycle, ADR Index (README.md), ADR Management, Architecture Decision Records, Automation (adr-tools), Best Practices (+12 more)

### Community 23 - "order-status.tsx"
Cohesion: 0.08
Nodes (23): badgeStyle, bodyStyle, containerStyle, ctaButton, ctaSection, ctaText, dividerStyle, footerStyle (+15 more)

### Community 24 - "Changelog"
Cohesion: 0.12
Nodes (16): [1.2.0](https://github.com/supabase/agent-skills/compare/v1.1.1...v1.2.0) (2026-06-02), [1.3.0](https://github.com/supabase/agent-skills/compare/v1.2.0...v1.3.0) (2026-06-05), [1.4.0](https://github.com/supabase/agent-skills/compare/v1.3.0...v1.4.0) (2026-07-10), [1.5.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.4.0...supabase-postgres-best-practices-v1.5.0) (2026-07-30), [1.6.0](https://github.com/supabase/agent-skills/compare/supabase-postgres-best-practices-v1.5.0...supabase-postgres-best-practices-v1.6.0) (2026-07-30), Bug Fixes, Bug Fixes, Bug Fixes (+8 more)

### Community 25 - "Writing Guidelines for Postgres References"
Cohesion: 0.12
Nodes (15): 1. Concrete Transformation Patterns, 2. Error-First Structure, 3. Quantified Impact, 4. Self-Contained Examples, 5. Semantic Naming, Code Example Standards, Comments, Impact Level Guidelines (+7 more)

### Community 26 - "formatCurrency"
Cohesion: 0.17
Nodes (10): DashboardPedidosEnProcesoPage(), DashboardPedidosPendientesPage(), DashboardStockBajoPage(), DashboardVentasPage(), ProductoDetalleClient(), EzMartDashboard(), SalesChart(), CheckoutSummary (+2 more)

### Community 27 - "checkout-engine.ts"
Cohesion: 0.22
Nodes (10): POST(), runtime, CheckoutEngine, CheckoutEngineItem, CheckoutEngineOptions, CheckoutEnginePayload, CheckoutEngineResult, OrderChannel (+2 more)

### Community 28 - "dependencies"
Cohesion: 0.18
Nodes (11): @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, next, dependencies, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, next, @react-email/render (+3 more)

### Community 29 - "useCheckoutForm.ts"
Cohesion: 0.14
Nodes (19): FormContent(), checkoutFormSchema, CheckoutFormValues, useCheckoutForm(), UseCheckoutFormOptions, createCheckoutOrder(), isCouponRelatedError(), validateCoupon() (+11 more)

### Community 30 - "checkout-form.tsx"
Cohesion: 0.11
Nodes (14): CheckoutAddress(), CheckoutAddressProps, CheckoutForm(), CheckoutFormProps, libraries, CheckoutShipping(), CheckoutShippingProps, CheckoutShopifySummary() (+6 more)

### Community 31 - "app/page.tsx"
Cohesion: 0.13
Nodes (13): ContactSection, HomePageProps, metadata, revalidate, BenefitsBar(), Category, CategoryGrid(), HomeScrollReveal() (+5 more)

### Community 32 - "HTML Report Format"
Cohesion: 0.10
Nodes (18): Call-graph collapse, Candidate card, Cross-section (good for layered shallowness), Diagram patterns, Hand-built boxes-and-arrows (when Mermaid's layout fights you), Header, HTML Report Format, Mass diagram (good for "interface as wide as implementation") (+10 more)

### Community 33 - "layout-shell.tsx"
Cohesion: 0.24
Nodes (7): AnnouncementBar(), AnnouncementBarProps, AnnouncementData, LayoutShell(), LayoutShellProps, useWhatsAppStore, WhatsAppState

### Community 34 - "order-file-card.tsx"
Cohesion: 0.29
Nodes (8): ACCENT_MAP, inputId(), isImage(), isPdf(), OrderFileCard(), OrderFileCardProps, PDFPreviewModal(), PDFPreviewModalProps

### Community 35 - "gtm.ts"
Cohesion: 0.31
Nodes (7): GA4Product, GTMEvent, EventListener, MarketingEventBus, MarketingEventPayload, MarketingItem, recentEvents

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

### Community 40 - "products.server.ts"
Cohesion: 0.06
Nodes (50): NotFound(), Home(), buildDescription(), buildProductUrl(), generateMetadata(), generateStaticParams(), parseProductIdentifier(), ProductoDetallePage() (+42 more)

### Community 42 - "webhooks/culqi/route.ts"
Cohesion: 0.67
Nodes (3): POST(), procesarPedidoPagado(), runtime

### Community 50 - "uploadToR2"
Cohesion: 0.16
Nodes (15): IncidenciasPage(), PedidoDetallePage(), OrderPaymentCard(), createIncidencia(), deleteIncidencia(), fetchIncidencias(), fetchPedidosForIncidencias(), uploadIncidenciaImages() (+7 more)

### Community 51 - "order-history-card.tsx"
Cohesion: 0.47
Nodes (5): ACTION_STYLES, getActionStyle(), OrderHistoryCard(), OrderHistoryCardProps, PedidoLog

### Community 53 - "success/page.tsx"
Cohesion: 0.27
Nodes (4): SuccessPage(), isMobileDevice(), buildWhatsAppFinalMessage(), buildWhatsAppUrl()

### Community 59 - "2. Correos de Autenticación — Resend SMTP + Supabase"
Cohesion: 0.40
Nodes (5): 2. Correos de Autenticación — Resend SMTP + Supabase, Arquitectura, Configuración SMTP en Supabase Dashboard, Plantillas de Email, Requisitos DNS (Resend)

### Community 79 - "footer.tsx"
Cohesion: 0.24
Nodes (4): Footer(), SocialLink, NewsletterSection(), PeruFlag()

### Community 85 - "KPI Dashboard Design"
Cohesion: 0.11
Nodes (17): 1. KPI Framework, 2. SMART KPIs, 3. Dashboard Hierarchy, Alert thresholds fire constantly, team ignores them, Best Practices, Core Concepts, Dashboard shows green but product team reports users complaining, Detailed worked examples and patterns (+9 more)

### Community 97 - "whatsapp/route.ts"
Cohesion: 0.38
Nodes (6): CheckoutBodySchema, CheckoutItemSchema, GET(), getEnv(), POST(), runtime

### Community 98 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 99 - "social-links.client.ts"
Cohesion: 0.47
Nodes (5): AdminSocialLinksPage(), deleteSocialLink(), fetchSocialLinks(), saveSocialLink(), SocialLink

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
Cohesion: 0.15
Nodes (13): 🧠 1.1 Herramientas de IA y Grafo de Conocimiento (Graphify & Vercel Skills), 🚀 1. Instalación y Configuración Local, 🛠️ 2. Tecnologías Clave e Integraciones Recientes, 📐 3. Convenciones de Código y Estructura FSD, 🤖 4. Manual de Operación para Agentes de IA (Instrucciones Estrictas), A. Graphify (Grafo de Conocimiento del Código), A. Píxeles de Marketing y Google Tag Manager (GTM), B. Almacenamiento y CDN de Imágenes (Cloudflare R2 + Cloudinary Fetch) (+5 more)

### Community 105 - "📦 Instrucciones Paso a Paso"
Cohesion: 0.22
Nodes (8): 1. Ingreso de Órdenes, 2. Comprobación de Pagos, 3. Envíos y Agencia Shalom, 4. Entregas Parciales (Devoluciones Rápidas), 🔄 Flujo de Gestión Diaria, 📦 Instrucciones Paso a Paso, 📘 Manual de Operaciones Administrativo, ⚠️ Reglas y Seguridad

### Community 106 - "Arquitectura Técnica - Tienda Blama 2026"
Cohesion: 0.25
Nodes (7): Arquitectura Técnica - Tienda Blama 2026, 🔒 Capa de Seguridad y Acceso a Datos, 📁 Estructura del Proyecto, Inyección de Supabase, Proxys y Guardias de Roles, Server Components vs Client Components, 🏗️ Topología Serverless (Next.js + Supabase)

### Community 107 - "README.md"
Cohesion: 0.33
Nodes (4): Características e Integridad:, 🚀 Quick Start (Inicio Rápido), 🌀 Scroll Suave con Lenis, 📚 Índice de Documentación

### Community 109 - "Lógica de Negocio y Flujo de Operaciones"
Cohesion: 0.29
Nodes (6): 🔐 Descuento Atómico de Stock (El problema de concurrencia), 📦 El Ciclo de Vida de un Pedido (Máquina de Estados), Flujo de Concurrencia:, 🏢 Jerarquía de Roles del Sistema, Lógica de Negocio y Flujo de Operaciones, 🛡️ Seguridad Transaccional "Cero Confianza" (Zero-Trust)

### Community 112 - "Common KPIs by Department"
Cohesion: 0.14
Nodes (13): Common KPIs by Department, Dashboard Layout Patterns, Finance KPIs, Implementation Patterns, kpi-dashboard-design — detailed worked examples, Marketing KPIs, Pattern 1: Executive Summary, Pattern 2: SaaS Metrics Dashboard (+5 more)

### Community 113 - "orders-bulk-actions.tsx"
Cohesion: 0.40
Nodes (5): OrdersBulkActions(), OrdersBulkActionsProps, OrdersFilterBarProps, OrdersTableProps, ProfileRow

### Community 115 - "Informe de Mejoras e Implementaciones - Tienda Blama 2026"
Cohesion: 0.40
Nodes (4): 🚀 Despliegue en Producción, Informe de Mejoras e Implementaciones - Tienda Blama 2026, 🚦 Pruebas de Calidad Ejecutadas, 📈 Resumen General del Estado del Proyecto

### Community 116 - "questions/actions/submit.ts"
Cohesion: 0.70
Nodes (4): getEnv(), normalizePhone(), normalizeText(), submitQuestionAction()

### Community 124 - "Supabase Postgres Best Practices"
Cohesion: 0.33
Nodes (5): How to Use, References, Rule Categories by Priority, Supabase Postgres Best Practices, When to Apply

### Community 165 - "Web Interface Guidelines"
Cohesion: 0.40
Nodes (4): Guidelines Source, How It Works, Usage, Web Interface Guidelines

### Community 166 - "useProductDetail.ts"
Cohesion: 0.16
Nodes (16): CheckoutPage(), ContactoPage(), ProductoDetalleClient(), CartButton(), ContactSection(), AnimationItem, CartAnimationState, useCartAnimationStore (+8 more)

## Knowledge Gaps
- **571 isolated node(s):** `CouponType`, `CouponRow`, `PROCESS_STATUSES`, `ProcessStatus`, `StatusFilter` (+566 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **81 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createClient()` connect `createClient` to `cn`, `pedidos/page.tsx`, `product-form.tsx`, `social-links.client.ts`, `PedidoRow`, `ProductosClient.tsx`, `useProductDetail.ts`, `products.server.ts`, `app/layout.tsx`, `dashboard/page.tsx`, `producto-detalle-client.tsx`, `createClient`, `footer.tsx`, `uploadToR2`, `admin/types.ts`, `button.tsx`, `success/page.tsx`, `useCheckoutForm.ts`?**
  _High betweenness centrality (0.058) - this node is a cross-community bridge._
- **Why does `Button()` connect `button.tsx` to `cn`, `pedidos/page.tsx`, `order-file-card.tsx`, `product-form.tsx`, `PedidoRow`, `ProductosClient.tsx`, `products.server.ts`, `mi-cuenta/page.tsx`, `dashboard/page.tsx`, `producto-detalle-client.tsx`, `footer.tsx`, `orders-bulk-actions.tsx`, `success/page.tsx`, `order-label-generator.tsx`, `formatCurrency`, `checkout-form.tsx`, `app/page.tsx`?**
  _High betweenness centrality (0.046) - this node is a cross-community bridge._
- **Why does `createClient()` connect `createClient` to `email.ts`, `mi-cuenta/page.tsx`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `CouponType`, `CouponRow`, `PROCESS_STATUSES` to the rest of the system?**
  _571 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.056489430777000214 - nodes in this community are weakly interconnected._
- **Should `product-form.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1349206349206349 - nodes in this community are weakly interconnected._
- **Should `newsletter-welcome.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._