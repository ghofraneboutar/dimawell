import Peer from "peerjs"

export class SimplePeerConnection {
  peer: Peer
  localStream: MediaStream | null = null
  remoteStream: MediaStream | null = null
  connection: any = null
  onRemoteStreamUpdate: (stream: MediaStream) => void = () => {}
  onConnectionStateChange: (state: string) => void = () => {}

  constructor(userId: string) {
    // Créer une instance PeerJS avec un ID unique
    this.peer = new Peer(userId, {
      host: "peerjs-server.herokuapp.com", // Serveur public gratuit
      secure: true,
    })

    // Configurer les événements
    this.setupPeerEvents()
  }

  private setupPeerEvents() {
    // Quand la connexion au serveur est établie
    this.peer.on("open", (id) => {
      console.log("Mon ID PeerJS:", id)
      this.onConnectionStateChange("connected")
    })

    // Quand on reçoit un appel
    this.peer.on("call", (call) => {
      console.log("Appel entrant de:", call.peer)

      // Répondre automatiquement avec notre flux local
      if (this.localStream) {
        call.answer(this.localStream)
        this.handleCall(call)
      }
    })

    // Erreurs
    this.peer.on("error", (err) => {
      console.error("Erreur PeerJS:", err)
      this.onConnectionStateChange("error")
    })
  }

  private handleCall(call: any) {
    // Quand on reçoit le flux distant
    call.on("stream", (stream: MediaStream) => {
      console.log("Flux distant reçu")
      this.remoteStream = stream
      this.onRemoteStreamUpdate(stream)
    })

    // Quand l'appel se termine
    call.on("close", () => {
      console.log("Appel terminé")
      this.onConnectionStateChange("disconnected")
    })

    this.connection = call
  }

  async getLocalStream(video = true, audio = true): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video, audio })
      return this.localStream
    } catch (error) {
      console.error("Erreur d'accès aux périphériques:", error)
      throw error
    }
  }

  async callPeer(peerId: string): Promise<void> {
    if (!this.localStream) {
      throw new Error("Flux local non disponible")
    }

    console.log("Appel de:", peerId)
    const call = this.peer.call(peerId, this.localStream)
    this.handleCall(call)
  }

  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }

  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }

  endCall(): void {
    if (this.connection) {
      this.connection.close()
    }

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
    }

    this.peer.destroy()
  }
}
