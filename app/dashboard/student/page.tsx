"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { StudentDashboardOverview } from "@/components/student/dashboard-overview"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function StudentDashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user?.role === "educator") {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full"></div>
        </div>
      </div>
    )
  }

  // Only students see this dashboard
  if (user.role !== "student") {
    return null
  }

  return (
    <DashboardLayout>
      <StudentDashboardOverview />
    </DashboardLayout>
  )
}
