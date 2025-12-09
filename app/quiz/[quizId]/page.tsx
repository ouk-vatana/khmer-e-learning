"use client"

import { QuizPlayer } from "@/components/student/quiz-player"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"

interface QuizPageProps {
  params: {
    quizId: string
  }
}

export default function QuizPage({ params }: QuizPageProps) {
  return (
    <ProtectedPage requiredRoles={["student"]}>
      <DashboardLayout>
        <QuizPlayer quizId={params.quizId} />
      </DashboardLayout>
    </ProtectedPage>
  )
}
