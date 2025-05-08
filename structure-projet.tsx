// Structure du projet DimaWell
// ├── dimawell/                  # Dossier racine du projet
// │   ├── frontend/              # Application Next.js pour le frontend
// │   │   ├── app/               # Dossier principal de l'App Router
// │   │   │   ├── (auth)/        # Routes d'authentification (groupées)
// │   │   │   │   ├── login/     # Page de connexion
// │   │   │   │   └── register/  # Page d'inscription
// │   │   │   ├── (student)/     # Interface étudiant (groupée)
// │   │   │   │   ├── dashboard/ # Tableau de bord étudiant
// │   │   │   │   ├── messages/  # Messagerie
// │   │   │   │   ├── appointments/ # Rendez-vous
// │   │   │   │   ├── video-call/ # Consultation vidéo
// │   │   │   │   └── wellbeing/ # Suivi de bien-être
// │   │   │   ├── (psychologist)/ # Interface psychologue (groupée)
// │   │   │   │   ├── dashboard/ # Tableau de bord psychologue
// │   │   │   │   ├── patients/  # Liste des étudiants
// │   │   │   │   ├── messages/  # Messagerie
// │   │   │   │   ├── appointments/ # Gestion des rendez-vous
// │   │   │   │   └── tips/      # Gestion des conseils quotidiens
// │   │   │   ├── api/           # Routes API
// │   │   │   │   ├── auth/      # Authentification
// │   │   │   │   ├── appointments/ # Gestion des rendez-vous
// │   │   │   │   ├── messages/  # Messagerie
// │   │   │   │   ├── tips/      # Conseils quotidiens
// │   │   │   │   └── wellbeing/ # Suivi de bien-être
// │   │   │   ├── about/         # À propos
// │   │   │   ├── faq/           # FAQ
// │   │   │   ├── contact/       # Contact
// │   │   │   ├── layout.tsx     # Layout principal
// │   │   │   └── page.tsx       # Page d'accueil
// │   │   ├── components/        # Composants réutilisables
// │   │   ├── lib/               # Utilitaires et fonctions
// │   │   └── public/            # Fichiers statiques
// │   └── backend/               # Logique backend (dans le même projet Next.js)
// │       ├── db/                # Configuration de la base de données
// │       ├── models/            # Modèles de données
// │       ├── services/          # Services métier
// │       └── utils/             # Utilitaires backend
