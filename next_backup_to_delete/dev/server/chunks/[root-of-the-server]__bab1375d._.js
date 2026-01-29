module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/checkout/whatsapp/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
;
const runtime = "nodejs";
function getEnv() {
    const url = process.env.SUPABASE_URL || ("TURBOPACK compile-time value", "https://pvgghvcqoxhcozlyagwz.supabase.co");
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
    return {
        url,
        service
    };
}
function normalizeDigits(v) {
    return String(v ?? "").replace(/\D/g, "");
}
function normalizeText(v) {
    return String(v ?? "").trim();
}
async function GET() {
    const { url, service } = getEnv();
    const missing = [];
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (!service) missing.push("SUPABASE_SERVICE_ROLE_KEY");
    if (missing.length > 0) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false,
            error: "Server env not configured",
            missing
        }, {
            status: 500
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        ok: true
    });
}
async function POST(req) {
    try {
        const { url, service } = getEnv();
        if (!url || !service) {
            const missing = [];
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (!service) missing.push("SUPABASE_SERVICE_ROLE_KEY");
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Server env not configured",
                missing
            }, {
                status: 500
            });
        }
        const body = await req.json();
        const name = normalizeText(body?.name);
        const phone = normalizeDigits(body?.phone);
        const dni = normalizeDigits(body?.dni).slice(0, 8);
        const address = normalizeText(body?.address);
        const reference = normalizeText(body?.reference);
        const locationLink = normalizeText(body?.locationLink);
        const shippingMethod = normalizeText(body?.shippingMethod) || null;
        const couponCode = normalizeText(body?.couponCode) || null;
        const discountRaw = Number(body?.discountAmount ?? 0);
        const itemsRaw = Array.isArray(body?.items) ? body.items : [];
        const items = itemsRaw.map((it)=>({
                id: Number(it?.id ?? 0),
                quantity: Number(it?.quantity ?? 0),
                precio: it?.precio != null ? Number(it.precio) : undefined,
                nombre: it?.nombre != null ? String(it.nombre) : undefined,
                producto_variante_id: it?.producto_variante_id != null ? Number(it.producto_variante_id) : null,
                variante_nombre: it?.variante_nombre != null ? String(it.variante_nombre) : null
            })).filter((it)=>Number.isFinite(it.id) && it.id > 0 && Number.isFinite(it.quantity) && it.quantity > 0);
        if (!name) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Nombre requerido"
        }, {
            status: 400
        });
        if (!phone) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Teléfono requerido"
        }, {
            status: 400
        });
        if (dni.length !== 8) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "DNI inválido"
        }, {
            status: 400
        });
        if (!address) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Dirección requerida"
        }, {
            status: 400
        });
        if (items.length === 0) return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Items inválidos"
        }, {
            status: 400
        });
        const subtotal = Math.max(0, Math.round(items.reduce((acc, it)=>{
            const unit = Number(it.precio ?? 0) || 0;
            return acc + unit * (Number(it.quantity) || 0);
        }, 0) * 100) / 100);
        const discountAmount = Math.max(0, Math.min(subtotal, Number.isFinite(discountRaw) ? discountRaw : 0));
        const total = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);
        const direccionCompleta = `${address} ${reference ? `(Ref: ${reference})` : ""} ${locationLink ? `[Link: ${locationLink}]` : ""}`.trim();
        const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, service);
        // A. Cliente
        let clienteId = null;
        const { data: existingClients, error: existingClientsError } = await supabaseAdmin.from("clientes").select("id").eq("telefono", phone).limit(1);
        if (existingClientsError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: existingClientsError.message
            }, {
                status: 400
            });
        }
        if (existingClients && existingClients.length > 0) {
            clienteId = Number(existingClients[0]?.id);
            const { error: updErr } = await supabaseAdmin.from("clientes").update({
                nombre: name,
                dni,
                direccion: direccionCompleta
            }).eq("id", clienteId);
            if (updErr) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: updErr.message
                }, {
                    status: 400
                });
            }
        } else {
            const { data: newClient, error: clientError } = await supabaseAdmin.from("clientes").insert({
                nombre: name,
                telefono: phone,
                dni,
                direccion: direccionCompleta
            }).select().single();
            if (clientError) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: clientError.message
                }, {
                    status: 400
                });
            }
            clienteId = Number(newClient?.id);
        }
        if (!clienteId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "No se pudo crear cliente"
            }, {
                status: 500
            });
        }
        // B. Pedido
        const insertPedidoFull = async ()=>{
            return supabaseAdmin.from("pedidos").insert({
                cliente_id: clienteId,
                subtotal,
                descuento: discountAmount,
                cupon_codigo: couponCode,
                total,
                status: "Pendiente",
                pago_status: "Pago Contraentrega",
                metodo_envio: shippingMethod
            }).select().single();
        };
        const insertPedidoFallback = async ()=>{
            return supabaseAdmin.from("pedidos").insert({
                cliente_id: clienteId,
                total,
                status: "Pendiente",
                pago_status: "Pago Contraentrega",
                metodo_envio: shippingMethod
            }).select().single();
        };
        const { data: pedidoFull, error: pedidoFullErr } = await insertPedidoFull();
        let pedido = pedidoFull;
        if (pedidoFullErr) {
            if (couponCode && couponCode.length > 0 || discountAmount > 0) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: pedidoFullErr.message
                }, {
                    status: 400
                });
            }
            const { data: pedidoFallback, error: pedidoFallbackErr } = await insertPedidoFallback();
            if (pedidoFallbackErr) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: pedidoFallbackErr.message
                }, {
                    status: 400
                });
            }
            pedido = pedidoFallback;
        }
        const pedidoId = Number(pedido?.id ?? 0);
        if (!pedidoId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "No se pudo crear pedido"
            }, {
                status: 500
            });
        }
        // C. Items
        const orderItems = items.map((item)=>({
                pedido_id: pedidoId,
                producto_id: item.id,
                producto_variante_id: item.producto_variante_id ?? null,
                precio_unitario: Number(item.precio ?? 0) || 0,
                producto_nombre: item.nombre ? String(item.nombre) : null,
                variante_nombre: item.variante_nombre ? String(item.variante_nombre) : null,
                cantidad: Number(item.quantity) || 1
            }));
        const { error: itemsError } = await supabaseAdmin.from("pedido_items").insert(orderItems);
        if (itemsError) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: itemsError.message
            }, {
                status: 400
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            orderId: pedidoId,
            subtotal,
            descuento: discountAmount,
            total
        });
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e?.message || "Unknown error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bab1375d._.js.map