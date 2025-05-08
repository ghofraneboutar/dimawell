import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const originalPath = request.nextUrl.pathname
  const path = originalPath.toLowerCase()
  const role = request.cookies.get('userRole')?.value

  // Gestion redirection vers dashboard selon rôle
  if (path === '/dashboard') {
    if (role === 'student') {
      return NextResponse.redirect(new URL('/student/Dashboard', request.url))
    } else if (role === 'psychologist') {
      return NextResponse.redirect(new URL('/psychologist/dashboard', request.url))
    }
  }

  // Redirection explicite (ex: mauvaise casse)
  if (originalPath === '/student/Dashboard') {
    return NextResponse.redirect(new URL('/student/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard', '/student/Dashboard'],
}
