"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { SimplePeerConnection } from "@/lib/webrtc-simple"
import VideoStream from "@/components/video-call/video-stream"

export default function SimpleVideoCall() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [connectionState, setConnectionState] = useState("disconnected")
  const [myPeerId, setMyPeerId] = useState("")
  const [remotePeerId, setRemotePeerId] = useState("")
  const [isCallActive, setIsCallActive] = useState(false)

  const peerConnection = useRef<SimplePeerConnection | null>(null)

  // Générer un ID aléatoire pour l'utilisateur
  useEffect(() => {
    const randomId = Math.random().toString(36).substring(2, 10)
    setMyPeerId(randomId)
  }, [])

  // Initialiser la connexion peer
  useEffect(() => {
    if (!myPeerId) return

    peerConnection.current = new SimplePeerConnection(myPeerId)

    peerConnection.current.onRemoteStreamUpdate = (stream) => {
      setRemoteStream(stream)
      setIsCallActive(true)
    }

    peerConnection.current.onConnectionStateChange = (state) => {
      setConnectionState(state)
      if (state === "disconnected") {
        setIsCallActive(false)
      }
    }

    const initLocalStream = async () => {
      try {
        if (peerConnection.current) {
          const stream = await peerConnection.current.getLocalStream()
          setLocalStream(stream)
        }
      } catch (error) {
        console.error("Erreur d'accès à la caméra:", error)
      }
    }

    initLocalStream()

    return () => {
      if (peerConnection.current) {
        peerConnection.current.endCall()
      }
    }
  }, [myPeerId])

  const handleStartCall = async () => {
    if (!peerConnection.current || !remotePeerId) return

    try {
      await peerConnection.current.callPeer(remotePeerId)
    } catch (error) {
      console.error("Erreur lors de l'appel:", error)
    }
  }

  const handleEndCall = () => {
    if (peerConnection.current) {
      peerConnection.current.endCall()
      setIsCallActive(false)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (peerConnection.current) {
      peerConnection.current.toggleAudio(!isMuted)
    }
  }

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
    if (peerConnection.current) {
      peerConnection.current.toggleVideo(!isVideoOn)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Appel Vidéo Simple</h1>

      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="font-semibold">
          Votre ID: <span className="text-blue-600">{myPeerId}</span>
        </p>
        <p className="text-sm text-gray-600 mt-1">Partagez cet ID avec votre collègue pour qu'il puisse vous appeler</p>
      </div>

      {!isCallActive && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">ID de votre collègue:</label>
                <div className="flex space-x-2">
                  <Input
                    value={remotePeerId}
                    onChange={(e) => setRemotePeerId(e.target.value)}
                    placeholder="Entrez l'ID de votre collègue"
                  />
                  <Button onClick={handleStartCall}>Appeler</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <VideoStream
            stream={localStream}
            muted={true}
            isLocal={true}
            userName="Vous"
            userInitials="VO"
            isVideoEnabled={isVideoOn}
          />
        </div>

        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
          <VideoStream
            stream={remoteStream}
            muted={false}
            isLocal={false}
            userName="Collègue"
            userInitials="CO"
            isVideoEnabled={!!remoteStream}
          />
        </div>
      </div>

      <div className="mt-4 p-4 bg-gray-100 rounded-lg flex justify-center space-x-4">
        <Button variant={isMuted ? "destructive" : "default"} onClick={toggleMute}>
          {isMuted ? "Activer Micro" : "Couper Micro"}
        </Button>

        <Button variant={isVideoOn ? "default" : "destructive"} onClick={toggleVideo}>
          {isVideoOn ? "Couper Vidéo" : "Activer Vidéo"}
        </Button>

        {isCallActive && (
          <Button variant="destructive" onClick={handleEndCall}>
            Terminer l'appel
          </Button>
        )}
      </div>
    </div>
  )
}
