"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

interface Message {
  id: number
  sender_id: number
  receiver_id: number
  content: string
  is_read: boolean
  created_at: string
  sender_name?: string
}

interface User {
  id: number
  first_name: string
  last_name: string
  role: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [psychologist, setPsychologist] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, token } = useAuth()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Charger les données utilisateur et les messages
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !token) {
        setError("Utilisateur non authentifié")
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Définir l'utilisateur connecté à partir du contexte d'authentification
        const currentUserData: User = {
          id: user.id,
          first_name: user.firstName,
          last_name: user.lastName,
          role: user.role || "student",
        }
        setCurrentUser(currentUserData)

        // Récupérer les informations du psychologue (exemple : ID 2 pour Dr. Badra Hedfi)
        // Vous devrez peut-être ajuster cette requête pour récupérer dynamiquement le psychologue
        const psychologistResponse = await fetch("/api/users/2", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!psychologistResponse.ok) throw new Error("Erreur lors de la récupération du psychologue")
        const psychologistData = await psychologistResponse.json()
        setPsychologist(psychologistData)

        // Récupérer les messages de la conversation
        const messagesResponse = await fetch(`/api/messages?with=${psychologistData.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!messagesResponse.ok) throw new Error("Erreur lors de la récupération des messages")
        const messagesData = await messagesResponse.json()
        setMessages(messagesData)

        // Marquer les messages reçus comme lus
        for (const message of messagesData) {
          if (message.receiver_id === currentUserData.id && !message.is_read) {
            await fetch("/api/messages", {
              method: "PATCH",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ messageId: message.id }),
            })
          }
        }

        setLoading(false)
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err)
        setError("Une erreur est survenue lors du chargement des données")
        setLoading(false)
      }
    }

    fetchData()
  }, [user, token])

  // Faire défiler vers le bas lorsque de nouveaux messages sont ajoutés
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Envoyer un nouveau message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !psychologist || !token) return

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiverId: psychologist.id,
          content: newMessage,
        }),
      })

      if (!response.ok) throw new Error("Erreur lors de l'envoi du message")

      const result = await response.json()
      const newMessageObj: Message = {
        id: result.id,
        sender_id: currentUser.id,
        receiver_id: psychologist.id,
        content: newMessage,
        is_read: false,
        created_at: new Date().toISOString(),
        sender_name: "Vous",
      }

      setMessages([...messages, newMessageObj])
      setNewMessage("")
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err)
      setError("Erreur lors de l'envoi du message")
    }
  }

  // Formater la date du message
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Messagerie</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-200px)] flex flex-col">
        {/* En-tête */}
        <div className="bg-indigo-600 text-white p-4">
          <h2 className="text-xl font-semibold">
            Dr. {psychologist?.first_name} {psychologist?.last_name}
          </h2>
          <p className="text-sm opacity-80">Psychologue</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === currentUser?.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.sender_id === currentUser?.id ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender_id === currentUser?.id ? "text-indigo-200" : "text-gray-500"
                  }`}
                >
                  {formatMessageDate(message.created_at)}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Formulaire d'envoi */}
        <div className="border-t p-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="rounded-full">
              <Paperclip className="h-5 w-5" />
            </Button>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Tapez votre message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />

            <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="rounded-full">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}