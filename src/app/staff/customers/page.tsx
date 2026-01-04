"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Users, Search, Mail, Phone, Calendar, Gift, Eye, UserPlus } from "lucide-react"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  points: number
  createdAt: string
  totalBookings: number
  lastBooking?: string
}

export default function StaffCustomersPage() {
  const { data: session, status } = useSession()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

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
    } finally {
      setIsLoading(false)
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
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.phone && customer.phone.includes(searchTerm))
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
            <p className="mt-4 text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white flex items-center">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-fury-orange mr-2 sm:mr-3" />
                  Customer Management
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">Manage customer accounts and view their activity</p>
              </div>
              <a
                href="/staff/register-customer"
                className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-fury-orange text-white rounded-lg hover:bg-fury-orange/90 transition-all shadow-lg hover:shadow-fury-orange/25 text-xs sm:text-sm font-semibold"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Register New Customer
              </a>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="max-w-md">
                <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
                  Search Customers
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent text-white placeholder-gray-400 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Customers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-300">No customers found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm 
                    ? "Try adjusting your search criteria"
                    : "No customers have been registered yet"
                  }
                </p>
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div key={customer.id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{customer.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-300">
                          <Mail className="h-4 w-4 mr-2" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center text-sm text-gray-300">
                            <Phone className="h-4 w-4 mr-2" />
                            {customer.phone}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-300">
                          <Calendar className="h-4 w-4 mr-2" />
                          Joined {formatDate(customer.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center text-lg sm:text-2xl font-bold text-fury-orange mb-1">
                          <Gift className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                          {customer.points}
                        </div>
                        <div className="text-[10px] sm:text-xs text-gray-400">Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-2xl font-bold text-blue-400 mb-1">
                          {customer.totalBookings}
                        </div>
                        <div className="text-xs text-gray-400">Bookings</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-white/10 text-gray-300 px-2 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-white/20 transition-colors flex items-center justify-center border border-white/20">
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                      View Details
                    </button>
                    <button className="flex-1 bg-fury-orange/20 text-fury-orange px-2 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium hover:bg-fury-orange/30 transition-colors flex items-center justify-center border border-fury-orange/30">
                      <Gift className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                      Allocate Points
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary Stats */}
          {filteredCustomers.length > 0 && (
            <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
              <h3 className="text-base sm:text-lg font-medium text-white mb-4">Customer Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-white">{filteredCustomers.length}</div>
                  <div className="text-xs sm:text-sm text-gray-400">Total Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-fury-orange">
                    {filteredCustomers.reduce((sum, customer) => sum + customer.points, 0)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-blue-400">
                    {filteredCustomers.reduce((sum, customer) => sum + customer.totalBookings, 0)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-green-400">
                    {filteredCustomers.filter(customer => customer.points > 0).length}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-400">Active Members</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
