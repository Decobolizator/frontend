# Frontend

Ce service est l'interface utilisateur pour le projet Decobolizator. Elle utilise le port 3000 (configuré dans vite.config.js).
Elle communique avec le microservice API Gateway.

## Fonctionnalités du service

1. **Edition et import de code COBOL** : import et fonction glisser-déposer du code COBOL dans l'éditeur intégré avec coloration syntaxique.
2. **Double mode d'analyse** :
    - **Traduction** : traduction du code COBOL en pseudo-code
    - **Tuteur** : explication du rôle du code au sein d'un projet
3. **Export des données** : export d'une représentation intermédiaire du code COBOL sous forme de JSON
4. **Historique d'analyse** : gestion de l'historique des analyses effectuées avec possibilité de reprendre en l'état
5. **Gestion de compte** : gestion de l'inscription, de la connexion et des données de l'utilisateur
6. **Sécurité** : double-authentification, gestion de mots de passe oublié
7. **Interface adaptative** : support d'un mode sombre
8. **Page accueil** : guide d'utilisation de notre outil

---

## Stack technique

- **React** : framework
- **Vite** : outil de build
- **Ant Design (Antd)** : bibliothèque de composants graphiques
- **CodeMirror 6** : éditeur de code avec intégration du module legacy pour la grammaire COBOL officielle
- **Axios** : client HTTP pour la communication asynchrone avec l'API Gateway
- **React Router Dom** : navigation et routage de l'application

---

## Structure

frontend/
├── src/
│   ├── assets/                  # Images .png et leurs formats vectoriels .svg
│   ├── context/                  
│   │   ├── AuthContext.jsx      # Stocke le user et son token
│   │   └── ProtectedRoute.jsx   # Protège l'accès aux routes privées
│   ├── pages/                   
│   │   ├── Accueil.jsx          # Page d'accueil
│   │   ├── Accueil.css          # Style de la page d'accueil
│   │   ├── Connexion.jsx        # Page du formulaire d'authentification
│   │   ├── Connexion.css        # Style de la page du formulaire d'authentification
│   │   ├── Connexion2.jsx       # Page de la double-authentification
│   │   ├── Connexion2.css       # Style de la page de la double-authentification
│   │   ├── Convertisseur.jsx    # Page de l'interface principale du traducteur
│   │   ├── Convertisseur.css    # Style de la page de l'interface principale
│   │   ├── Deconnexion.jsx      # Page de confirmation de la déconnexion
│   │   ├── Erreur403.jsx        # Page de redirection pour protection des routes privées
│   │   ├── Erreur403.css        # Style de la page de redirection pour protection des routes privées
│   │   ├── Inscription.jsx      # Page du formulaire d'incription
│   │   ├── Inscription.css      # Style de la page du formulaire d'authentification
│   │   ├── MainLayout.jsx       # Squelette global (header, footer, mode sombre global)
│   │   ├── Parametres.css       # Page des paramètres (mon compte et historique)
│   │   └── Parametres.css       # Style de la page des paramètres
│   ├── services/                   
│   │   ├── HttpClient.js        # Communication avec l'API Gateway
│   ├── App.jsx                  # Composant principal (router)
│   ├── App.css                  # Style du composant principal
│   ├── index.css                # Style global
│   └── main.jsx                 # Point d'entrée de l'app, lance App.jsx
└── index.html                   # Fichier html racine

---

## Installation

1. Cloner le repository
```bash
git clone https://github.com/Decobolizator/frontend.git
```

2. Aller dans le dossier frontend
```bash
cd frontend
```

3. Installer les dépendances
```bash
npm install
```

---

## Lancement

1. Lancer le serveur frontend (sur le port 3000)
```bash
npm run dev
```

2. Ouvrir le navigateur
[http://localhost:3000](http://localhost:3000)