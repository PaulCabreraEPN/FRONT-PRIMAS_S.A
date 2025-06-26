// src/context/AuthProvider.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('token');
        return token ? { token } : {};
    });
    const [cargando, setCargando] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const verificarToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setCargando(false);
            setAuth({});
            return;
        }

        try {
            const { data } = await api.get('/verify-token');
            setAuth({ token });
            
            // Si estamos en login y el token es válido, redirigir al dashboard
            if (location.pathname === '/login') {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Error al verificar token:', error);
            localStorage.removeItem('token');
            setAuth({});
            if (!location.pathname.includes('/login')) {
                navigate('/login');
            }
        } finally {
            setCargando(false);
        }
    };

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        setAuth({});
        navigate('/login');
    };

    useEffect(() => {
        verificarToken();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesion,
                verificarToken
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};