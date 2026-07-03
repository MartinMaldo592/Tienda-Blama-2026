"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Script from "next/script"
import { AttributionTracker } from "@/components/attribution-tracker"
import { createClient } from "@/lib/supabase.client"

type ActivePixel = {
    clave: string
    pixel_id: string
    enabled: boolean
}

export function MarketingPixels() {
    const pathname = usePathname()
    const [pixels, setPixels] = useState<ActivePixel[]>([])
    const [loading, setLoading] = useState(true)

    // Si la ruta comienza con /admin, no cargamos nada de tracking
    const isAdmin = pathname?.startsWith("/admin")

    useEffect(() => {
        if (isAdmin) {
            setLoading(false)
            return
        }

        const fetchPixels = async () => {
            try {
                const supabase = createClient()
                const { data, error } = await (supabase.from("marketing_pixels" as any) as any)
                    .select("clave, pixel_id, enabled")

                if (!error && data) {
                    setPixels(data as ActivePixel[])
                }
            } catch (err) {
                console.error("Error fetching marketing pixels:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchPixels()
    }, [isAdmin])

    if (isAdmin || loading) {
        return null
    }

    const gtm = pixels.find(p => p.clave === "gtm" && p.enabled && p.pixel_id && p.pixel_id.trim() !== "")
    const facebook = pixels.find(p => p.clave === "facebook")
    const tiktok = pixels.find(p => p.clave === "tiktok")
    const ga4 = pixels.find(p => p.clave === "ga4")

    const fbId = facebook?.pixel_id?.trim() || ""
    const ttId = tiktok?.pixel_id?.trim() || ""
    const gaId = ga4?.pixel_id?.trim() || ""

    return (
        <>
            {/* Polyfill temprano para prevenir ReferenceErrors de ttq en GTM */}
            <Script id="pixel-fallbacks" strategy="beforeInteractive">
                {`
                    window.ttq = window.ttq || [];
                    window.ttq.methods = window.ttq.methods || [];
                    window.ttq.instance = window.ttq.instance || function() { return window.ttq; };
                    window.ttq.load = window.ttq.load || function() {};
                    window.ttq.page = window.ttq.page || function() {};
                    window.ttq.track = window.ttq.track || function() {};
                    
                    // Exponer variables globales para que GTM pueda leer los IDs dinámicamente si los requiere
                    window.metaPixelId = "${fbId}";
                    window.tiktokPixelId = "${ttId}";
                    window.ga4PixelId = "${gaId}";
                `}
            </Script>

            {/* Google Tag Manager (GTM) */}
            {gtm && (
                <>
                    <Script id="gtm-script" strategy="lazyOnload">
                        {`
                            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({
                                'gtm.start': new Date().getTime(),
                                event: 'gtm.js',
                                metaPixelId: '${fbId}',
                                tiktokPixelId: '${ttId}',
                                ga4PixelId: '${gaId}'
                            });var f=d.getElementsByTagName(s)[0],
                            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                            })(window,document,'script','dataLayer','${gtm.pixel_id}');
                        `}
                    </Script>
                    <noscript>
                        <iframe
                            src={`https://www.googletagmanager.com/ns.html?id=${gtm.pixel_id}`}
                            height="0"
                            width="0"
                            style={{ display: "none", visibility: "hidden" }}
                        />
                    </noscript>
                </>
            )}

            {/* Carga Directa (Solo si GTM NO está habilitado, para evitar doble tracking) */}
            {!gtm && (
                <>
                    {/* Google Analytics 4 (GA4) Directo */}
                    {ga4 && ga4.enabled && gaId && (
                        <>
                            <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
                            <Script id="ga4-script" strategy="lazyOnload">
                                {`
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', '${gaId}');
                                `}
                            </Script>
                        </>
                    )}

                    {/* Meta Pixel (Facebook) Directo */}
                    {facebook && facebook.enabled && fbId && (
                        <Script id="facebook-pixel" strategy="lazyOnload">
                            {`
                                !function(f,b,e,v,n,t,s)
                                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                                n.queue=[];t=b.createElement(e);t.async=!0;
                                t.src=v;s=b.getElementsByTagName(e)[0];
                                s.parentNode.insertBefore(t,s)}(window, document,'script',
                                'https://connect.facebook.net/en_US/fbevents.js');
                                fbq('init', '${fbId}');
                                fbq('track', 'PageView');
                            `}
                        </Script>
                    )}

                    {/* TikTok Pixel Directo */}
                    {tiktok && tiktok.enabled && ttId && (
                        <Script id="tiktok-pixel" strategy="lazyOnload">
                            {`
                                !function (w, d, t) {
                                  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var e=0;e<ttq.methods.length;e++)ttq.setAndDefer(ttq,ttq.methods[e]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.mixpanel;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var i=d.createElement("script");i.type="text/javascript",i.async=!0,i.src=r;var a=d.getElementsByTagName("script")[0];a.parentNode.insertBefore(i,a)};
                                  ttq.load('${ttId}');
                                  ttq.page();
                                }(window, document, 'ttq');
                            `}
                        </Script>
                    )}
                </>
            )}

            {/* Atribución de UTMs y campañas */}
            <AttributionTracker />
        </>
    )
}
