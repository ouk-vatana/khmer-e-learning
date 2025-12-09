"use client"

import { AssignmentSubmission } from "@/components/student/assignment-submission"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ProtectedPage } from "@/components/auth/protected-page"

interface AssignmentPageProps {
  params: {
    assignmentId: string
  }
}

export default function AssignmentPage({ params }: AssignmentPageProps) {
  return (
    <ProtectedPage requiredRoles={["student"]}>
      <DashboardLayout>
        <AssignmentSubmission assignmentId={params.assignmentId} />
      </DashboardLayout>
    </ProtectedPage>
  )
}
