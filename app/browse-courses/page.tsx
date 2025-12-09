"use client"

import { CourseBrowse } from "@/components/student/course-browse"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"

export default function BrowseCoursesPage() {
  return (
    <ProtectedPage requiredRoles={["student"]}>
      <DashboardLayout>
        <CourseBrowse />
      </DashboardLayout>
    </ProtectedPage>
  )
}
