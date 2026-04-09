import './App.css'
// Import router
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// Import composants pages
import Accueil from './pages/Accueil';
import Inscription from './pages/Inscription';
import Compte from './pages/Compte';
import Convertisseur from './pages/Convertisseur';
import Connexion from './pages/Connexion';
import MainLayout from './pages/MainLayout';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Accueil />} />
          <Route path="convertisseur" element={<Convertisseur />} />
          <Route path="inscription" element={<Inscription />} />
          <Route path="login" element={<Connexion />} />
          <Route path="compte" element={<Compte />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
