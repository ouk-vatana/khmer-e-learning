"use client"

import { LessonPlayer } from "@/components/student/lesson-player"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"

interface LessonPageProps {
  params: {
    courseId: string
    lessonId: string
  }
}

export default function LessonPage({ params }: LessonPageProps) {
  return (
    <ProtectedPage requiredRoles={["student"]}>
      <DashboardLayout>
        <LessonPlayer courseId={params.courseId} lessonId={params.lessonId} />
      </DashboardLayout>
    </ProtectedPage>
  )
}
