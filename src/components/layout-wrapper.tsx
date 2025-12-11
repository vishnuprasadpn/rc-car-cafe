"use client"

import { useSession } from "next-auth/react"
import Sidebar from "@/components/sidebar"
import Footer from "@/components/footer"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  
  // Only apply margin when session is loaded and exists
  const hasSession = status === "authenticated" && session

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <div className={`flex-1 ${hasSession ? 'md:ml-64' : ''}`}>
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  )
}

