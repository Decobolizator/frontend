import './App.css'
// Import router
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
// Import composants pages
import Accueil from './pages/Accueil';
import Inscription from './pages/Inscription';
import Convertisseur from './pages/Convertisseur';
import Connexion from './pages/Connexion';
import MainLayout from './pages/MainLayout';
import Parametres from './pages/Parametres';
import Erreur403 from './pages/Erreur403';
import Deconnexion from './pages/Deconnexion';
import Connexion2 from './pages/Connexion2';
import Oubli from './pages/Oubli';
import Oubli2 from './pages/Oubli2';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Accueil />} />
            <Route path="inscription" element={<Inscription />} />
            <Route path="login" element={<Connexion />} />
            <Route path="erreur403" element={<Erreur403 />} />
            <Route path="connexion2" element={<Connexion2 />} />
            <Route path="forgot-password" element={<Oubli />} />
            <Route path="reset-password" element={<Oubli2 />} />

            {/* Routes protégées */}
            <Route path="convertisseur" element={<ProtectedRoute><Convertisseur /></ProtectedRoute>} />
            <Route path="parametres" element={<ProtectedRoute><Parametres /></ProtectedRoute>} />
            <Route path="deconnexion" element={<ProtectedRoute><Deconnexion /></ProtectedRoute>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
