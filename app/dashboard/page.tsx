"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function DashboardRedirect() {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log("Dashboard redirect page loaded")
    console.log("User:", user)
    console.log("Loading:", loading)
    console.log("Is authenticated:", isAuthenticated)

    if (!loading) {
      if (!isAuthenticated) {
        console.log("User not authenticated, redirecting to login")
        router.push("/login")
      } else {
        // Déterminer le tableau de bord approprié selon le rôle avec la casse correcte (D majuscule)
        const dashboardPath =
          user?.dashboardPath || (user?.role === "student" ? "/student/Dashboard" : "/psychologist/dashboard")

        console.log("Redirecting to:", dashboardPath)
        router.push(dashboardPath)
      }
    }
  }, [loading, isAuthenticated, user, router])

  // Afficher un indicateur de chargement pendant la redirection
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirection vers votre tableau de bord...</p>
        <p className="text-sm text-gray-500 mt-2">
          Si vous n'êtes pas redirigé automatiquement, veuillez cliquer sur le lien correspondant à votre profil :
        </p>
        <div className="mt-4 space-x-4">
          <a href="/student/Dashboard" className="text-indigo-600 hover:underline">
            Tableau de bord étudiant
          </a>
          <a href="/psychologist/dashboard" className="text-indigo-600 hover:underline">
            Tableau de bord psychologue
          </a>
        </div>
      </div>
    </div>
  )
}
