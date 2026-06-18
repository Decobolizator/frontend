import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return null; // on attend pour voir si un user est connecté 

    if (!isAuthenticated) 
        return <Navigate to="/erreur403" replace />;

    return children;
};

export default ProtectedRoute;