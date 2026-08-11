# 🛍️ Tienda Blama 2026 - Modern E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

**Tienda Blama 2026** es una plataforma de comercio electrónico de alta escala y rendimiento desarrollada con **Next.js (App Router)**, **TypeScript**, **Supabase (PostgreSQL + RLS)** e integración de pagos con **Culqi v4 (Pagos con tarjeta y QR/Yape)**.

---

## ✨ Características Principales

- ⚡ **Alto Rendimiento & SSR/ISR:** Renderizado ultra-rápido optimizado en Next.js.
- 💳 **Pasarela de Pagos Integrada:** Pagos con tarjeta de crédito/débito y códigos QR (Culqi v4 RSA).
- 🛡️ **Seguridad & Roles (RLS):** Control de acceso por roles (Admin, Worker, Customer) protegido con políticas RLS de Supabase.
- 📦 **Gestión Logística Completa:** Módulos de stock atómico via RPC, guías de despacho, notas de pedidos e impresiones.
- 📊 **Panel de Control & Analytics:** Gráficos de ventas en tiempo real, integración con Google Tag Manager (GTM) y TikTok Pixel.
- 🧪 **Pruebas End-to-End (E2E):** Suite automatizada de pruebas de checkout con Playwright.

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías |
|------|-------------|
| **Frontend** | Next.js (App Router), React, Tailwind CSS, TypeScript |
| **Backend & Base de Datos** | Supabase (PostgreSQL), Procedimientos Almacenados (RPC), RLS |
| **Integraciones** | Culqi v4 (Pagos), Cloudinary (Imágenes), Cloudflare R2 |
| **Analítica & Marketing** | Google Tag Manager (GTM), TikTok Pixel, Bus de Eventos |
| **Testing & Calidad** | Playwright E2E Testing, ESLint, TypeScript Strict Mode |

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/MartinMaldo592/Tienda-Blama-2026.git
cd Tienda-Blama-2026
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno
Crea un archivo `.env.local` con las credenciales necesarias:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key

# Culqi Payment Gateway
NEXT_PUBLIC_CULQI_PUBLIC_KEY=tu_culqi_public_key
CULQI_SECRET_KEY=tu_culqi_secret_key
```

### 4. Iniciar Servidor de Desarrollo
```bash
npm run dev
```
Abre `http://localhost:3000` en tu navegador.

---

## 🧪 Pruebas Automatizadas (E2E)

Para ejecutar la suite de pruebas E2E con Playwright:

```bash
npx playwright test
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más información.

---

<div align="center">
  <sub>Desarrollado por <a href="https://github.com/MartinMaldo592">Martin Maldonado</a></sub>
</div>
