import type { Metadata } from "next"
import { Inter, Bebas_Neue } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import LayoutWrapper from "@/components/layout-wrapper"

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
  return (
    <html lang="en">
      <body className={`${inter.variable} ${bebasNeue.variable} ${inter.className}`}>
        <Providers>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  )
}