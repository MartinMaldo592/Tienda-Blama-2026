import { supabase } from "@/lib/supabaseClient"

export async function fetchAdminQuestions() {
  const { data, error } = await supabase
    .from("product_questions")
    .select(
      "id, product_id, question, asker_name, asker_phone, published, created_at, productos(nombre), product_answers(id, answer, answered_by, created_at, published)"
    )
    .order("created_at", { ascending: false })
    .limit(200)

  if (error) throw error
  return (data as any[]) || []
}

export async function setQuestionPublished(args: { id: number; published: boolean }) {
  const { error } = await supabase.from("product_questions").update({ published: args.published }).eq("id", args.id)
  if (error) throw error
}

export async function saveQuestionAnswer(args: { questionId: number; answer: string }) {
  const answer = String(args.answer || "").trim()

  const { data: sessionRes } = await supabase.auth.getSession()
  const userId = (sessionRes as any)?.session?.user?.id || null

  let answeredBy: string | null = null
  if (userId) {
    const { data: profile } = await supabase.from("profiles").select("email, nombre").eq("id", userId).maybeSingle()
    answeredBy = String((profile as any)?.nombre || (profile as any)?.email || "Admin")
  }

  const { data: current } = await supabase
    .from("product_questions")
    .select("id, product_answers(id)")
    .eq("id", args.questionId)
    .maybeSingle()

  const existingId =
    current && Array.isArray((current as any).product_answers) && (current as any).product_answers.length > 0
      ? Number((current as any).product_answers[0]?.id)
      : null

  if (existingId) {
    const { error } = await supabase
      .from("product_answers")
      .update({ answer, answered_by: answeredBy, published: true })
      .eq("id", existingId)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from("product_answers")
      .insert({ question_id: args.questionId, answer, answered_by: answeredBy, published: true })
    if (error) throw error
  }

  const { error: pubErr } = await supabase.from("product_questions").update({ published: true }).eq("id", args.questionId)
  if (pubErr) throw pubErr
}
