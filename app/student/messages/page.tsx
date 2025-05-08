"use client"

import { useState, useEffect, useRef } from "react"
import { Send, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"

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

  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Simuler le chargement des données utilisateur et des messages
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simuler les données utilisateur
        const mockCurrentUser = {
          id: 1,
          first_name: "Étudiant",
          last_name: "Test",
          role: "student",
        }

        const mockPsychologist = {
          id: 2,
          first_name: "Badra",
          last_name: "Hedfi",
          role: "psychologist",
        }

        // Simuler les messages
        const mockMessages = [
          {
            id: 1,
            sender_id: 2,
            receiver_id: 1,
            content: "Bonjour, comment puis-je vous aider aujourd'hui?",
            is_read: true,
            created_at: "2023-04-15T10:30:00",
            sender_name: "Dr. Badra Hedfi",
          },
          {
            id: 2,
            sender_id: 1,
            receiver_id: 2,
            content: "Bonjour Dr. Hedfi, je souhaiterais discuter de mon stress lié aux examens.",
            is_read: true,
            created_at: "2023-04-15T10:32:00",
            sender_name: "Vous",
          },
          {
            id: 3,
            sender_id: 2,
            receiver_id: 1,
            content: "Bien sûr, je comprends. Pouvez-vous me décrire ce que vous ressentez exactement?",
            is_read: true,
            created_at: "2023-04-15T10:35:00",
            sender_name: "Dr. Badra Hedfi",
          },
          {
            id: 4,
            sender_id: 1,
            receiver_id: 2,
            content: "J'ai du mal à me concentrer et je me sens très anxieux à l'approche des examens.",
            is_read: true,
            created_at: "2023-04-15T10:38:00",
            sender_name: "Vous",
          },
          {
            id: 5,
            sender_id: 2,
            receiver_id: 1,
            content:
              "C'est tout à fait normal de ressentir cela. Nous pouvons travailler ensemble sur des techniques de gestion du stress. Seriez-vous disponible pour une consultation cette semaine?",
            is_read: true,
            created_at: "2023-04-15T10:42:00",
            sender_name: "Dr. Badra Hedfi",
          },
        ]

        setCurrentUser(mockCurrentUser)
        setPsychologist(mockPsychologist)
        setMessages(mockMessages)
        setLoading(false)
      } catch (error) {
        console.error("Erreur lors du chargement des messages:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Faire défiler vers le bas lorsque de nouveaux messages sont ajoutés
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Envoyer un nouveau message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser || !psychologist) return

    const newMessageObj: Message = {
      id: messages.length + 1,
      sender_id: currentUser.id,
      receiver_id: psychologist.id,
      content: newMessage,
      is_read: false,
      created_at: new Date().toISOString(),
      sender_name: "Vous",
    }

    setMessages([...messages, newMessageObj])
    setNewMessage("")

    // Simuler une réponse automatique après 2 secondes
    setTimeout(() => {
      const autoResponse: Message = {
        id: messages.length + 2,
        sender_id: psychologist.id,
        receiver_id: currentUser.id,
        content: "Merci pour votre message. Je vous répondrai dès que possible.",
        is_read: false,
        created_at: new Date().toISOString(),
        sender_name: `Dr. ${psychologist.first_name} ${psychologist.last_name}`,
      }

      setMessages((prev) => [...prev, autoResponse])
    }, 2000)
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Messagerie</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden h-[calc(100vh-200px)] flex flex-col">
        {/* En-tête */}
        <div className="bg-indigo-600 text-white p-4">
          <h2 className="text-xl font-semibold">Dr. Badra Hedfi</h2>
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
