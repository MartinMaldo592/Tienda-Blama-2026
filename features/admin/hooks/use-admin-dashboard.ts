"use client"

import { useQuery } from "@tanstack/react-query"
import { createClient } from "@/lib/supabase.client"
import { fetchAdminDashboardStats, fetchAdminSalesChart } from "@/features/admin/services/dashboard.client"
import type { AdminDashboardStats } from "@/features/admin/types"
import type { SalesDataPoint } from "@/components/admin/dashboard/sales-chart"

// Hook para las estadísticas generales
export function useDashboardStats(role: string, currentUserId: string) {
    return useQuery<AdminDashboardStats>({
        queryKey: ["admin-dashboard-stats", role, currentUserId],
        queryFn: async () => fetchAdminDashboardStats({ role, currentUserId }),
        enabled: !!role, // Solo ejecuta si hay rol
        staleTime: 1000 * 60 * 5, // 5 minutos de cache fresco
    })
}

// Hook para el gráfico de ventas
export function useSalesChart(period: "week" | "month" | "year") {
    return useQuery<SalesDataPoint[]>({
        queryKey: ["admin-sales-chart", period],
        queryFn: async () => fetchAdminSalesChart(period),
        staleTime: 1000 * 60 * 60, // 1 hora de cache (las ventas no cambian tan rápido)
        placeholderData: (previousData) => previousData, // Mantiene los datos viejos mientras carga los nuevos (UX fluida)
    })
}
