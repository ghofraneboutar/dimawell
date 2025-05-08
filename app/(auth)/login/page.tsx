"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Valider l'email pour les étudiants uniquement
      const isStudentEmail = email !== "ghadaazizi2023@gmail.com" // Considérer tout email non spécifique comme étudiant
      if (isStudentEmail && !email.endsWith("@rades.r-iset.tn")) {
        throw new Error("Les étudiants doivent utiliser un email universitaire (@rades.r-iset.tn)")
      }

      console.log("Tentative de connexion avec:", email)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("Réponse de l'API:", data)

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la connexion")
      }

      // Stocker le token et les informations utilisateur
      login(data.token, data.user)

      // Déterminer le chemin de redirection
      let dashboardPath
      if (email === "ghadaazizi2023@gmail.com") {
        dashboardPath = "/psychologist/dashboard"
      } else {
        dashboardPath =
          data.user.dashboardPath ||
          (data.user.role === "student" ? "/student/Dashboard" : "/psychologist/dashboard")
      }

      console.log("Redirection vers:", dashboardPath)

      // Ajouter un délai pour s'assurer que le localStorage est mis à jour
      setTimeout(() => {
        router.push(dashboardPath)
      }, 100)
    } catch (err: any) {
      console.error("Erreur de connexion:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <Image
            src="/placeholder.svg?height=80&width=200"
            alt="DimaWell Logo"
            width={200}
            height={80}
            className="mx-auto"
          />
          <h1 className="text-2xl font-bold mt-4 text-indigo-700">Connexion à DimaWell</h1>
          <p className="text-gray-600 mt-2">Accédez à votre espace de soutien psychologique</p>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="text" // Changé de "email" à "text" pour permettre des emails non standards
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="prenom.nom@rades.r-iset.tn ou email psychologue"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                Mot de passe oublié?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vous n'avez pas de compte?{" "}
            <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}