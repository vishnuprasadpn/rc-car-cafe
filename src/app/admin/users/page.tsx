"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Users, Search, Filter, Phone, Calendar, Trophy, CalendarCheck, Trash2, UserPlus, Edit, Save, X } from "lucide-react"
import { AUTHORIZED_DELETE_ADMIN_EMAIL } from "@/lib/admin-auth"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

interface User {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  createdAt: string
  bookingsCount: number
  pointsCount: number
}

const editUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.enum(["CUSTOMER", "STAFF", "ADMIN"]),
})

type EditUserForm = z.infer<typeof editUserSchema>

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [error, setError] = useState("")
  
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<EditUserForm>({
    resolver: zodResolver(editUserSchema),
  })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (roleFilter) params.append('role', roleFilter)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/admin/users?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setFilteredUsers(data.users)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && (session?.user as { role?: string })?.role !== "ADMIN") {
      router.push("/dashboard")
    } else if (status === "authenticated" && (session?.user as { role?: string })?.role === "ADMIN") {
      fetchUsers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router, roleFilter, searchTerm])

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-red-500/20 text-red-400 border-red-500/40"
      case "STAFF":
        return "bg-blue-500/20 text-blue-400 border-blue-500/40"
      case "CUSTOMER":
        return "bg-green-500/20 text-green-400 border-green-500/40"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/40"
    }
  }

  const getRoleStats = () => {
    const stats = {
      total: users.length,
      admin: users.filter(u => u.role === "ADMIN").length,
      staff: users.filter(u => u.role === "STAFF").length,
      customer: users.filter(u => u.role === "CUSTOMER").length
    }
    return stats
  }

  const stats = getRoleStats()

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return
    }

    try {
      setDeletingUserId(userId)
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchUsers()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      alert("An error occurred while deleting the user")
    } finally {
      setDeletingUserId(null)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUserId(user.id)
    resetEdit({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role as "CUSTOMER" | "STAFF" | "ADMIN",
    })
  }

  const handleCancelEdit = () => {
    setEditingUserId(null)
    resetEdit()
    setError("")
  }

  const onSubmitEdit = async (data: EditUserForm) => {
    if (!editingUserId) return

    try {
      setError("")
      const response = await fetch(`/api/admin/users/${editingUserId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchUsers()
        handleCancelEdit()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to update user")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      setError("An error occurred while updating the user")
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-fury-orange border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-300 font-medium">Loading users...</p>
        </div>
      </div>
    )
  }

  if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white mb-2">User Management</h1>
                <p className="text-xs sm:text-sm text-gray-400">Manage all users of Fury Road RC Club</p>
              </div>
              <Link
                href="/staff/register-customer"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-fury-orange to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-fury-orange/25 text-sm font-semibold"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Customer
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Total Users</p>
                  <p className="text-xl sm:text-3xl font-bold text-white">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-bl-full"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Admins</p>
                  <p className="text-xl sm:text-3xl font-bold text-white">{stats.admin}</p>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Staff</p>
                  <p className="text-xl sm:text-3xl font-bold text-white">{stats.staff}</p>
                </div>
              </div>
            </div>

            <div className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300 overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-bl-full"></div>
              <div className="relative p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400 mb-1">Customers</p>
                  <p className="text-xl sm:text-3xl font-bold text-white">{stats.customer}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent"
                />
              </div>

              {/* Role Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent appearance-none"
                >
                  <option value="">All Roles</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STAFF">Staff</option>
                  <option value="CUSTOMER">Customer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-500/20 border border-red-500/40 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Bookings</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Points</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full mb-4 border border-white/10">
                          <Users className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-400 font-medium">No users found</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {searchTerm || roleFilter ? "Try adjusting your search or filters" : "Users will appear here once they register"}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-white/5 transition-colors">
                        {editingUserId === user.id ? (
                          // Edit mode
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-fury-orange to-primary-600 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <input
                                    type="text"
                                    {...registerEdit("name")}
                                    className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange mb-1"
                                  />
                                  {editErrors.name && (
                                    <p className="text-red-400 text-xs">{editErrors.name.message}</p>
                                  )}
                                  <input
                                    type="email"
                                    {...registerEdit("email")}
                                    className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none focus:ring-2 focus:ring-fury-orange mt-1"
                                  />
                                  {editErrors.email && (
                                    <p className="text-red-400 text-xs">{editErrors.email.message}</p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="text"
                                {...registerEdit("phone")}
                                className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange"
                                placeholder="Phone (optional)"
                              />
                              {editErrors.phone && (
                                <p className="text-red-400 text-xs">{editErrors.phone.message}</p>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                {...registerEdit("role")}
                                className="px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange"
                              >
                                <option value="CUSTOMER">CUSTOMER</option>
                                <option value="STAFF">STAFF</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                              {editErrors.role && (
                                <p className="text-red-400 text-xs">{editErrors.role.message}</p>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-300">
                                <CalendarCheck className="h-4 w-4 mr-2 text-fury-orange" />
                                {user.bookingsCount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-300">
                                <Trophy className="h-4 w-4 mr-2 text-yellow-400" />
                                {user.pointsCount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={handleSubmitEdit(onSubmitEdit)}
                                className="text-green-400 hover:text-green-300 transition-colors"
                                title="Save changes"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="text-gray-400 hover:text-gray-300 transition-colors"
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </td>
                          </>
                        ) : (
                          // View mode
                          <>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-br from-fury-orange to-primary-600 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">{user.name}</div>
                                  <div className="text-xs text-gray-400">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-300">
                                {user.phone ? (
                                  <div className="flex items-center text-gray-300">
                                    <Phone className="h-4 w-4 mr-2" />
                                    {user.phone}
                                  </div>
                                ) : (
                                  <span className="text-gray-500">No phone</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(user.role)}`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-300">
                                <CalendarCheck className="h-4 w-4 mr-2 text-fury-orange" />
                                {user.bookingsCount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-300">
                                <Trophy className="h-4 w-4 mr-2 text-yellow-400" />
                                {user.pointsCount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                {new Date(user.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleEdit(user)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                title="Edit user"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              {session?.user?.email?.toLowerCase() === AUTHORIZED_DELETE_ADMIN_EMAIL.toLowerCase() && 
                               user.email.toLowerCase() !== AUTHORIZED_DELETE_ADMIN_EMAIL.toLowerCase() && 
                               user.bookingsCount === 0 && 
                               user.pointsCount === 0 && (
                                <button
                                  onClick={() => handleDeleteUser(user.id, user.name)}
                                  disabled={deletingUserId === user.id}
                                  className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Delete user (only if no bookings or points)"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

