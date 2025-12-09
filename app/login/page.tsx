"use client"

import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function LoginPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect authenticated users to their dashboard
      router.push(user.role === "educator" ? "/dashboard" : "/dashboard")
    }
  }, [isAuthenticated, isLoading, user, router])

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <div className="text-xl font-bold text-blue-700 leading-none">KOM</div>
              <div className="text-sm text-black font-semibold leading-none">PLEX</div>
            </div>
          </div>
          <p className="mt-2 text-gray-600">Empowering Education in Cambodia</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
