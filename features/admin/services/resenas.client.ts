import { supabase } from "@/lib/supabaseClient"

export async function fetchAdminReviews() {
  const { data, error } = await supabase
    .from("product_reviews")
    .select("id, product_id, rating, title, body, customer_name, customer_city, verified, approved, created_at, productos(nombre)")
    .order("created_at", { ascending: false })
    .limit(200)

  if (error) throw error
  return (data as any[]) || []
}

export async function setReviewApproved(args: { id: number; approved: boolean }) {
  const { error } = await supabase.from("product_reviews").update({ approved: args.approved }).eq("id", args.id)
  if (error) throw error
}

export async function deleteReview(id: number) {
  const { error } = await supabase.from("product_reviews").delete().eq("id", id)
  if (error) throw error
}
