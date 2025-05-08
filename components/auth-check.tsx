"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthCheck({
  children,
  requiredRole = null,
}: { children: React.ReactNode; requiredRole?: string | null }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const userJson = localStorage.getItem("user")

    if (!userJson) {
      // Rediriger vers la page de connexion si non connecté
      router.push("/login")
      return
    }

    const user = JSON.parse(userJson)

    // Vérifier le rôle si nécessaire
    if (requiredRole && user.role !== requiredRole) {
      // Rediriger vers le tableau de bord approprié si le rôle ne correspond pas
      router.push(user.dashboardPath)
      return
    }

    setIsLoading(false)
  }, [router, requiredRole])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  }

  return <>{children}</>
}
