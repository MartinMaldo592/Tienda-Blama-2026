"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from "@/lib/supabase.client"
import { Facebook, Instagram, Linkedin, Twitter, Youtube, ExternalLink } from 'lucide-react'
import { PeruFlag } from "@/components/ui/peru-flag"

// Custom icons for complex SVGs
const TiktokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#000000" />
        <path d="M16.7 8.2c-.63 0-1.2-.2-1.7-.5v4.5c0 3.2-2.6 5.8-5.8 5.8-3.2 0-5.8-2.6-5.8-5.8 0-3.2 2.6-5.8 5.8-5.8.34 0 .67.04 1 .1V9.3c-.3-.1-.6-.1-1-.1-1.6 0-3 1.3-3 3 0 1.6 1.3 3 3 3s3-1.3 3-3V2h3.2c0 2.2 1.8 3.9 3.9 4v3.2c-1.8 0-3.3-.6-4.6-1.5z" fill="#FE2C55" transform="translate(0.5, 0.5)" opacity="0" />
        <g transform="translate(4, 4) scale(0.66)">
            <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" fill="#FE2C55" transform="translate(0.5, 0.5)" />
            <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" fill="#25F4EE" transform="translate(-0.5, -0.5)" />
            <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" fill="#FFFFFF" />
        </g>
    </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="12" fill="#1877F2" />
        <path d="M13.5 19.5V12H15.5L16 9.5H13.5V8C13.5 7.375 13.844 7 14.5 7H16V4.5H14C11.5 4.5 10.5 5.875 10.5 8V9.5H8.5V12H10.5V19.5" fill="white" />
    </svg>
)

const InstagramIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="url(#paint0_radial_instagram_lg_footer)" />
        <rect x="5" y="5" width="14" height="14" rx="4" stroke="white" strokeWidth="2" />
        <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" />
        <circle cx="17" cy="7" r="1" fill="white" />
        <defs>
            <radialGradient id="paint0_radial_instagram_lg_footer" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(7 23) rotate(-90) scale(26 25)">
                <stop stopColor="#FCAF45" />
                <stop offset="0.32" stopColor="#F77737" />
                <stop offset="0.63" stopColor="#E1306C" />
                <stop offset="1" stopColor="#833AB4" />
            </radialGradient>
        </defs>
    </svg>
)

type SocialLink = {
    id: number
    platform: string
    url: string
    active: boolean
    orden: number
}

