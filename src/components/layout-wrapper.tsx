"use client"

import { useSession } from "next-auth/react"
import Sidebar from "@/components/sidebar"
import Footer from "@/components/footer"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <div className={`flex-1 ${session ? 'md:ml-64' : ''}`}>
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

