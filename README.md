# Frontend
Frontend pour le projet ScanCod. Utilise le port 3000 (configuré dans vite.config.js).

## Structure

- src/assets/ : images et ressources
- src/pages/ : composants page (Home.jsx, Login.jsx, Account.jsx)
- src/services/ : fichiers communiquant avec l'API (HttpClient.js)
- src/App.jsx : composant principal (contenant le routeur)
- src/App.css : style du composant App
- index.css : styles globaux
- main.jsx :  point d'entrée de l'app, lance App.jsx

---

## Stack technique

- React : framework
- JavaScript : langage utilisé avec React
- Vite : outil de build
- Node.js : gestionnaires de package

---

## Librairies et dépendances

- React Router Dom : routing
- Axios : requêtes http

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

## Lancer le frontend

1. Lancer le serveur frontend (sur le port 3000)
```bash
npm run dev
```

2. Ouvrir le navigateur
[http://localhost:3000](http://localhost:3000)