export function Footer() {
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const supabase = createClient()
                const { data } = await supabase
                    .from('social_links')
                    .select('*')
                    .eq('active', true)
                    .order('orden', { ascending: true })

                if (data) {
                    setSocialLinks(data.map(item => ({
                        id: item.id,
                        platform: item.platform,
                        url: item.url,
                        active: item.active ?? false,
                        orden: item.orden ?? 0
                    })))
                }
            } catch (err) {
                console.error("Error fetching social links:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchLinks()
    }, [])

    const getIcon = (platform: string) => {
        const p = platform.toLowerCase().trim()
        if (p === 'tiktok') return <TiktokIcon className="h-10 w-10" />
        if (p === 'facebook') return <FacebookIcon className="h-10 w-10" />
        if (p === 'instagram') return <InstagramIcon className="h-10 w-10" />
        if (p === 'twitter' || p === 'x') return <Twitter className="h-10 w-10 p-2 bg-black text-white rounded-full" />
        if (p === 'youtube') return <Youtube className="h-10 w-10 text-red-600 bg-white rounded-full p-1" />
        if (p === 'linkedin') return <Linkedin className="h-10 w-10 text-blue-700 bg-white rounded-md" />

        return <div className="h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xs">{p.slice(0, 2).toUpperCase()}</div>
    }

    // Default static links if fetch fails or is empty (and not loading)
    const showDefaults = !loading && socialLinks.length === 0

    return (
        <footer className="bg-[#09090b] text-gray-300 py-16 mt-auto border-t border-gray-800">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white tracking-tight">BLAMA SHOP</h3>
                    <p className="text-sm leading-relaxed text-gray-400">
                        Tu tienda online favorita con la mejor variedad de productos en tendencia.
                    </p>
                    <div className="space-y-2 text-sm text-gray-400 pt-2">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white shrink-0">Email:</span>
                            <span>{["soporte", "blamashop.com"].join("@")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white shrink-0">Teléfono:</span>
                            <span>+51 958 279 604</span>
                        </div>
                    </div>
                </div>

                {/* Links Rápidos */}
                <div>
                    <h4 className="text-white font-bold uppercase text-sm tracking-widest mb-6">Navegación</h4>
                    <ul className="space-y-3 text-base">
                        <li><Link href="/" className="hover:text-white transition-colors duration-200">Inicio</Link></li>
                        <li><Link href="/productos" className="hover:text-white transition-colors duration-200">Catálogo</Link></li>
                        <li><Link href="/nosotros" className="hover:text-white transition-colors duration-200">Quiénes Somos</Link></li>
                        <li><Link href="/contacto" className="hover:text-white transition-colors duration-200">Contáctanos</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="text-white font-bold uppercase text-sm tracking-widest mb-6">Legal</h4>
                    <ul className="space-y-3 text-base">
                        <li><Link href="/terminos" className="hover:text-white transition-colors duration-200">Términos y Condiciones</Link></li>
                        <li><Link href="/privacidad" className="hover:text-white transition-colors duration-200">Política de Privacidad</Link></li>
                        <li><Link href="/envios" className="hover:text-white transition-colors duration-200">Política de Envíos</Link></li>
                        <li><Link href="/devoluciones" className="hover:text-white transition-colors duration-200">Cambios y Devoluciones</Link></li>
                    </ul>
                </div>

                {/* Redes */}
                <div className="flex flex-col items-center md:items-start space-y-8">
                    <div>
                        <h4 className="text-white font-bold text-base uppercase tracking-wider mb-6 text-center md:text-left">
                            Síguenos
                        </h4>
                        <div className="flex gap-4 flex-wrap justify-center md:justify-start">
                            {/* ... existing social links code ... */}
                            {loading ? (
                                [1, 2, 3].map(i => <div key={i} className="h-10 w-10 bg-gray-800 rounded-full animate-pulse" />)
                            ) : socialLinks.length > 0 ? (
                                socialLinks.map((link) => (
                                    <a
                                        key={link.id}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:scale-110 transition-transform duration-200 hover:opacity-90"
                                        aria-label={`Síguenos en ${link.platform}`}
                                    >
                                        {getIcon(link.platform)}
                                    </a>
                                ))
                            ) : (
                                <>
                                    <a href="https://www.tiktok.com/@blamashop" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200 hover:opacity-90">
                                        <TiktokIcon className="h-10 w-10" />
                                    </a>
                                    <a href="https://www.facebook.com/blamashop" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200 hover:opacity-90">
                                        <FacebookIcon className="h-10 w-10" />
                                    </a>
                                    <a href="https://www.instagram.com/blamashop" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform duration-200 hover:opacity-90">
                                        <InstagramIcon className="h-10 w-10" />
                                    </a>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-800 w-full flex justify-center md:justify-start">
                        <Link href="/libro-reclamaciones" className="group flex items-center gap-3 bg-white text-black px-4 py-2 rounded-lg border-b-4 border-gray-300 hover:border-primary active:border-b-0 active:translate-y-1 transition-all">
                            <div className="p-1 border-2 border-black rounded">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-[10px] font-bold uppercase tracking-wider">Libro de</span>
                                <span className="text-sm font-black uppercase">Reclamaciones</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center md:flex md:justify-between md:text-left text-sm text-gray-500">
                <p>© {new Date().getFullYear()} Blama Shop. Todos los derechos reservados.</p>
                <div className="flex justify-center flex-col md:flex-row items-center gap-4 mt-2 md:mt-0">
                    <div className="flex items-center gap-2 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                        <PeruFlag className="h-3 w-4 rounded-[1px]" />
                        <span className="text-white font-bold text-xs tracking-wider">LIMA, PERÚ</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
