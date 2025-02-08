// src/routes/PrivateRoutes.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import Loader from '../components/Carga';

export const PrivateRoute = ({ children }) => {
    const { auth, cargando } = useAuth();

    if (cargando) return <Loader />;

    return auth?.token ? children : <Navigate to="/login" />;
};