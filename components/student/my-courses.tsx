"use client"

import { useLanguage } from "@/lib/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { mockCourses, mockEnrollments } from "@/lib/mock-data"
import Link from "next/link"

export function MyCoursesView() {
  const { t } = useLanguage()

  const enrolledCoursesData = mockEnrollments.map((enrollment) => {
    const course = mockCourses.find((c) => c.id === enrollment.courseId)
    return { ...enrollment, course }
  })

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("student.enrolledCourses")}</h1>
        <p className="text-gray-600 mt-2">Continue learning with your enrolled courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {enrolledCoursesData.map(
          (enrollment) =>
            enrollment.course && (
              <Card key={enrollment.courseId} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={enrollment.course.image || "/placeholder.svg"}
                  alt={enrollment.course.title}
                  className="w-full h-40 object-cover"
                />
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-gray-900">{enrollment.course.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">by {enrollment.course.educatorName}</p>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                      <span>{t("student.progressOverall")}</span>
                      <span>{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${enrollment.progress}%` }}></div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mt-2">
                    {Math.round((enrollment.progress / 100) * enrollment.course.lessons)}/{enrollment.course.lessons}{" "}
                    {t("student.lessonsCompleted")}
                  </p>

                  <Link
                    href={`/my-courses/${enrollment.courseId}`}
                    className="mt-3 block w-full py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 text-center"
                  >
                    {t("student.continueLearning")}
                  </Link>
                </CardContent>
              </Card>
            ),
        )}
      </div>
    </div>
  )
}
