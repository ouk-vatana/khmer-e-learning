"use client"

import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  getCourseById,
  getLessonsByCourse,
  getAssignmentsByCourse,
  getQuizzesByCourse,
} from "@/lib/data-service"
import Link from "next/link"

export function CourseView({ courseId }: { courseId: string }) {
  const { t } = useLanguage()

  const course = getCourseById(courseId)
  const lessons = getLessonsByCourse(courseId)
  const assignments = getAssignmentsByCourse(courseId)
  const quizzes = getQuizzesByCourse(courseId)

  if (!course) {
    return <div className="p-6">{t("common.error")}</div>
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-gray-600">Instructor:</span>
          <span className="font-semibold text-blue-600">{course.educatorName}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{lessons.length}</div>
            <p className="text-xs text-gray-600 mt-1">{t("course.lessons")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-teal-600">{assignments.length}</div>
            <p className="text-xs text-gray-600 mt-1">{t("course.assignments")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{quizzes.length}</div>
            <p className="text-xs text-gray-600 mt-1">{t("course.quizzes")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Lessons */}
      {lessons.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("course.lessons")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {lessons.map((lesson, idx) => (
              <Link
                key={lesson.id}
                href={`/my-courses/${courseId}/lesson/${lesson.id}`}
                className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 border-b last:border-b-0"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{lesson.title}</p>
                  <p className="text-xs text-gray-600">{lesson.description}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Assignments */}
      {assignments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("course.assignments")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {assignments.map((assignment) => (
              <Link
                key={assignment.id}
                href={`/assignment/${assignment.id}`}
                className="block p-3 rounded hover:bg-gray-100 border-b last:border-b-0"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{assignment.title}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {t("assignment.dueDate")}: {assignment.dueDate} • {assignment.points} {t("assignment.points")}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      assignment.status === "submitted"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {assignment.status === "submitted" ? t("assignment.submitted") : t("assignment.notSubmitted")}
                  </span>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Quizzes */}
      {quizzes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("course.quizzes")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="p-3 rounded hover:bg-gray-100 border-b last:border-b-0">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{quiz.title}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {quiz.questions.length} {t("quiz.questions")} • {quiz.timeLimit} min {t("quiz.timeLimit")}
                    </p>
                  </div>
                  <Link
                    href={`/quiz/${quiz.id}`}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 inline-block"
                  >
                    {t("quiz.takeQuiz")}
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
