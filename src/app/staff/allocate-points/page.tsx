"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Navigation from "@/components/navigation"
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

  if (status === "loading") {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
    </div>
  }

  if (!session || session.user.role !== "STAFF") {
    redirect("/auth/signin")
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

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

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/staff/customers")
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers)
        setFilteredCustomers(data.customers)
      }
    } catch (error) {
      console.error("Error fetching customers:", error)
    }
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
          allocatedBy: session.user.id
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
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-20 py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Gift className="h-8 w-8 text-red-600 mr-3" />
              Allocate Points
            </h1>
            <p className="text-gray-600 mt-2">Award points to customers for achievements, referrals, or special occasions</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-md flex items-center ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
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
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border border-white/20">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 text-red-600 mr-2" />
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
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
                    />
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {filteredCustomers.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No customers found</p>
                  ) : (
                    <div className="space-y-2">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          onClick={() => setSelectedCustomer(customer)}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedCustomer?.id === customer.id
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium text-gray-900">{customer.name}</h4>
                              <p className="text-sm text-gray-500">{customer.email}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-red-600">
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
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border border-white/20">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Allocate Points
                </h3>

                {selectedCustomer ? (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Selected:</strong> {selectedCustomer.name} ({selectedCustomer.email})
                    </p>
                    <p className="text-sm text-green-600">
                      Current points: {selectedCustomer.points}
                    </p>
                  </div>
                ) : (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Please select a customer from the list to allocate points
                    </p>
                  </div>
                )}

                <form onSubmit={handleAllocatePoints} className="space-y-4">
                  <div>
                    <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
                      placeholder="Enter points (1-1000)"
                    />
                  </div>

                  <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Allocation
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
                      placeholder="e.g., Referral bonus, Birthday gift, Achievement reward..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedCustomer || !points || !reason || isLoading}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
