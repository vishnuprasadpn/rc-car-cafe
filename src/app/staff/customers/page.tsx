"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import Navigation from "@/components/navigation"
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
    if (status !== "loading" && session && session.user.role === "STAFF") {
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
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
    </div>
  }

  if (!session || session.user.role !== "STAFF") {
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
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Navigation />
      
      <div className="max-w-7xl mx-auto pt-20 py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Users className="h-8 w-8 text-red-600 mr-3" />
                  Customer Management
                </h1>
                <p className="text-gray-600 mt-2">Manage customer accounts and view their activity</p>
              </div>
              <a
                href="/staff/register-customer"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Register New Customer
              </a>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border border-white/20 mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="max-w-md">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
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
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">No customers found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm 
                    ? "Try adjusting your search criteria"
                    : "No customers have been registered yet"
                  }
                </p>
              </div>
            ) : (
              filteredCustomers.map((customer) => (
                <div key={customer.id} className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{customer.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {customer.phone}
                          </div>
                        )}
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          Joined {formatDate(customer.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center text-2xl font-bold text-red-600 mb-1">
                          <Gift className="h-5 w-5 mr-1" />
                          {customer.points}
                        </div>
                        <div className="text-xs text-gray-500">Points</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                          {customer.totalBookings}
                        </div>
                        <div className="text-xs text-gray-500">Bookings</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                    <button className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-red-200 transition-colors flex items-center justify-center">
                      <Gift className="h-4 w-4 mr-1" />
                      Allocate Points
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary Stats */}
          {filteredCustomers.length > 0 && (
            <div className="mt-8 bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border border-white/20 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{filteredCustomers.length}</div>
                  <div className="text-sm text-gray-500">Total Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {filteredCustomers.reduce((sum, customer) => sum + customer.points, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredCustomers.reduce((sum, customer) => sum + customer.totalBookings, 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredCustomers.filter(customer => customer.points > 0).length}
                  </div>
                  <div className="text-sm text-gray-500">Active Members</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
