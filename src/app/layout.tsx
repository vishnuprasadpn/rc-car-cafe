import type { Metadata } from "next"
import Script from "next/script"
import { Inter, Bebas_Neue } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
import { Providers } from "@/components/providers"
import LayoutWrapper from "@/components/layout-wrapper"
import { VersionLogger } from "@/components/version-logger"

// Google Analytics Measurement ID - fallback for production
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-X14C8E032X"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const bebasNeue = Bebas_Neue({ 
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://furyroadclub.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fury Road RC Club - India's Biggest RC Car Racing Experience in Bangalore",
    template: "%s | Fury Road RC Club",
  },
  description:
    "Experience India's biggest indoor RC car racing at Fury Road RC Club, Bangalore. 4 professional tracks, hobby & toy grade cars, birthday parties, corporate events & cafe. Book your session now!",
  keywords: [
    "RC car racing Bangalore",
    "RC car racing near me",
    "indoor RC racing",
    "remote control car racing",
    "Fury Road RC Club",
    "RC tracks Bangalore",
    "birthday party venue Bangalore",
    "corporate events Bangalore",
    "indoor gaming Bangalore",
    "things to do in Bangalore",
    "fun activities Bangalore",
    "RC car cafe",
    "hobby grade RC cars",
    "RC gaming club",
    "family fun Bangalore",
    "kids activities Bangalore",
    "weekend activities Bangalore",
  ],
  authors: [{ name: "Fury Road RC Club" }],
  creator: "Fury Road RC Club",
  publisher: "Fury Road RC Club",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Fury Road RC Club",
    title: "Fury Road RC Club - India's Biggest RC Car Racing Experience",
    description:
      "Experience India's biggest indoor RC car racing at Fury Road RC Club, Bangalore. 4 professional tracks, hobby & toy grade cars, birthday parties & more.",
    images: [
      {
        url: "/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_2.jpg",
        width: 1200,
        height: 630,
        alt: "Fury Road RC Club - RC Car Racing in Bangalore",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fury Road RC Club - India's Biggest RC Car Racing Experience",
    description:
      "Experience India's biggest indoor RC car racing at Fury Road RC Club, Bangalore. Book your session now!",
    images: ["/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_2.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || ""
  
  // Extract domain from app URL (e.g., https://furyroadrc.com -> furyroadrc.com)
  // This ensures cookies are set for the custom domain, not vercel.app
  const getCookieDomain = () => {
    if (!appUrl) return "auto"
    try {
      const url = new URL(appUrl)
      const hostname = url.hostname
      // Remove 'www.' if present and use the root domain
      const domain = hostname.replace(/^www\./, "")
      // For production domains, use the root domain (e.g., furyroadrc.com)
      // This allows cookies to work across subdomains
      return domain.startsWith("localhost") ? "auto" : `.${domain.split(".").slice(-2).join(".")}`
    } catch {
      return "auto"
    }
  }

  const cookieDomain = getCookieDomain()

  return (
    <html lang="en">
      <head>
        {/* Google Analytics - placed in head as recommended by Google */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                ${cookieDomain !== "auto" ? `cookie_domain: '${cookieDomain}',` : ""}
                cookie_flags: 'SameSite=None;Secure',
                send_page_view: true
              });
              gtag('config', 'AW-17896637104');
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${bebasNeue.variable} ${inter.className}`}>
        {/* Organization & LocalBusiness JSON-LD for site-wide SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Fury Road RC Club",
              description:
                "India's biggest indoor RC car racing experience in Bangalore. 4 professional tracks, hobby & toy grade cars, birthday parties, corporate events & cafe.",
              url: siteUrl,
              logo: `${siteUrl}/Furyroad.png`,
              image: `${siteUrl}/rc-cars/Lucid_Origin_Ultrarealistic_cinematic_photo_of_an_RC_car_drift_2.jpg`,
              telephone: "+91-9876543210",
              address: {
                "@type": "PostalAddress",
                streetAddress:
                  "FuryRoad RC Club, Yelenahalli Main Rd, Akshayanagara East, Akshayanagar",
                addressLocality: "Bengaluru",
                addressRegion: "Karnataka",
                postalCode: "560114",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 12.8783,
                longitude: 77.5905,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
                  opens: "11:00",
                  closes: "21:00",
                },
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Saturday", "Sunday"],
                  opens: "10:00",
                  closes: "22:00",
                },
              ],
              priceRange: "₹199 - ₹1099",
              sameAs: [
                "https://www.instagram.com/furyroad.club/",
                "https://www.youtube.com/@FuryroadRCclub",
              ],
            }),
          }}
        />
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
        <VersionLogger />
        <Analytics />
      </body>
    </html>
  )
}