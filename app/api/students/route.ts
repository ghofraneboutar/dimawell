import { NextResponse } from "next/server"
import { validateAuth, checkRole } from "@/lib/auth"
import { getAllStudents, getRecentStudents } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    const authResult = await validateAuth(authHeader)

    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.message }, { status: 401 })
    }

    // Vérifier que l'utilisateur est la psychologue
    const roleResult = checkRole(authResult.user, "psychologist")
    if (!roleResult.authorized) {
      return NextResponse.json({ error: roleResult.message }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = searchParams.get("limit")

    let students

    if (limit && !isNaN(Number(limit))) {
      students = await getRecentStudents(Number(limit))
    } else {
      students = await getAllStudents()
    }

    return NextResponse.json(students)
  } catch (error) {
    console.error("Erreur lors de la récupération des étudiants:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des étudiants" },
      { status: 500 },
    )
  }
}
