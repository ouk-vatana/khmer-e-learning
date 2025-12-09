"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/lib/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getAssignmentById, getCourseById } from "@/lib/data-service"

export function AssignmentSubmission({ assignmentId }: { assignmentId: string }) {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const assignment = getAssignmentById(assignmentId)
  const course = assignment ? getCourseById(assignment.courseId) : null

  if (!assignment || !course) {
    return <div className="p-6">{t("common.error")}</div>
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate file upload
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update assignment status
    if (assignment && user?.id) {
      updateAssignment(assignment.id, { status: "submitted" })
      
      // Update course progress
      const progress = calculateCourseProgress(assignment.courseId, user.id)
      updateEnrollmentProgress(assignment.courseId, user.id, progress)
    }

    setSubmitted(true)
    setLoading(false)
    
    // Trigger progress update event
    window.dispatchEvent(new CustomEvent('progressUpdated'))
  }

  const daysUntilDue = Math.ceil(
    (new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
        <p className="text-gray-600 mt-1">{course.title}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-600">{t("assignment.dueDate")}</p>
            <p className="text-lg font-semibold text-gray-900">{assignment.dueDate}</p>
            {daysUntilDue > 0 && <p className="text-xs text-green-600 mt-1">{daysUntilDue} days left</p>}
            {daysUntilDue <= 0 && <p className="text-xs text-red-600 mt-1">Overdue</p>}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-600">{t("assignment.points")}</p>
            <p className="text-lg font-semibold text-gray-900">{assignment.points}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-gray-600">{t("assignment.title")}</p>
            <p className="text-lg font-semibold text-gray-900">
              {assignment.status === "submitted" ? t("assignment.submitted") : t("assignment.notSubmitted")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("assignment.instructions")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            {assignment.instructions || assignment.description || `${assignment.title} - Complete this assignment to demonstrate your understanding of the course material.`}
          </p>
        </CardContent>
      </Card>

      {!submitted && (
        <Card>
          <CardHeader>
            <CardTitle>{t("assignment.submitAssignment")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-600 transition-colors cursor-pointer">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <p className="text-gray-600">{t("assignment.uploadFile")}</p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF, TXT up to 10MB</p>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.txt,.jpg,.jpeg,.png,.doc,.docx"
                />
              </div>

              {uploadedFile && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded border border-green-200">
                  <span className="text-green-600">✓</span>
                  <span className="text-sm text-gray-900">{uploadedFile.name}</span>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="ml-auto text-xs text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={!uploadedFile || loading}
                className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 font-medium"
              >
                {loading ? t("common.loading") : t("common.submit")}
              </button>
            </form>
          </CardContent>
        </Card>
      )}

      {submitted && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl mb-2">✓</p>
              <p className="text-lg font-semibold text-green-600">{t("assignment.submitted")}</p>
              <p className="text-sm text-gray-600 mt-2">
                Your assignment has been submitted successfully. You can resubmit until the due date.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {assignment.status === "submitted" && assignment.grade && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">{t("assignment.feedback")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">{t("assignment.yourGrade")}</p>
              <p className="text-2xl font-bold text-green-600">{assignment.grade}/100</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Educator Feedback</p>
              <p className="text-gray-900 mt-1">Great work! You demonstrated a strong understanding of the material.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
