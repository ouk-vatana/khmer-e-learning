"use client"

import { useLanguage } from "@/lib/language-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"
import { Card, CardContent } from "@/components/ui/card"
import { getCourses, getCoursesByEducator } from "@/lib/data-service"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function CoursesPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [courses, setCourses] = useState(getCourses())

  useEffect(() => {
    if (user?.role === "educator") {
      setCourses(getCoursesByEducator(user.id))
    }
  }, [user])

  return (
    <ProtectedPage requiredRoles={["educator"]}>
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t("nav.myCoursesEd")}</h1>
              <p className="text-gray-600 mt-2">Manage all your courses and content</p>
            </div>
            <Link
              href="/courses/create"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Create New Course
            </Link>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-40 object-cover" />
                <CardContent className="pt-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-gray-900 line-clamp-2 flex-1">{course.title}</h3>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        course.level === "Beginner"
                          ? "bg-green-100 text-green-700"
                          : course.level === "Intermediate"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {course.level}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mt-4 py-3 border-y border-gray-200">
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Students</p>
                      <p className="text-lg font-bold text-blue-600">{course.students}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-medium">Lessons</p>
                      <p className="text-lg font-bold text-teal-600">{course.lessons}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Link
                      href={`/courses/${course.id}/edit`}
                      className="flex-1 text-sm py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center font-medium"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/courses/${course.id}/grades`}
                      className="flex-1 text-sm py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
                    >
                      Grades
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedPage>
  )
}
