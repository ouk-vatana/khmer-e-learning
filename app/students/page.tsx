"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"
import { useLanguage } from "@/lib/language-context"
import {
  getCoursesByEducator,
  getEnrollmentsByCourse,
  getCourseById,
  type Enrollment,
} from "@/lib/data-service"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StudentsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const { t } = useLanguage()
  const [courses, setCourses] = useState<any[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && user?.role !== "educator") {
      router.push("/dashboard")
    }
    if (user?.role === "educator") {
      const educatorCourses = getCoursesByEducator(user.id)
      setCourses(educatorCourses)
      if (educatorCourses.length > 0) {
        setSelectedCourseId(educatorCourses[0].id)
      }
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <ProtectedPage requiredRoles={["educator"]}>
        <DashboardLayout>
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full"></div>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedPage>
    )
  }

  return (
    <ProtectedPage requiredRoles={["educator"]}>
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("nav.students")}</h1>
            <p className="text-gray-600 mt-2">View enrolled students and their progress</p>
          </div>

          {courses.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-12">
                <p className="text-gray-600">You don't have any courses yet.</p>
                <a
                  href="/courses/create"
                  className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Your First Course
                </a>
              </CardContent>
            </Card>
          ) : (
            <Tabs value={selectedCourseId || ""} onValueChange={setSelectedCourseId}>
              <TabsList className="flex-wrap">
                {courses.map((course) => (
                  <TabsTrigger key={course.id} value={course.id}>
                    {course.title}
                  </TabsTrigger>
                ))}
              </TabsList>

              {courses.map((course) => (
                <TabsContent key={course.id} value={course.id}>
                  <CourseStudentsView courseId={course.id} />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </DashboardLayout>
    </ProtectedPage>
  )
}

function CourseStudentsView({ courseId }: { courseId: string }) {
  const { t } = useLanguage()
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const course = getCourseById(courseId)

  useEffect(() => {
    const courseEnrollments = getEnrollmentsByCourse(courseId)
    setEnrollments(courseEnrollments)
  }, [courseId])

  // Get student info from localStorage (in real app, this would come from API)
  const getStudentInfo = (studentId: string) => {
    const users = localStorage.getItem("komplex_users")
    if (users) {
      try {
        const usersArray = JSON.parse(users)
        const found = usersArray.find((u: any) => u.id === studentId)
        if (found) return found
      } catch {
        // ignore
      }
    }
    // Fallback: try to get from current user if it matches
    const currentUser = localStorage.getItem("user")
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser)
        if (user.id === studentId) return user
      } catch {
        // ignore
      }
    }
    return { fullName: `Student ${studentId.substring(0, 8)}`, email: "", id: studentId }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Enrolled Students ({enrollments.length})</span>
            {course && (
              <span className="text-sm font-normal text-gray-600">
                Total Students: {course.students}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrollments.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No students enrolled in this course yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {enrollments.map((enrollment) => {
                const studentInfo = getStudentInfo(enrollment.studentId)
                return (
                  <div
                    key={`${enrollment.courseId}-${enrollment.studentId}`}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 text-white flex items-center justify-center text-sm font-bold">
                          {studentInfo.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{studentInfo.fullName}</p>
                          <p className="text-xs text-gray-600">{studentInfo.email || `ID: ${enrollment.studentId}`}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Progress</p>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                            {enrollment.progress}%
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600 mb-1">Status</p>
                        <span
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            enrollment.completed
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {enrollment.completed ? "Completed" : "In Progress"}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 mb-1">Enrolled</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Course Statistics */}
      {enrollments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-1">Average Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(
                  enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length
                )}
                %
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {enrollments.filter((e) => e.completed).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-2xl font-bold text-orange-600">
                {enrollments.filter((e) => !e.completed).length}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
