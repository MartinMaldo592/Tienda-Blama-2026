import { createClient } from "@/lib/supabase.client"

export async function fetchAdminReviews() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("product_reviews")
    .select("id, product_id, rating, title, body, customer_name, customer_city, verified, approved, created_at, productos(nombre)")
    .order("created_at", { ascending: false })
    .limit(200)

  if (error) throw error
  return (data as any[]) || []
}

export async function setReviewApproved(args: { id: number; approved: boolean }) {
  const supabase = createClient()
  const { error } = await supabase.from("product_reviews").update({ approved: args.approved }).eq("id", args.id)
  if (error) throw error
}

export async function deleteReview(id: number) {
  const supabase = createClient()
  const { error } = await supabase.from("product_reviews").delete().eq("id", id)
  if (error) throw error
}

export async function fetchAdminReviewsPaginated(args: { page: number; limit: number; search?: string }): Promise<{ reviews: any[]; totalCount: number }> {
  const supabase = createClient()
  const from = (args.page - 1) * args.limit
  const to = from + args.limit - 1

  let query = supabase
    .from("product_reviews")
    .select("id, product_id, rating, title, body, customer_name, customer_city, verified, approved, created_at, productos(nombre)", { count: "exact" })

  if (args.search && args.search.trim()) {
    const s = `%${args.search.trim()}%`
    query = query.or(`customer_name.ilike.${s},customer_city.ilike.${s},title.ilike.${s},body.ilike.${s}`)
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to)

  if (error) throw error
  return {
    reviews: (data as any[]) || [],
    totalCount: count || 0
  }
}
