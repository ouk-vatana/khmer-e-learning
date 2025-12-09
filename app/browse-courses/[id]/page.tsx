"use client"

import { CourseDetail } from "@/components/student/course-detail"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"

interface CourseDetailPageProps {
  params: {
    id: string
  }
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  return (
    <ProtectedPage requiredRoles={["student"]}>
      <DashboardLayout>
        <CourseDetail courseId={params.id} />
      </DashboardLayout>
    </ProtectedPage>
  )
}
