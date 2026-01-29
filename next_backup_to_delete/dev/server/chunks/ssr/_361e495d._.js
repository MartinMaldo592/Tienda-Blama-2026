module.exports = [
"[project]/components/ui/card.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
;
;
function Card({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 7,
        columnNumber: 5
    }, this);
}
function CardHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, this);
}
function CardTitle({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-title",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("leading-none font-semibold", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 33,
        columnNumber: 5
    }, this);
}
function CardDescription({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-description",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
function CardAction({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-action",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, this);
}
function CardContent({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-content",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("px-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
function CardFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "card-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("flex items-center px-6 [.border-t]:pt-6", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/card.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
;
}),
"[project]/features/admin/types.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
;
}),
"[project]/features/admin/services/dashboard.client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
async function fetchAdminDashboardStats(args) {
    const role = String(args.role || "worker");
    const currentUserId = String(args.currentUserId || "");
    const { data: pedidos } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select("id, total, status, asignado_a, created_at");
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
        const { count } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("clientes").select("*", {
            count: "exact",
            head: true
        });
        totalClientes = count || 0;
    }
    let productosLowStock = 0;
    if (role === "admin") {
        const { count } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("productos").select("*", {
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
    let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select("id, total, status, created_at, clientes (nombre, telefono, dni)").eq("status", "Entregado").order("created_at", {
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
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("productos").select("id, nombre, precio, stock, imagen_url").lt("stock", th).order("stock", {
        ascending: true
    });
    if (error) throw error;
    return data || [];
}
async function fetchAdminPedidosPendientes() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select("id, total, status, created_at, clientes (nombre, telefono, dni)").eq("status", "Pendiente").order("created_at", {
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
    let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select("id, total, status, created_at, asignado_a, clientes (nombre, telefono, dni)").in("status", PROCESS_STATUSES).order("created_at", {
        ascending: false
    });
    if (args.status !== "all") query = query.eq("status", args.status);
    if (fromIso) query = query.gte("created_at", fromIso);
    if (toIso) query = query.lte("created_at", toIso);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
}
}),
"[project]/features/admin/services/pedidos.client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
async function fetchAdminWorkers() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("profiles").select("id, email, nombre, role").eq("role", "worker");
    if (error) throw error;
    return data || [];
}
async function fetchPedidosForRole(args) {
    const role = String(args.role || "worker");
    const currentUserId = String(args.currentUserId || "");
    let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select(`
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
            const { data: fallbackData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select(`*, clientes (nombre, telefono, dni)`).order("created_at", {
                ascending: false
            });
            return fallbackData || [];
        }
        throw error;
    }
    const rows = data || [];
    const withWorkers = await Promise.all(rows.map(async (pedido)=>{
        if (pedido.asignado_a) {
            const { data: workerProfile } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("profiles").select("id, email, nombre").eq("id", pedido.asignado_a).single();
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
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").update({
        asignado_a: assignValue,
        fecha_asignacion: assignValue ? new Date().toISOString() : null
    }).eq("id", args.pedidoId);
    if (error) throw error;
}
async function fetchPedidoDetail(pedidoId) {
    const { data: pedidoData, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select(`
        *,
        clientes (*)
      `).eq("id", pedidoId).single();
    if (error) throw error;
    let asignadoPerfil = null;
    if (pedidoData?.asignado_a) {
        const { data: workerProfile } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("profiles").select("id, email, nombre").eq("id", pedidoData.asignado_a).single();
        asignadoPerfil = workerProfile;
    }
    const pedido = {
        ...pedidoData,
        asignado_perfil: asignadoPerfil
    };
    const { data: itemsData, error: itemsErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("pedido_items").select(`
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
        const { data: itemsData, error: itemsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("pedido_items").select("producto_id, producto_variante_id, cantidad").eq("pedido_id", pedidoId);
        if (itemsError) throw itemsError;
        const safeItems = (itemsData || []).filter((it)=>it.producto_id);
        for (const it of safeItems){
            const productoId = Number(it.producto_id);
            const varianteId = it.producto_variante_id != null ? Number(it.producto_variante_id) : null;
            const qty = Number(it.cantidad || 0);
            if (!productoId || qty <= 0) continue;
            if (varianteId) {
                const { data: variante, error: varError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("producto_variantes").select("stock").eq("id", varianteId).single();
                if (varError) throw varError;
                const currentStock = Number(variante?.stock ?? 0);
                const newStock = Math.max(0, currentStock - qty);
                const { error: updError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("producto_variantes").update({
                    stock: newStock
                }).eq("id", varianteId);
                if (updError) throw updError;
            } else {
                const { data: producto, error: prodError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("productos").select("stock").eq("id", productoId).single();
                if (prodError) throw prodError;
                const currentStock = Number(producto?.stock ?? 0);
                const newStock = Math.max(0, currentStock - qty);
                const { error: updError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("productos").update({
                    stock: newStock
                }).eq("id", productoId);
                if (updError) throw updError;
            }
        }
        const { error: markError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").update({
            stock_descontado: true
        }).eq("id", pedidoId);
        if (markError) throw markError;
    }
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").update({
        status: nextStatus
    }).eq("id", pedidoId);
    if (error) throw error;
}
}),
"[project]/features/admin/services/productos.client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
async function fetchAdminProductos() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("productos").select("*").order("id", {
        ascending: true
    });
    if (error) throw error;
    return data || [];
}
async function fetchAdminProductoById(id) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("productos").select("*").eq("id", id).single();
    if (error) throw error;
    return data;
}
async function fetchAdminCategorias() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("categorias").select("*");
    if (error) throw error;
    return data || [];
}
async function createAdminCategoria(args) {
    const nombre = String(args.nombre || "").trim();
    const slug = nombre.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("categorias").insert({
        nombre,
        slug
    }).select().single();
    if (error) throw error;
    return data;
}
async function fetchProductoSpecsAndVariants(productId) {
    const [specRes, varRes] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("producto_especificaciones").select("*").eq("producto_id", productId).order("orden", {
            ascending: true
        }).order("id", {
            ascending: true
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("producto_variantes").select("*").eq("producto_id", productId).order("id", {
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
        const { error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from("productos").upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from("productos").getPublicUrl(filePath);
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
        const { error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from("productos").upload(filePath, file, {
            upsert: false,
            contentType: file.type || "video/mp4"
        });
        if (uploadError) throw uploadError;
        const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from("productos").getPublicUrl(filePath);
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
}),
"[project]/features/admin/services/usuarios.client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createWorkerViaApi",
    ()=>createWorkerViaApi,
    "fetchAdminProfiles",
    ()=>fetchAdminProfiles
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
async function fetchAdminProfiles() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("profiles").select("id, email, nombre, role, created_at").order("created_at", {
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
}),
"[project]/features/admin/services/cupones.client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
async function fetchAdminCupones() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("cupones").select("*").order("created_at", {
        ascending: false
    });
    if (error) throw error;
    return data || [];
}
async function createAdminCupon(payload) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("cupones").insert(payload);
    if (error) throw error;
}
async function updateAdminCupon(id, payload) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("cupones").update(payload).eq("id", id);
    if (error) throw error;
}
async function deleteAdminCupon(id) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("cupones").delete().eq("id", id);
    if (error) throw error;
}
}),
"[project]/features/admin/services/banners.client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteHomeBanner",
    ()=>deleteHomeBanner,
    "fetchHomeBanners",
    ()=>fetchHomeBanners,
    "saveHomeBanner",
    ()=>saveHomeBanner
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
async function fetchHomeBanners() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("home_banners").select("*").order("orden", {
        ascending: true
    }).order("id", {
        ascending: true
    });
    if (error) throw error;
    return data || [];
}
async function saveHomeBanner(args) {
    if (args.id != null) {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("home_banners").update(args.payload).eq("id", args.id);
        if (error) throw error;
        return;
    }
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("home_banners").insert(args.payload);
    if (error) throw error;
}
async function deleteHomeBanner(id) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("home_banners").delete().eq("id", id);
    if (error) throw error;
}
}),
"[project]/features/admin/services/announcement-bar.client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAnnouncementBarConfigViaApi",
    ()=>fetchAnnouncementBarConfigViaApi,
    "saveAnnouncementBarConfigViaApi",
    ()=>saveAnnouncementBarConfigViaApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
