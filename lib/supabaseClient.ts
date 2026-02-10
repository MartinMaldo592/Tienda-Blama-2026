/**
 * DEPRECATED: usage of static supabase client is removed.
 * Please use createClient from '@/lib/supabase.client' (browser) or '@/lib/supabase.server' (server).
 */
// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// if (!supabaseUrl || !supabaseAnonKey) {
//     throw new Error('Missing Supabase environment variables! Please check your .env.local file or Vercel project settings.')
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey)
