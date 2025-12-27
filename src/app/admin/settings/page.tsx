"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Users, Settings, Shield, UserPlus, Edit, Trash2, Save, X } from "lucide-react"
import { AUTHORIZED_DELETE_ADMIN_EMAIL } from "@/lib/admin-auth"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

interface AdminUser {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  createdAt: string
  lastLoginAt: string | null
  authMethod: string | null
}

const editAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number format"),
})

const createAdminSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Invalid phone number format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "STAFF"]),
})

type EditAdminForm = z.infer<typeof editAdminSchema>
type CreateAdminForm = z.infer<typeof createAdminSchema>

export default function AdminSettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [staff, setStaff] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null)
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showAddAdminForm, setShowAddAdminForm] = useState(false)
  const [creatingAdmin, setCreatingAdmin] = useState(false)
  
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors },
  } = useForm<EditAdminForm>({
    resolver: zodResolver(editAdminSchema),
  })

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CreateAdminForm>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      role: "ADMIN",
    },
  })

  const fetchAdminsAndStaff = async () => {
    try {
      setLoading(true)
      const [adminsResponse, staffResponse] = await Promise.all([
        fetch("/api/admin/users?role=ADMIN"),
        fetch("/api/admin/users?role=STAFF")
      ])
      
      if (adminsResponse.ok) {
        const data = await adminsResponse.json()
        setAdmins(data.users)
      }
      
      if (staffResponse.ok) {
        const data = await staffResponse.json()
        setStaff(data.users)
      }
    } catch (error) {
      console.error("Error fetching admins and staff:", error)
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
      fetchAdminsAndStaff()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router])

  const handleEdit = (admin: AdminUser) => {
    setEditingAdminId(admin.id)
    setEditingAdmin(admin)
    resetEdit({
      name: admin.name,
      email: admin.email,
      phone: admin.phone || "",
    })
  }

  const handleCancelEdit = () => {
    setEditingAdminId(null)
    setEditingAdmin(null)
    resetEdit()
  }

  const onSubmitEdit = async (data: EditAdminForm) => {
    if (!editingAdminId) return

    setSubmitting(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/users/${editingAdminId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchAdminsAndStaff()
        handleCancelEdit()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to update admin")
      }
    } catch (error) {
      console.error("Error updating admin:", error)
      setError("Failed to update admin. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteAdmin = async (adminId: string, adminName: string) => {
    if (!confirm(`Are you sure you want to delete admin "${adminName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${adminId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchAdminsAndStaff()
      } else {
        const errorData = await response.json()
        alert(errorData.message || "Failed to delete admin")
      }
    } catch (error) {
      console.error("Error deleting admin:", error)
      alert("Failed to delete admin. Please try again.")
    }
  }

  const onSubmitCreate = async (data: CreateAdminForm) => {
    setCreatingAdmin(true)
    setError("")

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchAdminsAndStaff()
        setShowAddAdminForm(false)
        resetCreate()
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to create admin")
      }
    } catch (error) {
      console.error("Error creating admin:", error)
      setError("Failed to create admin. Please try again.")
    } finally {
      setCreatingAdmin(false)
    }
  }

  if (!session || !session.user || (session.user as { role?: string }).role !== "ADMIN") {
    return null
  }

  // Only master admin can access this page
  const userEmail = (session.user as { email?: string }).email
  const isMasterAdmin = userEmail?.toLowerCase() === "vishnuprasad1990@gmail.com"

  if (!isMasterAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-red-500/20 backdrop-blur-lg border border-red-500/40 rounded-xl p-6 text-center">
              <Shield className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
              <p className="text-gray-400">Only the master admin can access this page.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-white mb-2">Admin Settings</h1>
                <p className="text-xs sm:text-sm text-gray-400">Manage admin users and system settings</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/40 text-red-400 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Admin Users Section */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl mb-6">
            <div className="px-6 py-4 border-b border-white/20 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Shield className="h-5 w-5 mr-2 text-fury-orange" />
                Admin Users
              </h2>
              <button
                onClick={() => {
                  setShowAddAdminForm(!showAddAdminForm)
                  setError("")
                  if (!showAddAdminForm) {
                    resetCreate()
                  }
                }}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-fury-orange to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-fury-orange/25 text-sm font-semibold"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {showAddAdminForm ? "Cancel" : "Add New Admin"}
              </button>
            </div>
            <div className="p-6">
              {/* Add Admin Form */}
              {showAddAdminForm && (
                <div className="mb-6 bg-white/5 border border-white/20 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Create New Admin/Staff</h3>
                  <form onSubmit={handleSubmitCreate(onSubmitCreate)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="create-name" className="block text-sm font-medium text-gray-300 mb-2">
                          Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="create-name"
                          type="text"
                          {...registerCreate("name")}
                          className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent"
                          placeholder="Enter name"
                        />
                        {createErrors.name && (
                          <p className="text-red-400 text-xs mt-1">{createErrors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="create-email" className="block text-sm font-medium text-gray-300 mb-2">
                          Email <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="create-email"
                          type="email"
                          {...registerCreate("email")}
                          className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent"
                          placeholder="Enter email"
                        />
                        {createErrors.email && (
                          <p className="text-red-400 text-xs mt-1">{createErrors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="create-phone" className="block text-sm font-medium text-gray-300 mb-2">
                          Phone <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="create-phone"
                          type="tel"
                          {...registerCreate("phone")}
                          className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent"
                          placeholder="Enter phone number"
                        />
                        {createErrors.phone && (
                          <p className="text-red-400 text-xs mt-1">{createErrors.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="create-password" className="block text-sm font-medium text-gray-300 mb-2">
                          Password <span className="text-red-400">*</span>
                        </label>
                        <input
                          id="create-password"
                          type="password"
                          {...registerCreate("password")}
                          className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent"
                          placeholder="Enter password (min 6 characters)"
                        />
                        {createErrors.password && (
                          <p className="text-red-400 text-xs mt-1">{createErrors.password.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="create-role" className="block text-sm font-medium text-gray-300 mb-2">
                          Role <span className="text-red-400">*</span>
                        </label>
                        <select
                          id="create-role"
                          {...registerCreate("role")}
                          className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent"
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="STAFF">STAFF</option>
                        </select>
                        {createErrors.role && (
                          <p className="text-red-400 text-xs mt-1">{createErrors.role.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddAdminForm(false)
                          resetCreate()
                        }}
                        className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={creatingAdmin}
                        className="px-6 py-2 bg-gradient-to-r from-fury-orange to-primary-600 text-white rounded-lg text-sm font-semibold hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-fury-orange/25 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {creatingAdmin ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                            Creating...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Create Admin
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-fury-orange"></div>
                  <p className="text-gray-400 mt-4">Loading admins...</p>
                </div>
              ) : admins.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No admin users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/10">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Auth Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Last Login
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white/5 divide-y divide-white/10">
                      {admins.map((admin) => (
                        <tr key={admin.id} className="hover:bg-white/10 transition-colors">
                          {editingAdminId === admin.id ? (
                            <>
                              <td className="px-6 py-4">
                                <input
                                  {...registerEdit("name")}
                                  type="text"
                                  className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent transition-all"
                                />
                                {editErrors.name && (
                                  <p className="mt-1 text-xs text-red-400">{editErrors.name.message}</p>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  {...registerEdit("email")}
                                  type="email"
                                  className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent transition-all"
                                />
                                {editErrors.email && (
                                  <p className="mt-1 text-xs text-red-400">{editErrors.email.message}</p>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <input
                                  {...registerEdit("phone")}
                                  type="tel"
                                  className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-fury-orange focus:border-transparent transition-all"
                                />
                                {editErrors.phone && (
                                  <p className="mt-1 text-xs text-red-400">{editErrors.phone.message}</p>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-300">
                                {admin.authMethod || "Email/Password"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-300">
                                {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString() : "Never"}
                              </td>
                              <td className="px-6 py-4 text-sm font-medium space-x-2">
                                <button
                                  onClick={handleSubmitEdit(onSubmitEdit)}
                                  disabled={submitting}
                                  className="text-green-400 hover:text-green-300 transition-colors"
                                  title="Save"
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
                            <>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-white">{admin.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">{admin.email}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">{admin.phone || "N/A"}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">{admin.authMethod || "Email/Password"}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">
                                  {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleDateString() : "Never"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button
                                  onClick={() => handleEdit(admin)}
                                  className="text-blue-400 hover:text-blue-300 transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                {admin.email.toLowerCase() !== AUTHORIZED_DELETE_ADMIN_EMAIL.toLowerCase() && (
                                  <button
                                    onClick={() => handleDeleteAdmin(admin.id, admin.name)}
                                    className="text-red-400 hover:text-red-300 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* System Settings Section - Placeholder for future settings */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-6 py-4 border-b border-white/20">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <Settings className="h-5 w-5 mr-2 text-fury-orange" />
                System Settings
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-400 text-sm">System settings will be available here in the future.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

