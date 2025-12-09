"use client"

import type React from "react"

import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function ProfilePage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    bio: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // In a real app, this would save to the database
    setEditing(false)
  }

  return (
    <ProtectedPage requiredRoles={["educator", "student"]}>
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-6 max-w-2xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("profile.myProfile")}</h1>
            <p className="text-gray-600 mt-2">Manage your profile information</p>
          </div>

          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
                    {user?.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{user?.fullName}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {user?.role === "educator" ? t("auth.educator") : t("auth.student")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 font-medium text-sm"
                >
                  {editing ? t("common.close") : t("profile.editProfile")}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          {editing && (
            <Card>
              <CardHeader>
                <CardTitle>{t("profile.editProfile")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">{t("profile.name")}</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">{t("profile.email")}</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-3 py-2 border border-input rounded-md bg-gray-50 text-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">{t("profile.bio")}</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
                  >
                    {t("profile.save")}
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-medium"
                  >
                    {t("common.close")}
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle>{t("profile.changePassword")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1">Confirm Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">
                {t("profile.changePassword")}
              </button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedPage>
  )
}
