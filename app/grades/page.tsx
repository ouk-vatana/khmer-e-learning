"use client"

import { useLanguage } from "@/lib/language-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockAssignments } from "@/lib/mock-data"

export default function GradesPage() {
  const { t } = useLanguage()

  const gradesByStatus = mockAssignments.reduce(
    (acc, assignment) => {
      const status = assignment.status === "submitted" ? "submitted" : "pending"
      if (!acc[status]) acc[status] = []
      acc[status].push(assignment)
      return acc
    },
    {} as Record<string, typeof mockAssignments>,
  )

  const averageGrade =
    mockAssignments.filter((a) => a.grade !== undefined).reduce((sum, a) => sum + (a.grade || 0), 0) /
      mockAssignments.filter((a) => a.grade !== undefined).length || 0

  return (
    <ProtectedPage requiredRoles={["student"]}>
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("nav.gradesStudent")}</h1>
            <p className="text-gray-600 mt-2">View your grades and performance</p>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-xs text-gray-600">{t("student.gradeAverage")}</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{Math.round(averageGrade)}%</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-xs text-gray-600">Graded</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {mockAssignments.filter((a) => a.grade !== undefined).length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-xs text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">
                  {mockAssignments.filter((a) => !a.grade).length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Graded Assignments */}
          {gradesByStatus.submitted && gradesByStatus.submitted.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("assignment.submitted")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gradesByStatus.submitted.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex justify-between items-center p-3 rounded hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{assignment.title}</p>
                        <p className="text-xs text-gray-600">
                          {t("assignment.dueDate")}: {assignment.dueDate}
                        </p>
                      </div>
                      {assignment.grade && (
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{assignment.grade}%</p>
                          <p className="text-xs text-gray-600">
                            {t("assignment.points")}: {Math.round((assignment.grade / 100) * assignment.points)}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pending Assignments */}
          {gradesByStatus.pending && gradesByStatus.pending.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("assignment.notSubmitted")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {gradesByStatus.pending.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex justify-between items-center p-3 rounded hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{assignment.title}</p>
                        <p className="text-xs text-gray-600">
                          {t("assignment.dueDate")}: {assignment.dueDate}
                        </p>
                      </div>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                        {t("assignment.notSubmitted")}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DashboardLayout>
    </ProtectedPage>
  )
}
