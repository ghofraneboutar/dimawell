import { NextResponse } from "next/server"
import { validateAuth } from "@/lib/auth"
import { getWellbeingRecords, createWellbeingRecord } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    const authResult = await validateAuth(authHeader)

    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.message }, { status: 401 })
    }

    // Vérifier que l'utilisateur est un étudiant
    if (authResult.user.role !== "student") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const records = await getWellbeingRecords(authResult.user.studentId)

    return NextResponse.json(records)
  } catch (error) {
    console.error("Erreur lors de la récupération des enregistrements de bien-être:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des enregistrements de bien-être" },
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

    // Vérifier que l'utilisateur est un étudiant
    if (authResult.user.role !== "student") {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const body = await request.json()
    const { moodScore, stressLevel, sleepQuality, notes } = body

    if (moodScore === undefined || stressLevel === undefined || sleepQuality === undefined) {
      return NextResponse.json({ error: "Les scores de bien-être sont requis" }, { status: 400 })
    }

    // Utiliser la date du jour
    const today = new Date().toISOString().split("T")[0]

    const recordData = {
      studentId: authResult.user.studentId,
      moodScore,
      stressLevel,
      sleepQuality,
      notes: notes || "",
      recordedDate: today,
    }

    const result = await createWellbeingRecord(recordData)

    return NextResponse.json({ message: "Enregistrement créé avec succès", id: result.insertId }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de l'enregistrement de bien-être:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la création de l'enregistrement de bien-être" },
      { status: 500 },
    )
  }
}
