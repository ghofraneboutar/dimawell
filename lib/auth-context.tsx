"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role: string
  dashboardPath: string
  [key: string]: any
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    setLoading(false)
  }, [])

  // Fonction pour vérifier la validité du token
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) return

      try {
        const response = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          // Token invalide, déconnecter l'utilisateur
          logout()
        } else {
          // Token valide, mettre à jour les informations utilisateur
          const data = await response.json()
          if (data.user) {
            setUser(data.user)
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du token:", error)
      }
    }

    if (token) {
      verifyToken()
    }
  }, [token])

  // Modifier la fonction login pour stocker les informations de manière permanente
  const login = (newToken: string, newUser: User) => {
    // S'assurer que le dashboardPath est défini avec la casse correcte
    if (!newUser.dashboardPath) {
      // Utiliser la casse correcte pour le chemin du dashboard étudiant (D majuscule)
      newUser.dashboardPath = newUser.role === "student" ? "/student/Dashboard" : "/psychologist/dashboard"
    } else {
      // Normaliser le chemin pour s'assurer qu'il utilise la bonne casse
      if (newUser.role === "student" && newUser.dashboardPath.toLowerCase() === "/student/dashboard") {
        newUser.dashboardPath = "/student/Dashboard" // Avec D majuscule
      }
    }

    setToken(newToken)
    setUser(newUser)

    // Stocker les informations de manière permanente (sans expiration)
    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(newUser))

    // Ajouter des logs pour le débogage
    console.log("User logged in:", newUser)
    console.log("Dashboard path:", newUser.dashboardPath)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    console.log("User logged out, redirecting to home page")
    router.push("/")
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}
