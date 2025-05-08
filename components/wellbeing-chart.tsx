"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart } from "lucide-react"
import { useState, useEffect } from "react"

interface DailyTip {
  id: number
  title: string
  content: string
}

export default function DailyTip() {
  const [tip, setTip] = useState<DailyTip | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simuler la récupération d'un conseil
    const fetchTip = async () => {
      try {
        // Dans une application réelle, vous feriez un appel API ici
        // const response = await fetch("/api/tips/daily")
        // const data = await response.json()

        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Données fictives
        const mockTip = {
          id: 1,
          title: "Technique de respiration 4-7-8",
          content:
            "Inspirez pendant 4 secondes, retenez votre souffle pendant 7 secondes, puis expirez pendant 8 secondes. Répétez 3 à 4 fois pour réduire l'anxiété.",
        }

        setTip(mockTip)
      } catch (error) {
        console.error("Erreur lors de la récupération du conseil:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTip()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-[#3f51b5]">Conseil du jour</CardTitle>
        <CardDescription>Astuce pour améliorer votre bien-être</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#5c6bc0]"></div>
          </div>
        ) : tip ? (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-[#e8eaf6] p-2 rounded-full">
                <Heart className="h-4 w-4 text-[#e57373]" />
              </div>
              <h4 className="font-medium">{tip.title}</h4>
            </div>
            <p className="text-gray-600 text-sm">{tip.content}</p>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Aucun conseil disponible aujourd'hui</p>
        )}
      </CardContent>
    </Card>
  )
}
