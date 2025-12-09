"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCourseById, getLessonById, getLessonsByCourse, markLessonCompleted } from "@/lib/data-service"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export function LessonPlayer({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [lessonCompleted, setLessonCompleted] = useState(false)
  
  // Check if lesson is already completed
  useEffect(() => {
    if (user?.id) {
      const key = `komplex_completed_lessons_${user.id}_${courseId}`
      const completed = localStorage.getItem(key)
      const completedArray = completed ? JSON.parse(completed) : []
      if (completedArray.includes(lessonId)) {
        setLessonCompleted(true)
      }
    }
  }, [user?.id, courseId, lessonId])

  const course = getCourseById(courseId)
  const lesson = getLessonById(lessonId)
  const allLessons = getLessonsByCourse(courseId)
  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId)

  if (!course || !lesson) {
    return <div className="p-6">{t("common.error")}</div>
  }

  const previousLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null

  const handleCompleteLesson = () => {
    if (user?.id) {
      markLessonCompleted(courseId, lessonId, user.id)
      setLessonCompleted(true)
      // Trigger a custom event to update dashboard
      window.dispatchEvent(new CustomEvent('progressUpdated'))
    }
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Video Player */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Video */}
          <div className="bg-black rounded-lg overflow-hidden aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={lesson.videoUrl}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Lesson Info */}
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
              <p className="text-gray-600 mt-1">{course.title}</p>
            </div>

            <p className="text-gray-700">{lesson.description}</p>

            {/* Mark Complete Button */}
            <div className="flex gap-2">
              {!lessonCompleted && (
                <button
                  onClick={handleCompleteLesson}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-medium"
                >
                  {t("lesson.markComplete")}
                </button>
              )}
              {lessonCompleted && (
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded font-medium">
                  ✓ {t("lesson.completed")}
                </div>
              )}
            </div>
          </div>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>{t("lesson.resources")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 text-sm font-medium">
                📥 {t("lesson.downloadNotes")}
              </button>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex gap-2 justify-between">
            {previousLesson && (
              <Link
                href={`/my-courses/${courseId}/lesson/${previousLesson.id}`}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm font-medium text-center"
              >
                ← {t("lesson.previousLesson")}
              </Link>
            )}
            <div className="flex-1"></div>
            {nextLesson && (
              <Link
                href={`/my-courses/${courseId}/lesson/${nextLesson.id}`}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium text-center"
              >
                {t("lesson.nextLesson")} →
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{course.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>{t("student.progressOverall")}</span>
                  <span>{Math.round((currentLessonIndex / allLessons.length) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.round((currentLessonIndex / allLessons.length) * 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Lessons List */}
              <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                <h3 className="font-semibold text-sm">{t("course.lessons")}</h3>
                {allLessons.map((l, idx) => (
                  <Link
                    key={l.id}
                    href={`/my-courses/${courseId}/lesson/${l.id}`}
                    className={`block p-2 rounded text-sm transition-colors ${
                      l.id === lessonId ? "bg-blue-600 text-white font-medium" : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <span className="font-medium">{idx + 1}.</span> {l.title}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
