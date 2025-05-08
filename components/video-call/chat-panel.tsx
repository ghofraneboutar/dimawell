"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Send } from "lucide-react"

interface Message {
  id: string
  sender: string
  text: string
  timestamp: Date
}

interface ChatPanelProps {
  onClose: () => void
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Dr. badra",
      text: "Bonjour, comment allez-vous aujourd'hui?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    },
    {
      id: "2",
      sender: "Vous",
      text: "Bonjour Docteur, je vais bien merci. J'ai quelques questions à vous poser.",
      timestamp: new Date(Date.now() - 1000 * 60 * 4), // 4 minutes ago
    },
    {
      id: "3",
      sender: "Dr. badra",
      text: "Je vous écoute, n'hésitez pas à me poser toutes vos questions.",
      timestamp: new Date(Date.now() - 1000 * 60 * 3), // 3 minutes ago
    },
  ])

  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    const message: Message = {
      id: Date.now().toString(),
      sender: "Vous",
      text: newMessage,
      timestamp: new Date(),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full border-l bg-white">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-semibold text-[#3f51b5]">Chat</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.sender === "Vous" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === "Vous" ? "bg-[#e8eaf6] text-gray-800" : "bg-[#3f51b5] text-white"
                }`}
              >
                <p>{message.text}</p>
              </div>
              <span className="text-xs text-gray-500 mt-1">
                {message.sender}, {formatTime(message.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Tapez votre message..."
            className="flex-1 p-2 border rounded-md"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage()
              }
            }}
          />
          <Button size="icon" onClick={handleSendMessage}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
