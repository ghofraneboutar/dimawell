import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { getUserByEmail, getUserById, getStudentByUserId } from "./db"

// Fonction pour hacher un mot de passe
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Fonction pour vérifier un mot de passe
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Fonction pour générer un token JWT
export function generateToken(payload: any): string {
  const secret = process.env.JWT_SECRET || "fallback_secret_key_not_secure"
  return jwt.sign(payload, secret, { expiresIn: "24h" })
}

// Fonction pour vérifier un token JWT
export function verifyToken(token: string): any {
  try {
    const secret = process.env.JWT_SECRET || "fallback_secret_key_not_secure"
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}

// Fonction pour authentifier un utilisateur
export async function authenticateUser(email: string, password: string) {
  // Récupérer l'utilisateur
  const user = await getUserByEmail(email)
  if (!user) {
    return { success: false, message: "Email ou mot de passe incorrect" }
  }

  // Vérifier le mot de passe
  // Pour simplifier, on compare directement les mots de passe
  // Dans une application réelle, utilisez bcrypt.compare
  if (user.password !== password) {
    return { success: false, message: "Email ou mot de passe incorrect" }
  }

  // Récupérer les informations supplémentaires selon le rôle
  let additionalInfo = {}
  if (user.role === "student") {
    const studentInfo = await getStudentByUserId(user.id)
    if (studentInfo) {
      additionalInfo = {
        studentId: studentInfo.id,
        studentCode: studentInfo.student_id,
        department: studentInfo.department,
        yearOfStudy: studentInfo.year_of_study,
      }
    }
  }

  // Déterminer le tableau de bord approprié
  const dashboardPath = user.role === "psychologist" ? "/psychologist/dashboard" : "/student/Dashboard"

  // Créer le payload du token
  const tokenPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.first_name,
    lastName: user.last_name,
    dashboardPath, // Inclure le chemin du tableau de bord dans le token
    ...additionalInfo,
  }

  // Générer le token
  const token = generateToken(tokenPayload)

  return {
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      dashboardPath, // Inclure le chemin du tableau de bord dans la réponse
      ...additionalInfo,
    },
  }
}

// Fonction pour extraire le token de l'en-tête Authorization
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null
  }
  return authHeader.substring(7) // Enlever 'Bearer ' du début
}

// Middleware pour vérifier l'authentification
export async function validateAuth(authHeader: string | null) {
  // Extraire le token
  const token = extractTokenFromHeader(authHeader)
  if (!token) {
    return { authenticated: false, message: "Token manquant" }
  }

  // Vérifier le token
  const decoded = verifyToken(token)
  if (!decoded) {
    return { authenticated: false, message: "Token invalide ou expiré" }
  }

  // Vérifier que l'utilisateur existe toujours
  const user = await getUserById(decoded.id)
  if (!user) {
    return { authenticated: false, message: "Utilisateur non trouvé" }
  }

  // Ajouter le chemin du tableau de bord si ce n'est pas déjà fait
  if (!decoded.dashboardPath) {
    decoded.dashboardPath = decoded.role === "psychologist" ? "/psychologist/dashboard" : "/student/Dashboard"
  }

  return { authenticated: true, user: decoded }
}

// Middleware pour vérifier le rôle
export function checkRole(user: any, requiredRole: string) {
  if (user.role !== requiredRole) {
    return { authorized: false, message: "Accès non autorisé" }
  }
  return { authorized: true }
}
