import { NextResponse } from "next/server"
import { validateAuth, checkRole } from "@/lib/auth"
import { getLatestDailyTip, createDailyTip } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    const authResult = await validateAuth(authHeader)

    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.message }, { status: 401 })
    }

    const tip = await getLatestDailyTip()

    if (!tip) {
      return NextResponse.json({ error: "Aucun conseil disponible" }, { status: 404 })
    }

    return NextResponse.json(tip)
  } catch (error) {
    console.error("Erreur lors de la récupération du conseil du jour:", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération du conseil du jour" },
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

    // Vérifier que l'utilisateur est la psychologue
    const roleResult = checkRole(authResult.user, "psychologist")
    if (!roleResult.authorized) {
      return NextResponse.json({ error: roleResult.message }, { status: 403 })
    }

    const body = await request.json()
    const { title, content, category } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Le titre et le contenu sont requis" }, { status: 400 })
    }

    // Utiliser la date du jour pour le conseil
    const today = new Date().toISOString().split("T")[0]

    const tipData = {
      title,
      content,
      category: category || "general",
      publishedAt: today,
    }

    const result = await createDailyTip(tipData)

    return NextResponse.json({ message: "Conseil créé avec succès", id: result.insertId }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du conseil:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la création du conseil" }, { status: 500 })
  }
}
