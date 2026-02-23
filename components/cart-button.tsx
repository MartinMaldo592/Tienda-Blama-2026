"use client"

import Image from "next/image"
import { useCartAnimationStore } from "@/features/cart/cart-animation"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Trash2, Plus, Minus, Image as ImageIcon } from "lucide-react"
import { useCartStore } from "@/features/cart"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { formatCurrency } from "@/lib/utils"
import { sendGTMEvent } from "@/lib/gtm"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet"

const CheckoutForm = dynamic(() => import("@/components/checkout-form").then(mod => mod.CheckoutForm), {
    loading: () => <div className="p-8 text-center">Cargando formulario...</div>
})
const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

// Lottie JSON definition (Simplified Success Check)
const successAnimation = {
    "v": "5.5.7", "fr": 60, "ip": 0, "op": 60, "w": 200, "h": 200, "nm": "Success", "ddd": 0,
    "assets": [],
    "layers": [
        {
            "ddd": 0, "ind": 1, "ty": 4, "nm": "Check", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 0, "k": [100, 100, 0], "ix": 2 }, "a": { "a": 0, "k": [0, 0, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6 } }, "ao": 0,
            "shapes": [
                {
                    "ty": "gr", "it": [
                        { "ind": 0, "ty": "sh", "ix": 1, "ks": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 0, "s": [{ "i": [[0, 0], [0, 0], [0, 0]], "o": [[0, 0], [0, 0], [0, 0]], "v": [[-40, 0], [-40, 0], [-40, 0]], "c": false }] }, { "t": 30, "s": [{ "i": [[0, 0], [0, 0], [0, 0]], "o": [[0, 0], [0, 0], [0, 0]], "v": [[-40, 0], [-10, 30], [-10, 30]], "c": false }] }, { "t": 60, "s": [{ "i": [[0, 0], [0, 0], [0, 0]], "o": [[0, 0], [0, 0], [0, 0]], "v": [[-40, 0], [-10, 30], [40, -30]], "c": false }] }], "ix": 2 }, "nm": "Path 1", "hd": false },
                        { "ty": "st", "c": { "a": 0, "k": [0.13, 0.77, 0.36, 1], "ix": 3 }, "o": { "a": 0, "k": 100, "ix": 4 }, "w": { "a": 0, "k": 15, "ix": 5 }, "lc": 2, "lj": 2, "ml": 4, "bm": 0, "nm": "Stroke 1", "hd": false },
                        { "ty": "tr", "p": { "a": 0, "k": [0, 0], "ix": 2 }, "a": { "a": 0, "k": [0, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100], "ix": 3 }, "r": { "a": 0, "k": 0, "ix": 6 }, "o": { "a": 0, "k": 100, "ix": 7 }, "sk": { "a": 0, "k": 0, "ix": 4 }, "sa": { "a": 0, "k": 0, "ix": 5 }, "nm": "Transform" }
                    ], "nm": "Shape 1", "np": 3, "cix": 2, "bm": 0, "hd": false
                }
            ], "ip": 0, "op": 60, "st": 0, "bm": 0
        },
        {
            "ddd": 0, "ind": 2, "ty": 4, "nm": "Circle", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 0, "k": [100, 100, 0], "ix": 2 }, "a": { "a": 0, "k": [0, 0, 0], "ix": 1 }, "s": { "a": 1, "k": [{ "i": { "x": [0.833], "y": [0.833] }, "o": { "x": [0.167], "y": [0.167] }, "t": 0, "s": [0, 0, 100] }, { "t": 30, "s": [100, 100, 100] }], "ix": 6 } }, "ao": 0,
            "shapes": [
                {
                    "ty": "gr", "it": [
                        { "d": 1, "ty": "el", "s": { "a": 0, "k": [180, 180], "ix": 2 }, "p": { "a": 0, "k": [0, 0], "ix": 3 }, "nm": "Ellipse Path 1", "hd": false },
                        { "ty": "st", "c": { "a": 0, "k": [0.13, 0.77, 0.36, 1], "ix": 3 }, "o": { "a": 0, "k": 20, "ix": 4 }, "w": { "a": 0, "k": 2, "ix": 5 }, "lc": 1, "lj": 1, "ml": 4, "bm": 0, "nm": "Stroke 1", "hd": false },
                        { "ty": "fl", "c": { "a": 0, "k": [0.13, 0.77, 0.36, 1], "ix": 4 }, "o": { "a": 0, "k": 10, "ix": 5 }, "r": 1, "bm": 0, "nm": "Fill 1", "hd": false },
                        { "ty": "tr", "p": { "a": 0, "k": [0, 0], "ix": 2 }, "a": { "a": 0, "k": [0, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100], "ix": 3 }, "r": { "a": 0, "k": 0, "ix": 6 }, "o": { "a": 0, "k": 100, "ix": 7 }, "sk": { "a": 0, "k": 0, "ix": 4 }, "sa": { "a": 0, "k": 0, "ix": 5 }, "nm": "Transform" }
                    ], "nm": "Shape 1", "np": 3, "cix": 2, "bm": 0, "hd": false
                }
            ], "ip": 0, "op": 60, "st": 0, "bm": 0
        }
    ]
}

