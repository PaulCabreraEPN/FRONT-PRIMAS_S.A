import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import api from '../services/api';
import { useAuth } from '../context/AuthProvider';

const Login = () => {
    // Declaraciones
    const { setAuth } = useAuth();
    const frontendUrl = import.meta.env.VITE_URL_FRONTEND;
    const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
    
    const [isLocked, setIsLocked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Esquema de validación con Yup
    const validationSchema = Yup.object({
        username: Yup.string()
            .trim()
            .required('El nombre de usuario es obligatorio')
            .oneOf(['TopAdmin', 'PrimAdmin', 'AtlasPro', 'PinAtlas'], 'El nombre de usuario no es válido'),
        password: Yup.string()
            .min(6, 'La contraseña debe tener al 8 caracteres')
            .required('La contraseña es obligatoria'),
    });

    // Usar Formik para gestionar el formulario
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: validationSchema, // Validación con Yup
        onSubmit: async (values) => {
            const normalizedForm = {
                username: values.username.trim() || '',
                password: values.password.trim() || '',
            };

            try {
                // Usar el servicio api en lugar de axios directamente
                const { data } = await api.post('/login-admin', normalizedForm);

                // Nievo: Accede correctamente al token desde la respuesta
                const token =data.data?.token;
                
                // Establecer el token en localStorage
                localStorage.setItem('token', token);

                // Establecer el estado de autenticación
                setAuth({ token });
                setIsLocked(false);

                // Limpiar el formulario
                formik.resetForm();

                // Navegar al dashboard
                navigate('/dashboard');
            } catch (error) {
                console.log(error);
                const resp = error.response?.data || {};

                // Si backend indica bloqueo, bloquear el formulario y mostrar toast
                if (resp.code === 'ACCOUNT_LOCKED') {
                    setIsLocked(true);
                    toast.error(resp.msg || 'La cuenta ha sido bloqueada.', { autoClose: 6000 });
                } else if (resp.code === 'INVALID_CREDENTIALS') {
                    // Mostrar el mensaje enviado por el backend (con intentos restantes)
                    toast.error(resp.msg || 'Credenciales inválidas.', { autoClose: 6000 });
                    // Si el backend indica bloqueo en el mensaje, marcar isLocked
                    if ((resp.msg || '').toLowerCase().includes('bloquead')) setIsLocked(true);
                } else {
                    // Mostrar mensaje genérico del backend si existe
                    toast.error(resp.msg || 'Error al iniciar sesión. Intenta nuevamente.', { autoClose: 6000 });
                }
            }
        },
    });

    return (
        <div className="flex flex-col sm:flex-row h-screen">
            {/* Contenedor del formulario */}
            <div className="w-full sm:w-1/2 flex justify-center items-center bg-customWhite p-6 h-full">
                <div className="w-full max-w-md p-6 rounded-lg sm:rounded-none sm:shadow-none">
                    <div className="flex items-center justify-center mb-1">
                        {/* Logo a la izquierda */}
                        <img
                            src="/images/mainlogo.png"
                            alt="Main Logo"
                            className="h-10 w-10 sm:h-12 sm:w-12 mr-1"
                        />
                        <h1 className="text-4xl font-semibold uppercase text-[#2c308a]">
                            PRIMA S.A.
                        </h1>
                    </div>
                    <small className="text-gray-400 block text-center text-sm">
                        Bienvenido a tu plataforma
                    </small>

                    {/* Los mensajes del backend se muestran mediante toasts */}
                    <ToastContainer />

                    <form onSubmit={formik.handleSubmit} className="mt-8">
                        <div className="mb-5">
                            <label className="block text-base font-sans text-[#6b6999] mb-2">
                                Nombre de Usuario
                            </label>
                            <input
                                type="text"
                                placeholder="Ingresa tu nombre de usuario"
                                className="block w-full rounded-full border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-2 px-3 text-gray-500"
                                name="username"
                                onChange={formik.handleChange}
                                value={formik.values.username}
                            />
                            {formik.touched.username && formik.errors.username ? (
                                <div className="text-red-500 text-sm">{formik.errors.username}</div>
                            ) : null}
                        </div>

                        <div className="mb-5">
                            <label className="block text-base font-sans text-[#6b6999] mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="**********"
                                    className="block w-full rounded-full border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-2 px-3 pr-10 text-gray-500"
                                    name="password"
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10a9.96 9.96 0 012.09-5.93M6.1 6.1A9.96 9.96 0 0112 3c5.523 0 10 4.477 10 10 0 1.05-.15 2.065-.432 3.02M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {formik.touched.password && formik.errors.password ? (
                                <div className="text-red-500 text-sm">{formik.errors.password}</div>
                            ) : null}
                        </div>

                        

                        

                        <button
                            type="submit"
                            disabled={isLocked}
                            className={`py-2 w-full text-slate-300 border rounded-full ${isLocked ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-500 hover:scale-105 duration-300 hover:bg-customBlue hover:text-white'}`}>
                            {isLocked ? 'Cuenta bloqueada' : 'Iniciar Sesión'}
                        </button>
                    </form>

                    <div className="mt-5 text-center text-sm">
                        <Link to="/recovery-account" className="text-gray-400 hover:text-gray-900 underline">
                            ¿Olvidaste tu contraseña? | Recuperar cuenta
                        </Link>
                    </div>
                </div>
            </div>

            {/* Imagen lateral solo en pantallas grandes */}
            <div className="hidden sm:block sm:w-1/2 bg-[url('/images/atlaslogin.jpg')] bg-no-repeat bg-cover bg-center h-full"></div>
        </div>
    );
};

export default Login;
