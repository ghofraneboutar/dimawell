"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  // Déterminer le chemin par défaut basé sur le rôle
  const defaultDashboardPath = user?.role === "student" 
  ? "/student/Dashboard" 
  : "/psychologist/dashboard"

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            {/* Ajouter un logo si nécessaire */}
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-indigo-600">
              Accueil
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-indigo-600">
              À propos
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-indigo-600">
              FAQ
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-indigo-600">
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href={user?.dashboardPath || defaultDashboardPath}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Tableau de bord
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50"
                >
                  Inscription
                </Link>
              </>
            )}
          </nav>

          {/* Menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-indigo-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu mobile déroulant */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-700 hover:text-indigo-600">
                Accueil
              </Link>
              {/* ... autres liens ... */}
              
              {isAuthenticated ? (
                <>
                  <Link
                    href={user?.dashboardPath || defaultDashboardPath}
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Tableau de bord
                  </Link>
                  {/* ... reste du code ... */}
                </>
              ) : null}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}