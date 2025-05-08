import AuthGuard from "@/components/auth-guard"
import PsychologistDashboard from "@/components/psychologist-dashboard"
import Header from "@/components/header"

export default function PsychologistDashboardPage() {
  return (
    <AuthGuard requiredRole="psychologist">
      <Header />
      <PsychologistDashboard />
    </AuthGuard>
  )
}
