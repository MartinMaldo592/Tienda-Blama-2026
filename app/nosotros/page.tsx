
import { Heart, Sparkles, UserCheck, Dumbbell, Home, ShieldCheck, Users } from "lucide-react"

export default function NosotrosPage() {
    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFE6EF] text-[#FF6FA7] text-xs font-bold mb-3 border border-[#FFD4E2]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Nuestra Historia</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-[#FF6FA7] font-serif lowercase">blama</h1>
                <p className="text-xs font-extrabold tracking-[0.25em] text-[#2D2D2D] uppercase mt-1">
                    FITNESS • PILATES • LIFESTYLE
                </p>
                <p className="text-lg text-[#FF6FA7] font-serif italic mt-2">
                    "tu mejor versión, todos los días. ♡"
                </p>
            </div>

            <div className="bg-white border border-[#FFD4E2] p-8 md:p-12 rounded-3xl shadow-sm space-y-6 text-[#2D2D2D]">
                <p className="text-lg leading-relaxed text-[#7C6A72]">
                    En <strong>BLAMA</strong> nos apasiona inspirar a las mujeres a conectarse con su fuerza interior, su salud y su bienestar diario. Diseñamos y seleccionamos equipamiento de pilates, resistencia y accesorios deportivos de la más alta calidad en Perú.
                </p>
                <p className="text-base leading-relaxed text-[#7C6A72]">
                    Creemos que no necesitas reglas estrictas para mantenerte activa: <em>entrena a tu manera, en casa o en el gym</em>. Nuestra meta es brindarte productos funcionales, estéticos y duraderos que te hagan sentir segura y poderosa en cada repetición.
                </p>

                <div className="pt-6 border-t border-[#FFD4E2]">
                    <h2 className="text-xl font-bold mb-6 text-[#FF6FA7] flex items-center gap-2">
                        <Heart className="w-5 h-5 fill-[#FF6FA7]" />
                        Los 5 Pilares de la Comunidad BLAMA
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FFF7F9] border border-[#FFD4E2]">
                            <div className="p-2.5 rounded-xl bg-[#FFE6EF] text-[#FF6FA7] shrink-0">
                                <UserCheck size={20} />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-sm text-[#2D2D2D]">Para mujeres como tú</h3>
                                <p className="text-xs text-[#7C6A72] mt-0.5">Pensado en la comodidad y elegancia de tu día a día.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FFF7F9] border border-[#FFD4E2]">
                            <div className="p-2.5 rounded-xl bg-[#FFE6EF] text-[#FF6FA7] shrink-0">
                                <Dumbbell size={20} />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-sm text-[#2D2D2D]">Entrena a tu manera</h3>
                                <p className="text-xs text-[#7C6A72] mt-0.5">Sin presiones. Disfruta tu proceso a tu propio ritmo.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FFF7F9] border border-[#FFD4E2]">
                            <div className="p-2.5 rounded-xl bg-[#FFE6EF] text-[#FF6FA7] shrink-0">
                                <Home size={20} />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-sm text-[#2D2D2D]">En casa o en el gym</h3>
                                <p className="text-xs text-[#7C6A72] mt-0.5">Accesorios portátiles para entrenar donde prefieras.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#FFF7F9] border border-[#FFD4E2]">
                            <div className="p-2.5 rounded-xl bg-[#FFE6EF] text-[#FF6FA7] shrink-0">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h3 className="font-extrabold text-sm text-[#2D2D2D]">Bienestar y confianza</h3>
                                <p className="text-xs text-[#7C6A72] mt-0.5">Materiales duraderos y ergonómicos garantizados.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 py-3 px-6 rounded-full bg-gradient-to-r from-[#FF6FA7] to-[#FF85B3] text-white text-center font-extrabold tracking-[0.2em] text-xs uppercase shadow-sm">
                    FUERTE • SEGURA • IMPARABLE
                </div>
            </div>
        </div>
    )
}
