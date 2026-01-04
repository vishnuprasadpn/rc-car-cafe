"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Navigation from "@/components/navigation"
import { Lock, ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react"

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  code: z.string().length(6, "Code must be 6 digits"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

function ResetPasswordPageContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const emailParam = searchParams.get("email")
    const codeParam = searchParams.get("code")
    if (emailParam && codeParam) {
      setEmail(emailParam)
      setCode(codeParam)
    } else {
      router.push("/auth/forgot-password")
    }
  }, [searchParams, router])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  })

  useEffect(() => {
    if (code) {
      setValue("code", code)
    }
  }, [code, setValue])

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code: data.code,
          newPassword: data.newPassword,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        // Redirect to sign in page after 2 seconds
        setTimeout(() => {
          router.push("/auth/signin?reset=success")
        }, 2000)
      } else {
        setError(result.message || "Failed to reset password")
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!email || !code) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="flex min-h-screen">
        {/* Left Section - Form */}
        <div className="flex-1 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-y-auto">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-fury-orange/20 to-primary-600/20 rounded-2xl mb-4 border border-fury-orange/30 backdrop-blur-sm">
                <Lock className="h-8 w-8 text-fury-orange" />
              </div>
              <h2 className="font-heading text-2xl sm:text-4xl text-white mb-2 uppercase">
                Reset <span className="bg-gradient-to-r from-fury-orange via-fury-orange to-primary-600 bg-clip-text text-transparent">Password</span>
              </h2>
              <p className="text-sm sm:text-base text-gray-400">
                Enter your new password
              </p>
            </div>

            {success ? (
              <div className="bg-green-500/20 backdrop-blur-sm border border-green-500/40 text-green-400 px-4 py-3 rounded-xl text-sm">
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Password reset successfully! Redirecting to sign in...
                </p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                {error && (
                  <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/40 text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                    <div className="w-1 h-4 bg-red-500 rounded-full"></div>
                    {error}
                  </div>
                )}

                <input type="hidden" {...register("code")} value={code} />

                <div className="space-y-2">
                  <label htmlFor="newPassword" className="flex items-center text-sm font-semibold text-gray-300">
                    <Lock className="h-4 w-4 mr-2 text-fury-orange" />
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("newPassword")}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 focus:bg-white/10 transition-all duration-300"
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="flex items-center text-sm font-semibold text-gray-300">
                    <Lock className="h-4 w-4 mr-2 text-fury-orange" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("confirmPassword")}
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 pr-12 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fury-orange/50 focus:border-fury-orange/50 focus:bg-white/10 transition-all duration-300"
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-3.5 text-sm font-bold rounded-xl text-white bg-fury-orange hover:bg-fury-orange/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fury-orange disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-fury-orange/30 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Resetting password...
                      </span>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Reset Password
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center pt-2">
                  <Link
                    href="/auth/signin"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-fury-orange transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-fury-orange"></div>
          <p className="mt-4 text-gray-300">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordPageContent />
    </Suspense>
  )
}