// Lottie JSON for Empty Cart
const emptyCartAnimation = {
    "v": "5.5.7", "fr": 60, "ip": 0, "op": 60, "w": 200, "h": 200, "nm": "EmptyCart", "ddd": 0,
    "assets": [],
    "layers": [
        {
            "ddd": 0, "ind": 1, "ty": 4, "nm": "Bag", "sr": 1, "ks": { "o": { "a": 0, "k": 100, "ix": 11 }, "r": { "a": 0, "k": 0, "ix": 10 }, "p": { "a": 0, "k": [100, 100, 0], "ix": 2 }, "a": { "a": 0, "k": [0, 0, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100, 100], "ix": 6 } }, "ao": 0,
            "shapes": [
                {
                    "ty": "gr", "it": [
                        { "ty": "rc", "d": 1, "s": { "a": 1, "k": [{ "i": { "x": [0.833, 0.833], "y": [0.833, 0.833] }, "o": { "x": [0.167, 0.167], "y": [0.167, 0.167] }, "t": 0, "s": [50, 50] }, { "t": 30, "s": [120, 100] }, { "t": 60, "s": [50, 50] }], "ix": 2 }, "p": { "a": 0, "k": [0, 10], "ix": 3 }, "r": { "a": 0, "k": 10, "ix": 4 }, "nm": "Rectangle Path 1", "hd": false },
                        { "ty": "st", "c": { "a": 0, "k": [0.5, 0.5, 0.5, 1], "ix": 3 }, "o": { "a": 0, "k": 100, "ix": 4 }, "w": { "a": 0, "k": 8, "ix": 5 }, "lc": 2, "lj": 2, "ml": 4, "bm": 0, "nm": "Stroke 1", "hd": false },
                        { "ty": "tr", "p": { "a": 0, "k": [0, 0], "ix": 2 }, "a": { "a": 0, "k": [0, 0], "ix": 1 }, "s": { "a": 0, "k": [100, 100], "ix": 3 }, "r": { "a": 0, "k": 0, "ix": 6 }, "o": { "a": 0, "k": 100, "ix": 7 }, "sk": { "a": 0, "k": 0, "ix": 4 }, "sa": { "a": 0, "k": 0, "ix": 5 }, "nm": "Transform" }
                    ], "nm": "Bag Base", "np": 3, "cix": 2, "bm": 0, "hd": false
                }
            ], "ip": 0, "op": 60, "st": 0, "bm": 0
        }
    ]
}

