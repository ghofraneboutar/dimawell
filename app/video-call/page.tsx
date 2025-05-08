import VideoCallClient from "@/components/video-call/video-call-client"
import AuthGuard from "@/components/auth-guard"
import DashboardLayout from "@/components/dashboard-layout"

export default function VideoCallPage() {
  // Dans une application réelle, ces informations viendraient de la base de données
  // ou seraient passées via les paramètres de la route
  const sessionData = {
    sessionId: "session-123",
    psychologistId: "psycho-456",
    psychologistName: "Dr. badra",
    psychologistInitials: "SM",
    studentName: "Étudiant Test",
    studentInitials: "ET",
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <VideoCallClient
          sessionId={sessionData.sessionId}
          psychologistId={sessionData.psychologistId}
          psychologistName={sessionData.psychologistName}
          psychologistInitials={sessionData.psychologistInitials}
          studentName={sessionData.studentName}
          studentInitials={sessionData.studentInitials}
        />
      </DashboardLayout>
    </AuthGuard>
  )
}
