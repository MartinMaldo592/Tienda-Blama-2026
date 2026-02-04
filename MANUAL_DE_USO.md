    # 📘 Manual de Operaciones - Sistema Administrativo Tienda Blama

Este documento sirve como guía de capacitación para el personal encargado de gestionar los pedidos en el panel administrativo.

---

## 🔄 1. Ciclo de Vida de un Pedido

El flujo ideal de un pedido pasa por los siguientes estados:

1.  **🟡 Pendiente**: El pedido ha entra, pero el pago no ha sido verificado o el stock no se ha separado físicamente.
2.  **🔵 Confirmado**: El pago es válido (voucher revisado). El pedido está listo para empaquetar.
3.  **🟣 Enviado**: El paquete ha sido entregado al courier (Shalom/Olva/Motorizado) o está en ruta.
4.  **🟢 Entregado**: El cliente ya tiene el producto en sus manos. ¡Proceso finalizado con éxito!
5.  **🔴 Fallido/Cancelado**: Hubo un problema (no pago, cliente canceló, etc.).

---

## 🛠️ 2. Paso a Paso: Gestión Diaria

### Paso 1: Verificación del Pago 💵
- Ve al detalle del pedido.
- En la tarjeta **"Pago"**, revisa los **Vouchers** adjuntos (haz clic en "Ver Voucher").
- Compara el monto y la fecha con la cuenta bancaria de la empresa.
- Si todo es correcto, cambia el estado superior de "Pendiente" a **"Confirmado"** y guarda.

### Paso 2: Preparación y Envío 📦
#### Si es para Lima (Motorizado/Propio):
1.  Empaqueta el producto.
2.  Coordina con el motorizado.
3.  Cuando el motorizado salga, cambia el estado a **"Enviado"**.

#### Si es para Provincia (Shalom):
1.  Genera la etiqueta o rotulado con los datos del cliente (Nombre, DNI, Teléfono, Destino).
2.  Lleva el paquete a la agencia Shalom.
3.  **IMPORTANTE**: Al regresar de la agencia, debes llenar la sección **"Envío"** en el sistema:
    - **Nº Orden**: El número largo de la boleta de Shalom.
    - **Código de Orden**: Código alfanumérico (ej: NKND).
    - **Clave de Recojo (PIN)**: 🔴 **Vital**. Es la clave de 4 dígitos (ej: 1234) que el cliente necesita para recoger. Si no la tienes, invéntala y anótala en el paquete, o usa el botón de **Dados 🎲** para generar una y comunícasela al cliente.
4.  Sube la foto de la **Guía de Remisión** en la tarjeta "Evidencia de Envío".

### Paso 3: Confirmación de Entrega ✅
- Cuando el cliente reciba el producto (o el motorizado te envíe la foto):
- Ve a la sección **"Evidencia de Entrega"**.
- Sube la foto del cliente recibiendo el producto o la foto que mandó el motorizado.
- Cambia el estado final a **"Entregado"**.

---

## ⚡ 3. Funciones Especiales

### 📝 Editar Datos del Cliente
Si el cliente se equivocó en su dirección o teléfono:
- En la tarjeta **"Cliente"**, busca el botón del **Lápiz ✏️**.
- Corrige los datos.
- También puedes cambiar el **Método de Envío** aquí (de Lima a Provincia o viceversa).

### ↩️ Devoluciones Parciales
Si un cliente pidió 3 productos y devuelve 1:
- No cambies todo el pedido a "Cancelado".
- Ve a la lista de **"Productos"**.
- Haz clic en el botón **"Devolver ↺"** al lado del producto específico.
- Ingresa la cantidad a devolver.
- *Nota: Esto devolverá el stock al inventario automáticamente.*

### 📷 Previsualización de Imágenes
- El sistema muestra miniaturas de las guías y vouchers subidos para que no tengas que abrirlos a cada rato. Úsalo para verificaciones rápidas.

---

## ⚠️ 4. Reglas de Oro

1.  **Nunca** pases a "Enviado" sin haber verificado el pago real en el banco.
2.  **Siempre** llena la **Clave de Recojo (PIN)** para envíos Shalom, si no el cliente te llamará molesto porque no le entregan su paquete.
3.  **Seguridad**: El sistema se bloquea para edición 3 días después de finalizado un pedido. Si necesitas editar algo antiguo, contacta al Administrador.