export function CartButton() {
    // Use state to avoid hydration mismatch with persisted store
    const [mounted, setMounted] = useState(false)
    const [view, setView] = useState<'cart' | 'checkout' | 'success'>('cart')

    const registerCartButton = useCartAnimationStore((s) => s.registerCartButton)
    const bumpTimestamp = useCartAnimationStore((s) => s.bumpTimestamp)
    const [isBumping, setIsBumping] = useState(false)

    useEffect(() => {
        if (!bumpTimestamp) return
        setIsBumping(true)
        const t = setTimeout(() => setIsBumping(false), 300)
        return () => clearTimeout(t)
    }, [bumpTimestamp])

    const items = useCartStore((state) => state.items)
    const removeItem = useCartStore((state) => state.removeItem)
    const updateQuantity = useCartStore((state) => state.updateQuantity)
    const clearCart = useCartStore((state) => state.clearCart)
    const total = useCartStore((state) => state.total)

    useEffect(() => {
        setMounted(true)

        const readCookie = (name: string) => {
            try {
                const value = `; ${document.cookie}`
                const parts = value.split(`; ${name}=`)
                if (parts.length < 2) return null
                return parts.pop()!.split(';').shift() || null
            } catch (err) {
                return null
            }
        }

        const deleteCookie = (name: string) => {
            try {
                const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:'
                document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${isHttps ? '; Secure' : ''}`
            } catch (err) {
            }
        }

        const consumeSuccessMarker = () => {
            try {
                const raw = localStorage.getItem('blama_last_order_success')
                const cookieRaw = raw ? null : readCookie('blama_last_order_success')
                const source = raw ?? (cookieRaw ? decodeURIComponent(cookieRaw) : null)
                if (!source) return

                const parsed = JSON.parse(source)
                const orderId = parsed?.orderId ? String(parsed.orderId) : null
                const ts = Number(parsed?.ts || 0)
                const isFresh = ts > 0 && Date.now() - ts < 1000 * 60 * 30 // 30 min
                if (!isFresh) {
                    localStorage.removeItem('blama_last_order_success')
                    deleteCookie('blama_last_order_success')
                    return
                }

                clearCart()
                try {
                    localStorage.removeItem('cart-storage')
                } catch (err) {
                }
                setView('success')
                localStorage.removeItem('blama_last_order_success')
                deleteCookie('blama_last_order_success')
            } catch (err) {
            }
        }

        consumeSuccessMarker()

        const onPageShow = () => consumeSuccessMarker()
        const onFocus = () => consumeSuccessMarker()
        const onVisibility = () => {
            if (document.visibilityState === 'visible') consumeSuccessMarker()
        }

        window.addEventListener('pageshow', onPageShow)
        window.addEventListener('focus', onFocus)
        document.addEventListener('visibilitychange', onVisibility)
        return () => {
            window.removeEventListener('pageshow', onPageShow)
            window.removeEventListener('focus', onFocus)
            document.removeEventListener('visibilitychange', onVisibility)
        }
    }, [])



    const totalItems = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0

    const isCartOpen = useCartAnimationStore((s) => s.isCartOpen)
    const setCartOpen = useCartAnimationStore((s) => s.setCartOpen)

    const handleOpenChange = (open: boolean) => {
        setCartOpen(open)
        if (!open) {
            // Reset view when closing, unless we are in success (optional)
            setTimeout(() => setView('cart'), 300)
        }
    }

    const handleComplete = () => {
        clearCart()
        try {
            localStorage.removeItem('cart-storage')
        } catch (err) {
        }
        setView('success')
    }

    // Culqi (tarjeta): cierra el carrito directamente sin mostrar
    // la pantalla de éxito intermedia, ya que la página de éxito
    // se encarga de toda la confirmación.
    const handleCompleteCulqi = () => {
        clearCart()
        try {
            localStorage.removeItem('cart-storage')
        } catch (err) {
        }
        setCartOpen(false)
        setTimeout(() => setView('cart'), 300)
    }

    const handleContinueShopping = () => {
        setCartOpen(false)
        setView('cart')
    }

    return (

        <>

            <Sheet open={isCartOpen} onOpenChange={handleOpenChange} modal={view !== 'checkout'}>
                <SheetTrigger asChild>
                    <Button variant="ghost" className={`relative hover:bg-popover flex items-center gap-2 px-3 h-10 rounded-full border border-border shadow-sm transition-all hover:shadow-md active:scale-95 ${isBumping ? 'scale-110 bg-green-50/50 ring-2 ring-green-500 duration-100' : 'duration-300'}`}>
                        <div className="relative flex items-center justify-center p-1" ref={(el) => registerCartButton(el as any)}>
                            <ShoppingCart className={`h-5 w-5 transition-colors ${isBumping ? 'text-green-600 animate-bounce' : 'text-foreground'}`} />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1.5 h-4 w-4 bg-red-600 rounded-full text-[10px] font-bold text-white flex items-center justify-center animate-in zoom-in ring-2 ring-background shadow-sm">
                                    {totalItems}
                                </span>
                            )}
                        </div>
                        <span className={`font-bold text-sm mr-1 transition-colors ${isBumping ? 'text-green-700' : 'text-foreground'}`}>Carrito</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-[400px] flex flex-col p-0">

                    <SheetHeader className="sr-only">
                        <SheetTitle>Carrito</SheetTitle>
                    </SheetHeader>

                    {/* VIEW: SUCCESS */}
                    {view === 'success' && (
                        <div className="flex flex-col items-center justify-center h-full space-y-6 text-center animate-in fade-in zoom-in duration-300 p-6">
                            <div className="h-32 w-32 flex items-center justify-center pointer-events-none drop-shadow-sm">
                                {isCartOpen && <Lottie animationData={successAnimation} loop={false} />}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-gray-900">¡Pedido Confirmado!</h3>
                                <p className="text-gray-500 max-w-[250px] mx-auto text-sm leading-relaxed font-medium">
                                    Tu pedido se registró correctamente. Ahora se abrirá WhatsApp para finalizar la confirmación. ¡Gracias por tu preferencia!
                                </p>
                            </div>

                            <SheetClose asChild>
                                <Button
                                    className="w-full max-w-[200px] h-12 rounded-xl bg-black hover:bg-gray-800 shadow-lg transition-all active:scale-95"
                                    onClick={handleContinueShopping}
                                >
                                    Seguir Comprando
                                </Button>
                            </SheetClose>
                        </div>
                    )}

                    {/* VIEW: CHECKOUT FORM */}
                    {view === 'checkout' && (
                        <CheckoutForm
                            items={items}
                            total={total}
                            onBack={() => setView('cart')}
                            onComplete={handleComplete}
                            onCompleteCulqi={handleCompleteCulqi}
                        />
                    )}

                    {/* VIEW: CART LIST (Default) */}
                    {view === 'cart' && (
                        <>
                            <SheetHeader className="p-6 border-b bg-muted/10">
                                <SheetTitle className="flex items-center gap-3 text-2xl font-extrabold tracking-tight">
                                    <ShoppingCart className="h-7 w-7 text-primary" />
                                    Mi Carrito ({totalItems})
                                </SheetTitle>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {!mounted ? (
                                    <p className="text-center text-muted-foreground mt-10">Cargando...</p>
                                ) : items.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4">
                                        <div className="h-40 w-40 flex items-center justify-center pointer-events-none opacity-80">
                                            {isCartOpen && <Lottie animationData={emptyCartAnimation} />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xl font-bold text-foreground">Tu carrito está vacío</p>
                                            <p className="text-sm text-muted-foreground">¡Parece que aún no has elegido nada!</p>
                                        </div>
                                        <SheetClose asChild>
                                            <Button variant="outline" className="mt-4 rounded-xl border-2 font-bold px-8">
                                                Empezar a comprar
                                            </Button>
                                        </SheetClose>
                                    </div>
                                ) : (
                                    items.map((item) => (
                                        <div key={`${item.id}-${item.producto_variante_id ?? 'base'}`} className="flex gap-3 bg-card p-2 rounded-lg border border-border shadow-sm">
                                            <div className="h-20 w-20 bg-popover rounded-md overflow-hidden flex-shrink-0 relative">
                                                {item.imagen_url ? (
                                                    <Image
                                                        src={item.imagen_url}
                                                        alt={item.nombre}
                                                        fill
                                                        className="object-cover"
                                                        sizes="80px"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                        <ImageIcon className="h-6 w-6" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h4 className="font-semibold text-sm line-clamp-1">{item.nombre}</h4>
                                                    {item.variante_nombre && (
                                                        <p className="text-xs text-muted-foreground">{item.variante_nombre}</p>
                                                    )}
                                                    <p className="text-xs text-muted-foreground">Unitario: {formatCurrency(item.precio)}</p>
                                                </div>

                                                <div className="flex justify-between items-end">
                                                    <div className="flex items-center gap-2 border border-border rounded-md p-1 h-8">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.producto_variante_id ?? null)}
                                                            disabled={item.quantity <= 1}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6"
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.producto_variante_id ?? null)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => removeItem(item.id, item.producto_variante_id ?? null)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {items.length > 0 && (
                                <div className="p-4 border-t border-border bg-popover space-y-4">
                                    <div className="flex justify-between items-center text-xl font-bold pb-2 border-b">
                                        <span>Total:</span>
                                        <span>{formatCurrency(total)}</span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            onClick={() => {
                                                sendGTMEvent({
                                                    event: 'begin_checkout',
                                                    ecommerce: {
                                                        currency: 'PEN',
                                                        value: total,
                                                        items: items.map(item => ({
                                                            item_id: String(item.id),
                                                            item_name: item.nombre,
                                                            price: item.precio,
                                                            quantity: item.quantity
                                                        }))
                                                    }
                                                })
                                                setView('checkout')
                                            }}
                                            className="w-full h-14 text-lg font-bold shadow-md hover:scale-[1.02] transition-all"
                                        >
                                            Ir a Completar Datos
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleContinueShopping}
                                            className="w-full h-14 text-lg font-bold border-2 shadow-sm hover:scale-[1.02] transition-all"
                                        >
                                            Seguir Comprando
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </SheetContent>
            </Sheet>
        </>
    )
}
