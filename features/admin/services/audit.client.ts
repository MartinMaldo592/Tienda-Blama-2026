import { createClient } from "@/lib/supabase.client"

export interface AuditLog {
    id: number;
    table_name: string;
    record_id: string;
    action: 'INSERT' | 'UPDATE' | 'DELETE' | string;
    old_data: any;
    new_data: any;
    changed_by: string;
    changed_at: string;
    usuario?: {
        nombre: string;
        email: string;
    }
}

export async function fetchAuditLogs(): Promise<AuditLog[]> {
    const supabase = createClient()
    const { data, error } = await supabase
        .from("system_audit_logs")
        .select(`
            *,
            usuario:usuarios(nombre, email)
        `)
        .order("changed_at", { ascending: false })
        .limit(100)

    if (error) throw error
    return (data as any[]) || []
}
