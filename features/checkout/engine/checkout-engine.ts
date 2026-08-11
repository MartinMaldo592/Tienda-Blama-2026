import { SupabaseClient } from "@supabase/supabase-js"
import { validateAndCalculateTotals } from "@/features/checkout/utils/totals"
import { triggerOrderConfirmationEmail } from "@/features/emails"
import { CheckoutEngineOptions, CheckoutEngineResult, CheckoutEngineItem } from "./types"

export class CheckoutEngine {
  public static async processOrder(
    supabaseAdmin: SupabaseClient,
    options: CheckoutEngineOptions
  ): Promise<CheckoutEngineResult> {
    const { channel, payload, culqiChargeId, culqiToken, culqiSecret } = options as any

    const name = payload.name.trim()
    const phone = payload.phone.trim()
    const dni = payload.dni?.trim() || null
    const email = payload.email?.trim() || null
    const address = payload.address.trim()
    const reference = payload.reference?.trim() || ""
    const couponCode = payload.couponCode?.trim() || null

    let locationLink = payload.locationLink?.trim() || null
    if (!locationLink && address) {
      const encoded = encodeURIComponent(address)
      locationLink = `https://www.google.com/maps/search/?api=1&query=${encoded}`
    }

    const shippingMethod = payload.shippingMethod?.trim() || null
    const isQuickCheckout = payload.isQuickCheckout || false

    // 1. Validar catálogo, cupones y calcular totales
    const { subtotal, discountAmount: appliedDiscount, total, validCouponCode, getUnitPrice } =
      await validateAndCalculateTotals(
        supabaseAdmin,
        payload.items,
        couponCode,
        email,
        isQuickCheckout
      )

    const district = payload.district?.trim() || null
    const provincia = payload.province?.trim() || payload.provinceName?.trim() || null
    const department = payload.department?.trim() || null
    const street = payload.street?.trim() || null

    const direccionCompleta = `${address} ${reference ? `(Ref: ${reference})` : ""} ${
      locationLink ? `[Link: ${locationLink}]` : ""
    }`.trim()

    // 1.5. Buscar usuario_id asociado por email o payload
    let usuarioId: string | null = (payload as any).usuario_id || null
    if (!usuarioId && email) {
      const { data: foundUser } = await supabaseAdmin
        .from("usuarios")
        .select("id")
        .eq("email", email)
        .maybeSingle()
      if (foundUser?.id) {
        usuarioId = foundUser.id
      }
    }

    // 2. Cliente (Crear registro de cliente)
    const { data: newClient, error: clientError } = await supabaseAdmin
      .from("clientes")
      .insert({
        nombre: name,
        telefono: phone,
        dni,
        direccion: direccionCompleta,
        referencia: reference,
        link_ubicacion: locationLink,
        departamento: department,
        provincia: provincia,
        distrito: district,
        email: email,
        usuario_id: usuarioId,
      })
      .select()
      .single()

    if (clientError) {
      throw new Error(`Error registrando cliente: ${clientError.message}`)
    }

    const clienteId = Number((newClient as any)?.id)
    if (!clienteId) {
      throw new Error("No se pudo obtener el ID del cliente generado")
    }

    // 3. Generar PIN de Shalom para envíos a Provincia
    const generatedShalomPin =
      shippingMethod?.toLowerCase().includes("provincia") ||
      shippingMethod?.toLowerCase().includes("shalom")
        ? Math.floor(1000 + Math.random() * 9000).toString()
        : null

    const chargeId = culqiChargeId || channel

    // 4. Inserción de Pedido
    const commonPedidoData = {
      cliente_id: clienteId,
      usuario_id: usuarioId,
      nombre_contacto: name,
      dni_contacto: dni,
      telefono_contacto: phone,
      departamento: department,
      provincia: provincia,
      distrito: district,
      direccion_calle: street || address,
      referencia_direccion: reference,
      link_ubicacion: locationLink,
      email_contacto: email,
      status: channel === "culqi" ? "Pendiente" : "Pendiente",
      pago_status: channel === "culqi" ? "Pendiente" : "Pendiente",
      metodo_envio: shippingMethod,
      culqi_charge_id: chargeId,
      shalom_pin: generatedShalomPin,
    }

    const { data: pedidoFull, error: pedidoFullErr } = await supabaseAdmin
      .from("pedidos")
      .insert({
        ...commonPedidoData,
        subtotal,
        descuento: appliedDiscount,
        cupon_codigo: validCouponCode,
        total,
      })
      .select()
      .single()

    let pedido = pedidoFull as any

    if (pedidoFullErr) {
      if ((validCouponCode && validCouponCode.length > 0) || appliedDiscount > 0) {
        throw new Error(`Error creando pedido con cupón: ${pedidoFullErr.message}`)
      }

      const { data: pedidoFallback, error: pedidoFallbackErr } = await supabaseAdmin
        .from("pedidos")
        .insert({
          ...commonPedidoData,
          total,
        })
        .select()
        .single()

      if (pedidoFallbackErr) {
        throw new Error(`Error creando pedido: ${pedidoFallbackErr.message}`)
      }
      pedido = pedidoFallback as any
    }

    const pedidoId = Number(pedido?.id ?? 0)
    if (!pedidoId) {
      throw new Error("No se pudo obtener el ID del pedido generado")
    }

    // 5. Inserción de Items del Pedido
    const orderItems = payload.items.map((item: CheckoutEngineItem) => ({
      pedido_id: pedidoId,
      producto_id: item.id,
      producto_variante_id: item.producto_variante_id ?? null,
      precio_unitario: getUnitPrice(item.id, item.producto_variante_id),
      producto_nombre: item.nombre || null,
      variante_nombre: item.variante_nombre || null,
      cantidad: item.quantity,
    }))

    const { error: itemsError } = await supabaseAdmin.from("pedido_items").insert(orderItems)
    if (itemsError) {
      throw new Error(`Error registrando items del pedido: ${itemsError.message}`)
    }

    // 6. Procesamiento especial para Culqi (si aplica)
    if (channel === "culqi" && culqiToken && culqiSecret) {
      let wasStockDeducted = false

      // Reservar Stock
      const { data: stockRes, error: stockErr } = await supabaseAdmin.rpc("admin_procesar_descuento_stock", {
        p_pedido_id: pedidoId,
        p_revertir: false,
      })

      if (stockErr || !stockRes) {
        await supabaseAdmin.from("pedidos").update({ status: "Fallido", pago_status: "Fallido" }).eq("id", pedidoId)
        throw new Error("No hay stock suficiente para procesar tu pedido.")
      }
      wasStockDeducted = true

      const nameParts = name.trim().split(" ")
      const firstName = nameParts[0] || "Cliente"
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Blama"
      const culqiAmount = Math.round(total * 100)

      const culqiRes = await fetch("https://api.culqi.com/v2/charges", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${culqiSecret}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: culqiAmount,
          currency_code: "PEN",
          email: email || "cliente@blama.shop",
          source_id: culqiToken,
          description: `Pedido ${pedidoId} Tienda Blama - ${dni || "Sin DNI"}`,
          antifraud_details: {
            first_name: firstName.substring(0, 50),
            last_name: lastName.substring(0, 100),
            phone_number: phone,
            address: direccionCompleta ? direccionCompleta.substring(0, 100) : "No indicada",
            address_city: provincia ? provincia.substring(0, 50) : "Lima",
            country_code: "PE",
          },
          metadata: { pedido_id: pedidoId },
        }),
      })

      const culqiData = await culqiRes.json()

      if (!culqiRes.ok) {
        if (wasStockDeducted) {
          await supabaseAdmin.rpc("admin_procesar_descuento_stock", { p_pedido_id: pedidoId, p_revertir: true })
        }
        await supabaseAdmin.from("pedidos").update({ status: "Fallido", pago_status: "Fallido" }).eq("id", pedidoId)
        const userMsg = culqiData.user_message || culqiData.merchant_message || "No se pudo procesar el pago."
        throw new Error(userMsg)
      }

      // Actualizar a pagado
      await supabaseAdmin
        .from("pedidos")
        .update({ status: "Confirmado", pago_status: "Pagado Anticipado", culqi_charge_id: culqiData.id })
        .eq("id", pedidoId)

      await Promise.allSettled([
        supabaseAdmin.from("pedido_pagos").insert({
          pedido_id: pedidoId,
          monto: total,
          metodo_pago: "Tarjeta",
          tipo_pago: "Pago Final",
          nota: `Culqi ID: ${culqiData.id} - Tarjeta ${culqiData.source?.iin?.card_brand || "Desconocida"}`,
          registrado_por: "Sistema (Web)",
        }),
        supabaseAdmin.from("pedido_notas").insert({
          pedido_id: pedidoId,
          autor_id: "00000000-0000-0000-0000-000000000000",
          autor_nombre: "Sistema Inteligente",
          contenido: `Pago aprobado por Culqi. ID: ${culqiData.id}. Tarjeta: ${culqiData.source?.iin?.card_brand || "Desconocida"}.`,
          tipo: "info",
        }),
      ])
    }

    // 7. Disparar email de confirmación
    if (email) {
      try {
        await triggerOrderConfirmationEmail(pedidoId, chargeId)
      } catch (err) {
        console.error("⚠️ Transmisión de email de confirmación en segundo plano falló:", err)
      }
    }

    return {
      ok: true,
      orderId: pedidoId,
      clienteId,
      subtotal,
      descuento: appliedDiscount,
      total,
    }
  }
}
