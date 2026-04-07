import './App.css'
// Import router
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// Import composants pages
import Accueil from './pages/Accueil';
import Inscription from './pages/Inscription';
import Compte from './pages/Compte';
import Convertisseur from './pages/Convertisseur';
import Connexion from './pages/Connexion';

function App() {
  return (
    <BrowserRouter>

      <nav>
            <Link to="/">Accueil</Link><br/>
            <Link to="/convertisseur">Convertisseur</Link><br/>
            <Link to="/inscription">Inscription</Link><br/>
            <Link to="/connexion">Connexion</Link><br/>
            <Link to="/compte">Compte</Link><br/>
      </nav>

      <Routes>
        <Route path="/" element={<Accueil/>}/>
        <Route path="/convertisseur" element={<Convertisseur/>}/>
        <Route path="/inscription" element={<Inscription/>}/>
        <Route path="/connexion" element={<Connexion/>}/>
        <Route path="/compte" element={<Compte/>}/>
      </Routes>

    </BrowserRouter>
  )
}

export default App
