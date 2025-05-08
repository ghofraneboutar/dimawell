// Implémentation des classes WebRTCConnection et SignalingService

// Configuration des serveurs ICE (STUN/TURN)
const iceServers = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
    // Vous pouvez ajouter des serveurs TURN pour une meilleure connectivité
    // {
    //   urls: ["turn:your-turn-server.com:3478"],
    //   username: "username",
    //   credential: "password"
    // }
  ],
}

/**
 * Classe pour gérer la connexion WebRTC
 */
export class WebRTCConnection {
  peerConnection: RTCPeerConnection
  localStream: MediaStream | null = null
  remoteStream: MediaStream | null = null
  userId: string
  remoteUserId: string
  onRemoteStreamUpdate: (stream: MediaStream) => void = () => {}
  onConnectionStateChange: (state: RTCPeerConnectionState) => void = () => {}
  onIceCandidate: (candidate: RTCIceCandidate) => void = () => {}

  constructor(userId: string, remoteUserId: string) {
    this.userId = userId
    this.remoteUserId = remoteUserId
    this.peerConnection = new RTCPeerConnection(iceServers)

    // Configurer les événements de la connexion peer
    this.setupPeerConnectionEvents()
  }

  /**
   * Configurer les événements pour la connexion peer
   */
  private setupPeerConnectionEvents() {
    // Gérer les candidats ICE
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.onIceCandidate(event.candidate)
      }
    }

    // Gérer les changements d'état de la connexion
    this.peerConnection.onconnectionstatechange = () => {
      this.onConnectionStateChange(this.peerConnection.connectionState)
    }

    // Gérer les pistes reçues
    this.peerConnection.ontrack = (event) => {
      if (!this.remoteStream) {
        this.remoteStream = new MediaStream()
        this.onRemoteStreamUpdate(this.remoteStream)
      }

      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream?.addTrack(track)
      })
    }
  }

  /**
   * Obtenir le flux média local (audio/vidéo)
   */
  async getLocalStream(video = true, audio = true): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video,
        audio,
      })

      // Ajouter les pistes au peer connection
      this.localStream.getTracks().forEach((track) => {
        if (this.localStream) {
          this.peerConnection.addTrack(track, this.localStream)
        }
      })

      return this.localStream
    } catch (error) {
      console.error("Erreur lors de l'accès aux périphériques média:", error)
      throw error
    }
  }

  /**
   * Créer une offre SDP
   */
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    try {
      const offer = await this.peerConnection.createOffer()
      await this.peerConnection.setLocalDescription(offer)
      return offer
    } catch (error) {
      console.error("Erreur lors de la création de l'offre:", error)
      throw error
    }
  }

  /**
   * Gérer une offre reçue
   */
  async handleOffer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      const answer = await this.peerConnection.createAnswer()
      await this.peerConnection.setLocalDescription(answer)
      return answer
    } catch (error) {
      console.error("Erreur lors du traitement de l'offre:", error)
      throw error
    }
  }

  /**
   * Gérer une réponse reçue
   */
  async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    try {
      await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer))
    } catch (error) {
      console.error("Erreur lors du traitement de la réponse:", error)
      throw error
    }
  }

  /**
   * Ajouter un candidat ICE
   */
  async addIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    try {
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    } catch (error) {
      console.error("Erreur lors de l'ajout du candidat ICE:", error)
      throw error
    }
  }

  /**
   * Activer/désactiver l'audio
   */
  toggleAudio(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }

  /**
   * Activer/désactiver la vidéo
   */
  toggleVideo(enabled: boolean): void {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled
      })
    }
  }

  /**
   * Terminer l'appel
   */
  endCall(): void {
    // Fermer la connexion peer
    this.peerConnection.close()

    // Arrêter les pistes locales
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }

    // Nettoyer le flux distant
    this.remoteStream = null
  }
}

/**
 * Classe pour gérer la signalisation entre les pairs
 * Dans une application réelle, vous utiliseriez WebSockets ou une autre technologie en temps réel
 * Cette implémentation simule la signalisation avec localStorage pour les tests
 */
export class SignalingService {
  userId: string
  pollingInterval: NodeJS.Timeout | null = null
  messageQueue: Map<string, any[]> = new Map()

  constructor(userId: string) {
    this.userId = userId
  }

  /**
   * Envoyer un message à un utilisateur distant
   */
  async sendMessage(recipientId: string, type: string, payload: any): Promise<void> {
    try {
      // Dans une application réelle, vous enverriez ce message à un serveur
      // Pour les tests, nous utilisons localStorage
      const message = {
        sender: this.userId,
        recipient: recipientId,
        type,
        payload,
        timestamp: Date.now(),
      }

      // Récupérer les messages existants
      const existingMessagesJson = localStorage.getItem(`signaling_${recipientId}`) || "[]"
      const existingMessages = JSON.parse(existingMessagesJson)

      // Ajouter le nouveau message
      existingMessages.push(message)

      // Enregistrer les messages mis à jour
      localStorage.setItem(`signaling_${recipientId}`, JSON.stringify(existingMessages))

      console.log(`Message envoyé à ${recipientId}:`, message)
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
      throw error
    }
  }

  /**
   * Démarrer le polling pour les messages entrants
   */
  startPolling(callback: (messages: any[]) => void): void {
    // Nettoyer les messages précédents
    localStorage.setItem(`signaling_${this.userId}`, "[]")

    // Démarrer le polling
    this.pollingInterval = setInterval(() => {
      try {
        // Récupérer les messages
        const messagesJson = localStorage.getItem(`signaling_${this.userId}`) || "[]"
        const messages = JSON.parse(messagesJson)

        if (messages.length > 0) {
          // Traiter les messages
          callback(messages)

          // Nettoyer les messages traités
          localStorage.setItem(`signaling_${this.userId}`, "[]")
        }
      } catch (error) {
        console.error("Erreur lors du polling des messages:", error)
      }
    }, 1000) // Vérifier toutes les secondes
  }

  /**
   * Arrêter le polling
   */
  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }
  }
}
