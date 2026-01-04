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
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

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
                gtag('config', '${gaId}');
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