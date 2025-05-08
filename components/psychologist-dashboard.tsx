"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Calendar, Users, MessageSquare, PenTool, Video } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface Appointment {
  id: number
  title: string
  start_time: string
  first_name: string
  last_name: string
  google_meet_link: string
}

interface Student {
  id: number
  first_name: string
  last_name: string
  department: string
}

interface Message {
  id: number
  sender_first_name: string
  sender_last_name: string
  content: string
  created_at: string
}

export default function PsychologistDashboard() {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [recentStudents, setRecentStudents] = useState<Student[]>([])
  const [unreadMessages, setUnreadMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [tipData, setTipData] = useState({
    title: "",
    content: "",
    category: "",
  })
  const { user, token } = useAuth()

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return

      try {
        // Récupérer les rendez-vous du jour
        const appointmentsResponse = await fetch("/api/appointments?date=today", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!appointmentsResponse.ok) {
          throw new Error("Erreur lors de la récupération des rendez-vous")
        }
        const appointmentsData = await appointmentsResponse.json()
        setTodayAppointments(appointmentsData)

        // Récupérer les étudiants récents
        const studentsResponse = await fetch("/api/students?limit=5", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!studentsResponse.ok) {
          throw new Error("Erreur lors de la récupération des étudiants")
        }
        const studentsData = await studentsResponse.json()
        setRecentStudents(studentsData)

        // Récupérer les messages non lus
        const messagesResponse = await fetch("/api/messages?unread=true", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!messagesResponse.ok) {
          throw new Error("Erreur lors de la récupération des messages")
        }
        const messagesData = await messagesResponse.json()
        setUnreadMessages(messagesData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchDashboardData()
    }
  }, [token])

  const handleTipChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTipData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTipSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    try {
      const response = await fetch("/api/tips/daily", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(tipData),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la création du conseil")
      }

      // Réinitialiser le formulaire
      setTipData({
        title: "",
        content: "",
        category: "",
      })

      alert("Conseil créé avec succès!")
    } catch (error: any) {
      alert(`Erreur: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Tableau de bord</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Bonjour, Dr. {user?.firstName} {user?.lastName}
        </h2>
        <p className="text-gray-600">Bienvenue sur votre espace DimaWell</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Rendez-vous du jour */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-indigo-600">Rendez-vous du jour</h3>
            </div>
            <Link href="/psychologist/appointments" className="text-sm text-indigo-600 hover:text-indigo-800">
              Voir tous
            </Link>
          </div>

          {todayAppointments.length > 0 ? (
            <div className="space-y-4">
              {todayAppointments.map((appointment) => (
                <div key={appointment.id} className="border-b pb-3">
                  <p className="font-medium">{appointment.title}</p>
                  <p className="text-gray-600">
                    {new Date(appointment.start_time).toLocaleTimeString("fr-FR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    - {appointment.first_name} {appointment.last_name}
                  </p>
                  <div className="mt-2">
                    <a
                      href={appointment.google_meet_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-700 inline-flex items-center"
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Démarrer
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Aucun rendez-vous aujourd'hui</p>
          )}
        </div>

        {/* Messages non lus */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <MessageSquare className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-indigo-600">
                Messages non lus{" "}
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full ml-2">
                  {unreadMessages.length}
                </span>
              </h3>
            </div>
            <Link href="/psychologist/messages" className="text-sm text-indigo-600 hover:text-indigo-800">
              Voir tous
            </Link>
          </div>

          {unreadMessages.length > 0 ? (
            <div className="space-y-4">
              {unreadMessages.map((message) => (
                <div key={message.id} className="border-b pb-3">
                  <div className="flex justify-between">
                    <p className="font-medium">
                      {message.sender_first_name} {message.sender_last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(message.created_at).toLocaleString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "numeric",
                        month: "numeric",
                      })}
                    </p>
                  </div>
                  <p className="text-gray-600 truncate">{message.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Aucun message non lu</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Étudiants récents */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Users className="h-6 w-6 text-indigo-600 mr-2" />
              <h3 className="text-lg font-semibold text-indigo-600">Étudiants récents</h3>
            </div>
            <Link href="/psychologist/patients" className="text-sm text-indigo-600 hover:text-indigo-800">
              Voir tous
            </Link>
          </div>

          {recentStudents.length > 0 ? (
            <div className="space-y-2">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">
                      {student.first_name} {student.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{student.department}</p>
                  </div>
                  <Link
                    href={`/psychologist/patients/${student.id}`}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Voir profil
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Aucun étudiant récent</p>
          )}
        </div>

        {/* Créer un conseil */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <PenTool className="h-6 w-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-indigo-600">Créer un conseil du jour</h3>
          </div>

          <form onSubmit={handleTipSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Titre
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={tipData.title}
                onChange={handleTipChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Titre du conseil"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Contenu
              </label>
              <textarea
                id="content"
                name="content"
                value={tipData.content}
                onChange={handleTipChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Contenu du conseil"
                required
              ></textarea>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                id="category"
                name="category"
                value={tipData.category}
                onChange={handleTipChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="stress">Gestion du stress</option>
                <option value="sleep">Sommeil</option>
                <option value="anxiety">Anxiété</option>
                <option value="motivation">Motivation</option>
                <option value="wellbeing">Bien-être général</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Publier le conseil
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
