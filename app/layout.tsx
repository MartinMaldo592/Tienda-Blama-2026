import type { Metadata } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutShell } from "@/components/layout-shell";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { createClient } from "@supabase/supabase-js";
import { SmoothScroll } from "@/components/smooth-scroll";
import { AttributionTracker } from "@/components/attribution-tracker";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.blama.shop";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || "GTM-PCKTWQM3";

export const metadata: Metadata = {
  title: {
    default: "Blama Shop | Lo mejor en Tendencias",
    template: "%s | Blama Shop",
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: [
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
  },
  applicationName: "Blama.shop",
  description:
    "Blama Shop es tu tienda online de confianza en Perú. Encuentra lo último en tecnología, hogar y moda con envíos rápidos a todo el país.",
  openGraph: {
    title: "Blama Shop | Lo mejor en Tendencias",
    description:
      "Productos en tendencia con la mejor atención. Tecnología, hogar, moda y más. Envíos a todo el Perú.",
    type: "website",
    locale: "es_ES",
    siteName: "Blama Shop",
    url: siteUrl,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Blama.shop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blama Shop | Lo mejor en Tendencias",
    description:
      "Tienda online en Perú con atención rápida por WhatsApp. Novedades, ofertas y envíos a domicilio.",
    images: ["/twitter-image"],
  },
};

import { unstable_cache } from "next/cache";

const getAnnouncementData = unstable_cache(
  async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    )
    try {
      const { data } = await supabase

        .from("announcement_bar")
        .select("enabled, interval_ms, messages")
        .eq("id", 1)
        .maybeSingle()

      if (!data) return null

      return {
        enabled: Boolean(data.enabled),
        intervalMs: Number(data.interval_ms) || 3500,
        messages: (Array.isArray(data.messages) ? data.messages : []) as string[],
      }
    } catch (err) {
      console.error("Error fetching announcement:", err)
      return null
    }
  },
  ['announcement-bar'],
  { tags: ['announcement'], revalidate: 3600 }
)

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const announcementData = await getAnnouncementData()

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background`}
      >
        <Script id="gtm-script" strategy="lazyOnload">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <AttributionTracker />
        <Providers>

          <SmoothScroll>
            <LayoutShell announcementData={announcementData}>{children}</LayoutShell>
          </SmoothScroll>
        </Providers>
        <SpeedInsights />
        <Toaster position="top-center" visibleToasts={5} expand={true} />
      </body>
    </html>
  );
}
