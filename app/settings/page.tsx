"use client"

import { useLanguage } from "@/lib/language-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()

  return (
    <ProtectedPage requiredRoles={["educator", "student"]}>
      <DashboardLayout>
        <div className="space-y-6 p-4 sm:p-6 max-w-2xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t("nav.settings")}</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle>{t("language.selectLanguage")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">Choose your preferred language for the platform</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setLanguage("en")}
                  className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                    language === "en"
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {t("language.english")}
                </button>
                <button
                  onClick={() => setLanguage("km")}
                  className={`flex-1 py-3 rounded-lg border-2 font-medium transition-colors ${
                    language === "km"
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                  }`}
                >
                  {t("language.khmer")}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">Email Notifications</span>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">Course Updates</span>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-medium">Grade Notifications</span>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-gray-600">Be careful with these actions. They cannot be undone.</p>
              <button className="w-full py-2 border-2 border-red-600 text-red-600 rounded hover:bg-red-50 font-medium">
                Delete Account
              </button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </ProtectedPage>
  )
}
