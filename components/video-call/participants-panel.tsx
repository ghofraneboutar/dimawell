"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ParticipantsPanelProps {
  onClose: () => void
}

export default function ParticipantsPanel({ onClose }: ParticipantsPanelProps) {
  // Dummy data for participants
  const participants = [
    { id: "1", name: "Dr. badra", initials: "SM" },
    { id: "2", name: "Étudiant Test", initials: "ET" },
  ]

  return (
    <div className="flex flex-col h-full border-l bg-white">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-semibold text-[#3f51b5]">Participants</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-2">
          {participants.map((participant) => (
            <li key={participant.id} className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-[#5c6bc0] text-white flex items-center justify-center uppercase">
                {participant.initials}
              </div>
              <span>{participant.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
