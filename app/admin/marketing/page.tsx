"use client"

import { useState } from "react"
import { useRoleGuard } from "@/hooks/use-role-guard"
import { AccessDenied } from "@/features/admin/components/access-denied"
import { AdminPageHeader } from "@/features/admin/components/page-header"
import { AdminPageSkeleton } from "@/features/admin/components/page-skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Save, RefreshCw, AlertCircle, Sparkles } from "lucide-react"
import { getMarketingPixelsAction, updateMarketingPixelAction, MarketingPixel } from "@/features/admin/actions/marketing"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { m } from "framer-motion"

export default function AdminMarketingPage() {
  const guard = useRoleGuard({ allowedRoles: ["superadmin", "admin"] })
  const qc = useQueryClient()

  // Local state for edits
  const [pixelData, setPixelData] = useState<{ [key: number]: { pixel_id: string; enabled: boolean } }>({})

  const { data: pixels = [], isLoading, isFetching } = useQuery({
    queryKey: ["marketingPixels"],
    queryFn: async () => {
      const res = await getMarketingPixelsAction()
      if (res.error) throw new Error(res.error)
      return res.data || []
    },
    enabled: !guard.loading && !guard.accessDenied,
  })

  const updateMut = useMutation({
    mutationFn: async (args: { id: number; pixel_id: string; enabled: boolean }) => {
      const res = await updateMarketingPixelAction(args.id, {
        pixel_id: args.pixel_id,
        enabled: args.enabled,
      })
      if (res.error) throw new Error(res.error)
      return res
    },
    onSuccess: () => {
      toast.success("Configuración de píxel guardada")
      qc.invalidateQueries({ queryKey: ["marketingPixels"] })
    },
    onError: (e: any) => {
      toast.error(e?.message || "Error al actualizar píxel")
    },
  })

  // Initialize or fetch local state for a specific pixel
  const getPixelVal = (pixel: MarketingPixel) => {
    if (pixelData[pixel.id] !== undefined) {
      return pixelData[pixel.id]
    }
    return { pixel_id: pixel.pixel_id || "", enabled: pixel.enabled }
  }

  const handleIdChange = (id: number, val: string) => {
    setPixelData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        pixel_id: val,
        enabled: prev[id]?.enabled ?? pixels.find((p) => p.id === id)?.enabled ?? false,
      },
    }))
  }

  const handleStatusChange = (id: number, enabled: boolean) => {
    setPixelData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        pixel_id: prev[id]?.pixel_id ?? pixels.find((p) => p.id === id)?.pixel_id ?? "",
        enabled,
      },
    }))
  }

  const handleSave = (pixel: MarketingPixel) => {
    const vals = getPixelVal(pixel)
    updateMut.mutate({
      id: pixel.id,
      pixel_id: vals.pixel_id,
      enabled: vals.enabled,
    })
  }

  if (guard.loading || isLoading) return <AdminPageSkeleton hasStats={0} tableColumns={4} tableRows={3} />
  if (guard.accessDenied) return <AccessDenied message="Solo administradores pueden gestionar píxeles de marketing." />

  // Icon / color helpers for beautiful designs
  const getBrandStyle = (clave: string) => {
    switch (clave) {
      case "gtm":
        return { bg: "bg-orange-500/10 text-orange-600 border-orange-200/50", dot: "bg-orange-500" }
      case "facebook":
        return { bg: "bg-blue-600/10 text-blue-600 border-blue-200/50", dot: "bg-blue-600" }
      case "tiktok":
        return { bg: "bg-slate-900/10 text-slate-900 border-slate-200", dot: "bg-slate-900" }
      case "ga4":
        return { bg: "bg-yellow-500/10 text-yellow-600 border-yellow-200/50", dot: "bg-yellow-500" }
      default:
        return { bg: "bg-slate-500/10 text-slate-600 border-slate-200", dot: "bg-slate-500" }
    }
  }

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-[1600px] mx-auto"
    >
      <AdminPageHeader
        icon={<Activity size={28} strokeWidth={1.5} />}
        iconColor="bg-gradient-to-tr from-blue-600 to-indigo-600"
        iconShadow="shadow-blue-500/20"
        title="Píxeles y Marketing"
        totalItems={pixels.length}
        totalLabel="servicios integrados"
        isFetching={isFetching}
        dotColor="bg-blue-500"
        actions={
          <Button
            variant="outline"
            className="gap-2 haptic-scale shadow-sm rounded-xl h-11 px-5 font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => qc.invalidateQueries({ queryKey: ["marketingPixels"] })}
            disabled={isFetching}
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Sincronizar
          </Button>
        }
      />

      {/* Hero Banner with Modern SaaS Ambient Gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-2xl border border-blue-500/20">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <div className="h-12 w-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shrink-0 shadow-inner">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-base sm:text-lg font-black tracking-tight text-white">Gestión Dinámica de Scripts y Píxeles</h4>
            </div>
            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed max-w-4xl font-normal">
              Desde este panel controlas qué píxeles de rastreo y scripts analíticos están activos en tu tienda online. 
              Cualquier cambio se aplicará de inmediato a tus clientes sin requerir reinicios.
              Por seguridad, <strong>ninguno de estos scripts se cargará mientras tú navegues en el panel administrativo (/admin)</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Pixel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pixels.map((pixel) => {
          const vals = getPixelVal(pixel)
          const styles = getBrandStyle(pixel.clave)
          const isPending = updateMut.isPending && updateMut.variables?.id === pixel.id

          return (
            <m.div
              key={pixel.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900 h-full flex flex-col justify-between overflow-hidden group">
                <CardHeader className="space-y-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-lg border ${styles.bg}`}>
                      {pixel.clave}
                    </span>
                    <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                      <input
                        type="checkbox"
                        id={`status-${pixel.id}`}
                        checked={vals.enabled}
                        onChange={(e) => handleStatusChange(pixel.id, e.target.checked)}
                        className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                      />
                      <Label htmlFor={`status-${pixel.id}`} className="text-xs font-black uppercase tracking-wider cursor-pointer select-none">
                        <span className={vals.enabled ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>
                          {vals.enabled ? "Activo" : "Inactivo"}
                        </span>
                      </Label>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{pixel.nombre}</CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {pixel.clave === "gtm" && "Integra contenedores completos de Google Tag Manager."}
                      {pixel.clave === "facebook" && "Rastrea visitas y conversiones de campañas de anuncios en Meta."}
                      {pixel.clave === "tiktok" && "Monitorea campañas publicitarias y atribuciones en TikTok."}
                      {pixel.clave === "ga4" && "Configura las mediciones nativas de eventos en Google Analytics 4."}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 pt-5 flex-1 flex flex-col justify-end">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      ID del Píxel / Contenedor
                    </Label>
                    <Input
                      placeholder={
                        pixel.clave === "gtm" ? "GTM-XXXXXXX" :
                        pixel.clave === "ga4" ? "G-XXXXXXXXXX" : "ID numérico o alfanumérico"
                      }
                      value={vals.pixel_id}
                      onChange={(e) => handleIdChange(pixel.id, e.target.value)}
                      className="rounded-xl h-11 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 font-mono text-sm font-semibold focus-ring-premium"
                    />
                  </div>

                  <div className={`flex items-center gap-2.5 text-[11px] font-semibold rounded-xl p-3 border transition-colors ${
                    vals.enabled
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                      : "bg-slate-50 dark:bg-slate-800/40 text-slate-400 border-slate-200/60 dark:border-slate-800"
                  }`}>
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>
                      {vals.enabled
                        ? `El rastreador procesará eventos con ID: ${vals.pixel_id || "(sin ID)"}`
                        : "Servicio desactivado: no se cargará en la tienda."}
                    </span>
                  </div>

                  <Button
                    onClick={() => handleSave(pixel)}
                    disabled={isPending}
                    className="w-full haptic-scale shadow-lg shadow-blue-600/20 rounded-xl h-11 font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] transition-all"
                  >
                    {isPending ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isPending ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </CardContent>
              </Card>
            </m.div>
          )
        })}
      </div>
    </m.div>
  )
}
