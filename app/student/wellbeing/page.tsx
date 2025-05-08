"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, TrendingUp, Lightbulb } from "lucide-react"

interface DailyTip {
  id: number
  title: string
  content: string
  category: string
  published_at: string
}

interface WellbeingRecord {
  id: number
  mood_score: number
  stress_level: number
  sleep_quality: number
  notes: string
  recorded_date: string
}

export default function WellbeingPage() {
  const [activeTab, setActiveTab] = useState("tracker")
  const [dailyTips, setDailyTips] = useState<DailyTip[]>([])
  const [wellbeingRecords, setWellbeingRecords] = useState<WellbeingRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    moodScore: 5,
    stressLevel: 5,
    sleepQuality: 5,
    notes: "",
  })

  // Simuler le chargement des données
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Simuler les conseils quotidiens
        const mockTips: DailyTip[] = [
          {
            id: 1,
            title: "Technique de respiration 4-7-8",
            content:
              "Inspirez pendant 4 secondes, retenez votre souffle pendant 7 secondes, puis expirez pendant 8 secondes. Répétez 3 à 4 fois pour réduire l'anxiété.",
            category: "stress",
            published_at: "2023-04-16",
          },
          {
            id: 2,
            title: "Améliorer votre sommeil",
            content:
              "Évitez les écrans au moins 1 heure avant de vous coucher. La lumière bleue peut perturber votre rythme circadien et rendre l'endormissement plus difficile.",
            category: "sleep",
            published_at: "2023-04-15",
          },
          {
            id: 3,
            title: "Technique Pomodoro pour les révisions",
            content:
              "Travaillez pendant 25 minutes, puis prenez une pause de 5 minutes. Après 4 cycles, prenez une pause plus longue de 15-30 minutes. Cette technique améliore la concentration et réduit la procrastination.",
            category: "productivity",
            published_at: "2023-04-14",
          },
        ]

        // Simuler les enregistrements de bien-être
        const mockRecords: WellbeingRecord[] = [
          {
            id: 1,
            mood_score: 7,
            stress_level: 6,
            sleep_quality: 8,
            notes: "Journée productive, mais un peu stressé par les examens à venir.",
            recorded_date: "2023-04-15",
          },
          {
            id: 2,
            mood_score: 5,
            stress_level: 8,
            sleep_quality: 4,
            notes: "Difficulté à dormir à cause du stress. Besoin de mieux gérer mon anxiété.",
            recorded_date: "2023-04-14",
          },
          {
            id: 3,
            mood_score: 8,
            stress_level: 4,
            sleep_quality: 7,
            notes: "Bonne journée! Les exercices de respiration m'ont aidé à me sentir plus calme.",
            recorded_date: "2023-04-13",
          },
        ]

        setDailyTips(mockTips)
        setWellbeingRecords(mockRecords)
        setLoading(false)
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Gérer les changements dans le formulaire
  const handleFormChange = (field: string, value: number | string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Soumettre l'enregistrement de bien-être
  const handleSubmit = async () => {
    try {
      setLoading(true)

      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Créer un nouvel enregistrement
      const newRecord: WellbeingRecord = {
        id: wellbeingRecords.length + 1,
        mood_score: formData.moodScore,
        stress_level: formData.stressLevel,
        sleep_quality: formData.sleepQuality,
        notes: formData.notes,
        recorded_date: new Date().toISOString().split("T")[0],
      }

      // Ajouter l'enregistrement à la liste
      setWellbeingRecords([newRecord, ...wellbeingRecords])

      // Réinitialiser le formulaire
      setFormData({
        moodScore: 5,
        stressLevel: 5,
        sleepQuality: 5,
        notes: "",
      })

      setLoading(false)
      alert("Enregistrement ajouté avec succès!")
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'enregistrement:", error)
      setLoading(false)
      alert("Une erreur est survenue lors de l'ajout de l'enregistrement.")
    }
  }

  if (loading && wellbeingRecords.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">Suivi de bien-être</h1>

      <Tabs defaultValue="tracker" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full max-w-md mx-auto mb-8">
          <TabsTrigger value="tracker" className="flex-1">
            <TrendingUp className="h-4 w-4 mr-2" />
            Suivi quotidien
          </TabsTrigger>
          <TabsTrigger value="tips" className="flex-1">
            <Lightbulb className="h-4 w-4 mr-2" />
            Conseils
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Formulaire d'enregistrement */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Comment vous sentez-vous aujourd'hui?</h2>

                <div className="space-y-6">
                  {/* Humeur */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Humeur (1-10)</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Mauvaise</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.moodScore}
                        onChange={(e) => handleFormChange("moodScore", Number.parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500">Excellente</span>
                      <span className="ml-2 w-8 text-center font-medium">{formData.moodScore}</span>
                    </div>
                  </div>

                  {/* Niveau de stress */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Niveau de stress (1-10)</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Faible</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.stressLevel}
                        onChange={(e) => handleFormChange("stressLevel", Number.parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500">Élevé</span>
                      <span className="ml-2 w-8 text-center font-medium">{formData.stressLevel}</span>
                    </div>
                  </div>

                  {/* Qualité du sommeil */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Qualité du sommeil (1-10)</label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Mauvaise</span>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={formData.sleepQuality}
                        onChange={(e) => handleFormChange("sleepQuality", Number.parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-500">Excellente</span>
                      <span className="ml-2 w-8 text-center font-medium">{formData.sleepQuality}</span>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (facultatif)
                    </label>
                    <textarea
                      id="notes"
                      rows={4}
                      value={formData.notes}
                      onChange={(e) => handleFormChange("notes", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Comment s'est passée votre journée? Y a-t-il des événements particuliers qui ont affecté votre bien-être?"
                    ></textarea>
                  </div>

                  <Button onClick={handleSubmit} disabled={loading} className="w-full">
                    {loading ? "Enregistrement en cours..." : "Enregistrer"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Historique des enregistrements */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Votre historique</h2>

                {wellbeingRecords.length > 0 ? (
                  <div className="space-y-4">
                    {wellbeingRecords.map((record) => (
                      <div key={record.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">
                            {new Date(record.recorded_date).toLocaleDateString("fr-FR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </h3>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Humeur</p>
                            <p className="font-medium">{record.mood_score}/10</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Stress</p>
                            <p className="font-medium">{record.stress_level}/10</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500">Sommeil</p>
                            <p className="font-medium">{record.sleep_quality}/10</p>
                          </div>
                        </div>

                        {record.notes && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">Notes:</p>
                            <p className="text-sm">{record.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center">
                    Aucun enregistrement pour le moment. Commencez à suivre votre bien-être dès aujourd'hui!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tips" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dailyTips.map((tip) => (
              <Card key={tip.id}>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Heart className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="font-semibold">{tip.title}</h3>
                  </div>

                  <p className="text-gray-600 mb-4">{tip.content}</p>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {new Date(tip.published_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                    <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full">
                      {tip.category === "stress" && "Gestion du stress"}
                      {tip.category === "sleep" && "Sommeil"}
                      {tip.category === "productivity" && "Productivité"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
