"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Video, VideoOff, Phone, MessageSquare, Users } from "lucide-react"

interface VideoCallClientProps {
  sessionId: string
  psychologistId: string
  psychologistName: string
  psychologistInitials: string
  studentName: string
  studentInitials: string
}

export default function VideoCallClient({
  sessionId,
  psychologistId,
  psychologistName,
  psychologistInitials,
  studentName,
  studentInitials,
}: VideoCallClientProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [activeTab, setActiveTab] = useState("call")
  const [notes, setNotes] = useState("")
  const [googleMeetUrl, setGoogleMeetUrl] = useState("")

  // Simuler la récupération du lien Google Meet
  useEffect(() => {
    // Dans une application réelle, ce lien viendrait de la base de données
    setGoogleMeetUrl("https://meet.google.com/abc-defg-hij")
  }, [])

  // Gérer le basculement du micro
  const handleToggleMute = () => {
    setIsMuted(!isMuted)
    // Dans une application réelle, vous appelleriez l'API Google Meet pour couper le micro
  }

  // Gérer le basculement de la vidéo
  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    // Dans une application réelle, vous appelleriez l'API Google Meet pour couper la vidéo
  }

  // Gérer la fin de l'appel
  const handleEndCall = () => {
    // Dans une application réelle, vous fermeriez la connexion et redirigeriez l'utilisateur
    window.location.href = "/dashboard"
  }

  // Gérer l'affichage du chat
  const handleToggleChat = () => {
    setShowChat(!showChat)
    setShowParticipants(false)
    setActiveTab("chat")
  }

  // Gérer l'affichage des participants
  const handleToggleParticipants = () => {
    setShowParticipants(!showParticipants)
    setShowChat(false)
    setActiveTab("participants")
  }

  // Gérer la sauvegarde des notes
  const handleSaveNotes = async () => {
    // Dans une application réelle, vous enverriez les notes au serveur
    alert("Notes sauvegardées avec succès!")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Consultation vidéo</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className={`md:col-span-${showChat || showParticipants ? "3" : "4"}`}>
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="call" value={activeTab} className="w-full">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="call" onClick={() => setActiveTab("call")}>
                    Appel
                  </TabsTrigger>
                  <TabsTrigger value="notes" onClick={() => setActiveTab("notes")}>
                    Notes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="call" className="mt-0">
                  <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden mb-6">
                    <iframe
                      src={googleMeetUrl}
                      allow="camera; microphone; fullscreen; display-capture; autoplay"
                      className="w-full h-full"
                    ></iframe>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button variant={isMuted ? "destructive" : "default"} size="icon" onClick={handleToggleMute}>
                      {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>

                    <Button variant={isVideoOn ? "default" : "destructive"} size="icon" onClick={handleToggleVideo}>
                      {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>

                    <Button variant="outline" size="icon" onClick={handleToggleChat}>
                      <MessageSquare className="h-5 w-5" />
                    </Button>

                    <Button variant="outline" size="icon" onClick={handleToggleParticipants}>
                      <Users className="h-5 w-5" />
                    </Button>

                    <Button variant="destructive" size="icon" onClick={handleEndCall}>
                      <Phone className="h-5 w-5 rotate-135" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-0">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-3">
                      <p className="text-sm font-medium">Sujet de la séance</p>
                      <p className="text-gray-600">Gestion du stress lié aux examens</p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <p className="text-sm font-medium">Objectifs</p>
                      <ul className="list-disc pl-5 text-gray-600">
                        <li>Identifier les sources de stress</li>
                        <li>Développer des stratégies d'adaptation</li>
                        <li>Améliorer la concentration</li>
                      </ul>
                    </div>

                    <div className="border rounded-lg p-3">
                      <p className="text-sm font-medium">Notes de la séance</p>
                      <textarea
                        className="w-full mt-2 p-2 border rounded-md h-32"
                        placeholder="Prenez des notes pendant la consultation..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      ></textarea>
                      <Button className="mt-2" onClick={handleSaveNotes}>
                        Enregistrer les notes
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {showChat && (
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <div className="flex flex-col h-full">
                  <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="font-semibold">Chat</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                      ×
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3">
                    <p className="text-center text-gray-500 text-sm">
                      Le chat n'est pas disponible pour les consultations via Google Meet. Veuillez utiliser le chat
                      intégré de Google Meet.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showParticipants && (
          <div className="md:col-span-1">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <div className="flex flex-col h-full">
                  <div className="p-3 border-b flex justify-between items-center">
                    <h3 className="font-semibold">Participants</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowParticipants(false)}>
                      ×
                    </Button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-3">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            {psychologistInitials}
                          </div>
                          <p className="text-sm font-medium">{psychologistName}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            {studentInitials}
                          </div>
                          <p className="text-sm font-medium">{studentName} (Vous)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
