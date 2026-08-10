import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShoppingBag, Heart, Sparkles, Home, Dumbbell, UserCheck, ShieldCheck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MinimalHero() {
    return (
        <section className="relative overflow-hidden rounded-3xl min-h-[580px] sm:min-h-[640px] mx-2 sm:mx-4 my-2 border border-[#FFD4E2] shadow-md flex flex-col items-center justify-center pt-10 pb-8 group">
            {/* Background Lifestyle Image of BLAMA Products */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                    src="/images/blama-hero-bg.png"
                    alt="BLAMA Fitness, Pilates y Lifestyle"
                    fill
                    priority
                    quality={90}
                    className="object-cover object-center transform scale-102 transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Translucent overlay for seamless integration with header navbar */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/75 to-[#FFF7F9]/95 backdrop-blur-[2px]" />
                <div className="absolute inset-0 bg-radial from-transparent via-[#FFE6EF]/20 to-[#FFF7F9]/80" />
            </div>

            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center max-w-4xl">
                {/* Brand Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 text-[#FF6FA7] text-xs font-bold mb-6 border border-[#FFD4E2] shadow-sm backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6FA7]" />
                    <span>Colección Pilates & Fitness 2026</span>
                </div>

                {/* Main Logo Title */}
                <div className="flex flex-col items-center mb-2">
                    <div className="flex items-center gap-3">
                        <svg className="w-10 h-10 md:w-14 md:h-14 text-[#FF6FA7] drop-shadow-xs" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C10 5 7 8 7 12c0 3 2.5 5 5 5s5-2 5-5c0-4-3-7-5-10zm0 13c-1.6 0-3-1.3-3-3 0-2.2 1.8-4.5 3-6.5 1.2 2 3 4.3 3 6.5 0 1.7-1.4 3-3 3z" />
                            <path d="M6 14c-2 0-4-1-5-3 2 0 4.5.5 6 2 1.5 1.5 1.5 3 1.5 3s-.5-2-2.5-2z" opacity="0.7"/>
                            <path d="M18 14c2 0 4-1 5-3-2 0-4.5.5-6 2-1.5 1.5-1.5 3-1.5 3s.5-2 2.5-2z" opacity="0.7"/>
                        </svg>
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight text-[#FF6FA7] font-serif lowercase leading-none drop-shadow-xs">
                            blama
                        </h1>
                    </div>
                    <p className="text-xs sm:text-sm font-black tracking-[0.3em] text-[#2D2D2D] uppercase mt-2">
                        FITNESS • PILATES • LIFESTYLE
                    </p>
                </div>

                {/* Sub-tagline script */}
                <p className="text-lg sm:text-2xl text-[#FF6FA7] font-semibold italic my-3 tracking-wide drop-shadow-xs">
                    tu mejor versión, todos los días. ♡
                </p>

                <p className="text-sm sm:text-base text-[#7C6A72] mb-8 max-w-xl leading-relaxed px-2 font-medium">
                    Diseñado especialmente para mujeres apasionadas por su bienestar. Encuentra mats premium, aros de pilates, bandas y accesorios para entrenar a tu manera.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto px-4 sm:px-0 mb-10">
                    <Button asChild size="default" className="w-full sm:w-auto rounded-full px-9 h-12 text-sm sm:text-base font-extrabold bg-[#FF6FA7] hover:bg-[#E0528F] text-white shadow-lg shadow-[#FF6FA7]/30 transition-all hover:scale-105">
                        <Link href="/productos">
                            <ShoppingBag className="mr-2 h-5 w-5" />
                            Explorar Catálogo
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="default" className="w-full sm:w-auto rounded-full px-8 h-12 text-sm sm:text-base font-bold bg-white/90 border-[#FFB6C9] text-[#2D2D2D] hover:bg-[#FFE6EF] transition-all backdrop-blur-md shadow-xs">
                        <Link href="/nosotros">
                            Conoce Nuestra Historia <ArrowRight className="ml-2 h-4 w-4 text-[#FF6FA7]" />
                        </Link>
                    </Button>
                </div>

                {/* 5 Pillars Ribbon */}
                <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-[#FFD4E2] shadow-sm grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="flex flex-col items-center text-center p-2">
                        <div className="w-10 h-10 rounded-full bg-[#FFE6EF] flex items-center justify-center text-[#FF6FA7] mb-2">
                            <UserCheck size={20} />
                        </div>
                        <span className="text-xs font-black text-[#2D2D2D] uppercase tracking-wider">Para Mujeres como Tú</span>
                    </div>

                    <div className="flex flex-col items-center text-center p-2">
                        <div className="w-10 h-10 rounded-full bg-[#FFE6EF] flex items-center justify-center text-[#FF6FA7] mb-2">
                            <Dumbbell size={20} />
                        </div>
                        <span className="text-xs font-black text-[#2D2D2D] uppercase tracking-wider">Entrena a Tu Manera</span>
                    </div>

                    <div className="flex flex-col items-center text-center p-2">
                        <div className="w-10 h-10 rounded-full bg-[#FFE6EF] flex items-center justify-center text-[#FF6FA7] mb-2">
                            <Home size={20} />
                        </div>
                        <span className="text-xs font-black text-[#2D2D2D] uppercase tracking-wider">En Casa o En El Gym</span>
                    </div>

                    <div className="flex flex-col items-center text-center p-2">
                        <div className="w-10 h-10 rounded-full bg-[#FFE6EF] flex items-center justify-center text-[#FF6FA7] mb-2">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="text-xs font-black text-[#2D2D2D] uppercase tracking-wider">Bienestar y Confianza</span>
                    </div>

                    <div className="flex flex-col items-center text-center p-2 col-span-2 md:col-span-1">
                        <div className="w-10 h-10 rounded-full bg-[#FFE6EF] flex items-center justify-center text-[#FF6FA7] mb-2">
                            <Users size={20} />
                        </div>
                        <span className="text-xs font-black text-[#2D2D2D] uppercase tracking-wider">Comunidad BLAMA</span>
                    </div>
                </div>

                {/* Mantra Banner */}
                <div className="mt-6 w-full py-3 px-6 rounded-full bg-gradient-to-r from-[#FF6FA7] via-[#FF85B3] to-[#FF6FA7] text-white flex items-center justify-center gap-3 text-xs sm:text-sm font-extrabold tracking-[0.25em] uppercase shadow-md">
                    <Heart className="w-3.5 h-3.5 fill-white text-white" />
                    <span>FUERTE • SEGURA • IMPARABLE</span>
                    <Heart className="w-3.5 h-3.5 fill-white text-white" />
                </div>
            </div>
        </section>
    )
}
