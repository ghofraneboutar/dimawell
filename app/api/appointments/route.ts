import { NextResponse } from "next/server"
import { validateAuth } from "@/lib/auth"
import { getStudentAppointments, getPsychologistAppointments, createAppointment, getTodayAppointments } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    const authResult = await validateAuth(authHeader)

    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.message }, { status: 401 })
    }

    const user = authResult.user
    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")
    const limit = searchParams.get("limit")

    let appointments

    if (user.role === "student") {
      appointments = await getStudentAppointments(user.studentId)
    } else if (user.role === "psychologist") {
      if (date === "today") {
        appointments = await getTodayAppointments()
      } else {
        appointments = await getPsychologistAppointments()
      }
    }

    // Appliquer la limite si spécifiée
    if (limit && !isNaN(Number(limit))) {
      appointments = appointments.slice(0, Number(limit))
    }

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Erreur lors de la récupération des rendez-vous:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des rendez-vous" },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    const authResult = await validateAuth(authHeader)

    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.message }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, startTime, endTime, googleMeetLink } = body

    // Si c'est un étudiant qui crée le rendez-vous
    if (authResult.user.role === "student") {
      const appointmentData = {
        studentId: authResult.user.studentId,
        title,
        description,
        startTime,
        endTime,
        googleMeetLink,
      }

      const result = await createAppointment(appointmentData)
      return NextResponse.json({ message: "Rendez-vous créé avec succès", id: result.insertId }, { status: 201 })
    }
    // Si c'est la psychologue qui crée le rendez-vous
    else if (authResult.user.role === "psychologist") {
      const { studentId } = body
      if (!studentId) {
        return NextResponse.json({ error: "L'ID de l'étudiant est requis" }, { status: 400 })
      }

      const appointmentData = {
        studentId,
        title,
        description,
        startTime,
        endTime,
        googleMeetLink,
      }

      const result = await createAppointment(appointmentData)
      return NextResponse.json({ message: "Rendez-vous créé avec succès", id: result.insertId }, { status: 201 })
    }

    return NextResponse.json({ error: "Rôle non autorisé" }, { status: 403 })
  } catch (error) {
    console.error("Erreur lors de la création du rendez-vous:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la création du rendez-vous" }, { status: 500 })
  }
}
