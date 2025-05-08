import AuthGuard from "@/components/auth-guard"
import StudentDashboard from "@/components/student-dashboard"
import DashboardLayout from "@/components/dashboard-layout"

export default function StudentDashboardPage() {
  return (
    <AuthGuard requiredRole="student">
      <DashboardLayout>
        <StudentDashboard />
      </DashboardLayout>
    </AuthGuard>
  )
}
