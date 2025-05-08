import { NextResponse } from "next/server"
import { hashPassword, generateToken } from "@/lib/auth"
import { createUser, createStudent, getUserByEmail } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password, role = "student", studentId, department, yearOfStudy } = body

    // Vérifier que tous les champs requis sont présents
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 })
    }

    // Vérifier si l'email est un email universitaire
    if (email !== "ghadaazizi2023@gmail.com" && !email.endsWith("@rades.r-iset.tn")) {
      return NextResponse.json(
        { error: "Veuillez utiliser votre email universitaire (@rades.r-iset.tn ou @iset.tn)" },
        { status: 400 },
      )
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 400 })
    }

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(password)

    // Créer l'utilisateur
    const userId = await createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role, // Utilisation du rôle fourni dans le corps de la requête ou "student" par défaut
    })

    // Créer le profil selon le rôle
    if (role === "student") {
      // Vérifier que les informations de l'étudiant sont présentes
      if (!studentId || !department || !yearOfStudy) {
        return NextResponse.json({ error: "Informations d'étudiant incomplètes" }, { status: 400 })
      }

      await createStudent(userId, {
        studentId,
        department,
        yearOfStudy,
      })
    } else if (role !== "psychologist") {
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 })
    }

    // Définir la route du dashboard selon le rôle (avec la casse correcte - D majuscule)
    const dashboardPath = role === "student" ? "/student/Dashboard" : "/psychologist/dashboard"

    // Créer le payload du token
    const tokenPayload = {
      id: userId,
      email,
      role,
      firstName,
      lastName,
      dashboardPath, // Inclure le chemin du tableau de bord dans le token
    }

    // Générer le token
    const token = generateToken(tokenPayload)

    return NextResponse.json(
      {
        token,
        user: {
          id: userId,
          email,
          firstName,
          lastName,
          role,
          dashboardPath, // Redirection dynamique vers le dashboard selon le rôle
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de l'inscription" }, { status: 500 })
  }
}
