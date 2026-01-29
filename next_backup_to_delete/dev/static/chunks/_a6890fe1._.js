(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ui/card.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Card",
    ()=>Card,
    "CardAction",
    ()=>CardAction,
    "CardContent",
    ()=>CardContent,
    "CardDescription",
    ()=>CardDescription,
    "CardFooter",
    ()=>CardFooter,
    "CardHeader",
    ()=>CardHeader,
    "CardTitle",
    ()=>CardTitle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Card;
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
_c1 = CardHeader;
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
_c2 = CardTitle;
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
_c3 = CardDescription;
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
_c4 = CardAction;
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
_c5 = CardContent;
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-6 [.border-t]:pt-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_c6 = CardFooter;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6;
__turbopack_context__.k.register(_c, "Card");
__turbopack_context__.k.register(_c1, "CardHeader");
__turbopack_context__.k.register(_c2, "CardTitle");
__turbopack_context__.k.register(_c3, "CardDescription");
__turbopack_context__.k.register(_c4, "CardAction");
__turbopack_context__.k.register(_c5, "CardContent");
__turbopack_context__.k.register(_c6, "CardFooter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/admin/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/admin/services/dashboard.client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAdminDashboardStats",
    ()=>fetchAdminDashboardStats,
    "fetchAdminPedidosEnProceso",
    ()=>fetchAdminPedidosEnProceso,
    "fetchAdminPedidosPendientes",
    ()=>fetchAdminPedidosPendientes,
    "fetchAdminStockBajo",
    ()=>fetchAdminStockBajo,
    "fetchAdminVentasEntregadas",
    ()=>fetchAdminVentasEntregadas
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
;
async function fetchAdminDashboardStats(args) {
    const role = String(args.role || "worker");
    const currentUserId = String(args.currentUserId || "");
    const { data: pedidos } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select("id, total, status, asignado_a, created_at");
    const deliveredSales = (pedidos || []).filter((p)=>p.status === "Entregado");
    const totalVentasReales = deliveredSales.reduce((sum, p)=>sum + (Number(p.total) || 0), 0);
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayPrefix = `${yyyy}-${mm}-${dd}`;
    const ventasHoy = deliveredSales.filter((p)=>typeof p.created_at === "string" && p.created_at.startsWith(todayPrefix)).reduce((sum, p)=>sum + (Number(p.total) || 0), 0);
    const pedidosPendientes = (pedidos || []).filter((p)=>p.status === "Pendiente").length;
    const pedidosEnProceso = (pedidos || []).filter((p)=>[
            "Confirmado",
            "Preparando",
            "Enviado"
        ].includes(p.status)).length;
    const pedidosEntregados = deliveredSales.length;
    const pedidosAsignados = (pedidos || []).filter((p)=>p.asignado_a === currentUserId && ![
            "Fallido",
            "Devuelto",
            "Entregado"
        ].includes(p.status)).length;
    let totalClientes = 0;
    if (role === "admin") {
        const { count } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("clientes").select("*", {
            count: "exact",
            head: true
        });
        totalClientes = count || 0;
    }
    let productosLowStock = 0;
    if (role === "admin") {
        const { count } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("productos").select("*", {
            count: "exact",
            head: true
        }).lt("stock", 5);
        productosLowStock = count || 0;
    }
    return {
        totalVentasReales,
        ventasHoy,
        pedidosPendientes,
        pedidosEnProceso,
        pedidosEntregados,
        pedidosAsignados,
        totalClientes,
        productosLowStock
    };
}
async function fetchAdminVentasEntregadas(args) {
    const fromIso = args.from ? `${args.from}T00:00:00.000Z` : undefined;
    const toIso = args.to ? `${args.to}T23:59:59.999Z` : undefined;
    let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select("id, total, status, created_at, clientes (nombre, telefono, dni)").eq("status", "Entregado").order("created_at", {
        ascending: false
    });
    if (fromIso) query = query.gte("created_at", fromIso);
    if (toIso) query = query.lte("created_at", toIso);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
}
async function fetchAdminStockBajo(args) {
    const th = Number(args.threshold);
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("productos").select("id, nombre, precio, stock, imagen_url").lt("stock", th).order("stock", {
        ascending: true
    });
    if (error) throw error;
    return data || [];
}
async function fetchAdminPedidosPendientes() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select("id, total, status, created_at, clientes (nombre, telefono, dni)").eq("status", "Pendiente").order("created_at", {
        ascending: false
    });
    if (error) throw error;
    return data || [];
}
const PROCESS_STATUSES = [
    "Confirmado",
    "Preparando",
    "Enviado"
];
async function fetchAdminPedidosEnProceso(args) {
    const fromIso = args.from ? `${args.from}T00:00:00.000Z` : undefined;
    const toIso = args.to ? `${args.to}T23:59:59.999Z` : undefined;
    let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select("id, total, status, created_at, asignado_a, clientes (nombre, telefono, dni)").in("status", PROCESS_STATUSES).order("created_at", {
        ascending: false
    });
    if (args.status !== "all") query = query.eq("status", args.status);
    if (fromIso) query = query.gte("created_at", fromIso);
    if (toIso) query = query.lte("created_at", toIso);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/admin/services/pedidos.client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assignPedidoToWorker",
    ()=>assignPedidoToWorker,
    "fetchAdminWorkers",
    ()=>fetchAdminWorkers,
    "fetchPedidoDetail",
    ()=>fetchPedidoDetail,
    "fetchPedidosForRole",
    ()=>fetchPedidosForRole,
    "updatePedidoStatusWithStock",
    ()=>updatePedidoStatusWithStock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
;
async function fetchAdminWorkers() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("profiles").select("id, email, nombre, role").eq("role", "worker");
    if (error) throw error;
    return data || [];
}
async function fetchPedidosForRole(args) {
    const role = String(args.role || "worker");
    const currentUserId = String(args.currentUserId || "");
    let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select(`
        *,
        clientes (nombre, telefono, dni)
      `).order("created_at", {
        ascending: false
    });
    if (role === "worker") {
        query = query.eq("asignado_a", currentUserId);
    }
    const { data, error } = await query;
    if (error) {
        if (String(error.message || "").includes("asignado_a")) {
            const { data: fallbackData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select(`*, clientes (nombre, telefono, dni)`).order("created_at", {
                ascending: false
            });
            return fallbackData || [];
        }
        throw error;
    }
    const rows = data || [];
    const withWorkers = await Promise.all(rows.map(async (pedido)=>{
        if (pedido.asignado_a) {
            const { data: workerProfile } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("profiles").select("id, email, nombre").eq("id", pedido.asignado_a).single();
            return {
                ...pedido,
                asignado_perfil: workerProfile || null
            };
        }
        return {
            ...pedido,
            asignado_perfil: null
        };
    }));
    return withWorkers;
}
async function assignPedidoToWorker(args) {
    const assignValue = args.workerId ? String(args.workerId) : null;
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").update({
        asignado_a: assignValue,
        fecha_asignacion: assignValue ? new Date().toISOString() : null
    }).eq("id", args.pedidoId);
    if (error) throw error;
}
async function fetchPedidoDetail(pedidoId) {
    const { data: pedidoData, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select(`
        *,
        clientes (*)
      `).eq("id", pedidoId).single();
    if (error) throw error;
    let asignadoPerfil = null;
    if (pedidoData?.asignado_a) {
        const { data: workerProfile } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("profiles").select("id, email, nombre").eq("id", pedidoData.asignado_a).single();
        asignadoPerfil = workerProfile;
    }
    const pedido = {
        ...pedidoData,
        asignado_perfil: asignadoPerfil
    };
    const { data: itemsData, error: itemsErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("pedido_items").select(`
        *,
        productos (nombre, precio, imagen_url)
      `).eq("pedido_id", pedidoId);
    if (itemsErr) throw itemsErr;
    return {
        pedido,
        items: itemsData || []
    };
}
async function updatePedidoStatusWithStock(args) {
    const pedidoId = Number(args.pedidoId);
    const nextStatus = String(args.nextStatus || "");
    if (nextStatus === "Confirmado" && !args.stockDescontado) {
        const { data: itemsData, error: itemsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("pedido_items").select("producto_id, producto_variante_id, cantidad").eq("pedido_id", pedidoId);
        if (itemsError) throw itemsError;
        const safeItems = (itemsData || []).filter((it)=>it.producto_id);
        for (const it of safeItems){
            const productoId = Number(it.producto_id);
            const varianteId = it.producto_variante_id != null ? Number(it.producto_variante_id) : null;
            const qty = Number(it.cantidad || 0);
            if (!productoId || qty <= 0) continue;
            if (varianteId) {
                const { data: variante, error: varError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("producto_variantes").select("stock").eq("id", varianteId).single();
                if (varError) throw varError;
                const currentStock = Number(variante?.stock ?? 0);
                const newStock = Math.max(0, currentStock - qty);
                const { error: updError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("producto_variantes").update({
                    stock: newStock
                }).eq("id", varianteId);
                if (updError) throw updError;
            } else {
                const { data: producto, error: prodError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("productos").select("stock").eq("id", productoId).single();
                if (prodError) throw prodError;
                const currentStock = Number(producto?.stock ?? 0);
                const newStock = Math.max(0, currentStock - qty);
                const { error: updError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("productos").update({
                    stock: newStock
                }).eq("id", productoId);
                if (updError) throw updError;
            }
        }
        const { error: markError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").update({
            stock_descontado: true
        }).eq("id", pedidoId);
        if (markError) throw markError;
    }
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").update({
        status: nextStatus
    }).eq("id", pedidoId);
    if (error) throw error;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/admin/services/productos.client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminCategoria",
    ()=>createAdminCategoria,
    "deleteAdminProductoViaApi",
    ()=>deleteAdminProductoViaApi,
    "fetchAdminCategorias",
    ()=>fetchAdminCategorias,
    "fetchAdminProductoById",
    ()=>fetchAdminProductoById,
    "fetchAdminProductos",
    ()=>fetchAdminProductos,
    "fetchProductoSpecsAndVariants",
    ()=>fetchProductoSpecsAndVariants,
    "saveAdminProductoViaApi",
    ()=>saveAdminProductoViaApi,
    "uploadProductImages",
    ()=>uploadProductImages,
    "uploadProductVideos",
    ()=>uploadProductVideos
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
;
async function fetchAdminProductos() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("productos").select("*").order("id", {
        ascending: true
    });
    if (error) throw error;
    return data || [];
}
async function fetchAdminProductoById(id) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("productos").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
}
async function fetchAdminCategorias() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("categorias").select("*");
    if (error) throw error;
    return data || [];
}
async function createAdminCategoria(args) {
    const nombre = String(args.nombre || "").trim();
    const slug = nombre.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("categorias").insert({
        nombre,
        slug
    }).select().single();
    if (error) throw error;
    return data;
}
async function fetchProductoSpecsAndVariants(productId) {
    const [specRes, varRes] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("producto_especificaciones").select("*").eq("producto_id", productId).order("orden", {
            ascending: true
        }).order("id", {
            ascending: true
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("producto_variantes").select("*").eq("producto_id", productId).order("id", {
            ascending: true
        })
    ]);
    return {
        specs: specRes.data || [],
        variants: varRes.data || []
    };
}
async function uploadProductImages(args) {
    const files = Array.isArray(args.files) ? args.files : [];
    const uploadedUrls = [];
    for (const file of files){
        const fileExt = file.name.split(".").pop() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`;
        const filePath = `imagenes/${fileName}`;
        const { error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from("productos").upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from("productos").getPublicUrl(filePath);
        if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
    }
    return uploadedUrls;
}
async function uploadProductVideos(args) {
    const files = Array.isArray(args.files) ? args.files : [];
    const uploadedUrls = [];
    for (const file of files){
        const fileExt = file.name.split(".").pop() || "mp4";
        const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`;
        const filePath = `videos/${fileName}`;
        const { error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from("productos").upload(filePath, file, {
            upsert: false,
            contentType: file.type || "video/mp4"
        });
        if (uploadError) throw uploadError;
        const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from("productos").getPublicUrl(filePath);
        if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
    }
    return uploadedUrls;
}
async function saveAdminProductoViaApi(args) {
    const res = await fetch("/api/admin/productos", {
        method: args.method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${args.accessToken}`
        },
        body: JSON.stringify(args.body)
    });
    let json = null;
    try {
        json = await res.json();
    } catch (err) {
        json = null;
    }
    if (!res.ok || !json?.ok) {
        throw new Error(String(json?.error || "No se pudo guardar el producto"));
    }
    return json;
}
async function deleteAdminProductoViaApi(args) {
    const res = await fetch("/api/admin/productos", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${args.accessToken}`
        },
        body: JSON.stringify({
            id: args.id
        })
    });
    let json = null;
    try {
        json = await res.json();
    } catch (err) {
        json = null;
    }
    if (!res.ok || !json?.ok) {
        throw new Error(String(json?.error || "No se pudo eliminar"));
    }
    return json;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/admin/services/usuarios.client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createWorkerViaApi",
    ()=>createWorkerViaApi,
    "fetchAdminProfiles",
    ()=>fetchAdminProfiles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
;
async function fetchAdminProfiles() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("profiles").select("id, email, nombre, role, created_at").order("created_at", {
        ascending: false
    });
    if (error) throw error;
    return data || [];
}
async function createWorkerViaApi(args) {
    const res = await fetch("/api/admin/create-worker", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${args.accessToken}`
        },
        body: JSON.stringify({
            email: args.email,
            nombre: args.nombre,
            password: args.password
        })
    });
    const json = await res.json();
    if (!res.ok) {
        throw new Error(String(json?.error || "Error"));
    }
    return json;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/admin/services/cupones.client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminCupon",
    ()=>createAdminCupon,
    "deleteAdminCupon",
    ()=>deleteAdminCupon,
    "fetchAdminCupones",
    ()=>fetchAdminCupones,
    "updateAdminCupon",
    ()=>updateAdminCupon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
;
async function fetchAdminCupones() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cupones").select("*").order("created_at", {
        ascending: false
    });
    if (error) throw error;
    return data || [];
}
async function createAdminCupon(payload) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cupones").insert(payload);
    if (error) throw error;
}
async function updateAdminCupon(id, payload) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cupones").update(payload).eq("id", id);
    if (error) throw error;
}
async function deleteAdminCupon(id) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("cupones").delete().eq("id", id);
    if (error) throw error;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/admin/services/banners.client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteHomeBanner",
    ()=>deleteHomeBanner,
    "fetchHomeBanners",
    ()=>fetchHomeBanners,
    "saveHomeBanner",
    ()=>saveHomeBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
;
async function fetchHomeBanners() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("home_banners").select("*").order("orden", {
        ascending: true
    }).order("id", {
        ascending: true
    });
    if (error) throw error;
    return data || [];
}
async function saveHomeBanner(args) {
    if (args.id != null) {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("home_banners").update(args.payload).eq("id", args.id);
        if (error) throw error;
        return;
    }
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("home_banners").insert(args.payload);
    if (error) throw error;
}
async function deleteHomeBanner(id) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("home_banners").delete().eq("id", id);
    if (error) throw error;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/admin/services/announcement-bar.client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAnnouncementBarConfigViaApi",
    ()=>fetchAnnouncementBarConfigViaApi,
    "saveAnnouncementBarConfigViaApi",
    ()=>saveAnnouncementBarConfigViaApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
;
async function getAccessToken() {
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
    const token = res?.data?.session?.access_token || "";
    return token;
}
async function fetchAnnouncementBarConfigViaApi() {
    const token = await getAccessToken();
    if (!token) throw new Error("No autorizado");
    const res = await fetch("/api/admin/announcement-bar", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    let json = null;
    try {
        json = await res.json();
    } catch (e) {
        json = null;
    }
    if (!res.ok || !json?.ok) {
        throw new Error(String(json?.error || "No se pudo obtener la configuración"));
    }
    const data = json?.data || {};
    return {
        enabled: Boolean(data.enabled),
        interval_ms: Number(data.interval_ms) || 3500,
        messages: Array.isArray(data.messages) ? data.messages : []
    };
}
async function saveAnnouncementBarConfigViaApi(config) {
    const token = await getAccessToken();
    if (!token) throw new Error("No autorizado");
    const res = await fetch("/api/admin/announcement-bar", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(config)
    });
    let json = null;
    try {
        json = await res.json();
    } catch (e) {
        json = null;
    }
    if (!res.ok || !json?.ok) {
        throw new Error(String(json?.error || "No se pudo guardar"));
    }
    return json;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/admin/services/incidencias.client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createIncidencia",
    ()=>createIncidencia,
    "deleteIncidencia",
    ()=>deleteIncidencia,
    "fetchIncidencias",
    ()=>fetchIncidencias,
    "fetchPedidosForIncidencias",
    ()=>fetchPedidosForIncidencias,
    "uploadIncidenciaImages",
    ()=>uploadIncidenciaImages
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
;
async function fetchPedidosForIncidencias() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select("id, status, created_at, clientes (nombre, telefono)").order("created_at", {
        ascending: false
    }).limit(200);
    if (error) throw error;
    return data || [];
}
async function fetchIncidencias() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("incidencias").select("*, pedidos (id, status, created_at, clientes (nombre, telefono))").order("created_at", {
        ascending: false
    });
    if (error) throw error;
    return data || [];
}
async function uploadIncidenciaImages(args) {
    const pedidoId = String(args.pedidoId || "").trim();
    const files = Array.isArray(args.files) ? args.files : [];
    const uploadedUrls = [];
    for (const file of files){
        const fileExt = file.name.split(".").pop() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${fileExt}`;
        const folder = pedidoId ? `incidencias/${pedidoId}` : "incidencias";
        const filePath = `${folder}/${fileName}`;
        const { error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from("productos").upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].storage.from("productos").getPublicUrl(filePath);
        if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
    }
    return uploadedUrls;
}
async function createIncidencia(payload) {
    async function save(withFotos) {
        const p = {
            ...payload
        };
        if (!withFotos) delete p.fotos;
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("incidencias").insert(p);
    }
    const first = await save(true);
    let error = first.error;
    if (error && typeof error.message === "string" && error.message.toLowerCase().includes("fotos")) {
        const second = await save(false);
        error = second.error;
    }
    if (error) throw new Error(error.message);
}
async function deleteIncidencia(id) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("incidencias").delete().eq("id", id);
    if (error) throw error;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/admin/services/preguntas.client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAdminQuestions",
    ()=>fetchAdminQuestions,
    "saveQuestionAnswer",
    ()=>saveQuestionAnswer,
    "setQuestionPublished",
    ()=>setQuestionPublished
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
;
async function fetchAdminQuestions() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("product_questions").select("id, product_id, question, asker_name, asker_phone, published, created_at, productos(nombre), product_answers(id, answer, answered_by, created_at, published)").order("created_at", {
        ascending: false
    }).limit(200);
    if (error) throw error;
    return data || [];
}
async function setQuestionPublished(args) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("product_questions").update({
        published: args.published
    }).eq("id", args.id);
    if (error) throw error;
}
async function saveQuestionAnswer(args) {
    const answer = String(args.answer || "").trim();
    const { data: sessionRes } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
    const userId = sessionRes?.session?.user?.id || null;
    let answeredBy = null;
    if (userId) {
        const { data: profile } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("profiles").select("email, nombre").eq("id", userId).maybeSingle();
        answeredBy = String(profile?.nombre || profile?.email || "Admin");
    }
    const { data: current } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("product_questions").select("id, product_answers(id)").eq("id", args.questionId).maybeSingle();
    const existingId = current && Array.isArray(current.product_answers) && current.product_answers.length > 0 ? Number(current.product_answers[0]?.id) : null;
    if (existingId) {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("product_answers").update({
            answer,
            answered_by: answeredBy,
            published: true
        }).eq("id", existingId);
        if (error) throw error;
    } else {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("product_answers").insert({
            question_id: args.questionId,
            answer,
            answered_by: answeredBy,
            published: true
        });
        if (error) throw error;
    }
    const { error: pubErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("product_questions").update({
        published: true
    }).eq("id", args.questionId);
    if (pubErr) throw pubErr;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/admin/services/resenas.client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteReview",
    ()=>deleteReview,
    "fetchAdminReviews",
    ()=>fetchAdminReviews,
    "setReviewApproved",
    ()=>setReviewApproved
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
;
async function fetchAdminReviews() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("product_reviews").select("id, product_id, rating, title, body, customer_name, customer_city, verified, approved, created_at, productos(nombre)").order("created_at", {
        ascending: false
    }).limit(200);
    if (error) throw error;
    return data || [];
}
async function setReviewApproved(args) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("product_reviews").update({
        approved: args.approved
    }).eq("id", args.id);
    if (error) throw error;
}
async function deleteReview(id) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("product_reviews").delete().eq("id", id);
    if (error) throw error;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/admin/services/clientes.client.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAdminClientes",
    ()=>fetchAdminClientes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
