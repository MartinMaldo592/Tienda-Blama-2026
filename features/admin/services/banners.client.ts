import { supabase } from "@/lib/supabaseClient"

export async function fetchHomeBanners() {
  const { data, error } = await supabase.from("home_banners").select("*").order("orden", { ascending: true }).order("id", { ascending: true })
  if (error) throw error
  return (data as any[]) || []
}

export async function saveHomeBanner(args: { id?: number | null; payload: any }) {
  if (args.id != null) {
    const { error } = await supabase.from("home_banners").update(args.payload).eq("id", args.id)
    if (error) throw error
    return
  }

  const { error } = await supabase.from("home_banners").insert(args.payload)
  if (error) throw error
}

export async function deleteHomeBanner(id: number) {
  const { error } = await supabase.from("home_banners").delete().eq("id", id)
  if (error) throw error
}
