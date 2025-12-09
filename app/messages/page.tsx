"use client"

import { useLanguage } from "@/lib/language-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function MessagesPage() {
  const { t } = useLanguage()
  const [showCompose, setShowCompose] = useState(false)

  const mockAnnouncements = [
    {
      id: "1",
      title: "Midterm Exam Schedule",
      content: "The midterm exam will be held next week. Please prepare accordingly.",
      course: "Java Programming",
      date: "2025-01-10",
      recipients: 45,
    },
    {
      id: "2",
      title: "Assignment Deadline Extended",
      content: "The deadline for Assignment 2 has been extended to January 20.",
      course: "Web Design",
      date: "2025-01-08",
      recipients: 32,
    },
  ]

  return (
    <ProtectedPage requiredRoles={["educator"]}>
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t("nav.messages")}</h1>
              <p className="text-gray-600 mt-2">Send announcements and communicate with students</p>
            </div>
            <button
              onClick={() => setShowCompose(!showCompose)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              New Announcement
            </button>
          </div>

          {/* Compose Form */}
          {showCompose && (
            <Card className="border-2 border-blue-200">
              <CardHeader>
                <CardTitle>Compose Announcement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Select Course</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                    <option>Java Programming</option>
                    <option>Web Design</option>
                    <option>English Communication</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Title</label>
                  <input
                    type="text"
                    placeholder="Announcement title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Write your announcement..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Send Now
                  </button>
                  <button
                    onClick={() => setShowCompose(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Announcements List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Announcements</h2>
            {mockAnnouncements.map((announcement) => (
              <Card key={announcement.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{announcement.title}</h3>
                      <p className="text-gray-600 mt-2">{announcement.content}</p>
                      <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                        <span className="font-medium text-blue-600">{announcement.course}</span>
                        <span>{announcement.date}</span>
                        <span>{announcement.recipients} students notified</span>
                      </div>
                    </div>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm font-medium">
                      Edit
                    </button>
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
