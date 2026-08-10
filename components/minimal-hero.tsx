import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShoppingBag, Heart, Sparkles, Home, Dumbbell, UserCheck, ShieldCheck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MinimalHero() {
    return (
        <section className="relative overflow-hidden min-h-[620px] sm:min-h-[720px] w-full flex flex-col justify-end pb-12 sm:pb-16 pt-32 group">
            {/* Background Lifestyle Image of BLAMA Products - Gymshark Style */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/blama-hero-bg.png"
                    alt="BLAMA Fitness, Pilates y Lifestyle"
                    fill
                    priority
                    quality={95}
                    className="object-cover object-center transform scale-100 transition-transform duration-1000 group-hover:scale-105"
                />
                {/* Gymshark style dark vignette gradient overlay for crisp readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30" />
            </div>

            <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col items-start text-left max-w-6xl">
                {/* Brand Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-[0.2em] mb-4 border border-white/30 backdrop-blur-md">
                    <Sparkles className="w-3.5 h-3.5 text-[#FFB6C9]" />
                    <span>Nuestros Más Vendidos • Colección 2026</span>
                </div>

                {/* Main Heading - Gymshark bold style */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white font-sans uppercase leading-[0.95] mb-3 drop-shadow-md">
                    FUERTE • SEGURA <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB6C9] via-white to-[#FFB6C9]">
                        IMPARABLE.
                    </span>
                </h1>

                {/* Sub-tagline script */}
                <p className="text-lg sm:text-2xl text-[#FFB6C9] font-serif italic mb-4 tracking-wide font-normal">
                    "tu mejor versión, todos los días. ♡"
                </p>

                <p className="text-sm sm:text-base text-white/85 mb-8 max-w-xl leading-relaxed font-medium">
                    Equipamiento premium de pilates, mats, pesas tobilleras y bandas antideslizantes. Diseñado para acompañarte a tu propio ritmo, en casa o en el gym.
                </p>

                {/* CTA Buttons — Clean Gymshark Pill Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-10">
                    <Button asChild size="lg" className="w-full sm:w-auto rounded-full px-10 h-14 text-sm sm:text-base font-black uppercase tracking-wider bg-white text-[#2D2D2D] hover:bg-[#FFE6EF] hover:text-[#FF6FA7] shadow-xl transition-all hover:scale-105">
                        <Link href="/productos">
                            <ShoppingBag className="mr-2.5 h-5 w-5 text-[#FF6FA7]" />
                            Explorar Catálogo
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="w-full sm:w-auto rounded-full px-9 h-14 text-sm sm:text-base font-black uppercase tracking-wider bg-black/40 border-2 border-white text-white hover:bg-white hover:text-[#2D2D2D] transition-all backdrop-blur-md">
                        <Link href="/productos?cat=pilates-yoga">
                            Colección Pilates <ArrowRight className="ml-2.5 h-4 w-4" />
                        </Link>
                    </Button>
                </div>

                {/* 5 Pillars Ribbon */}
                <div className="w-full bg-black/40 backdrop-blur-xl rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="flex flex-col items-center text-center p-2">
                        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-[#FFB6C9] mb-2 border border-white/20">
                            <UserCheck size={18} />
                        </div>
                        <span className="text-[11px] font-black text-white uppercase tracking-wider">Para Mujeres como Tú</span>
                    </div>

                    <div className="flex flex-col items-center text-center p-2">
                        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-[#FFB6C9] mb-2 border border-white/20">
                            <Dumbbell size={18} />
                        </div>
                        <span className="text-[11px] font-black text-white uppercase tracking-wider">Entrena a Tu Manera</span>
                    </div>

                    <div className="flex flex-col items-center text-center p-2">
                        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-[#FFB6C9] mb-2 border border-white/20">
                            <Home size={18} />
                        </div>
                        <span className="text-[11px] font-black text-white uppercase tracking-wider">En Casa o En El Gym</span>
                    </div>

                    <div className="flex flex-col items-center text-center p-2">
                        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-[#FFB6C9] mb-2 border border-white/20">
                            <ShieldCheck size={18} />
                        </div>
                        <span className="text-[11px] font-black text-white uppercase tracking-wider">Bienestar y Confianza</span>
                    </div>

                    <div className="flex flex-col items-center text-center p-2 col-span-2 md:col-span-1">
                        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-[#FFB6C9] mb-2 border border-white/20">
                            <Users size={18} />
                        </div>
                        <span className="text-[11px] font-black text-white uppercase tracking-wider">Comunidad BLAMA</span>
                    </div>
                </div>
            </div>
        </section>
    )
}
