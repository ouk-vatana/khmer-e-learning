"use client"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { getCourses } from "@/lib/data-service"
import Link from "next/link"

export function CourseBrowse() {
  const { t } = useLanguage()
  const [search, setSearch] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const courses = getCourses()

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      course.description.toLowerCase().includes(search.toLowerCase())
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel
    return matchesSearch && matchesLevel
  })

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t("course.allCourses")}</h1>
        <p className="text-gray-600 mt-2">Explore and enroll in courses</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder={t("course.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="all">{t("course.level")} - All</option>
          <option value="Beginner">{t("educator.beginner")}</option>
          <option value="Intermediate">{t("educator.intermediate")}</option>
          <option value="Advanced">{t("educator.advanced")}</option>
        </select>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-40 object-cover" />
            <CardContent className="pt-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">by {course.educatorName}</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded whitespace-nowrap">
                  {course.level}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{course.description}</p>

              <div className="flex justify-between text-xs text-gray-600 mt-3">
                <span>
                  {course.students} {t("student.enrolledCourses")}
                </span>
                <span>
                  {course.lessons} {t("course.lessons")}
                </span>
              </div>

              <Link
                href={`/browse-courses/${course.id}`}
                className="mt-4 block w-full py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 text-center"
              >
                {t("course.viewDetails")}
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">{t("common.search")} returned no results.</p>
        </div>
      )}
    </div>
  )
}
