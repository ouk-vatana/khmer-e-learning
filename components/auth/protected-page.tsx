"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import type { UserRole } from "@/lib/auth-context"

interface ProtectedPageProps {
  children: React.ReactNode
  requiredRoles: UserRole[]
}

export function ProtectedPage({ children, requiredRoles }: ProtectedPageProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!user) {
        router.push("/login")
        return
      }

      // If user role is not allowed, redirect to their home dashboard
      if (!requiredRoles.includes(user.role)) {
        router.push(user.role === "educator" ? "/dashboard" : "/dashboard")
      }
    }
  }, [user, isLoading, requiredRoles, router])

  // Show loading state
  if (isLoading || !user || !requiredRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
