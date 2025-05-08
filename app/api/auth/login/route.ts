import { NextResponse } from "next/server"
import { authenticateUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Authentifier l'utilisateur
    const result = await authenticateUser(email, password)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 401 })
    }

    // Déterminer le tableau de bord approprié
    const dashboardPath = result.user?.role === "psychologist" ? "/psychologist/dashboard" : "/student/Dashboard"

    // Retourner le token et les informations utilisateur
    return NextResponse.json({
      token: result.token,
      user: {
        ...result.user,
        dashboardPath,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la connexion" }, { status: 500 })
  }
}
