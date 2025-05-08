"use client"

import { Button } from "@/components/ui/button"
import {
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
  Phone,
  MessageSquare,
  Users,
  MonitorIcon as MonitorShare,
  MonitorOff,
} from "lucide-react"

interface CallControlsProps {
  isMuted: boolean
  isVideoOn: boolean
  isScreenSharing: boolean
  onToggleMute: () => void
  onToggleVideo: () => void
  onEndCall: () => void
  onToggleChat: () => void
  onToggleParticipants: () => void
  onShareScreen: () => void
}

export default function CallControls({
  isMuted,
  isVideoOn,
  isScreenSharing,
  onToggleMute,
  onToggleVideo,
  onEndCall,
  onToggleChat,
  onToggleParticipants,
  onShareScreen,
}: CallControlsProps) {
  return (
    <div className="p-4 bg-gray-100 flex items-center justify-center gap-4">
      <Button
        variant={isMuted ? "outline" : "default"}
        size="icon"
        onClick={onToggleMute}
        className={isMuted ? "bg-red-100 text-red-500 hover:bg-red-200 border-red-200" : ""}
      >
        {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>

      <Button
        variant={isVideoOn ? "default" : "outline"}
        size="icon"
        onClick={onToggleVideo}
        className={!isVideoOn ? "bg-red-100 text-red-500 hover:bg-red-200 border-red-200" : ""}
      >
        {isVideoOn ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
      </Button>

      <Button
        variant={isScreenSharing ? "default" : "outline"}
        size="icon"
        onClick={onShareScreen}
        className={isScreenSharing ? "bg-green-100 text-green-500 hover:bg-green-200 border-green-200" : ""}
      >
        {isScreenSharing ? <MonitorShare className="h-5 w-5" /> : <MonitorOff className="h-5 w-5" />}
      </Button>

      <Button variant="outline" size="icon" onClick={onToggleChat}>
        <MessageSquare className="h-5 w-5" />
      </Button>

      <Button variant="outline" size="icon" onClick={onToggleParticipants}>
        <Users className="h-5 w-5" />
      </Button>

      <Button variant="destructive" size="icon" onClick={onEndCall}>
        <Phone className="h-5 w-5 rotate-135" />
      </Button>
    </div>
  )
}
