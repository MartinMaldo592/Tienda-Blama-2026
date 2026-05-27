<div align="center">
  <h1>🛍️ Tienda Blama 2026</h1>
  <p><strong>Plataforma E-Commerce B2C con Sistema CRM Logístico Integrado</strong></p>

  [![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

<br />

Tienda Blama es una plataforma de comercio electrónico diseñada para alto rendimiento y escalabilidad (Grado Enterprise). Construida sobre una arquitectura Serverless, no solo actúa como un punto de venta (Frontend), sino que cuenta con un robusto CRM administrativo para la gestión atómica de inventarios, roles de trabajadores y procesamiento de órdenes logísticas.

---

## 📚 Índice de Documentación

Para mantener la raíz del proyecto limpia, toda la documentación oficial se ha modularizado dentro de la carpeta `docs/`. Selecciona la guía que necesites:

| Rol / Enfoque | Documento | Descripción |
| --- | --- | --- |
| 🚀 **Mejoras del Core** | [Resumen de Mejoras (RESUMEN_MEJORAS.md)](./docs/RESUMEN_MEJORAS.md) | Historial detallado de las Fases 1-4 de optimización, seguridad, RLS y mitigación de fallos. |
| 🧑‍💻 **Desarrolladores** | [Guía de Desarrollo (DEVELOPMENT_GUIDE.md)](./docs/DEVELOPMENT_GUIDE.md) | Guía de instalación local, estándares de código, uso de React Query y Git Workflow. |
| 🏗️ **Arquitectos** | [Arquitectura (ARCHITECTURE.md)](./docs/ARCHITECTURE.md) | Topología Serverless, diagrama de flujo técnico (Next.js + Supabase) y estructura de carpetas. |
| 📈 **Analistas** | [Lógica de Negocio (BUSINESS_LOGIC.md)](./docs/BUSINESS_LOGIC.md) | Diagramas de estado logístico, seguridad Zero-Trust en el carrito y lógica transaccional. |
| 👷 **Administradores** | [Manual de Uso (USER_MANUAL.md)](./docs/USER_MANUAL.md) | Guía paso a paso sobre cómo gestionar pedidos diarios, envíos Shalom y devoluciones. |
| ⚙️ **DevOps** | [Integraciones (INTEGRATIONS.md)](./docs/INTEGRATIONS.md) | Variables de entorno necesarias y activación de APIs externas (Google Maps, WhatsApp). |

---

## 🚀 Quick Start (Inicio Rápido)

Si eres desarrollador y necesitas levantar este proyecto en 2 minutos:

```bash
# 1. Instala las dependencias
npm install

# 2. Clona el archivo de entorno (Asegúrate de llenar las credenciales leyendo INTEGRATIONS.md)
cp .env.example .env.local

# 3. Arranca el servidor de desarrollo en modo rápido (Turbopack)
npm run dev
```

Visita `http://localhost:3000` para ver la tienda o entra a `http://localhost:3000/admin` para acceder al CRM Logístico.

---

<div align="center">
  <small><em>Desarrollado para la visión 2026. Auditado para alto rendimiento.</em></small>
</div>
