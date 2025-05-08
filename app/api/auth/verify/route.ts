import { NextResponse } from "next/server"
import { validateAuth } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    const result = await validateAuth(authHeader)

    if (!result.authenticated) {
      return NextResponse.json({ error: result.message }, { status: 401 })
    }

    // Déterminer le tableau de bord approprié
    const dashboardPath = result.user.role === "psychologist" ? "/psychologist/dashboard" : "/student/Dashboard"

    return NextResponse.json({
      user: {
        ...result.user,
        dashboardPath,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la vérification du token" }, { status: 500 })
  }
}
