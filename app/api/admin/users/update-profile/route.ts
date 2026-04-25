/**
 * @deprecated This route is deprecated in favor of Server Actions.
 * Use updateUserProfile Server Action from "@/features/admin/actions/users" instead.
 */
import { NextResponse } from "next/server"

export async function PUT() {
    return NextResponse.json(
        { error: "Ruta obsoleta. Use Server Actions." },
        { status: 410 }
    )
}
