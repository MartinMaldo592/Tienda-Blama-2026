# ADR-0001: Unificación del Motor de Checkout, Marketing Event Bus y Capa de Datos Supabase

## Estatus
**Propuesto / En Revisión** (Esperando Autorización del Propietario)

**Fecha:** 2026-08-09  
**Decisores:** Equipo de Arquitectura de Tienda Blama & Propietario del Proyecto  
**Skill de Origen:** `architecture-decision-records` (MADR v3.0)

---

## 1. Contexto y Problema del Negocio

La plataforma **Tienda Blama 2026** opera con múltiples pasarelas de pago y canales de conversión (Checkout con tarjeta vía Culqi y Checkout rápido vía WhatsApp), además de rastreo de marketing (GTM, Meta Pixel, TikTok Pixel). 

Actualmente se identifican tres puntos de fricción arquitectónica:

1. **Duplicidad de Reglas del Negocio:** La lógica para calcular subtotales, verificar vigencia/usos de cupones, reservar stock en Kardex y registrar la orden en Supabase se repite independientemente en `app/api/checkout/culqi/route.ts` y `app/api/checkout/whatsapp/route.ts`.
2. **Latencia en Renderizado por Píxeles:** Los eventos analíticos se disparan directamente dentro del ciclo de vida de componentes React, saturando el hilo principal del navegador en momentos críticos de conversión.
3. **Mantenibilidad de la Base de Datos:** Se requiere asegurar la coherencia absoluta entre el archivo de esquema maestro local (`supabase/schema.sql`) y la base de datos viva en producción.

---

## 2. Factores Clave de la Decisión (Decision Drivers)

- **Unicidad de Reglas de Negocio:** Una sola fuente de verdad para el cálculo de totales, cupones y descuentos de stock.
- **Rendimiento Visual (CWV):** 0-bloqueo del hilo de renderizado principal al disparar analíticas.
- **Seguridad y RLS:** Acceso controlado a Supabase mediante funciones tipadas y políticas RLS auditadas.
- **Cero Interrupción Operativa:** Transición transparente sin afectar las ventas en vivo.

---

## 3. Opciones Consideradas

### Opción A: Mantener la Arquitectura Actual (Sin Cambios)
- **Pros:** No requiere refactorización.
- **Contras:** Si cambia una regla de cupones o precios, debe actualizarse manualmente en múltiples archivos API. Riesgo continuo de desincronización de stock y cuellos de botella en la UI.

### Opción B: Implementar Unified Checkout Engine + Marketing Event Bus (Recomendado)
- **Pros:** 
  - Centraliza el procesamiento de pedidos en `features/checkout/engine/checkout-engine.ts`.
  - Culqi y WhatsApp se convierten en adaptadores livianos de pasarela.
  - El bus de eventos en `lib/marketing/event-bus.ts` ejecuta el rastreo en segundo plano sin congelar la UI.
  - Garantiza coincidencia del 100% entre `schema.sql` y Supabase PROD.
- **Contras:** Requiere migración y pruebas unitarias de enrutamiento de checkout.

---

## 4. Decisión Propuesta

Aprobar la **Opción B**: Implementar el **Unified Checkout Engine**, el **Marketing Event Bus** asíncrono y consolidar la sincronización de la base de datos Supabase.

---

## 5. Consecuencias

### Positivas:
- **Pruebas Automatizadas:** El motor de checkout podrá probarse unitariamente de forma aislada sin necesidad de levantar rutas HTTP completas.
- **Escalabilidad:** Añadir una nueva pasarela (ej: Yape directo, MercadoPago) requerirá solo un adaptador de 20 líneas en lugar de reescribir la lógica de compras.
- **Velocidad de Carga:** Mejora directa en los indicadores Core Web Vitals (INP y LCP).

### Negativas / Riesgos:
- Requiere validación rigurosa de las respuestas de prueba de Culqi y WhatsApp antes de publicar la rama.

---

## 6. Plan de Ejecución

1. **Fase 1 (Checkout Engine):** Refactorizar y extraer la lógica de orden a `features/checkout/engine/checkout-engine.ts`.
2. **Fase 2 (Event Bus):** Implementar el despachador asíncrono `lib/marketing/event-bus.ts`.
3. **Fase 3 (Verificación):** Correr `npx tsc --noEmit` y pruebas de integración.
4. **Fase 4 (Despliegue):** Subir a `develop` y fusionar en `main` para despliegue automático en Vercel.
