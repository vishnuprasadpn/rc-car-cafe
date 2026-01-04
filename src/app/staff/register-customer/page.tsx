"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { UserPlus, Mail, Phone, User, AlertCircle, CheckCircle } from "lucide-react"

export default function RegisterCustomerPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: ""
  })

  if (status === "loading") {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
        <p className="mt-4 text-gray-300">Loading...</p>
      </div>
    </div>
  }

  // Allow both ADMIN and STAFF to register customers
  const userRole = (session?.user as { role?: string })?.role
  if (!session || !session.user || (userRole !== "STAFF" && userRole !== "ADMIN")) {
    redirect("/auth/signin")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: "CUSTOMER"
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Customer registered successfully!' })
        setFormData({ name: "", email: "", phone: "", password: "" })
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to register customer' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-xl sm:text-3xl font-bold text-white flex items-center">
              <UserPlus className="h-6 w-6 sm:h-8 sm:w-8 text-fury-orange mr-2 sm:mr-3" />
              Register New Customer
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">
              {userRole === "ADMIN" 
                ? "Add a new customer to the Fury Road RC Club" 
                : "Add a new customer to the Fury Road RC Club"}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center ${
                  message.type === 'success' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/40' 
                    : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}>
                  {message.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mr-2" />
                  )}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="h-4 w-4 inline mr-1" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white placeholder-gray-400 transition-all"
                      placeholder="Enter customer's full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white placeholder-gray-400 transition-all"
                      placeholder="customer@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone Number <span className="text-red-400 text-sm">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      id="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white placeholder-gray-400 transition-all"
                      placeholder="+91 99455 76007"
                      pattern="[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}"
                      title="Please enter a valid phone number (e.g., +91 99455 76007)"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white placeholder-gray-400 transition-all"
                      placeholder="Set initial password"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-5 py-2.5 border border-white/20 rounded-lg text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-fury-orange focus:ring-offset-2 focus:ring-offset-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 bg-fury-orange text-white rounded-lg text-xs sm:text-sm font-semibold hover:bg-fury-orange/90 focus:outline-none focus:ring-2 focus:ring-fury-orange focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-all shadow-lg hover:shadow-fury-orange/25"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Registering...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register Customer
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
