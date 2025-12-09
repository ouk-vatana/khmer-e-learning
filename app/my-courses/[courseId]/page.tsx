"use client"

import { CourseView } from "@/components/student/course-view"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"

interface CoursePageProps {
  params: {
    courseId: string
  }
}

export default function CoursePage({ params }: CoursePageProps) {
  return (
    <ProtectedPage requiredRoles={["student"]}>
      <DashboardLayout>
        <CourseView courseId={params.courseId} />
      </DashboardLayout>
    </ProtectedPage>
  )
}
