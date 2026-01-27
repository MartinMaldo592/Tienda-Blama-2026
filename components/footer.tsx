import Link from 'next/link'

export function Footer() {
    return (
        <footer className="bg-sidebar text-sidebar-foreground py-10 mt-auto">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-sidebar-primary-foreground">Blama Shop</h3>
                    <p className="text-sm text-muted-foreground">
                        La mejor experiencia de compra online con atención personalizada vía WhatsApp.
                    </p>
                </div>

                {/* Links Rápidos */}
                <div className="space-y-4">
                    <h4 className="text-sidebar-primary-foreground font-semibold">Enlaces Rápidos</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/" className="hover:text-sidebar-primary-foreground transition-colors">Inicio</Link></li>
                        <li><Link href="/productos" className="hover:text-sidebar-primary-foreground transition-colors">Catálogo</Link></li>
                        <li><Link href="/nosotros" className="hover:text-sidebar-primary-foreground transition-colors">Quiénes Somos</Link></li>
                        <li><Link href="/contacto" className="hover:text-sidebar-primary-foreground transition-colors">Contáctanos</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div className="space-y-4">
                    <h4 className="text-sidebar-primary-foreground font-semibold">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/terminos" className="hover:text-sidebar-primary-foreground transition-colors">Términos y Condiciones</Link></li>
                        <li><Link href="/privacidad" className="hover:text-sidebar-primary-foreground transition-colors">Política de Privacidad</Link></li>
                        <li><Link href="/envios" className="hover:text-sidebar-primary-foreground transition-colors">Política de Envíos</Link></li>
                    </ul>
                </div>

                {/* Redes */}
                <div className="space-y-4 flex flex-col items-center">
                    <h4 className="text-primary font-extrabold text-lg uppercase tracking-wider mb-2 text-center">¡Únete a nuestra comunidad!</h4>
                    <div className="flex gap-5">
                        {/* TikTok */}
                        <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="12" fill="#000000" />
                                {/* Red Layer (Shifted Right-Down) */}
                                <path d="M16.7 8.2c-.63 0-1.2-.2-1.7-.5v4.5c0 3.2-2.6 5.8-5.8 5.8-3.2 0-5.8-2.6-5.8-5.8 0-3.2 2.6-5.8 5.8-5.8.34 0 .67.04 1 .1V9.3c-.3-.1-.6-.1-1-.1-1.6 0-3 1.3-3 3 0 1.6 1.3 3 3 3s3-1.3 3-3V2h3.2c0 2.2 1.8 3.9 3.9 4v3.2c-1.8 0-3.3-.6-4.6-1.5z" fill="#FE2C55" transform="translate(10, 8) scale(0.6)" opacity="0" />
                                {/* ^ The above path is generic placeholder, using the exact path from FontAwesome/SimpleIcons below */}
                                <g transform="translate(4, 4) scale(0.66)">
                                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" fill="#FE2C55" transform="translate(0.5, 0.5)" />
                                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" fill="#25F4EE" transform="translate(-0.5, -0.5)" />
                                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" fill="#FFFFFF" />
                                </g>
                            </svg>
                        </a>
                        {/* Facebook */}
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="12" fill="#1877F2" />
                                <path d="M13.5 19.5V12H15.5L16 9.5H13.5V8C13.5 7.375 13.844 7 14.5 7H16V4.5H14C11.5 4.5 10.5 5.875 10.5 8V9.5H8.5V12H10.5V19.5" fill="white" />
                            </svg>
                        </a>
                        {/* Instagram */}
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                            <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="24" height="24" rx="6" fill="url(#paint0_radial_instagram_lg)" />
                                <rect x="5" y="5" width="14" height="14" rx="4" stroke="white" strokeWidth="2" />
                                <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="2" />
                                <circle cx="17" cy="7" r="1" fill="white" />
                                <defs>
                                    <radialGradient id="paint0_radial_instagram_lg" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(7 23) rotate(-90) scale(26 25)">
                                        <stop stopColor="#FCAF45" />
                                        <stop offset="0.32" stopColor="#F77737" />
                                        <stop offset="0.63" stopColor="#E1306C" />
                                        <stop offset="1" stopColor="#833AB4" />
                                    </radialGradient>
                                </defs>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            <div className="border-t border-border mt-8 pt-8 text-center text-xs text-muted-foreground">
                © {new Date().getFullYear()} Blama Shop. Todos los derechos reservados.
            </div>
        </footer>
    )
}
