
import { supabase } from "@/lib/supabaseClient"

export type SocialLink = {
    id: number
    platform: string
    url: string
    active: boolean
    orden: number
    created_at?: string
}

export async function fetchSocialLinks() {
    const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("orden", { ascending: true })

    if (error) {
        throw new Error(error.message)
    }
    return data
}

export async function saveSocialLink({ id, payload }: { id?: number | null; payload: any }) {
    if (id) {
        const { error } = await supabase
            .from("social_links")
            .update(payload)
            .eq("id", id)

        if (error) throw new Error(error.message)
    } else {
        const { error } = await supabase.from("social_links").insert(payload)
        if (error) throw new Error(error.message)
    }
}

export async function deleteSocialLink(id: number) {
    const { error } = await supabase.from("social_links").delete().eq("id", id)
    if (error) throw new Error(error.message)
}
