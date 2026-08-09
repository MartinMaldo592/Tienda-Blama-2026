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

Toda la documentación oficial se encuentra actualizada y modularizada según el rol o enfoque que necesites:

| Rol / Enfoque | Documento | Descripción |
| --- | --- | --- |
| 📊 **Informe Global** | [Informe de Mejoras (INFORME_MEJORAS.md)](./INFORME_MEJORAS.md) | Resumen técnico consolidado de las optimizaciones, refactorizaciones y sistema de analíticas implementado. |
| 🚀 **Mejoras del Core** | [Resumen de Mejoras (RESUMEN_MEJORAS.md)](./docs/RESUMEN_MEJORAS.md) | Historial y desglose detallado de las Fases 1 a 10 de optimización, seguridad, RLS, cookies de atribución y píxeles. |
| 🧑‍💻 **Desarrolladores** | [Guía de Desarrollo (DEVELOPMENT_GUIDE.md)](./docs/DEVELOPMENT_GUIDE.md) | Guía de instalación local, estándares de código, uso de React Query y Git Workflow. |
| 🏗️ **Arquitectos** | [Arquitectura (ARCHITECTURE.md)](./docs/ARCHITECTURE.md) | Topología Serverless, diagrama de flujo técnico (Next.js + Supabase) y estructura de carpetas. |
| 📈 **Analistas** | [Lógica de Negocio (BUSINESS_LOGIC.md)](./docs/BUSINESS_LOGIC.md) | Diagramas de estado logístico, seguridad Zero-Trust en el carrito y lógica transaccional. |
| 👷 **Administradores** | [Manual de Uso (USER_MANUAL.md)](./docs/USER_MANUAL.md) | Guía paso a paso sobre cómo gestionar pedidos diarios, envíos Shalom y devoluciones. |
| ⚙️ **DevOps** | [Integraciones (INTEGRATIONS.md)](./docs/INTEGRATIONS.md) | Variables de entorno necesarias y activación de APIs externas (Google Maps, WhatsApp, GTM, Píxeles). |


---

## 🚀 Quick Start (Inicio Rápido)

Si eres desarrollador y necesitas levantar este proyecto en 2 minutos:

```bash
# 1. Instala las dependencias de Node.js
npm install

# 2. Clona el archivo de entorno (Asegúrate de llenar las credenciales leyendo INTEGRATIONS.md)
cp .env.example .env.local

# 3. Herramientas de IA y Arquitectura (Skills & Graphify)
# Install Graphify for codebase knowledge graphs:
py -m pip install graphifyy
py -m graphify update .

# Install Vercel Skills CLI & find-skills:
npx skills add https://github.com/vercel-labs/skills --skill find-skills

# 4. Arranca el servidor de desarrollo
npm run dev
```

Visita `http://localhost:3000` para ver la tienda o entra a `http://localhost:3000/admin` para acceder al CRM Logístico.

---

## 🌀 Scroll Suave con Lenis

La plataforma utiliza **Lenis** para mejorar la experiencia de usuario con un comportamiento de scroll premium y fluido en todo el catálogo y vistas de la tienda.

### Características e Integridad:
* **Accesibilidad Native Fallback:** Si el usuario tiene habilitada la preferencia del sistema operativo `prefers-reduced-motion: reduce`, Lenis se desactiva de forma automática y se utiliza el scroll nativo clásico del navegador.
* **Integración con Next.js Routing:** Cada navegación de ruta (ej. cambiar entre productos o entrar a colecciones) limpia y restablece instantáneamente la posición de scroll en la cabecera (coordenada `0,0`) sin parpadeos visuales.
* **Limpieza de Recursos:** Utiliza `requestAnimationFrame` asíncrono y se destruye correctamente la instancia mediante `.destroy()` al desmontar el componente para evitar fugas de memoria.

---

<div align="center">
  <small><em>Desarrollado para la visión 2026. Auditado para alto rendimiento.</em></small>
</div>

