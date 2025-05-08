import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  console.log("Middleware executed for path:", request.nextUrl.pathname)

  // Si l'utilisateur accède à /dashboard
  if (request.nextUrl.pathname === "/dashboard") {
    console.log("Dashboard route detected in middleware")

    // Rediriger vers une page qui existe certainement
    return NextResponse.redirect(new URL("/dashboard-redirect", request.url))
  }

  // Si l'utilisateur accède à /student/dashboard (avec d minuscule)
  if (request.nextUrl.pathname === "/student/dashboard") {
    console.log("Redirecting from /student/dashboard to /student/Dashboard")

    // Rediriger vers la version avec la casse correcte (D majuscule)
    return NextResponse.redirect(new URL("/student/Dashboard", request.url))
  }

  // Pour les autres routes, on continue normalement
  return NextResponse.next()
}

// Configurer le middleware pour s'exécuter sur les routes spécifiées
export const config = {
  matcher: ["/dashboard", "/student/Dashboard"],
}
