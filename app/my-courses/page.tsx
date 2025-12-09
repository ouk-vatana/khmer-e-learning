"use client"

import { MyCoursesView } from "@/components/student/my-courses"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"

export default function MyCoursesPage() {
  return (
    <ProtectedPage requiredRoles={["student"]}>
      <DashboardLayout>
        <MyCoursesView />
      </DashboardLayout>
    </ProtectedPage>
  )
}
