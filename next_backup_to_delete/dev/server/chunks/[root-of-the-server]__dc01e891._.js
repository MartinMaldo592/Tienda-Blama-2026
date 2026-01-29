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
"[project]/features/admin/services/admin.server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ADMIN_RUNTIME",
    ()=>ADMIN_RUNTIME,
    "getSupabaseEnv",
    ()=>getSupabaseEnv,
    "requireAdmin",
    ()=>requireAdmin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
;
const ADMIN_RUNTIME = "nodejs";
function getSupabaseEnv() {
    const url = process.env.SUPABASE_URL || ("TURBOPACK compile-time value", "https://pvgghvcqoxhcozlyagwz.supabase.co");
    const anon = ("TURBOPACK compile-time value", "sb_publishable_fa2tkyQJswbluGvWIwXTtw_YYevu4NL");
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
    return {
        url,
        anon,
        service
    };
}
async function requireAdmin(req) {
    const { url, anon, service } = getSupabaseEnv();
    if (!url || !anon || !service) {
        const missing = [];
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        if (!anon) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
        if (!service) missing.push("SUPABASE_SERVICE_ROLE_KEY");
        return {
            ok: false,
            res: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Server env not configured",
                missing
            }, {
                status: 500
            })
        };
    }
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
    if (!token) {
        return {
            ok: false,
            res: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing Authorization token"
            }, {
                status: 401
            })
        };
    }
    const supabaseAuth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, anon);
    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser(token);
    if (userErr || !userData?.user) {
        return {
            ok: false,
            res: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid session"
            }, {
                status: 401
            })
        };
    }
    const { data: profile, error: profileErr } = await supabaseAuth.from("profiles").select("role").eq("id", userData.user.id).maybeSingle();
    if (profileErr) {
        return {
            ok: false,
            res: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: profileErr.message
            }, {
                status: 500
            })
        };
    }
    if (String(profile?.role || "").toLowerCase() !== "admin") {
        return {
            ok: false,
            res: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Forbidden"
            }, {
                status: 403
            })
        };
    }
    const supabaseAdmin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(url, service);
    return {
        ok: true,
        supabaseAdmin
    };
}
}),
"[project]/app/api/admin/productos/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$admin$2e$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/features/admin/services/admin.server.ts [app-route] (ecmascript)");
;
;
const runtime = "nodejs";
function normalizeText(v) {
    return String(v ?? "").trim();
}
function normalizeNumber(v) {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}
function normalizeImages(input) {
    const arr = Array.isArray(input) ? input : [];
    const unique = [];
    for (const raw of arr){
        const v = String(raw || "").trim();
        if (!v) continue;
        const lower = v.toLowerCase();
        if (lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".mov") || lower.endsWith(".m4v") || lower.endsWith(".avi") || lower.endsWith(".mkv")) {
            continue;
        }
        if (!unique.includes(v)) unique.push(v);
        if (unique.length >= 10) break;
    }
    return unique;
}
function normalizeVideos(input) {
    const arr = Array.isArray(input) ? input : [];
    const unique = [];
    for (const raw of arr){
        const v = String(raw || "").trim();
        if (!v) continue;
        if (!unique.includes(v)) unique.push(v);
        if (unique.length >= 6) break;
    }
    return unique;
}
async function upsertProduct(args) {
    const { supabaseAdmin, id, product } = args;
    const basePayload = {
        nombre: normalizeText(product.nombre),
        precio: Number(product.precio),
        precio_antes: product.precio_antes != null ? Number(product.precio_antes) : null,
        stock: Number(product.stock),
        imagen_url: product.imagen_url ? String(product.imagen_url) : null,
        imagenes: normalizeImages(product.imagenes),
        videos: normalizeVideos(product.videos),
        descripcion: product.descripcion ? normalizeText(product.descripcion) : null,
        materiales: product.materiales ? normalizeText(product.materiales) : null,
        tamano: product.tamano ? normalizeText(product.tamano) : null,
        color: product.color ? normalizeText(product.color) : null,
        cuidados: product.cuidados ? normalizeText(product.cuidados) : null,
        uso: product.uso ? normalizeText(product.uso) : null,
        categoria_id: product.categoria_id != null && !Number.isNaN(Number(product.categoria_id)) ? Number(product.categoria_id) : null,
        calificacion: product.calificacion ? Number(product.calificacion) : 5.0
    };
    const save = async (withGallery)=>{
        const payload = {
            ...basePayload
        };
        if (!withGallery) delete payload.imagenes;
        if (id && Number.isFinite(id) && id > 0) {
            return supabaseAdmin.from("productos").update(payload).eq("id", id).select("id").single();
        }
        return supabaseAdmin.from("productos").insert(payload).select("id").single();
    };
    const first = await save(true);
    let error = first.error;
    if (error && typeof error.message === "string" && String(error.message).toLowerCase().includes("imagenes")) {
        const second = await save(false);
        error = second.error;
        if (error) return {
            ok: false,
            error
        };
        const savedId = id && Number.isFinite(id) && id > 0 ? id : Number(second?.data?.id ?? 0);
        return {
            ok: true,
            id: savedId
        };
    }
    if (error) return {
        ok: false,
        error
    };
    const savedId = id && Number.isFinite(id) && id > 0 ? id : Number(first?.data?.id ?? 0);
    return {
        ok: true,
        id: savedId
    };
}
async function replaceSpecs(supabaseAdmin, productId, specs) {
    const { error: delErr } = await supabaseAdmin.from("producto_especificaciones").delete().eq("producto_id", productId);
    if (delErr) return delErr;
    const clean = specs.map((s)=>({
            clave: normalizeText(s.clave),
            valor: s.valor != null ? normalizeText(s.valor) : null,
            orden: Number.isFinite(Number(s.orden)) ? Number(s.orden) : 0
        })).filter((s)=>s.clave.length > 0);
    if (clean.length === 0) return null;
    const { error: insErr } = await supabaseAdmin.from("producto_especificaciones").insert(clean.map((s)=>({
            producto_id: productId,
            clave: s.clave,
            valor: s.valor,
            orden: s.orden
        })));
    return insErr || null;
}
async function replaceVariants(supabaseAdmin, productId, variants) {
    const { error: delErr } = await supabaseAdmin.from("producto_variantes").delete().eq("producto_id", productId);
    if (delErr) return delErr;
    const clean = variants.map((v)=>({
            etiqueta: normalizeText(v.etiqueta),
            precio: normalizeNumber(v.precio),
            precio_antes: normalizeNumber(v.precio_antes),
            stock: Number.isFinite(Number(v.stock)) ? Number(v.stock) : 0,
            activo: v.activo == null ? true : Boolean(v.activo)
        })).filter((v)=>v.etiqueta.length > 0);
    if (clean.length === 0) return null;
    const { error: insErr } = await supabaseAdmin.from("producto_variantes").insert(clean.map((v)=>({
            producto_id: productId,
            etiqueta: v.etiqueta,
            precio: v.precio,
            precio_antes: v.precio_antes,
            stock: v.stock,
            activo: v.activo
        })));
    return insErr || null;
}
async function POST(req) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$admin$2e$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAdmin"])(req);
    if (!auth.ok) return auth.res;
    try {
        const body = await req.json();
        const product = body?.product;
        const specs = Array.isArray(body?.specs) ? body.specs : [];
        const variants = Array.isArray(body?.variants) ? body.variants : [];
        const saved = await upsertProduct({
            supabaseAdmin: auth.supabaseAdmin,
            product
        });
        if (!saved.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: saved.error?.message || "Failed to save product"
            }, {
                status: 400
            });
        }
        const productId = Number(saved.id);
        const specsErr = await replaceSpecs(auth.supabaseAdmin, productId, specs);
        if (specsErr) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: specsErr?.message || "Failed to save specs"
            }, {
                status: 400
            });
        }
        const variantsErr = await replaceVariants(auth.supabaseAdmin, productId, variants);
        if (variantsErr) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: variantsErr?.message || "Failed to save variants"
            }, {
                status: 400
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            id: productId
        });
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e?.message || "Unknown error"
        }, {
            status: 500
        });
    }
}
async function PUT(req) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$admin$2e$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAdmin"])(req);
    if (!auth.ok) return auth.res;
    try {
        const body = await req.json();
        console.log("[API PUT Product] Body received:", JSON.stringify(body, null, 2)); // Debug log
        const id = Number(body?.id ?? 0);
        if (!Number.isFinite(id) || id <= 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid product id"
            }, {
                status: 400
            });
        }
        const product = body?.product;
        console.log("[API PUT Product] categoria_id payload:", product.categoria_id); // Debug log
        const specs = Array.isArray(body?.specs) ? body.specs : [];
        const variants = Array.isArray(body?.variants) ? body.variants : [];
        const saved = await upsertProduct({
            supabaseAdmin: auth.supabaseAdmin,
            id,
            product
        });
        if (!saved.ok) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: saved.error?.message || "Failed to update product"
            }, {
                status: 400
            });
        }
        const productId = Number(saved.id);
        const specsErr = await replaceSpecs(auth.supabaseAdmin, productId, specs);
        if (specsErr) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: specsErr?.message || "Failed to save specs"
            }, {
                status: 400
            });
        }
        const variantsErr = await replaceVariants(auth.supabaseAdmin, productId, variants);
        if (variantsErr) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: variantsErr?.message || "Failed to save variants"
            }, {
                status: 400
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            id: productId
        });
    } catch (e) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: e?.message || "Unknown error"
        }, {
            status: 500
        });
    }
}
async function DELETE(req) {
    const auth = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$features$2f$admin$2f$services$2f$admin$2e$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["requireAdmin"])(req);
    if (!auth.ok) return auth.res;
    try {
        const body = await req.json().catch(()=>({}));
        const id = Number(body?.id ?? 0);
        if (!Number.isFinite(id) || id <= 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid product id"
            }, {
                status: 400
            });
        }
        const { error } = await auth.supabaseAdmin.from("productos").delete().eq("id", id);
        if (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: error.message
            }, {
                status: 400
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true
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

//# sourceMappingURL=%5Broot-of-the-server%5D__dc01e891._.js.map