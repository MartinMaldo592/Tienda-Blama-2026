module.exports = [
"[project]/components/ui/table.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Table",
    ()=>Table,
    "TableBody",
    ()=>TableBody,
    "TableCaption",
    ()=>TableCaption,
    "TableCell",
    ()=>TableCell,
    "TableFooter",
    ()=>TableFooter,
    "TableHead",
    ()=>TableHead,
    "TableHeader",
    ()=>TableHeader,
    "TableRow",
    ()=>TableRow
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
"use client";
;
;
function Table({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        "data-slot": "table-container",
        className: "relative w-full overflow-x-auto",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
            "data-slot": "table",
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("w-full caption-bottom text-sm", className),
            ...props
        }, void 0, false, {
            fileName: "[project]/components/ui/table.tsx",
            lineNumber: 13,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
function TableHeader({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
        "data-slot": "table-header",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("[&_tr]:border-b", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 24,
        columnNumber: 5
    }, this);
}
function TableBody({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
        "data-slot": "table-body",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("[&_tr:last-child]:border-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
function TableFooter({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tfoot", {
        "data-slot": "table-footer",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("bg-muted/50 border-t font-medium [&>tr]:last:border-b-0", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
}
function TableRow({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
        "data-slot": "table-row",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
function TableHead({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
        "data-slot": "table-head",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
function TableCell({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
        "data-slot": "table-cell",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
function TableCaption({ className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("caption", {
        "data-slot": "table-caption",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])("text-muted-foreground mt-4 text-sm", className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/table.tsx",
        lineNumber: 99,
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
"[project]/app/admin/productos/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductosPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabaseClient.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/input.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$role$2d$guard$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/use-role-guard.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$access$2d$denied$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/admin/access-denied.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/table.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-ssr] (ecmascript) <export default as Edit>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-ssr] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/features/admin/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$productos$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/productos.client.ts [app-ssr] (ecmascript)");
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
;
;
;
function ProductosPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [productos, setProductos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const guard = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$use$2d$role$2d$guard$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRoleGuard"])({
        allowedRoles: [
            'admin'
        ]
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (guard.loading || guard.accessDenied) return;
        fetchProductos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        guard.loading,
        guard.accessDenied
    ]);
    async function fetchProductos() {
        setLoading(true);
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$productos$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchAdminProductos"])();
            setProductos(data);
        } catch (err) {
            setProductos([]);
        }
        setLoading(false);
    }
    const handleDelete = async (id)=>{
        if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;
        const sessionRes = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabaseClient$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
        const accessToken = sessionRes?.data?.session?.access_token;
        if (!accessToken) {
            alert('Tu sesión expiró. Vuelve a iniciar sesión.');
            return;
        }
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$productos$2e$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["deleteAdminProductoViaApi"])({
                accessToken,
                id
            });
        } catch (err) {
            alert("Error al eliminar: " + String(err?.message || 'No se pudo eliminar'));
            return;
        }
        fetchProductos();
    };
    if (guard.accessDenied) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$admin$2f$access$2d$denied$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AccessDenied"], {}, void 0, false, {
        fileName: "[project]/app/admin/productos/page.tsx",
        lineNumber: 69,
        columnNumber: 36
    }, this);
    if (guard.loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "p-6 text-muted-foreground",
            children: "Cargando..."
        }, void 0, false, {
            fileName: "[project]/app/admin/productos/page.tsx",
            lineNumber: 72,
            columnNumber: 16
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-3xl font-bold text-gray-900",
                                children: "Productos"
                            }, void 0, false, {
                                fileName: "[project]/app/admin/productos/page.tsx",
                                lineNumber: 79,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500",
                                children: "Administra el inventario de tu tienda."
                            }, void 0, false, {
                                fileName: "[project]/app/admin/productos/page.tsx",
                                lineNumber: 80,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/productos/page.tsx",
                        lineNumber: 78,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        asChild: true,
                        className: "bg-black text-white gap-2 hover:bg-gray-800",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                            href: "/admin/productos/nuevo",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/productos/page.tsx",
                                    lineNumber: 85,
                                    columnNumber: 25
                                }, this),
                                " Nuevo Producto"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/admin/productos/page.tsx",
                            lineNumber: 84,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/admin/productos/page.tsx",
                        lineNumber: 83,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/productos/page.tsx",
                lineNumber: 77,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2 bg-white p-4 rounded-xl shadow-sm border",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                            className: "absolute left-3 top-3 h-4 w-4 text-gray-400"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/productos/page.tsx",
                            lineNumber: 92,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$input$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Input"], {
                            placeholder: "Buscar produto...",
                            className: "pl-9 border-gray-200"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/productos/page.tsx",
                            lineNumber: 93,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/productos/page.tsx",
                    lineNumber: 91,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/productos/page.tsx",
                lineNumber: 90,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl shadow-sm border overflow-hidden",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Table"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHeader"], {
                            className: "bg-gray-50",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                        className: "w-[80px]",
                                        children: "Imagen"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/productos/page.tsx",
                                        lineNumber: 101,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Nombre"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/productos/page.tsx",
                                        lineNumber: 102,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Precio"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/productos/page.tsx",
                                        lineNumber: 103,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                        children: "Stock"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/productos/page.tsx",
                                        lineNumber: 104,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableHead"], {
                                        className: "text-right",
                                        children: "Acciones"
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/productos/page.tsx",
                                        lineNumber: 105,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/admin/productos/page.tsx",
                                lineNumber: 100,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/admin/productos/page.tsx",
                            lineNumber: 99,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableBody"], {
                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                    colSpan: 5,
                                    className: "text-center py-10",
                                    children: "Cargando..."
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/productos/page.tsx",
                                    lineNumber: 111,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/admin/productos/page.tsx",
                                lineNumber: 110,
                                columnNumber: 29
                            }, this) : productos.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                    colSpan: 5,
                                    className: "text-center py-10",
                                    children: "No hay productos."
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/productos/page.tsx",
                                    lineNumber: 115,
                                    columnNumber: 33
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/admin/productos/page.tsx",
                                lineNumber: 114,
                                columnNumber: 29
                            }, this) : productos.map((producto)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableRow"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-10 w-10 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center",
                                                children: producto.imagen_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: producto.imagen_url,
                                                    alt: producto.nombre,
                                                    className: "h-full w-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/productos/page.tsx",
                                                    lineNumber: 123,
                                                    columnNumber: 49
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__["Image"], {
                                                    className: "h-4 w-4 text-gray-400"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/productos/page.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 49
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/productos/page.tsx",
                                                lineNumber: 121,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/productos/page.tsx",
                                            lineNumber: 120,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "font-medium",
                                            children: producto.nombre
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/productos/page.tsx",
                                            lineNumber: 129,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-baseline gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold",
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(producto.precio)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/productos/page.tsx",
                                                        lineNumber: 132,
                                                        columnNumber: 45
                                                    }, this),
                                                    producto.precio_antes != null && Number(producto.precio_antes) > Number(producto.precio) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-gray-500 line-through",
                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatCurrency"])(producto.precio_antes)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/productos/page.tsx",
                                                        lineNumber: 134,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/productos/page.tsx",
                                                lineNumber: 131,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/productos/page.tsx",
                                            lineNumber: 130,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `px-2 py-1 rounded-full text-xs font-bold ${producto.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`,
                                                children: [
                                                    producto.stock,
                                                    " un."
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/productos/page.tsx",
                                                lineNumber: 139,
                                                columnNumber: 41
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/productos/page.tsx",
                                            lineNumber: 138,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$table$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TableCell"], {
                                            className: "text-right space-x-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    asChild: true,
                                                    variant: "ghost",
                                                    size: "icon",
                                                    className: "h-8 w-8 hover:bg-gray-100",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: `/admin/productos/${producto.id}/editar`,
                                                        "aria-label": "Editar",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Edit$3e$__["Edit"], {
                                                            className: "h-4 w-4 text-gray-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/productos/page.tsx",
                                                            lineNumber: 146,
                                                            columnNumber: 49
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/productos/page.tsx",
                                                        lineNumber: 145,
                                                        columnNumber: 45
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/productos/page.tsx",
                                                    lineNumber: 144,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                                    variant: "ghost",
                                                    size: "icon",
                                                    className: "h-8 w-8 hover:bg-red-50",
                                                    onClick: ()=>handleDelete(producto.id),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                        className: "h-4 w-4 text-red-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/productos/page.tsx",
                                                        lineNumber: 150,
                                                        columnNumber: 45
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/productos/page.tsx",
                                                    lineNumber: 149,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/admin/productos/page.tsx",
                                            lineNumber: 143,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, producto.id, true, {
                                    fileName: "[project]/app/admin/productos/page.tsx",
                                    lineNumber: 119,
                                    columnNumber: 33
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/admin/productos/page.tsx",
                            lineNumber: 108,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/productos/page.tsx",
                    lineNumber: 98,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/productos/page.tsx",
                lineNumber: 97,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/productos/page.tsx",
        lineNumber: 76,
        columnNumber: 9
    }, this);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Search
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
        "path",
        {
            d: "m21 21-4.34-4.34",
            key: "14j7rj"
        }
    ],
    [
        "circle",
        {
            cx: "11",
            cy: "11",
            r: "8",
            key: "4ej97u"
        }
    ]
];
const Search = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("search", __iconNode);
;
 //# sourceMappingURL=search.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Search",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>SquarePen
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
        "path",
        {
            d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7",
            key: "1m0v6g"
        }
    ],
    [
        "path",
        {
            d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z",
            key: "ohrbg2"
        }
    ]
];
const SquarePen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("square-pen", __iconNode);
;
 //# sourceMappingURL=square-pen.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-ssr] (ecmascript) <export default as Edit>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Edit",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$square$2d$pen$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/square-pen.js [app-ssr] (ecmascript)");
}),
];

//# sourceMappingURL=_da21c9df._.js.map