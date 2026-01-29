export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.blama.shop'
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin/',
                    '/checkout/',
                    '/auth/',
                    '/api/',
                    '/open-wa/'
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
