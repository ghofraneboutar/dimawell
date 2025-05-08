import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-6">Vous êtes étudiant à ISET Rades?</h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-indigo-700 mb-6">
              Vous souffrez des problèmes psychologiques?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              DimaWell vous offre un service d'écoute, d'accompagnement et de soutien psychologique avec notre
              psychologue universitaire en ligne personnalisé.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Créer un compte gratuit
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Se connecter
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Aucun besoin de crédit. Service gratuit pour les étudiants de l'ISET Rades.
            </p>
          </div>
          <div className="flex justify-center">
            <Image src="/hero-image.svg" alt="Consultation psychologique en ligne" width={500} height={400} priority />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">Ce que DimaWell vous offre</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Créez votre plan de thérapie en quelques secondes et en toute sécurité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-indigo-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">Consultation</h3>
              <p className="text-gray-700">
                Planifiez des consultations en ligne avec notre psychologue universitaire.
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">Chat</h3>
              <p className="text-gray-700">Discutez en temps réel avec notre psychologue pour obtenir des conseils.</p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">Conseil</h3>
              <p className="text-gray-700">Recevez des conseils quotidiens pour améliorer votre bien-être mental.</p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-indigo-900 mb-2">Suivi</h3>
              <p className="text-gray-700">Suivez votre progression et votre bien-être mental au fil du temps.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-indigo-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <Image
                src="/feature-access.svg"
                alt="Facilité d'accès au service"
                width={200}
                height={200}
                className="mx-auto mb-6"
              />
              <h3 className="text-xl font-semibold text-indigo-900 mb-3">Facilité d'accès au service</h3>
              <p className="text-gray-700">Réservez votre séance en quelques clics, sans déplacement nécessaire.</p>
            </div>

            <div className="text-center">
              <Image
                src="/feature-privacy.svg"
                alt="Anonymat et confidentialité"
                width={200}
                height={200}
                className="mx-auto mb-6"
              />
              <h3 className="text-xl font-semibold text-indigo-900 mb-3">Anonymat et confidentialité</h3>
              <p className="text-gray-700">Vos échanges avec votre psychologue sont confidentiels et 100% sécurisés.</p>
            </div>

            <div className="text-center">
              <Image
                src="/feature-support.svg"
                alt="Écoute et suivi personnalisés"
                width={200}
                height={200}
                className="mx-auto mb-6"
              />
              <h3 className="text-xl font-semibold text-indigo-900 mb-3">Écoute et suivi personnalisés</h3>
              <p className="text-gray-700">
                Bénéficiez d'un suivi en one-to-one selon la thérapie que vous aurez choisie.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à prendre soin de votre santé mentale?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez DimaWell aujourd'hui et commencez votre parcours vers un meilleur bien-être mental.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
