import { NextResponse } from "next/server"
import { validateAuth } from "@/lib/auth"
import { getUnreadMessages, getConversation, sendMessage, markMessageAsRead } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    const authResult = await validateAuth(authHeader)

    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.message }, { status: 401 })
    }

    const user = authResult.user
    const { searchParams } = new URL(request.url)
    const withUserId = searchParams.get("with")
    const unread = searchParams.get("unread")
    const limit = searchParams.get("limit")

    let messages

    if (withUserId) {
      // Récupérer la conversation avec un utilisateur spécifique
      messages = await getConversation(user.id, Number(withUserId))
    } else if (unread === "true") {
      // Récupérer les messages non lus
      messages = await getUnreadMessages(user.id)
    } else {
      // Par défaut, récupérer les messages non lus
      messages = await getUnreadMessages(user.id)
    }

    // Appliquer la limite si spécifiée
    if (limit && !isNaN(Number(limit))) {
      messages = messages.slice(0, Number(limit))
    }

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Erreur lors de la récupération des messages:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la récupération des messages" }, { status: 500 })
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
    const { receiverId, content } = body

    if (!receiverId || !content) {
      return NextResponse.json({ error: "Le destinataire et le contenu sont requis" }, { status: 400 })
    }

    const result = await sendMessage(authResult.user.id, receiverId, content)

    return NextResponse.json({ message: "Message envoyé avec succès", id: result.insertId }, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de l'envoi du message" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    const authResult = await validateAuth(authHeader)

    if (!authResult.authenticated) {
      return NextResponse.json({ error: authResult.message }, { status: 401 })
    }

    const body = await request.json()
    const { messageId } = body

    if (!messageId) {
      return NextResponse.json({ error: "L'ID du message est requis" }, { status: 400 })
    }

    await markMessageAsRead(messageId)

    return NextResponse.json({ message: "Message marqué comme lu" })
  } catch (error) {
    console.error("Erreur lors de la mise à jour du message:", error)
    return NextResponse.json({ error: "Une erreur est survenue lors de la mise à jour du message" }, { status: 500 })
  }
}
