"use client"

import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/charts/stat-card"
import { ProgressChart } from "@/components/charts/progress-chart"
import { LineChartCustom } from "@/components/charts/line-chart-custom"
import { getCourses, getAssignments, getCoursesByEducator } from "@/lib/data-service"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import Link from "next/link"

export function EducatorDashboardOverview() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [courses, setCourses] = useState(getCourses())
  const [assignments, setAssignments] = useState(getAssignments())

  useEffect(() => {
    if (user?.role === "educator") {
      setCourses(getCoursesByEducator(user.id))
    }
  }, [user])

  // Fixed data for graphs
  const courseProgressData = [
    { name: "Java", value: 85 },
    { name: "Web Design", value: 72 },
    { name: "English", value: 78 },
  ]

  const studentEngagementData = [
    { name: "Week 1", activeStudents: 45, submittedWork: 38 },
    { name: "Week 2", activeStudents: 52, submittedWork: 45 },
    { name: "Week 3", activeStudents: 48, submittedWork: 42 },
    { name: "Week 4", activeStudents: 65, submittedWork: 58 },
  ]

  const gradeDistributionData = [
    { name: "A (90-100)", value: 15 },
    { name: "B (80-89)", value: 28 },
    { name: "C (70-79)", value: 35 },
    { name: "D (60-69)", value: 18 },
    { name: "F (<60)", value: 4 },
  ]

  const pendingCount = assignments.filter((a) => a.status === "pending").length

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-foreground">{t("educator.dashboard")}</h1>
        <p className="text-muted-foreground mt-2">Monitor your courses and student progress at a glance</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={t("educator.activeCourses")}
          value={courses.length}
          color="blue"
          trend={{ value: 12, direction: "up" }}
          subtext="Compared to last month"
        />
        <StatCard
          label={t("educator.totalStudents")}
          value={courses.reduce((sum, course) => sum + course.students, 0)}
          color="teal"
          trend={{ value: 8, direction: "up" }}
          subtext="Active learners"
        />
        <StatCard
          label={t("educator.pendingSubmissions")}
          value={pendingCount}
          color="orange"
          subtext="Need your review"
        />
        <StatCard
          label="Avg. Student Grade"
          value="85%"
          color="green"
          trend={{ value: 5, direction: "up" }}
          subtext="Overall performance"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Performance */}
        <ProgressChart
          title="Course Completion Rates"
          type="bar"
          data={courseProgressData}
          dataKey="value"
          color="#3b82f6"
        />

        {/* Grade Distribution */}
        <ProgressChart title="Grade Distribution" type="pie" data={gradeDistributionData} dataKey="value" />
      </div>

      {/* Student Engagement Trend */}
      <LineChartCustom
        title="Student Engagement Over Time"
        data={studentEngagementData}
        lines={[
          { key: "activeStudents", color: "#3b82f6", name: "Active Students" },
          { key: "submittedWork", color: "#14b8a6", name: "Work Submitted" },
        ]}
      />

      {/* My Courses Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">{t("educator.myCourses")}</h2>
          <Link
            href="/courses/create"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            {t("educator.createNewCourse")}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow border border-border">
              <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-40 object-cover" />
              <CardContent className="pt-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-foreground line-clamp-2 flex-1">{course.title}</h3>
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
                <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 mt-4 py-3 border-y border-border">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Students</p>
                    <p className="text-lg font-bold text-primary">
                      {course.students} {course.students === 1 ? "student" : "students"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Lessons</p>
                    <p className="text-lg font-bold text-secondary">{course.lessons}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/courses/${course.id}/edit`}
                    className="flex-1 text-sm py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity text-center font-medium"
                  >
                    {t("educator.edit")}
                  </Link>
                  <button className="flex-1 text-sm py-2 border border-border text-foreground rounded-lg hover:bg-muted transition-colors font-medium">
                    {t("educator.viewGrades")}
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pending Work Section */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold">{t("educator.pendingSubmissions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {assignments
              .filter((a) => a.status === "pending")
              .slice(0, 5)
              .map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{assignment.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: {assignment.dueDate}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full">
                    {assignment.points} points
                  </span>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
