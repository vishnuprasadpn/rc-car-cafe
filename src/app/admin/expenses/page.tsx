"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { DollarSign, ArrowLeft, Plus, Calendar, Filter, Download } from "lucide-react"
import Navigation from "@/components/navigation"

interface Expense {
  id: string
  date: string
  category: string
  description: string
  amount: number
  paymentMethod: string
  status: string
}

export default function ExpensesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && (session?.user as { role?: string })?.role !== "ADMIN") {
      router.push("/dashboard")
    } else if (status === "authenticated") {
      fetchExpenses()
    }
  }, [status, session, router, startDate, endDate, categoryFilter])

  const fetchExpenses = async () => {
    try {
      // Simulate API call - replace with actual API endpoint
      setLoading(false)
      setExpenses([])
    } catch (error) {
      console.error("Error fetching expenses:", error)
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <Navigation />

      <div className="max-w-7xl mx-auto pt-20 py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center text-gray-400 hover:text-fury-orange mb-4 transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white flex items-center">
                  <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-fury-orange mr-2 sm:mr-3" />
                  Expenses
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-2">Track and manage business expenses</p>
              </div>
              <button className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 transition-all text-sm font-medium">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </button>
            </div>
          </div>

          {/* Date Range and Filters */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="expense-start-date" className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-fury-orange" />
                      Start Date
                    </span>
                    <span className="text-xs text-gray-400 ml-6">Select the beginning of the date range</span>
                  </label>
                  <input
                    type="date"
                    id="expense-start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={endDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 transition-all text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="expense-end-date" className="block text-sm font-medium text-gray-300 mb-2">
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-fury-orange" />
                      End Date
                    </span>
                    <span className="text-xs text-gray-400 ml-6">Select the end of the date range</span>
                  </label>
                  <input
                    type="date"
                    id="expense-end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-fury-orange" />
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 transition-all text-sm"
                  >
                    <option value="all" className="bg-gray-900">All Categories</option>
                    <option value="equipment" className="bg-gray-900">Equipment</option>
                    <option value="maintenance" className="bg-gray-900">Maintenance</option>
                    <option value="utilities" className="bg-gray-900">Utilities</option>
                    <option value="supplies" className="bg-gray-900">Supplies</option>
                    <option value="other" className="bg-gray-900">Other</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <button
                    onClick={fetchExpenses}
                    className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2.5 rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 transition-all text-sm font-medium"
                  >
                    Filter
                  </button>
                  <button
                    onClick={() => {}}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2.5 rounded-lg hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 transition-all"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses List */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              {expenses.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-300">No expenses found</h3>
                  <p className="mt-1 text-sm text-gray-500">Add your first expense to get started</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payment Method</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {expenses.map((expense) => (
                        <tr key={expense.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">
                            {new Date(expense.date).toLocaleDateString('en-IN')}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-white">{expense.category}</td>
                          <td className="px-4 py-3 text-sm text-gray-300">{expense.description}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-white">₹{expense.amount.toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-300">{expense.paymentMethod}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              expense.status === 'paid' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-yellow-500/20 text-yellow-400'
                            }`}>
                              {expense.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

