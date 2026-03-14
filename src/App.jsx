import './App.css'
// Import router
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
// Import composants pages
import Home from './pages/Home';
import Login from './pages/Login';
import Account from './pages/Account';

function App() {
  return (
    <BrowserRouter>

      <nav>
            <Link to="/">Home</Link><br/>
            <Link to="/login">Login</Link><br/>
            <Link to="/account">Account</Link><br/>
      </nav>

      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/account" element={<Account/>}/>
      </Routes>

    </BrowserRouter>
  )
}

export default App
