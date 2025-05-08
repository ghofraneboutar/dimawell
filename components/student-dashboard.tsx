"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, MessageCircle, Video, ArrowRight } from "lucide-react"
import WellbeingChart from "@/components/wellbeing-chart"
import DailyTip from "@/components/daily-tip"

interface Appointment {
  id: number
  title: string
  start_time: string
  first_name: string
  last_name: string
  google_meet_link: string
}

interface Message {
  id: number
  sender_first_name: string
  sender_last_name: string
  content: string
  created_at: string
}

export default function StudentDashboard() {
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null)
  const [recentMessages, setRecentMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { user, token } = useAuth()

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        // Récupérer le prochain rendez-vous
        const appointmentsResponse = await fetch("/api/appointments?limit=1", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!appointmentsResponse.ok) {
          throw new Error("Erreur lors de la récupération des rendez-vous")
        }
        const appointmentsData = await appointmentsResponse.json()
        setNextAppointment(appointmentsData[0] || null)

        // Récupérer les messages récents
        const messagesResponse = await fetch("/api/messages?limit=2", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!messagesResponse.ok) {
          throw new Error("Erreur lors de la récupération des messages")
        }
        const messagesData = await messagesResponse.json()
        setRecentMessages(messagesData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [token])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5c6bc0]"></div>
      </div>
    )
  }

  // Formater la date pour l'affichage
  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.toLocaleDateString("fr-FR", { weekday: "long" }),
      date: date.getDate(),
      month: date.toLocaleDateString("fr-FR", { month: "long" }),
      time: date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#3f51b5]">Tableau de bord</h1>
        <p className="text-gray-500">Bonjour, {user?.firstName || "Étudiant"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[#3f51b5]">Prochaine consultation</CardTitle>
            <CardDescription>Votre rendez-vous à venir</CardDescription>
          </CardHeader>
          <CardContent>
            {nextAppointment ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#e8eaf6] p-3 rounded-full">
                    <Video className="h-5 w-5 text-[#5c6bc0]" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Dr. {nextAppointment.first_name} {nextAppointment.last_name}
                    </p>
                    <p className="text-sm text-gray-500">Psychologue</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {formatAppointmentDate(nextAppointment.start_time).day},{" "}
                    {formatAppointmentDate(nextAppointment.start_time).date}{" "}
                    {formatAppointmentDate(nextAppointment.start_time).month} •{" "}
                    {formatAppointmentDate(nextAppointment.start_time).time}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-[#5c6bc0] hover:bg-[#3f51b5] w-full" asChild>
                    <a href={nextAppointment.google_meet_link} target="_blank" rel="noopener noreferrer">
                      Rejoindre
                    </a>
                  </Button>
                  <Button variant="outline" className="border-[#5c6bc0] text-[#5c6bc0]" asChild>
                    <Link href="/appointments">Reprogrammer</Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-[#e8eaf6] p-3 rounded-full">
                    <Video className="h-5 w-5 text-[#5c6bc0]" />
                  </div>
                  <div>
                    <p className="font-medium">Aucun rendez-vous prévu</p>
                    <p className="text-sm text-gray-500">Planifiez votre prochaine consultation</p>
                  </div>
                </div>
                <Button className="bg-[#5c6bc0] hover:bg-[#3f51b5] w-full" asChild>
                  <Link href="/appointments">Prendre rendez-vous</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-[#3f51b5]">Messages récents</CardTitle>
            <CardDescription>Vos dernières conversations</CardDescription>
          </CardHeader>
          <CardContent>
            {recentMessages.length > 0 ? (
              <div className="space-y-4">
                {recentMessages.map((message) => (
                  <div key={message.id} className="flex items-center gap-3">
                    <div className="bg-[#e8eaf6] p-2 rounded-full">
                      <MessageCircle className="h-4 w-4 text-[#5c6bc0]" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {message.sender_first_name} {message.sender_last_name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(message.created_at).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">Aucun message récent</p>
            )}
            <Button variant="ghost" className="w-full mt-4 text-[#5c6bc0]" asChild>
              <Link href="/messages">
                Voir tous les messages
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <DailyTip />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-[#3f51b5]">Suivi de bien-être</CardTitle>
            <CardDescription>Évolution de votre humeur sur les 7 derniers jours</CardDescription>
          </CardHeader>
          <CardContent>
            <WellbeingChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#3f51b5]">Calendrier</CardTitle>
            <CardDescription>Planifiez vos rendez-vous</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
            <Button className="w-full mt-4 bg-[#5c6bc0] hover:bg-[#3f51b5]" asChild>
              <Link href="/appointments">Prendre rendez-vous</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
