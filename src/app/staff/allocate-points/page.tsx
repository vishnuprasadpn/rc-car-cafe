"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Gift, Users, AlertCircle, CheckCircle, Search } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  points: number
}

export default function AllocatePointsPage() {
  const { data: session, status } = useSession()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [points, setPoints] = useState("")
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/staff/customers")
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers)
        setFilteredCustomers(data.customers)
      }
    } catch {
      console.error("Error fetching customers")
    }
  }

  useEffect(() => {
    if (status !== "loading" && session && session.user && (session.user as { role?: string }).role === "STAFF") {
      fetchCustomers()
    }
  }, [status, session])

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredCustomers(filtered)
    } else {
      setFilteredCustomers(customers)
    }
  }, [searchTerm, customers])

  if (status === "loading") {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
        <p className="mt-4 text-gray-300">Loading...</p>
      </div>
    </div>
  }

  if (!session || !session.user || (session.user as { role?: string }).role !== "STAFF") {
    redirect("/auth/signin")
    return null
  }

  const handleAllocatePoints = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomer || !points || !reason) return

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/staff/allocate-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedCustomer.id,
          points: parseInt(points),
          reason: reason,
          allocatedBy: (session.user as { id: string }).id
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: `Successfully allocated ${points} points to ${selectedCustomer.name}` })
        setPoints("")
        setReason("")
        setSelectedCustomer(null)
        fetchCustomers() // Refresh customer data
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to allocate points' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-xl sm:text-3xl font-bold text-white flex items-center">
              <Gift className="h-6 w-6 sm:h-8 sm:w-8 text-fury-orange mr-2 sm:mr-3" />
              Allocate Points
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-2">Award points to customers for achievements, referrals, or special occasions</p>
          </div>

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Customer Selection */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-white mb-4 flex items-center">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-fury-orange mr-2" />
                  Select Customer
                </h3>

                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search customers by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white placeholder-gray-400 transition-all"
                    />
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {filteredCustomers.length === 0 ? (
                    <p className="text-gray-400 text-center py-4">No customers found</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          onClick={() => setSelectedCustomer(customer)}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedCustomer?.id === customer.id
                              ? 'border-fury-orange bg-fury-orange/20'
                              : 'border-white/20 hover:border-white/30 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-white">{customer.name}</h4>
                              <p className="text-sm text-gray-400">{customer.email}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-fury-orange">
                                {customer.points} pts
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Points Allocation Form */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-white mb-4">
                  Allocate Points
                </h3>

                {selectedCustomer ? (
                  <div className="mb-4 p-3 bg-green-500/20 border border-green-500/40 rounded-lg">
                    <p className="text-sm text-green-400">
                      <strong>Selected:</strong> {selectedCustomer.name} ({selectedCustomer.email})
                    </p>
                    <p className="text-sm text-green-300">
                      Current points: {selectedCustomer.points}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/40 rounded-lg">
                    <p className="text-sm text-yellow-400">
                      Please select a customer from the list to allocate points
                    </p>
                  </div>
                )}

                <form onSubmit={handleAllocatePoints} className="space-y-4">
                  <div>
                    <label htmlFor="points" className="block text-sm font-medium text-gray-300 mb-2">
                      Points to Allocate
                    </label>
                    <input
                      type="number"
                      id="points"
                      value={points}
                      onChange={(e) => setPoints(e.target.value)}
                      min="1"
                      max="1000"
                      required
                      className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white placeholder-gray-400 transition-all"
                      placeholder="Enter points (1-1000)"
                    />
                  </div>

                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">
                      Reason for Allocation
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                      rows={3}
                      className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white placeholder-gray-400 transition-all"
                      placeholder="e.g., Referral bonus, Birthday gift, Achievement reward..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedCustomer || !points || !reason || isLoading}
                    className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-fury-orange text-white rounded-md hover:bg-fury-orange/90 focus:outline-none focus:ring-2 focus:ring-fury-orange focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg hover:shadow-fury-orange/25 text-xs sm:text-sm font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Allocating...
                      </>
                    ) : (
                      <>
                        <Gift className="h-4 w-4 mr-2" />
                        Allocate Points
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
