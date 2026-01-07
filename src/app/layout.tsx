import type { Metadata } from "next"
import Script from "next/script"
import { Inter, Bebas_Neue } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
import { Providers } from "@/components/providers"
import LayoutWrapper from "@/components/layout-wrapper"
import { VersionLogger } from "@/components/version-logger"

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

export const metadata: Metadata = {
  title: "Fury Road RC Club - Indoor Racing Experience",
  description: "Book your slot for an exciting indoor RC car racing experience in Bangalore",
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
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
      <body className={`${inter.variable} ${bebasNeue.variable} ${inter.className}`}>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  ${cookieDomain !== "auto" ? `cookie_domain: '${cookieDomain}',` : ""}
                  cookie_flags: 'SameSite=None;Secure',
                  send_page_view: true
                });
              `}
            </Script>
          </>
        )}
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