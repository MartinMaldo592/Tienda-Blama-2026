import { NextRequest, NextResponse } from "next/server"
import { triggerOrderStatusEmail } from "@/features/emails"
import { createClient } from "@/lib/supabase.server"

export async function POST(req: NextRequest) {
    try {
        const { orderId } = await req.json()
        if (!orderId) {
            return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
        }

        // Authenticate request (make sure user is logged in as staff/admin)
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { data: profile } = await supabase
            .from("usuarios")
            .select("role")
            .eq("id", user.id)
            .maybeSingle()

        if (!profile || !profile.role || !["admin", "superadmin", "worker"].includes(profile.role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 })
        }

        const result = await triggerOrderStatusEmail(Number(orderId))

        return NextResponse.json({ success: true, result })
    } catch (error: any) {
        console.error("Error triggering status email:", error)
        return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
    }
}
