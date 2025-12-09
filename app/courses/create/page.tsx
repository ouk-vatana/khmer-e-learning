"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useLanguage } from "@/lib/language-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createCourse } from "@/lib/data-service"

export default function CreateCoursePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    level: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    category: "",
    image: "",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (!formData.title || !formData.description || !formData.category) {
        setError("Please fill in all required fields")
        setLoading(false)
        return
      }

      if (!user) {
        setError("You must be logged in to create a course")
        setLoading(false)
        return
      }

      const newCourse = createCourse({
        title: formData.title,
        description: formData.description,
        level: formData.level,
        category: formData.category,
        image: formData.image || "/placeholder.svg",
        educatorId: user.id,
        educatorName: user.fullName,
      })

      router.push(`/courses/${newCourse.id}/edit`)
    } catch (err) {
      setError("Failed to create course")
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedPage requiredRoles={["educator"]}>
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("educator.createNewCourse")}</h1>
            <p className="text-gray-600 mt-2">Create a new course for your students</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-gray-700">
                    {t("educator.courseTitle")} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Introduction to Web Development"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium text-gray-700">
                    {t("educator.courseDescription")} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    required
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe what students will learn in this course..."
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="level" className="text-sm font-medium text-gray-700">
                      {t("educator.difficulty")} <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="level"
                      name="level"
                      required
                      value={formData.level}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">{t("educator.beginner")}</option>
                      <option value="Intermediate">{t("educator.intermediate")}</option>
                      <option value="Advanced">{t("educator.advanced")}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="category"
                      name="category"
                      type="text"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g., Programming, Web Design, Languages"
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="image" className="text-sm font-medium text-gray-700">
                    {t("educator.courseImage")} (URL)
                  </label>
                  <input
                    id="image"
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500">Leave empty to use default placeholder</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {loading ? t("common.loading") : t("educator.create")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="border-gray-300"
                  >
                    {t("educator.cancel")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedPage>
  )
}

