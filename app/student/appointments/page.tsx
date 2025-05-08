"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface TimeSlot {
  id: string
  startTime: Date
  endTime: Date
  available: boolean
}

interface Appointment {
  id: number
  title: string
  description: string
  start_time: string
  end_time: string
  google_meet_link: string
  status: "scheduled" | "cancelled" | "completed"
}

export default function AppointmentsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingStep, setBookingStep] = useState(1)
  const [appointmentTitle, setAppointmentTitle] = useState("")
  const [appointmentDescription, setAppointmentDescription] = useState("")
  const [bookingSuccess, setBookingSuccess] = useState(false)

  // Fonction pour générer des créneaux horaires (simulation)
  const generateTimeSlots = (date: Date) => {
    const slots: TimeSlot[] = []
    const startHour = 9 // 9h
    const endHour = 17 // 17h
    const slotDuration = 60 // 60 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      const startTime = new Date(date)
      startTime.setHours(hour, 0, 0, 0)

      const endTime = new Date(date)
      endTime.setHours(hour, slotDuration, 0, 0)

      // Simuler des créneaux déjà pris (aléatoirement)
      const available = Math.random() > 0.3

      slots.push({
        id: `slot-${hour}`,
        startTime,
        endTime,
        available,
      })
    }

    return slots
  }

  // Charger les créneaux horaires lorsque la date change
  useEffect(() => {
    if (selectedDate) {
      setTimeSlots(generateTimeSlots(selectedDate))
    }
  }, [selectedDate])

  // Charger les rendez-vous existants
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true)
        // Simuler un appel API
        setTimeout(() => {
          const mockAppointments: Appointment[] = [
            {
              id: 1,
              title: "Consultation initiale",
              description: "Première séance pour discuter de vos besoins",
              start_time: "2023-04-24T14:00:00",
              end_time: "2023-04-24T15:00:00",
              google_meet_link: "https://meet.google.com/abc-defg-hij",
              status: "scheduled",
            },
            {
              id: 2,
              title: "Suivi mensuel",
              description: "Séance de suivi régulière",
              start_time: "2023-05-15T10:00:00",
              end_time: "2023-05-15T11:00:00",
              google_meet_link: "https://meet.google.com/klm-nopq-rst",
              status: "scheduled",
            },
          ]

          setAppointments(mockAppointments)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Erreur lors du chargement des rendez-vous:", error)
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  // Gérer la sélection d'un créneau
  const handleSlotSelect = (slot: TimeSlot) => {
    if (slot.available) {
      setSelectedSlot(slot)
      setBookingStep(2)
    }
  }

  // Gérer la soumission du formulaire de rendez-vous
  const handleBookAppointment = async () => {
    try {
      setLoading(true)

      // Simuler un appel API pour créer un rendez-vous
      setTimeout(() => {
        setBookingSuccess(true)
        setBookingStep(3)
        setLoading(false)
      }, 1500)
    } catch (error) {
      console.error("Erreur lors de la réservation du rendez-vous:", error)
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Prendre rendez-vous</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Calendrier */}
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Sélectionnez une date</h2>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={fr}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Vos rendez-vous</h3>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{appointment.title}</h4>
                          <p className="text-sm text-gray-600">
                            {format(new Date(appointment.start_time), "EEEE d MMMM yyyy", { locale: fr })}
                          </p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(appointment.start_time), "HH:mm")} -{" "}
                            {format(new Date(appointment.end_time), "HH:mm")}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <a
                            href={appointment.google_meet_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-indigo-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-indigo-700 text-center"
                          >
                            Rejoindre
                          </a>
                          <button className="bg-white text-red-600 border border-red-600 px-3 py-1 rounded-md text-xs font-medium hover:bg-red-50 text-center">
                            Annuler
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">Aucun rendez-vous programmé</p>
            )}
          </div>
        </div>

        {/* Créneaux et formulaire */}
        <div className="md:col-span-2">
          {bookingStep === 1 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Créneaux disponibles pour le{" "}
                  {selectedDate && format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                </h2>

                {timeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={slot.available ? "outline" : "ghost"}
                        disabled={!slot.available}
                        onClick={() => handleSlotSelect(slot)}
                        className={`h-auto py-3 ${slot.available ? "hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300" : "opacity-50 cursor-not-allowed"}`}
                      >
                        {format(slot.startTime, "HH:mm")} - {format(slot.endTime, "HH:mm")}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">Aucun créneau disponible pour cette date</p>
                )}
              </CardContent>
            </Card>
          )}

          {bookingStep === 2 && selectedSlot && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Détails du rendez-vous</h2>

                <div className="mb-4 p-3 bg-indigo-50 rounded-md">
                  <p className="font-medium">
                    {selectedDate && format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                  </p>
                  <p>
                    {format(selectedSlot.startTime, "HH:mm")} - {format(selectedSlot.endTime, "HH:mm")}
                  </p>
                  <p>Avec Dr. Badra Hedfi</p>
                </div>

                <form className="space-y-4">
                  <div>
                    <label htmlFor="appointmentTitle" className="block text-sm font-medium text-gray-700 mb-1">
                      Motif du rendez-vous
                    </label>
                    <input
                      type="text"
                      id="appointmentTitle"
                      value={appointmentTitle}
                      onChange={(e) => setAppointmentTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ex: Consultation initiale, Suivi, Anxiété..."
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="appointmentDescription" className="block text-sm font-medium text-gray-700 mb-1">
                      Description (facultatif)
                    </label>
                    <textarea
                      id="appointmentDescription"
                      value={appointmentDescription}
                      onChange={(e) => setAppointmentDescription(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Décrivez brièvement la raison de votre rendez-vous..."
                    ></textarea>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setBookingStep(1)}>
                      Retour
                    </Button>

                    <Button onClick={handleBookAppointment} disabled={!appointmentTitle || loading}>
                      {loading ? "Réservation en cours..." : "Confirmer le rendez-vous"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {bookingStep === 3 && bookingSuccess && (
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Rendez-vous confirmé!</h2>
                <p className="text-gray-600 mb-6">
                  Votre rendez-vous avec Dr. Badra Hedfi a été programmé avec succès. Vous recevrez un email de
                  confirmation avec le lien Google Meet.
                </p>

                <div className="mb-6 p-4 bg-indigo-50 rounded-md inline-block">
                  <p className="font-medium">
                    {selectedDate && format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                  </p>
                  <p>
                    {selectedSlot &&
                      `${format(selectedSlot.startTime, "HH:mm")} - ${format(selectedSlot.endTime, "HH:mm")}`}
                  </p>
                  <p className="font-medium mt-2">{appointmentTitle}</p>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBookingStep(1)
                      setSelectedSlot(null)
                      setAppointmentTitle("")
                      setAppointmentDescription("")
                      setBookingSuccess(false)
                    }}
                  >
                    Prendre un autre rendez-vous
                  </Button>

                  <Button onClick={() => (window.location.href = "/dashboard")}>Retour au tableau de bord</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
