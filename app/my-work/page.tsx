"use client"

import { useLanguage } from "@/lib/language-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"
import { Card, CardContent } from "@/components/ui/card"
import { mockAssignments, mockQuizzes } from "@/lib/mock-data"
import Link from "next/link"

export default function MyWorkPage() {
  const { t } = useLanguage()

  return (
    <ProtectedPage requiredRoles={["student"]}>
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("nav.myWork")}</h1>
            <p className="text-gray-600 mt-2">Manage your assignments and quizzes</p>
          </div>

          {/* Assignments */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{t("course.assignments")}</h2>
            <div className="space-y-2">
              {mockAssignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardContent className="pt-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{assignment.title}</p>
                      <p className="text-xs text-gray-600">
                        {t("assignment.dueDate")}: {assignment.dueDate}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          assignment.status === "submitted"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {assignment.status === "submitted" ? t("assignment.submitted") : t("assignment.notSubmitted")}
                      </span>
                      <Link
                        href={`/assignment/${assignment.id}`}
                        className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                      >
                        View
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quizzes */}
          <div>
            <h2 className="text-2xl font-bold mb-4">{t("course.quizzes")}</h2>
            <div className="space-y-2">
              {mockQuizzes.map((quiz) => (
                <Card key={quiz.id}>
                  <CardContent className="pt-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{quiz.title}</p>
                      <p className="text-xs text-gray-600">
                        {quiz.questions} questions • {quiz.timeLimit} min
                      </p>
                    </div>
                    <Link
                      href={`/quiz/${quiz.id}`}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                    >
                      {t("quiz.takeQuiz")}
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedPage>
  )
}
