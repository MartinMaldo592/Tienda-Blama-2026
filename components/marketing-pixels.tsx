"use client"

import { usePathname } from "next/navigation"
import Script from "next/script"
import { AttributionTracker } from "@/components/attribution-tracker"

export function MarketingPixels() {
    const pathname = usePathname()
    
    // Si la ruta comienza con /admin, no renderizamos ningún script de tracking
    if (pathname && pathname.startsWith("/admin")) {
        return null
    }

    const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-PCKTWQM3"

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
                `}
            </Script>

            {/* Google Tag Manager (GTM) script */}
            <Script id="gtm-script" strategy="lazyOnload">
                {`
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','${GTM_ID}');
                `}
            </Script>

            {/* GTM Noscript fallback */}
            <noscript>
                <iframe
                    src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                    height="0"
                    width="0"
                    style={{ display: "none", visibility: "hidden" }}
                />
            </noscript>

            {/* Atribución de UTMs y campañas */}
            <AttributionTracker />
        </>
    )
}
