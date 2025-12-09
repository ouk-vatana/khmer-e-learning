"use client"

import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/charts/stat-card"
import { ProgressChart } from "@/components/charts/progress-chart"
import { LineChartCustom } from "@/components/charts/line-chart-custom"
import {
  getCourses,
  getEnrollmentsByStudent,
  getAssignments,
  getCourseById,
  calculateCourseProgress,
  updateEnrollmentProgress,
} from "@/lib/data-service"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"

export function StudentDashboardOverview() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [enrolledCoursesData, setEnrolledCoursesData] = useState<any[]>([])
  const [pendingAssignments, setPendingAssignments] = useState<any[]>([])
  const [overallProgress, setOverallProgress] = useState(0)

  const refreshDashboard = useCallback(() => {
    if (user?.id) {
      const enrollments = getEnrollmentsByStudent(user.id)
      
      // Recalculate progress for each course
      const coursesData = enrollments.map((enrollment) => {
        const course = getCourseById(enrollment.courseId)
        if (course) {
          // Recalculate and update progress
          const currentProgress = calculateCourseProgress(enrollment.courseId, user.id)
          updateEnrollmentProgress(enrollment.courseId, user.id, currentProgress)
          
          return {
            ...enrollment,
            progress: currentProgress,
            course,
          }
        }
        return { ...enrollment, course: null }
      }).filter((item) => item.course !== null)
      
      setEnrolledCoursesData(coursesData)

      // Calculate overall progress
      const totalProgress = coursesData.reduce((sum, item) => sum + item.progress, 0)
      const avgProgress = coursesData.length > 0 ? Math.round(totalProgress / coursesData.length) : 0
      setOverallProgress(avgProgress)

      // Get pending assignments
      const allAssignments = getAssignments()
      const studentEnrolledCourseIds = coursesData.map((item) => item.courseId)
      const pending = allAssignments.filter(
        (a) => a.status === "pending" && studentEnrolledCourseIds.includes(a.courseId)
      )
      setPendingAssignments(pending)
    }
  }, [user?.id])

  useEffect(() => {
    refreshDashboard()
    
    // Listen for progress updates
    const handleProgressUpdate = () => {
      refreshDashboard()
    }
    
    window.addEventListener('progressUpdated', handleProgressUpdate)
    
    // Refresh every 2 seconds to keep data up to date
    const interval = setInterval(refreshDashboard, 2000)
    
    return () => {
      window.removeEventListener('progressUpdated', handleProgressUpdate)
      clearInterval(interval)
    }
  }, [refreshDashboard])

  // Generate course progress data for pie chart
  const courseProgressData = enrolledCoursesData.map((item) => ({
    name: item.course?.title || "Unknown",
    value: item.progress,
  }))

  // Calculate overall stats
  const totalCourses = enrolledCoursesData.length
  const completedCourses = enrolledCoursesData.filter((item) => item.progress >= 100).length
  const inProgressCourses = enrolledCoursesData.filter((item) => item.progress > 0 && item.progress < 100).length
  const notStartedCourses = enrolledCoursesData.filter((item) => item.progress === 0).length

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">{t("student.dashboard")}</h1>
        <p className="text-muted-foreground mt-2">Track your learning progress and upcoming assignments</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t("student.enrolledCourses")}
          value={enrolledCoursesData.length}
          color="blue"
          subtext="Currently learning"
        />
        <StatCard
          label={t("student.progressOverall")}
          value={`${overallProgress}%`}
          color="teal"
          subtext={`${totalCourses} courses enrolled`}
        />
        <StatCard
          label={t("student.pendingAssignments")}
          value={pendingAssignments.length}
          color="orange"
          subtext="Due soon"
        />
        <StatCard
          label={t("student.gradeAverage")}
          value="87%"
          color="green"
          trend={{ value: 3, direction: "up" }}
          subtext="Excellent work"
        />
      </div>

      {/* Charts Section */}
      {courseProgressData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Progress Pie Chart */}
          <ProgressChart
            title="Course Progress Overview"
            type="pie"
            data={courseProgressData}
            dataKey="value"
          />

          {/* Course Status Breakdown */}
          <ProgressChart
            title="Course Status Distribution"
            type="pie"
            data={[
              { name: "Completed", value: completedCourses },
              { name: "In Progress", value: inProgressCourses },
              { name: "Not Started", value: notStartedCourses },
            ]}
            dataKey="value"
          />
        </div>
      )}

      {/* In Progress Courses */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">{t("student.enrolledCourses")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCoursesData.map(
            (enrollment) =>
              enrollment.course && (
                <Card
                  key={enrollment.courseId}
                  className="overflow-hidden hover:shadow-lg transition-shadow border border-border"
                >
                  <img
                    src={enrollment.course.image || "/placeholder.svg"}
                    alt={enrollment.course.title}
                    className="w-full h-36 object-cover"
                  />
                  <CardContent className="pt-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-bold text-foreground text-lg">{enrollment.course.title}</h3>
                      <span className="text-xs font-bold text-green-600 bg-green-100 px-2.5 py-1 rounded-full">
                        {enrollment.progress}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">by {enrollment.course.educatorName}</p>

                    {/* Progress Bar */}
                    <div className="mt-4 mb-4">
                      <div className="flex justify-between items-center text-xs font-medium text-muted-foreground mb-2">
                        <span>{t("student.progressOverall")}</span>
                        <span>
                          {Math.round((enrollment.progress / 100) * enrollment.course.lessons)}/
                          {enrollment.course.lessons}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full transition-all"
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <Link
                      href={`/my-courses/${enrollment.courseId}`}
                      className="w-full py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-lg hover:opacity-90 transition-opacity text-center block"
                    >
                      {t("student.continueLearning")}
                    </Link>
                  </CardContent>
                </Card>
              ),
          )}
        </div>
      </div>

      {/* Pending Assignments */}
      {pendingAssignments.length > 0 && (
        <Card className="border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold">
              {t("assignment.title")} & {t("quiz.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{assignment.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {assignment.dueDate} • {assignment.points} points
                    </p>
                  </div>
                  <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1.5 rounded-full whitespace-nowrap ml-2">
                    Not Submitted
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Browse More CTA */}
      <Link
        href="/browse-courses"
        className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-bold text-center"
      >
        {t("student.browseMoreCourses")}
      </Link>
    </div>
  )
}
