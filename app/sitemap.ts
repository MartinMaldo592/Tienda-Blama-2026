import { createClient } from "@supabase/supabase-js"
import { slugify } from "@/lib/utils"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blama.shop'

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        return []
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false }
    })

    // 1. Static Pages
    const routes = [
        '',
        '/productos',
        '/nosotros',
        '/contacto',
        '/envios',
        '/privacidad',
        '/terminos',
    ].map((route) => ({
        url: `${BASE_URL}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // 2. Fetch Products
    const { data: products } = await supabase
        .from('productos')
        .select('id, nombre, updated_at')

    const productRoutes = (products || []).map((product) => ({
        url: `${BASE_URL}/productos/${slugify(product.nombre)}-${product.id}`,
        lastModified: product.updated_at || new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    // 3. Fetch Categories
    const { data: categories } = await supabase
        .from('categorias')
        .select('id, nombre, slug')

    // Note: Assuming you have category pages like /productos?category=slug
    // Since they are query params, they are technically same page. 
    // Good SEO practice for categories often involves dedicated routes /categoria/[slug].
    // Since your app uses /productos?category=slug, we might not index them as separate pages in sitemap.xml strictly, 
    // but if you had true routes we would add them. 
    // For now, let's keep it simple with Products and Static pages.

    return [...routes, ...productRoutes]
}
