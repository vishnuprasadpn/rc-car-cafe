"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { User, Mail, Phone, ArrowLeft, Save, CheckCircle } from "lucide-react"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Password must be at least 6 characters").optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  // If newPassword is provided, currentPassword and confirmPassword must also be provided
  if (data.newPassword) {
    return data.currentPassword && data.confirmPassword
  }
  return true
}, {
  message: "Current password and confirmation are required when changing password",
  path: ["currentPassword"],
}).refine((data) => {
  // If newPassword is provided, it must match confirmPassword
  if (data.newPassword && data.confirmPassword) {
    return data.newPassword === data.confirmPassword
  }
  return true
}, {
  message: "New password and confirmation must match",
  path: ["confirmPassword"],
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    } else if (status === "authenticated" && session?.user) {
      // Pre-fill form with current user data
      reset({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: "", // Phone not in session, will be fetched from API
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      fetchUserProfile()
    }
  }, [status, session, router, reset])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        reset({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: data.user.phone || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      }
    } catch (error) {
      console.error("Error fetching user profile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data: ProfileForm) => {
    setIsSaving(true)
    setError("")
    setSuccess(false)

    try {
      // Prepare update data
      const updateData: {
        name: string
        phone?: string
        currentPassword?: string
        newPassword?: string
      } = {
        name: data.name,
      }

      if (data.phone) {
        updateData.phone = data.phone
      }

      // If password is being changed
      if (data.newPassword && data.currentPassword) {
        updateData.currentPassword = data.currentPassword
        updateData.newPassword = data.newPassword
      }

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
        setShowPasswordSection(false)
        // Reset password fields
        reset({
          ...data,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        // Optionally refresh session to get updated data
        setTimeout(() => window.location.reload(), 1000)
      } else {
        setError(result.message || "Failed to update profile")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900">

      <div className="max-w-3xl mx-auto py-8 py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center text-gray-400 hover:text-fury-orange mb-4 transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-xl sm:text-3xl font-bold text-white mb-2">Edit Profile</h1>
            <p className="text-xs sm:text-sm text-gray-400">Update your personal information</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
            <div className="px-4 py-5 sm:p-6">
              {success && (
                <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/40 text-green-400 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Profile updated successfully!
                </div>
              )}

              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/40 text-red-400 px-4 py-3 rounded-xl text-sm mb-6 flex items-center gap-2">
                  <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-300">
                    <User className="h-4 w-4 mr-2 text-fury-orange" />
                    Full Name
                  </label>
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    autoComplete="name"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="flex items-center text-sm font-semibold text-gray-300">
                    <Mail className="h-4 w-4 mr-2 text-fury-orange" />
                    Email Address
                  </label>
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    autoComplete="email"
                    disabled
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-gray-400 placeholder-gray-500 cursor-not-allowed opacity-60"
                    placeholder="Enter your email"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="flex items-center text-sm font-semibold text-gray-300">
                    <Phone className="h-4 w-4 mr-2 text-fury-orange" />
                    Phone Number <span className="text-red-400 text-xs ml-1 font-normal">*</span>
                  </label>
                  <input
                    {...register("phone")}
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="Enter your phone number (e.g., +91 99455 76007)"
                    required
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Password Update Section - Available for all users */}
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-300">
                      Change Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPasswordSection(!showPasswordSection)}
                      className="text-xs text-fury-orange hover:text-primary-600 transition-colors"
                    >
                      {showPasswordSection ? "Hide" : "Change Password"}
                    </button>
                  </div>

                    {showPasswordSection && (
                      <>
                        <div className="space-y-2">
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300">
                            Current Password
                          </label>
                          <input
                            {...register("currentPassword")}
                            id="currentPassword"
                            type="password"
                            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 focus:bg-white/10 transition-all duration-300"
                            placeholder="Enter current password"
                          />
                          {errors.currentPassword && (
                            <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                              {errors.currentPassword.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                            New Password
                          </label>
                          <input
                            {...register("newPassword")}
                            id="newPassword"
                            type="password"
                            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 focus:bg-white/10 transition-all duration-300"
                            placeholder="Enter new password (min 6 characters)"
                          />
                          {errors.newPassword && (
                            <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                              {errors.newPassword.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                            Confirm New Password
                          </label>
                          <input
                            {...register("confirmPassword")}
                            id="confirmPassword"
                            type="password"
                            className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 focus:bg-white/10 transition-all duration-300"
                            placeholder="Confirm new password"
                          />
                          {errors.confirmPassword && (
                            <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                              <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                              {errors.confirmPassword.message}
                            </p>
                          )}
                        </div>
                      </>
                    )}
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 sm:px-5 sm:py-2.5 border border-white/20 rounded-lg text-xs sm:text-sm font-medium text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-fury-orange to-primary-600 text-white rounded-lg text-xs sm:text-sm font-semibold hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-fury-orange/25 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
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