async function getAccessToken() {
    const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
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
}),
"[project]/features/admin/services/incidencias.client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
async function fetchPedidosForIncidencias() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("pedidos").select("id, status, created_at, clientes (nombre, telefono)").order("created_at", {
        ascending: false
    }).limit(200);
    if (error) throw error;
    return data || [];
}
async function fetchIncidencias() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("incidencias").select("*, pedidos (id, status, created_at, clientes (nombre, telefono))").order("created_at", {
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
        const { error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from("productos").upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from("productos").getPublicUrl(filePath);
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("incidencias").insert(p);
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
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("incidencias").delete().eq("id", id);
    if (error) throw error;
}
}),
"[project]/features/admin/services/preguntas.client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAdminQuestions",
    ()=>fetchAdminQuestions,
    "saveQuestionAnswer",
    ()=>saveQuestionAnswer,
    "setQuestionPublished",
    ()=>setQuestionPublished
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
async function fetchAdminQuestions() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("product_questions").select("id, product_id, question, asker_name, asker_phone, published, created_at, productos(nombre), product_answers(id, answer, answered_by, created_at, published)").order("created_at", {
        ascending: false
    }).limit(200);
    if (error) throw error;
    return data || [];
}
async function setQuestionPublished(args) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("product_questions").update({
        published: args.published
    }).eq("id", args.id);
    if (error) throw error;
}
async function saveQuestionAnswer(args) {
    const answer = String(args.answer || "").trim();
    const { data: sessionRes } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
    const userId = sessionRes?.session?.user?.id || null;
    let answeredBy = null;
    if (userId) {
        const { data: profile } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("profiles").select("email, nombre").eq("id", userId).maybeSingle();
        answeredBy = String(profile?.nombre || profile?.email || "Admin");
    }
    const { data: current } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("product_questions").select("id, product_answers(id)").eq("id", args.questionId).maybeSingle();
    const existingId = current && Array.isArray(current.product_answers) && current.product_answers.length > 0 ? Number(current.product_answers[0]?.id) : null;
    if (existingId) {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("product_answers").update({
            answer,
            answered_by: answeredBy,
            published: true
        }).eq("id", existingId);
        if (error) throw error;
    } else {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("product_answers").insert({
            question_id: args.questionId,
            answer,
            answered_by: answeredBy,
            published: true
        });
        if (error) throw error;
    }
    const { error: pubErr } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("product_questions").update({
        published: true
    }).eq("id", args.questionId);
    if (pubErr) throw pubErr;
}
}),
"[project]/features/admin/services/resenas.client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteReview",
    ()=>deleteReview,
    "fetchAdminReviews",
    ()=>fetchAdminReviews,
    "setReviewApproved",
    ()=>setReviewApproved
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
async function fetchAdminReviews() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("product_reviews").select("id, product_id, rating, title, body, customer_name, customer_city, verified, approved, created_at, productos(nombre)").order("created_at", {
        ascending: false
    }).limit(200);
    if (error) throw error;
    return data || [];
}
async function setReviewApproved(args) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("product_reviews").update({
        approved: args.approved
    }).eq("id", args.id);
    if (error) throw error;
}
async function deleteReview(id) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("product_reviews").delete().eq("id", id);
    if (error) throw error;
}
}),
"[project]/features/admin/services/clientes.client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchAdminClientes",
    ()=>fetchAdminClientes
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
;
async function fetchAdminClientes() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from("clientes").select("*").order("id", {
        ascending: false
    });
    if (error) throw error;
    return data || [];
}
}),
"[project]/features/admin/index.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/types.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$dashboard$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/dashboard.client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$pedidos$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/pedidos.client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$productos$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/productos.client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$usuarios$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/usuarios.client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$cupones$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/cupones.client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$banners$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/banners.client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$announcement$2d$bar$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/announcement-bar.client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$incidencias$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/incidencias.client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$preguntas$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/preguntas.client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$resenas$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/resenas.client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$clientes$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/clientes.client.ts [app-ssr] (ecmascript)");
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
}),
"[project]/app/admin/dashboard/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$role$2d$guard$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-role-guard.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$access$2d$denied$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/admin/access-denied.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-ssr] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-ssr] (ecmascript) <export default as ClipboardList>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/admin/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$dashboard$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/dashboard.client.ts [app-ssr] (ecmascript)");
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
function AdminDashboard() {
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        totalVentasReales: 0,
        ventasHoy: 0,
        pedidosPendientes: 0,
        pedidosEnProceso: 0,
        pedidosEntregados: 0,
        pedidosAsignados: 0,
        totalClientes: 0,
        productosLowStock: 0
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const guard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$role$2d$guard$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRoleGuard"])({
        allowedRoles: [
            "admin",
            "worker"
        ]
    });
    const [userRole, setUserRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('worker');
    const fetchStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (role, currentUserId)=>{
        setLoading(true);
        const next = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$dashboard$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAdminDashboardStats"])({
            role,
            currentUserId
        });
        setStats(next);
        setLoading(false);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (guard.loading || guard.accessDenied) return;
        const role = guard.role || 'worker';
        setUserRole(role);
        (async ()=>{
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            const uid = session?.user?.id || '';
            await fetchStats(role, uid);
        })();
    }, [
        guard.loading,
        guard.accessDenied,
        guard.role,
        fetchStats
    ]);
    if (guard.loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-10",
            children: "Cargando..."
        }, void 0, false, {
            fileName: "[project]/app/admin/dashboard/page.tsx",
            lineNumber: 52,
            columnNumber: 16
        }, this);
    }
    if (guard.accessDenied) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$access$2d$denied$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccessDenied"], {}, void 0, false, {
            fileName: "[project]/app/admin/dashboard/page.tsx",
            lineNumber: 56,
            columnNumber: 16
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold text-gray-900",
                        children: userRole === 'admin' ? 'Dashboard General' : 'Mi Panel'
                    }, void 0, false, {
                        fileName: "[project]/app/admin/dashboard/page.tsx",
                        lineNumber: 62,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 mt-1",
                        children: userRole === 'admin' ? 'Resumen general de tu tienda' : 'Resumen de tus pedidos asignados'
                    }, void 0, false, {
                        fileName: "[project]/app/admin/dashboard/page.tsx",
                        lineNumber: 65,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/dashboard/page.tsx",
                lineNumber: 61,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
                children: userRole === 'admin' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatsCard, {
                            title: "Ventas (Entregado)",
                            value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(stats.totalVentasReales),
                            change: `Hoy: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(stats.ventasHoy)}`,
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                className: "h-6 w-6 text-green-600"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/dashboard/page.tsx",
                                lineNumber: 80,
                                columnNumber: 35
                            }, void 0),
                            wrapperClass: "bg-green-50 border-green-100",
                            loading: loading,
                            href: "/admin/dashboard/ventas"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/dashboard/page.tsx",
                            lineNumber: 76,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatsCard, {
                            title: "Pedidos Pendientes",
                            value: stats.pedidosPendientes.toString(),
                            change: "Por atender",
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                className: "h-6 w-6 text-orange-600"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/dashboard/page.tsx",
                                lineNumber: 89,
                                columnNumber: 35
                            }, void 0),
                            wrapperClass: "bg-orange-50 border-orange-100",
                            loading: loading,
                            href: "/admin/dashboard/pedidos-pendientes"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/dashboard/page.tsx",
                            lineNumber: 85,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatsCard, {
                            title: "En Proceso",
                            value: stats.pedidosEnProceso.toString(),
                            change: "Confirmado / Preparando / Enviado",
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                                className: "h-6 w-6 text-blue-600"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/dashboard/page.tsx",
                                lineNumber: 98,
                                columnNumber: 35
                            }, void 0),
                            wrapperClass: "bg-blue-50 border-blue-100",
                            loading: loading,
                            href: "/admin/dashboard/pedidos-en-proceso"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/dashboard/page.tsx",
                            lineNumber: 94,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatsCard, {
                            title: "Stock Bajo",
                            value: stats.productosLowStock.toString(),
                            change: "Productos < 5 un.",
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                className: "h-6 w-6 text-red-600"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/dashboard/page.tsx",
                                lineNumber: 107,
                                columnNumber: 35
                            }, void 0),
                            wrapperClass: "bg-red-50 border-red-100",
                            loading: loading,
                            href: "/admin/dashboard/stock-bajo"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/dashboard/page.tsx",
                            lineNumber: 103,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatsCard, {
                        title: "Pedidos Asignados",
                        value: stats.pedidosAsignados.toString(),
                        change: "Pendientes de gestionar",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardList$3e$__["ClipboardList"], {
                            className: "h-6 w-6 text-blue-600"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/dashboard/page.tsx",
                            lineNumber: 119,
                            columnNumber: 35
                        }, void 0),
                        wrapperClass: "bg-blue-50 border-blue-100",
                        loading: loading,
                        href: "/admin/pedidos"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/dashboard/page.tsx",
                        lineNumber: 115,
                        columnNumber: 25
                    }, this)
                }, void 0, false)
            }, void 0, false, {
                fileName: "[project]/app/admin/dashboard/page.tsx",
                lineNumber: 73,
                columnNumber: 13
            }, this),
            userRole === 'admin' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatsCard, {
                        title: "Clientes Totales",
                        value: stats.totalClientes.toString(),
                        change: "Base de datos",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                            className: "h-6 w-6 text-blue-600"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/dashboard/page.tsx",
                            lineNumber: 134,
                            columnNumber: 31
                        }, void 0),
                        wrapperClass: "bg-blue-50 border-blue-100",
                        loading: loading,
                        href: "/admin/clientes"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/dashboard/page.tsx",
                        lineNumber: 130,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatsCard, {
                        title: "Pedidos Entregados",
                        value: stats.pedidosEntregados.toString(),
                        change: "Ventas completadas",
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                            className: "h-6 w-6 text-green-600"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/dashboard/page.tsx",
                            lineNumber: 143,
                            columnNumber: 31
                        }, void 0),
                        wrapperClass: "bg-green-50 border-green-100",
                        loading: loading,
                        href: "/admin/dashboard/ventas"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/dashboard/page.tsx",
                        lineNumber: 139,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/dashboard/page.tsx",
                lineNumber: 129,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-2 gap-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    className: "shadow-sm border-gray-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardTitle"], {
                                children: "Accesos Rápidos"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/dashboard/page.tsx",
                                lineNumber: 155,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/admin/dashboard/page.tsx",
                            lineNumber: 154,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "grid grid-cols-2 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/admin/pedidos",
                                    className: "p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border flex flex-col items-center justify-center text-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"], {
                                            className: "h-8 w-8 text-gray-600"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/dashboard/page.tsx",
                                            lineNumber: 159,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium",
                                            children: userRole === 'admin' ? 'Gestionar Pedidos' : 'Mis Pedidos'
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/dashboard/page.tsx",
                                            lineNumber: 160,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/dashboard/page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 25
                                }, this),
                                userRole === 'admin' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/admin/productos",
                                    className: "p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border flex flex-col items-center justify-center text-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"], {
                                            className: "h-8 w-8 text-gray-600"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/dashboard/page.tsx",
                                            lineNumber: 168,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "font-medium",
                                            children: "Inventario"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/dashboard/page.tsx",
                                            lineNumber: 169,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/dashboard/page.tsx",
                                    lineNumber: 167,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/dashboard/page.tsx",
                            lineNumber: 157,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/dashboard/page.tsx",
                    lineNumber: 153,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/dashboard/page.tsx",
                lineNumber: 152,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/dashboard/page.tsx",
        lineNumber: 60,
        columnNumber: 9
    }, this);
}
function StatsCard({ title, value, change, icon, wrapperClass, loading, href }) {
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
        className: `border shadow-sm transition-all hover:shadow-md ${wrapperClass}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
            className: "p-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-between items-start mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-2 bg-white rounded-lg shadow-sm border",
                        children: icon
                    }, void 0, false, {
                        fileName: "[project]/app/admin/dashboard/page.tsx",
                        lineNumber: 184,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/admin/dashboard/page.tsx",
                    lineNumber: 183,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-medium text-gray-500 mb-1",
                            children: title
                        }, void 0, false, {
                            fileName: "[project]/app/admin/dashboard/page.tsx",
                            lineNumber: 189,
                            columnNumber: 21
                        }, this),
                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-8 w-24 bg-gray-200 animate-pulse rounded"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/dashboard/page.tsx",
                            lineNumber: 191,
                            columnNumber: 25
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-2xl font-bold text-gray-900",
                            children: value
                        }, void 0, false, {
                            fileName: "[project]/app/admin/dashboard/page.tsx",
                            lineNumber: 193,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-gray-400 mt-1",
                            children: change
                        }, void 0, false, {
                            fileName: "[project]/app/admin/dashboard/page.tsx",
                            lineNumber: 195,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/dashboard/page.tsx",
                    lineNumber: 188,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/admin/dashboard/page.tsx",
            lineNumber: 182,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/admin/dashboard/page.tsx",
        lineNumber: 181,
        columnNumber: 9
    }, this);
    if (typeof href === 'string') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            href: href,
            className: "block",
            children: content
        }, void 0, false, {
            fileName: "[project]/app/admin/dashboard/page.tsx",
            lineNumber: 203,
            columnNumber: 13
        }, this);
    }
    return content;
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>DollarSign
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "line",
        {
            x1: "12",
            x2: "12",
            y1: "2",
            y2: "22",
            key: "7eqyqh"
        }
    ],
    [
        "path",
        {
            d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
            key: "1b0p4s"
        }
    ]
];
const DollarSign = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("dollar-sign", __iconNode);
;
 //# sourceMappingURL=dollar-sign.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript) <export default as DollarSign>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DollarSign",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>ClipboardList
]);
/**
 * @license lucide-react v0.562.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-ssr] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "8",
            height: "4",
            x: "8",
            y: "2",
            rx: "1",
            ry: "1",
            key: "tgr4d6"
        }
    ],
    [
        "path",
        {
            d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
            key: "116196"
        }
    ],
    [
        "path",
        {
            d: "M12 11h4",
            key: "1jrz19"
        }
    ],
    [
        "path",
        {
            d: "M12 16h4",
            key: "n85exb"
        }
    ],
    [
        "path",
        {
            d: "M8 11h.01",
            key: "1dfujw"
        }
    ],
    [
        "path",
        {
            d: "M8 16h.01",
            key: "18s6g9"
        }
    ]
];
const ClipboardList = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("clipboard-list", __iconNode);
;
 //# sourceMappingURL=clipboard-list.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-ssr] (ecmascript) <export default as ClipboardList>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClipboardList",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$list$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-list.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=_361e495d._.js.map