;
async function fetchAdminClientes() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from("clientes").select("*").order("id", {
        ascending: false
    });
    if (error) throw error;
    return data || [];
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/features/admin/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/types.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$dashboard$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/dashboard.client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$pedidos$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/pedidos.client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$productos$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/productos.client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$usuarios$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/usuarios.client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$cupones$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/cupones.client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$banners$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/banners.client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$announcement$2d$bar$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/announcement-bar.client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$incidencias$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/incidencias.client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$preguntas$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/preguntas.client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$resenas$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/resenas.client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$clientes$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/clientes.client.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/textarea.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Textarea",
    ()=>Textarea
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
function Textarea({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
        "data-slot": "textarea",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/textarea.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
_c = Textarea;
;
var _c;
__turbopack_context__.k.register(_c, "Textarea");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/select.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Select",
    ()=>Select,
    "SelectContent",
    ()=>SelectContent,
    "SelectGroup",
    ()=>SelectGroup,
    "SelectItem",
    ()=>SelectItem,
    "SelectLabel",
    ()=>SelectLabel,
    "SelectScrollDownButton",
    ()=>SelectScrollDownButton,
    "SelectScrollUpButton",
    ()=>SelectScrollUpButton,
    "SelectSeparator",
    ()=>SelectSeparator,
    "SelectTrigger",
    ()=>SelectTrigger,
    "SelectValue",
    ()=>SelectValue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-select/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as CheckIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-client] (ecmascript) <export default as ChevronUpIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
"use client";
;
;
;
;
function Select({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Root"], {
        "data-slot": "select",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 12,
        columnNumber: 10
    }, this);
}
_c = Select;
function SelectGroup({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Group"], {
        "data-slot": "select-group",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 18,
        columnNumber: 10
    }, this);
}
_c1 = SelectGroup;
function SelectValue({ ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Value"], {
        "data-slot": "select-value",
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 24,
        columnNumber: 10
    }, this);
}
_c2 = SelectValue;
function SelectTrigger({ className, size = "default", children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Trigger"], {
        "data-slot": "select-trigger",
        "data-size": size,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", className),
        ...props,
        children: [
            children,
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                asChild: true,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                    className: "size-4 opacity-50"
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 47,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
_c3 = SelectTrigger;
function SelectContent({ className, children, position = "item-aligned", align = "center", ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Portal"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Content"], {
            "data-slot": "select-content",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
            position: position,
            align: align,
            ...props,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollUpButton, {}, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 74,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Viewport"], {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"),
                    children: children
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 75,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SelectScrollDownButton, {}, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 84,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 62,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 61,
        columnNumber: 5
    }, this);
}
_c4 = SelectContent;
function SelectLabel({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
        "data-slot": "select-label",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground px-2 py-1.5 text-xs", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c5 = SelectLabel;
function SelectItem({ className, children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Item"], {
        "data-slot": "select-item",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", className),
        ...props,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                "data-slot": "select-item-indicator",
                className: "absolute right-2 flex size-3.5 items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemIndicator"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckIcon$3e$__["CheckIcon"], {
                        className: "size-4"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/select.tsx",
                        lineNumber: 122,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ui/select.tsx",
                    lineNumber: 121,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ItemText"], {
                children: children
            }, void 0, false, {
                fileName: "[project]/components/ui/select.tsx",
                lineNumber: 125,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, this);
}
_c6 = SelectItem;
function SelectSeparator({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Separator"], {
        "data-slot": "select-separator",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-border pointer-events-none -mx-1 my-1 h-px", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 135,
        columnNumber: 5
    }, this);
}
_c7 = SelectSeparator;
function SelectScrollUpButton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollUpButton"], {
        "data-slot": "select-scroll-up-button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__["ChevronUpIcon"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 156,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 148,
        columnNumber: 5
    }, this);
}
_c8 = SelectScrollUpButton;
function SelectScrollDownButton({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$select$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollDownButton"], {
        "data-slot": "select-scroll-down-button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex cursor-default items-center justify-center py-1", className),
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
            className: "size-4"
        }, void 0, false, {
            fileName: "[project]/components/ui/select.tsx",
            lineNumber: 174,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/select.tsx",
        lineNumber: 166,
        columnNumber: 5
    }, this);
}
_c9 = SelectScrollDownButton;
;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "Select");
__turbopack_context__.k.register(_c1, "SelectGroup");
__turbopack_context__.k.register(_c2, "SelectValue");
__turbopack_context__.k.register(_c3, "SelectTrigger");
__turbopack_context__.k.register(_c4, "SelectContent");
__turbopack_context__.k.register(_c5, "SelectLabel");
__turbopack_context__.k.register(_c6, "SelectItem");
__turbopack_context__.k.register(_c7, "SelectSeparator");
__turbopack_context__.k.register(_c8, "SelectScrollUpButton");
__turbopack_context__.k.register(_c9, "SelectScrollDownButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/admin/product-form.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ProductForm",
    ()=>ProductForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/admin/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$productos$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/productos.client.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/label.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/textarea.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-down.js [app-client] (ecmascript) <export default as ArrowDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-up.js [app-client] (ecmascript) <export default as ArrowUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader-circle.js [app-client] (ecmascript) <export default as Loader2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/cloud-upload.js [app-client] (ecmascript) <export default as UploadCloud>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/select.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
function ProductForm({ productToEdit, categories = [], onSuccess, onCancel }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploading, setUploading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Categories are now passed as props
    // Form State
    const [name, setName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [price, setPrice] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [priceBefore, setPriceBefore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [stock, setStock] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [calificacion, setCalificacion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("5");
    const [imageUrl, setImageUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [galleryImages, setGalleryImages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [newGalleryUrl, setNewGalleryUrl] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [videos, setVideos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedParentId, setSelectedParentId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("default");
    const [selectedSubcategoryId, setSelectedSubcategoryId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("default");
    const [descripcion, setDescripcion] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [materiales, setMateriales] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tamano, setTamano] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [color, setColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [cuidados, setCuidados] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [uso, setUso] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [especificaciones, setEspecificaciones] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [variantes, setVariantes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // NEW: Toggle for manual category change
    const [changeCategoryMode, setChangeCategoryMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Computed Category State removed (we use direct productToEdit or local state)
    // Create Category State
    const [isCreatingCategory, setIsCreatingCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newCategoryName, setNewCategoryName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProductForm.useEffect": ()=>{
            if (productToEdit) {
                setName(productToEdit.nombre || "");
                setPrice(productToEdit.precio?.toString() || "");
                setPriceBefore(productToEdit.precio_antes != null ? String(productToEdit.precio_antes) : "");
                setStock(productToEdit.stock?.toString() || "");
                setCalificacion(productToEdit.calificacion != null ? String(productToEdit.calificacion) : "5");
                setImageUrl(productToEdit.imagen_url || "");
                setDescripcion(productToEdit.descripcion || "");
                setMateriales(productToEdit.materiales || "");
                setTamano(productToEdit.tamano || "");
                setColor(productToEdit.color || "");
                setCuidados(productToEdit.cuidados || "");
                setUso(productToEdit.uso || "");
                const fromDb = Array.isArray(productToEdit.imagenes) ? productToEdit.imagenes : [];
                const normalized = [
                    ...productToEdit.imagen_url ? [
                        productToEdit.imagen_url
                    ] : [],
                    ...fromDb
                ].map({
                    "ProductForm.useEffect.normalized": (x)=>String(x || "").trim()
                }["ProductForm.useEffect.normalized"]).filter(Boolean);
                const unique = Array.from(new Set(normalized)).slice(0, 10);
                setGalleryImages(unique);
                setNewGalleryUrl("");
                const vFromDb = Array.isArray(productToEdit.videos) ? productToEdit.videos : [];
                const vClean = vFromDb.map({
                    "ProductForm.useEffect.vClean": (x)=>String(x || '').trim()
                }["ProductForm.useEffect.vClean"]).filter(Boolean);
                setVideos(Array.from(new Set(vClean)).slice(0, 6));
                // Category syncing logic:
                // If editing, we DO NOT fill the selectedParentId/Sub to avoid confusing the "New Category" fields.
                // We want "New Category" fields to start empty (default) so the user explicitly chooses if they want to change.
                // UNLESS it's a new product or no category assigned.
                const rawCatId = productToEdit.categoria_id;
                if (!rawCatId) {
                    setSelectedParentId("default");
                    setSelectedSubcategoryId("default");
                }
                // If rawCatId exists, we leave selected*Id as default. The UI will show the "Current Category" block.
                ;
                ({
                    "ProductForm.useEffect": async ()=>{
                        try {
                            const productId = Number(productToEdit.id);
                            if (!productId) {
                                setEspecificaciones([]);
                                setVariantes([]);
                                return;
                            }
                            const { specs, variants } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$productos$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchProductoSpecsAndVariants"])(productId);
                            const nextSpecs = Array.isArray(specs) ? specs.map({
                                "ProductForm.useEffect": (s)=>({
                                        id: Number(s.id),
                                        clave: String(s.clave || ''),
                                        valor: String(s.valor || ''),
                                        orden: Number(s.orden || 0)
                                    })
                            }["ProductForm.useEffect"]) : [];
                            setEspecificaciones(nextSpecs);
                            const nextVars = Array.isArray(variants) ? variants.map({
                                "ProductForm.useEffect": (v)=>({
                                        id: Number(v.id),
                                        etiqueta: String(v.etiqueta || ''),
                                        precio: v.precio != null ? String(v.precio) : '',
                                        precio_antes: v.precio_antes != null ? String(v.precio_antes) : '',
                                        stock: String(v.stock ?? 0),
                                        activo: Boolean(v.activo ?? true)
                                    })
                            }["ProductForm.useEffect"]) : [];
                            setVariantes(nextVars);
                        } catch (err) {
                            setEspecificaciones([]);
                            setVariantes([]);
                        }
                    }
                })["ProductForm.useEffect"]();
            } else {
                // Reset form when not editing (or switching to new)
                setName("");
                setPrice("");
                setPriceBefore("");
                setStock("");
                setCalificacion("5");
                setImageUrl("");
                setDescripcion("");
                setMateriales("");
                setTamano("");
                setColor("");
                setCuidados("");
                setUso("");
                setGalleryImages([]);
                setNewGalleryUrl("");
                setVideos([]);
                setSelectedParentId("default");
                setSelectedSubcategoryId("default");
                setEspecificaciones([]);
                setVariantes([]);
            }
        }
    }["ProductForm.useEffect"], [
        productToEdit,
        categories
    ]);
    function normalizeImages(input) {
        const unique = [];
        for (const raw of input){
            const v = String(raw || "").trim();
            if (!v) continue;
            if (!unique.includes(v)) unique.push(v);
            if (unique.length >= 10) break;
        }
        return unique;
    }
    function normalizeVideos(input) {
        const unique = [];
        for (const raw of input){
            const v = String(raw || "").trim();
            if (!v) continue;
            if (!unique.includes(v)) unique.push(v);
            if (unique.length >= 6) break;
        }
        return unique;
    }
    async function handleVideoUpload(e) {
        if (!e.target.files || e.target.files.length === 0) return;
        try {
            setUploading(true);
            const files = Array.from(e.target.files);
            const remaining = Math.max(0, 6 - videos.length);
            const toUpload = files.slice(0, remaining);
            const uploadedUrls = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$productos$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadProductVideos"])({
                files: toUpload
            });
            const next = normalizeVideos([
                ...videos,
                ...uploadedUrls
            ]);
            setVideos(next);
        } catch (error) {
            alert("Error subiendo video: " + error.message);
        } finally{
            setUploading(false);
            e.target.value = '';
        }
    }
    function addGalleryUrl(url) {
        const next = normalizeImages([
            ...galleryImages,
            url
        ]);
        setGalleryImages(next);
        if (!imageUrl && next.length > 0) {
            setImageUrl(next[0]);
        }
    }
    function removeGalleryUrl(url) {
        const next = galleryImages.filter((x)=>x !== url);
        setGalleryImages(next);
        if (imageUrl === url) {
            setImageUrl(next[0] || "");
        }
    }
    function makeGalleryMain(url) {
        const next = normalizeImages([
            url,
            ...galleryImages.filter((x)=>x !== url)
        ]);
        setGalleryImages(next);
        setImageUrl(next[0] || "");
    }
    function moveGalleryIndex(fromIndex, toIndex) {
        if (fromIndex === toIndex) return;
        if (fromIndex < 0 || toIndex < 0) return;
        if (fromIndex >= galleryImages.length || toIndex >= galleryImages.length) return;
        const next = [
            ...galleryImages
        ];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        setGalleryImages(next);
        if (next.length > 0) setImageUrl(next[0]);
    }
    function moveVideoIndex(fromIndex, toIndex) {
        if (fromIndex === toIndex) return;
        if (fromIndex < 0 || toIndex < 0) return;
        if (fromIndex >= videos.length || toIndex >= videos.length) return;
        const next = [
            ...videos
        ];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        setVideos(next);
    }
    async function handleCreateCategory() {
        if (!newCategoryName.trim()) return;
        try {
            setLoading(true);
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$productos$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createAdminCategoria"])({
                nombre: newCategoryName
            });
            // Add to local list and select it
            // setCategories([...categories, data]) // Cannot update props locally
            window.location.reload(); // Force reload to fetch new category
            setCategoryId(data.id.toString());
            setIsCreatingCategory(false);
            setNewCategoryName("");
        } catch (error) {
            alert("Error creando categoría: " + error.message);
        } finally{
            setLoading(false);
        }
    }
    async function handleImageUpload(e) {
        if (!e.target.files || e.target.files.length === 0) return;
        try {
            setUploading(true);
            const files = Array.from(e.target.files).filter((f)=>{
                const t = String(f?.type || '').toLowerCase();
                const n = String(f?.name || '').toLowerCase();
                if (t) return t.startsWith('image/');
                return n.endsWith('.png') || n.endsWith('.jpg') || n.endsWith('.jpeg') || n.endsWith('.webp') || n.endsWith('.gif');
            });
            const remaining = Math.max(0, 10 - galleryImages.length);
            const toUpload = files.slice(0, remaining);
            const uploadedUrls = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$productos$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uploadProductImages"])({
                files: toUpload
            });
            const next = normalizeImages([
                ...galleryImages,
                ...uploadedUrls
            ]);
            setGalleryImages(next);
            if (!imageUrl && next.length > 0) {
                setImageUrl(next[0]);
            }
        } catch (error) {
            alert("Error subiendo imagen: " + error.message);
        } finally{
            setUploading(false);
            e.target.value = '';
        }
    }
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            const sessionRes = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            const accessToken = sessionRes?.data?.session?.access_token;
            if (!accessToken) {
                alert('Tu sesión expiró. Vuelve a iniciar sesión.');
                setLoading(false);
                return;
            }
            // Determine final category ID
            // Determine final category ID
            let finalCategoryIdToSave = null;
            // LOGIC: 
            // 1. If Change Mode is active (explicit toggle OR no existing category), use selectedParentId.
            // 2. Else, keep existing productToEdit.categoria_id.
            const isChangeMode = !productToEdit?.categoria_id || changeCategoryMode;
            if (isChangeMode) {
                if (!selectedParentId || selectedParentId === "default") {
                    alert("Debes seleccionar una Categoría Principal.");
                    setLoading(false);
                    return;
                }
                finalCategoryIdToSave = selectedParentId;
                // Validate subcategory if needed
                const hasSubcats = categories.some((c)=>String(c.parent_id) === selectedParentId);
                if (hasSubcats && (!selectedSubcategoryId || selectedSubcategoryId === "default")) {
                    alert("Debes seleccionar una Subcategoría para la nueva categoría seleccionada.");
                    setLoading(false);
                    return;
                }
                if (selectedSubcategoryId && selectedSubcategoryId !== "default") {
                    finalCategoryIdToSave = selectedSubcategoryId;
                }
            } else {
                // Not in change mode, preserve existing
                if (productToEdit?.categoria_id) {
                    finalCategoryIdToSave = productToEdit.categoria_id;
                } else {
                    // Should not happen if logic is correct, but fallback
                    alert("Error de lógica: No hay categoría asignada y no se seleccionó ninguna.");
                    setLoading(false);
                    return;
                }
            }
            const priceNum = Number(price);
            if (!Number.isFinite(priceNum) || priceNum <= 0) {
                alert('Ingresa un precio actual válido');
                setLoading(false);
                return;
            }
            const priceBeforeRaw = String(priceBefore || '').trim();
            const priceBeforeNum = priceBeforeRaw ? Number(priceBeforeRaw) : null;
            if (priceBeforeNum != null && (!Number.isFinite(priceBeforeNum) || priceBeforeNum <= 0)) {
                alert('Ingresa un precio antes válido o déjalo vacío');
                setLoading(false);
                return;
            }
            if (priceBeforeNum != null && priceBeforeNum <= priceNum) {
                alert('El precio antes debe ser mayor que el precio actual para mostrar oferta');
                setLoading(false);
                return;
            }
            const stockNum = Number(stock);
            if (!Number.isFinite(stockNum) || stockNum < 0) {
                alert('Ingresa un stock válido');
                setLoading(false);
                return;
            }
            const calificacionNum = Number(calificacion);
            if (!Number.isFinite(calificacionNum) || calificacionNum < 0 || calificacionNum > 5) {
                alert('Ingresa una calificación válida (0-5)');
                setLoading(false);
                return;
            }
            const mergedImages = galleryImages.length > 0 ? normalizeImages(galleryImages) : normalizeImages([
                ...imageUrl ? [
                    imageUrl
                ] : []
            ]);
            const imageOnly = mergedImages.filter((u)=>{
                const s = String(u || '').toLowerCase();
                return !(s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.mov') || s.endsWith('.m4v'));
            });
            const videoFromImages = mergedImages.filter((u)=>{
                const s = String(u || '').toLowerCase();
                return s.endsWith('.mp4') || s.endsWith('.webm') || s.endsWith('.mov') || s.endsWith('.m4v');
            });
            const videosFinal = normalizeVideos([
                ...videos,
                ...videoFromImages
            ]);
            const mainImage = imageOnly[0] || (imageUrl ? imageUrl : null);
            const productData = {
                nombre: name,
                precio: priceNum,
                precio_antes: priceBeforeNum,
                stock: stockNum,
                calificacion: calificacionNum,
                imagen_url: mainImage,
                imagenes: imageOnly,
                videos: videosFinal,
                descripcion: descripcion.trim() || null,
                materiales: materiales.trim() || null,
                tamano: tamano.trim() || null,
                color: color.trim() || null,
                cuidados: cuidados.trim() || null,
                uso: uso.trim() || null,
                categoria_id: finalCategoryIdToSave ? parseInt(finalCategoryIdToSave) : null
            };
            const cleanSpecs = especificaciones.map((s)=>({
                    clave: String(s.clave || '').trim(),
                    valor: String(s.valor || '').trim(),
                    orden: Number(s.orden || 0)
                })).filter((s)=>s.clave.length > 0);
            const cleanVariants = variantes.map((v)=>({
                    etiqueta: String(v.etiqueta || '').trim(),
                    precio: String(v.precio || '').trim(),
                    precio_antes: String(v.precio_antes || '').trim(),
                    stock: String(v.stock || '').trim(),
                    activo: Boolean(v.activo)
                })).filter((v)=>v.etiqueta.length > 0);
            const method = productToEdit ? 'PUT' : 'POST';
            const apiBody = {
                product: productData,
                specs: cleanSpecs,
                variants: cleanVariants.map((v)=>({
                        etiqueta: v.etiqueta,
                        precio: v.precio ? Number(v.precio) : null,
                        precio_antes: v.precio_antes ? Number(v.precio_antes) : null,
                        stock: Number(v.stock || 0),
                        activo: v.activo
                    }))
            };
            if (productToEdit) apiBody.id = Number(productToEdit.id);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$productos$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["saveAdminProductoViaApi"])({
                accessToken,
                method: method,
                body: apiBody
            });
            onSuccess();
        } catch (error) {
            alert("Error al guardar: " + error.message);
        } finally{
            setLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "space-y-6 py-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                        htmlFor: "name",
                        children: "Nombre del Producto"
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 497,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                        id: "name",
                        placeholder: "Ej: Zapatillas Nike Air",
                        required: true,
                        value: name,
                        onChange: (e)=>setName(e.target.value)
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 498,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin/product-form.tsx",
                lineNumber: 496,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                        htmlFor: "descripcion",
                        children: "Descripción (general)"
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 508,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                        id: "descripcion",
                        placeholder: "Descripción completa del producto...",
                        value: descripcion,
                        onChange: (e)=>setDescripcion(e.target.value)
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 509,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin/product-form.tsx",
                lineNumber: 507,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "materiales",
                                children: "Materiales"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 519,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                id: "materiales",
                                value: materiales,
                                onChange: (e)=>setMateriales(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 520,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 518,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "tamano",
                                children: "Tamaño / Medidas"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 523,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                id: "tamano",
                                value: tamano,
                                onChange: (e)=>setTamano(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 524,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 522,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "color",
                                children: "Color"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 527,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                id: "color",
                                value: color,
                                onChange: (e)=>setColor(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 528,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 526,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "cuidados",
                                children: "Cuidados"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 531,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                id: "cuidados",
                                value: cuidados,
                                onChange: (e)=>setCuidados(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 532,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 530,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2 sm:col-span-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "uso",
                                children: "Uso recomendado"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 535,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$textarea$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Textarea"], {
                                id: "uso",
                                value: uso,
                                onChange: (e)=>setUso(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 536,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 534,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin/product-form.tsx",
                lineNumber: 517,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                children: "Ficha técnica (especificaciones)"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 542,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "outline",
                                size: "sm",
                                onClick: ()=>setEspecificaciones((prev)=>[
                                            ...prev,
                                            {
                                                clave: '',
                                                valor: '',
                                                orden: prev.length
                                            }
                                        ]),
                                children: "Agregar"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 543,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 541,
                        columnNumber: 17
                    }, this),
                    especificaciones.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-muted-foreground",
                        children: "Sin especificaciones"
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 554,
                        columnNumber: 21
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: especificaciones.slice().sort((a, b)=>Number(a.orden || 0) - Number(b.orden || 0)).map((s, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 sm:grid-cols-12 gap-2 rounded-lg border bg-popover p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "sm:col-span-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-xs",
                                                children: "Clave"
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 563,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                value: s.clave,
                                                onChange: (e)=>{
                                                    const val = e.target.value;
                                                    setEspecificaciones((prev)=>prev.map((p)=>p === s ? {
                                                                ...p,
                                                                clave: val
                                                            } : p));
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 564,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 562,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "sm:col-span-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-xs",
                                                children: "Valor"
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 573,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                value: s.valor,
                                                onChange: (e)=>{
                                                    const val = e.target.value;
                                                    setEspecificaciones((prev)=>prev.map((p)=>p === s ? {
                                                                ...p,
                                                                valor: val
                                                            } : p));
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 574,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 572,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "sm:col-span-2 flex items-end gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-9 w-9",
                                                onClick: ()=>setEspecificaciones((prev)=>prev.map((p)=>p === s ? {
                                                                ...p,
                                                                orden: Math.max(0, Number(p.orden || 0) - 1)
                                                            } : p)),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__["ArrowUp"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                    lineNumber: 590,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 583,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-9 w-9",
                                                onClick: ()=>setEspecificaciones((prev)=>prev.map((p)=>p === s ? {
                                                                ...p,
                                                                orden: Number(p.orden || 0) + 1
                                                            } : p)),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__["ArrowDown"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                    lineNumber: 599,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 592,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-9 w-9",
                                                onClick: ()=>setEspecificaciones((prev)=>prev.filter((p)=>p !== s)),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                    lineNumber: 608,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 601,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 582,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, s.id ?? `new-${idx}`, true, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 561,
                                columnNumber: 33
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 556,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin/product-form.tsx",
                lineNumber: 540,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                children: "Videos (hasta 6)"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 619,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-muted-foreground",
                                children: [
                                    videos.length,
                                    "/6"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 620,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 618,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            type: "file",
                            accept: "video/mp4,video/webm",
                            multiple: true,
                            onChange: handleVideoUpload,
                            disabled: uploading || videos.length >= 6
                        }, void 0, false, {
                            fileName: "[project]/components/admin/product-form.tsx",
                            lineNumber: 624,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 623,
                        columnNumber: 17
                    }, this),
                    videos.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: videos.map((url, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 rounded-lg border bg-popover p-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-7 w-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold",
                                        children: idx + 1
                                    }, void 0, false, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 637,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0 flex-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-muted-foreground truncate",
                                            children: url
                                        }, void 0, false, {
                                            fileName: "[project]/components/admin/product-form.tsx",
                                            lineNumber: 642,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 641,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-8 w-8",
                                                onClick: ()=>moveVideoIndex(idx, idx - 1),
                                                disabled: idx === 0,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__["ArrowUp"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                    lineNumber: 654,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 646,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-8 w-8",
                                                onClick: ()=>moveVideoIndex(idx, idx + 1),
                                                disabled: idx === videos.length - 1,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__["ArrowDown"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                    lineNumber: 665,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 657,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-8 w-8",
                                                onClick: ()=>setVideos((prev)=>prev.filter((x)=>x !== url)),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                    lineNumber: 675,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 668,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 645,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, `${url}-${idx}`, true, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 636,
                                columnNumber: 29
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 634,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin/product-form.tsx",
                lineNumber: 617,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                children: "Variantes (talla / color / modelo)"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 686,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                variant: "outline",
                                size: "sm",
                                onClick: ()=>setVariantes((prev)=>[
                                            ...prev,
                                            {
                                                etiqueta: '',
                                                precio: '',
                                                precio_antes: '',
                                                stock: '0',
                                                activo: true
                                            }
                                        ]),
                                children: "Agregar"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 687,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 685,
                        columnNumber: 17
                    }, this),
                    variantes.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-sm text-muted-foreground",
                        children: "Sin variantes"
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 698,
                        columnNumber: 21
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: variantes.map((v, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 sm:grid-cols-12 gap-2 rounded-lg border bg-popover p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "sm:col-span-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-xs",
                                                children: "Etiqueta"
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 704,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                value: v.etiqueta,
                                                onChange: (e)=>{
                                                    const val = e.target.value;
                                                    setVariantes((prev)=>prev.map((p)=>p === v ? {
                                                                ...p,
                                                                etiqueta: val
                                                            } : p));
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 705,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 703,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "sm:col-span-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-xs",
                                                children: "Precio (opcional)"
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 714,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                inputMode: "decimal",
                                                value: v.precio,
                                                onChange: (e)=>{
                                                    const val = e.target.value;
                                                    setVariantes((prev)=>prev.map((p)=>p === v ? {
                                                                ...p,
                                                                precio: val
                                                            } : p));
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 715,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 713,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "sm:col-span-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-xs",
                                                children: "Precio antes (opcional)"
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 725,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                inputMode: "decimal",
                                                value: v.precio_antes,
                                                onChange: (e)=>{
                                                    const val = e.target.value;
                                                    setVariantes((prev)=>prev.map((p)=>p === v ? {
                                                                ...p,
                                                                precio_antes: val
                                                            } : p));
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 726,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 724,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "sm:col-span-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                className: "text-xs",
                                                children: "Stock"
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 736,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                inputMode: "numeric",
                                                value: v.stock,
                                                onChange: (e)=>{
                                                    const val = e.target.value;
                                                    setVariantes((prev)=>prev.map((p)=>p === v ? {
                                                                ...p,
                                                                stock: val
                                                            } : p));
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 737,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 735,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "sm:col-span-2 flex items-end gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                variant: "outline",
                                                size: "sm",
                                                onClick: ()=>setVariantes((prev)=>prev.map((p)=>p === v ? {
                                                                ...p,
                                                                activo: !p.activo
                                                            } : p)),
                                                children: v.activo ? 'Activa' : 'Inactiva'
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 747,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-9 w-9",
                                                onClick: ()=>setVariantes((prev)=>prev.filter((p)=>p !== v)),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                    lineNumber: 762,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 755,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 746,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, v.id ?? `vnew-${idx}`, true, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 702,
                                columnNumber: 29
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 700,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin/product-form.tsx",
                lineNumber: 684,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "price",
                                children: "Precio actual (S/)"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 773,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                id: "price",
                                type: "number",
                                step: "0.01",
                                required: true,
                                placeholder: "0.00",
                                value: price,
                                onChange: (e)=>setPrice(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 774,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 772,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "priceBefore",
                                children: "Precio antes (S/) (opcional)"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 785,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                id: "priceBefore",
                                type: "number",
                                step: "0.01",
                                placeholder: "0.00",
                                value: priceBefore,
                                onChange: (e)=>setPriceBefore(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 786,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 784,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "stock",
                                children: "Stock (Unidades)"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 796,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                id: "stock",
                                type: "number",
                                required: true,
                                placeholder: "10",
                                value: stock,
                                onChange: (e)=>setStock(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 797,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 795,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "calificacion",
                                children: "Calificación (0-5)"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 807,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                id: "calificacion",
                                type: "number",
                                step: "0.1",
                                min: "0",
                                max: "5",
                                required: true,
                                placeholder: "5.0",
                                value: calificacion,
                                onChange: (e)=>setCalificacion(e.target.value)
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 808,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 806,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin/product-form.tsx",
                lineNumber: 771,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: (()=>{
                    const hasExistingCategory = !!productToEdit?.categoria_id;
                    // Logic to display existing category name
                    let existingParentName = "";
                    let existingChildName = "";
                    if (hasExistingCategory && categories.length > 0) {
                        const rawId = String(productToEdit.categoria_id);
                        const current = categories.find((c)=>String(c.id) === rawId);
                        if (current) {
                            if (current.parent_id) {
                                const p = categories.find((c)=>String(c.id) === String(current.parent_id));
                                existingParentName = p?.nombre || "...";
                                existingChildName = current.nombre;
                            } else {
                                existingParentName = current.nombre;
                            }
                        }
                    }
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            hasExistingCategory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-4 border rounded-md bg-muted/40",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                        className: "text-sm font-semibold mb-2 block",
                                        children: "Categoría Asignada (Actual)"
                                    }, void 0, false, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 850,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 text-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-primary/10 text-primary px-3 py-1 rounded-full font-medium",
                                                children: existingParentName || "Desconocida"
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 852,
                                                columnNumber: 41
                                            }, this),
                                            existingChildName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-muted-foreground",
                                                        children: "/"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/admin/product-form.tsx",
                                                        lineNumber: 857,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "bg-secondary text-secondary-foreground px-3 py-1 rounded-full font-medium",
                                                        children: existingChildName
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/admin/product-form.tsx",
                                                        lineNumber: 858,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 851,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center space-x-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    id: "changeCat",
                                                    className: "h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary",
                                                    checked: changeCategoryMode,
                                                    onChange: (e)=>setChangeCategoryMode(e.target.checked)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                    lineNumber: 866,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                    htmlFor: "changeCat",
                                                    className: "font-normal cursor-pointer select-none",
                                                    children: "Quiero cambiar la categoría actual"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                    lineNumber: 873,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/admin/product-form.tsx",
                                            lineNumber: 865,
                                            columnNumber: 41
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 864,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 849,
                                columnNumber: 33
                            }, this),
                            (!hasExistingCategory || changeCategoryMode) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `space-y-4 ${hasExistingCategory ? "p-4 border border-dashed rounded-md bg-background animate-in fade-in zoom-in-95 duration-200" : ""}`,
                                children: [
                                    hasExistingCategory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                        className: "text-sm font-semibold text-primary",
                                        children: "Seleccionar Nueva Categoría"
                                    }, void 0, false, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 883,
                                        columnNumber: 61
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                        className: "text-xs text-muted-foreground",
                                                        children: [
                                                            "Categoría Principal ",
                                                            hasExistingCategory ? "(Nueva)" : ""
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/admin/product-form.tsx",
                                                        lineNumber: 887,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                        value: selectedParentId,
                                                        onValueChange: (val)=>{
                                                            setSelectedParentId(val);
                                                            setSelectedSubcategoryId("default");
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                                    placeholder: "Seleccionar Principal"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                                    lineNumber: 895,
                                                                    columnNumber: 53
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/admin/product-form.tsx",
                                                                lineNumber: 894,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                        value: "default",
                                                                        children: "Seleccionar..."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/admin/product-form.tsx",
                                                                        lineNumber: 898,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    categories.filter((c)=>!c.parent_id).sort((a, b)=>a.nombre.localeCompare(b.nombre)).map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                            value: String(c.id),
                                                                            children: c.nombre
                                                                        }, c.id, false, {
                                                                            fileName: "[project]/components/admin/product-form.tsx",
                                                                            lineNumber: 903,
                                                                            columnNumber: 61
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/admin/product-form.tsx",
                                                                lineNumber: 897,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/admin/product-form.tsx",
                                                        lineNumber: 888,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 886,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                                        className: "text-xs text-muted-foreground",
                                                        children: "Subcategoría (Opcional)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/admin/product-form.tsx",
                                                        lineNumber: 912,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Select"], {
                                                        value: selectedSubcategoryId,
                                                        onValueChange: setSelectedSubcategoryId,
                                                        disabled: selectedParentId === "default" || !categories.some((c)=>String(c.parent_id) === selectedParentId),
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectTrigger"], {
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectValue"], {
                                                                    placeholder: "Seleccionar Subcategoría"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                                    lineNumber: 919,
                                                                    columnNumber: 53
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/admin/product-form.tsx",
                                                                lineNumber: 918,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectContent"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                        value: "default",
                                                                        children: "Ninguna"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/admin/product-form.tsx",
                                                                        lineNumber: 922,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    categories.filter((c)=>String(c.parent_id) === selectedParentId).sort((a, b)=>a.nombre.localeCompare(b.nombre)).map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$select$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SelectItem"], {
                                                                            value: String(c.id),
                                                                            children: c.nombre
                                                                        }, c.id, false, {
                                                                            fileName: "[project]/components/admin/product-form.tsx",
                                                                            lineNumber: 927,
                                                                            columnNumber: 61
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/admin/product-form.tsx",
                                                                lineNumber: 921,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/admin/product-form.tsx",
                                                        lineNumber: 913,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 911,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 885,
                                        columnNumber: 37
                                    }, this),
                                    !isCreatingCategory ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        type: "button",
                                        variant: "link",
                                        className: "h-auto p-0 text-xs text-accent mt-2",
                                        onClick: ()=>setIsCreatingCategory(true),
                                        children: "+ Crear Nueva Categoría Global"
                                    }, void 0, false, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 938,
                                        columnNumber: 41
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2 mt-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                                placeholder: "Nombre nueva categoría...",
                                                value: newCategoryName,
                                                onChange: (e)=>setNewCategoryName(e.target.value),
                                                className: "flex-1"
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 948,
                                                columnNumber: 45
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                size: "sm",
                                                onClick: handleCreateCategory,
                                                disabled: !newCategoryName.trim() || loading,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                    lineNumber: 960,
                                                    columnNumber: 49
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 954,
                                                columnNumber: 45
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                variant: "ghost",
                                                size: "sm",
                                                onClick: ()=>setIsCreatingCategory(false),
                                                children: "Cancelar"
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 962,
                                                columnNumber: 45
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 947,
                                        columnNumber: 41
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 882,
                                columnNumber: 33
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 847,
                        columnNumber: 25
                    }, this);
                })()
            }, void 0, false, {
                fileName: "[project]/components/admin/product-form.tsx",
                lineNumber: 823,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                        children: "Imagen"
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 981,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                            value: imageUrl,
                            onChange: (e)=>setImageUrl(e.target.value),
                            placeholder: "https://...",
                            className: "flex-1"
                        }, void 0, false, {
                            fileName: "[project]/components/admin/product-form.tsx",
                            lineNumber: 983,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 982,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-muted-foreground",
                        children: "Pega una URL externa o sube una imagen (si tienes bucket)."
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 990,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                htmlFor: "file-upload",
                                className: "cursor-pointer inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground px-3 py-2 rounded-md transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$cloud$2d$upload$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UploadCloud$3e$__["UploadCloud"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 995,
                                        columnNumber: 25
                                    }, this),
                                    uploading ? "Subiendo..." : "Subir desde PC (puedes seleccionar varias)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 994,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                id: "file-upload",
                                type: "file",
                                accept: "image/*",
                                multiple: true,
                                className: "hidden",
                                onChange: handleImageUpload,
                                disabled: uploading
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 998,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 993,
                        columnNumber: 17
                    }, this),
                    imageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 h-32 w-32 rounded-lg border overflow-hidden relative bg-popover",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: imageUrl,
                            alt: "Preview",
                            className: "h-full w-full object-cover"
                        }, void 0, false, {
                            fileName: "[project]/components/admin/product-form.tsx",
                            lineNumber: 1012,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 1011,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin/product-form.tsx",
                lineNumber: 980,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$label$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Label"], {
                                children: "Galería (hasta 10)"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 1019,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-muted-foreground",
                                children: [
                                    galleryImages.length,
                                    "/10"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 1020,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 1018,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                value: newGalleryUrl,
                                onChange: (e)=>setNewGalleryUrl(e.target.value),
                                placeholder: "Pega otra URL de imagen...",
                                className: "flex-1"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 1024,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                type: "button",
                                onClick: ()=>{
                                    if (!newGalleryUrl.trim()) return;
                                    if (galleryImages.length >= 10) return;
                                    addGalleryUrl(newGalleryUrl);
                                    setNewGalleryUrl("");
                                },
                                disabled: !newGalleryUrl.trim() || galleryImages.length >= 10,
                                children: "Agregar"
                            }, void 0, false, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 1030,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 1023,
                        columnNumber: 17
                    }, this),
                    galleryImages.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: galleryImages.map((url, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3 rounded-lg border bg-popover p-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-7 w-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold",
                                        children: idx + 1
                                    }, void 0, false, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 1048,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "h-12 w-12 rounded-md overflow-hidden border bg-background flex-shrink-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: url,
                                            alt: "Imagen",
                                            className: "h-full w-full object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/components/admin/product-form.tsx",
                                            lineNumber: 1053,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 1052,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0 flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-muted-foreground truncate",
                                                children: url
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 1057,
                                                columnNumber: 37
                                            }, this),
                                            idx === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-medium",
                                                children: "Principal"
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 1059,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 1056,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-8 w-8",
                                                onClick: ()=>makeGalleryMain(url),
                                                disabled: idx === 0,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                    lineNumber: 1072,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 1064,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-8 w-8",
                                                onClick: ()=>moveGalleryIndex(idx, idx - 1),
                                                disabled: idx === 0,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUp$3e$__["ArrowUp"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                    lineNumber: 1083,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 1075,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-8 w-8",
                                                onClick: ()=>moveGalleryIndex(idx, idx + 1),
                                                disabled: idx === galleryImages.length - 1,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowDown$3e$__["ArrowDown"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                    lineNumber: 1094,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 1086,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                type: "button",
                                                variant: "ghost",
                                                size: "icon",
                                                className: "h-8 w-8",
                                                onClick: ()=>removeGalleryUrl(url),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/admin/product-form.tsx",
                                                    lineNumber: 1104,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/admin/product-form.tsx",
                                                lineNumber: 1097,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/admin/product-form.tsx",
                                        lineNumber: 1063,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, `${url}-${idx}`, true, {
                                fileName: "[project]/components/admin/product-form.tsx",
                                lineNumber: 1047,
                                columnNumber: 29
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 1045,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin/product-form.tsx",
                lineNumber: 1017,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "pt-4 flex gap-3 justify-end",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        type: "button",
                        variant: "outline",
                        onClick: onCancel,
                        children: "Cancelar"
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 1114,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        type: "submit",
                        className: "bg-primary text-primary-foreground hover:bg-primary/90",
                        disabled: loading || uploading,
                        children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Loader2$3e$__["Loader2"], {
                                    className: "mr-2 h-4 w-4 animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/components/admin/product-form.tsx",
                                    lineNumber: 1120,
                                    columnNumber: 29
                                }, this),
                                " Guardando..."
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                    className: "mr-2 h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/admin/product-form.tsx",
                                    lineNumber: 1124,
                                    columnNumber: 29
                                }, this),
                                " Guardar Producto"
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/components/admin/product-form.tsx",
                        lineNumber: 1117,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/admin/product-form.tsx",
                lineNumber: 1113,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/admin/product-form.tsx",
        lineNumber: 495,
        columnNumber: 9
    }, this);
}
_s(ProductForm, "6AmgpIftPWpMT86X51jjanSuYSM=");
_c = ProductForm;
var _c;
__turbopack_context__.k.register(_c, "ProductForm");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/productos/[id]/editar/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>EditarProductoPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$product$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/admin/product-form.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$role$2d$guard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-role-guard.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$access$2d$denied$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/admin/access-denied.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/admin/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$productos$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/productos.client.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
;
function EditarProductoPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const id = params.id;
    const guard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$role$2d$guard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRoleGuard"])({
        allowedRoles: [
            'admin'
        ]
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [producto, setProducto] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EditarProductoPage.useEffect": ()=>{
            if (guard.loading || guard.accessDenied) return;
            loadProducto();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["EditarProductoPage.useEffect"], [
        id,
        guard.loading,
        guard.accessDenied
    ]);
    async function loadProducto() {
        setLoading(true);
        const numericId = Number(id);
        if (!numericId) {
            setProducto(null);
            setLoading(false);
            return;
        }
        try {
            const [prodData, catData] = await Promise.all([
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$productos$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAdminProductoById"])(numericId),
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$productos$2e$client$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchAdminCategorias"])()
            ]);
            setProducto(prodData);
            setCategories(catData || []);
        } catch (err) {
            console.error(err);
            setProducto(null);
            setCategories([]);
        }
        setLoading(false);
    }
    if (guard.accessDenied) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$access$2d$denied$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AccessDenied"], {}, void 0, false, {
        fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
        lineNumber: 57,
        columnNumber: 36
    }, this);
    if (guard.loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 text-muted-foreground",
            children: "Cargando..."
        }, void 0, false, {
            fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
            lineNumber: 60,
            columnNumber: 16
        }, this);
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 text-muted-foreground",
            children: "Cargando..."
        }, void 0, false, {
            fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
            lineNumber: 64,
            columnNumber: 16
        }, this);
    }
    if (!producto) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                    variant: "ghost",
                    className: "gap-2",
                    asChild: true,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/admin/productos",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                                lineNumber: 72,
                                columnNumber: 25
                            }, this),
                            " Volver"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                        lineNumber: 71,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                    lineNumber: 70,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "bg-white rounded-xl shadow-sm border",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-lg font-bold text-gray-900",
                                children: "Producto no encontrado"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                                lineNumber: 77,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-sm text-gray-500",
                                children: "Puede que haya sido eliminado o no exista."
                            }, void 0, false, {
                                fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                                lineNumber: 78,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                        lineNumber: 76,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                    lineNumber: 75,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
            lineNumber: 69,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        className: "gap-2",
                        asChild: true,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/admin/productos",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                                    lineNumber: 90,
                                    columnNumber: 25
                                }, this),
                                " Volver"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                            lineNumber: 89,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                        lineNumber: 88,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold text-gray-900",
                                children: "Editar Producto"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                                lineNumber: 94,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500",
                                children: "Actualiza la información del producto."
                            }, void 0, false, {
                                fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                                lineNumber: 95,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                        lineNumber: 93,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                        fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                        lineNumber: 97,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                lineNumber: 87,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "bg-white rounded-xl shadow-sm border",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "p-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$product$2d$form$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProductForm"], {
                        productToEdit: producto,
                        categories: categories,
                        onSuccess: ()=>router.push('/admin/productos'),
                        onCancel: ()=>router.push('/admin/productos')
                    }, void 0, false, {
                        fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                        lineNumber: 102,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                    lineNumber: 101,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
                lineNumber: 100,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/productos/[id]/editar/page.tsx",
        lineNumber: 86,
        columnNumber: 9
    }, this);
}
_s(EditarProductoPage, "NPoD+qRE5PwnQYq/poETdW85UdQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$role$2d$guard$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRoleGuard"]
    ];
});
_c = EditarProductoPage;
var _c;
__turbopack_context__.k.register(_c, "EditarProductoPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_a6890fe1._.js.map