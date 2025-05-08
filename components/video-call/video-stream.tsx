"use client"

import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface VideoStreamProps {
  stream: MediaStream | null
  muted?: boolean
  isLocal?: boolean
  userName: string
  userInitials: string
  isVideoEnabled: boolean
}

export default function VideoStream({
  stream,
  muted = false,
  isLocal = false,
  userName,
  userInitials,
  isVideoEnabled,
}: VideoStreamProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      {stream && isVideoEnabled ? (
        <video ref={videoRef} autoPlay playsInline muted={muted} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-2xl bg-[#5c6bc0]">{userInitials}</AvatarFallback>
          </Avatar>
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
        {userName} {isLocal && "(Vous)"}
      </div>
    </div>
  )
}
