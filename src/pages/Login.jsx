import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../context/alerts/Mensaje';

const Login = () => {
    //Declarciones
    const frontendUrl = import.meta.env.VITE_URL_FRONTEND;
    const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
    const [mensaje, setMensaje] = useState({})
    const navigate = useNavigate()

    //Crear un use state
    const [form, setform] = useState({
        username:"",
        password:""
    });
    
    //Setear valores 
    const handleChange = (e) => {
        setform({
            ...form,
            [e.target.name]:e.target.value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Normalizar valores vacíos
        const normalizedForm = {
            username: form.username.trim() || "",
            password: form.password.trim() || ""
        };
        
        try {
            const url = `${backendUrl}/login-admin`;
            const respuesta = await axios.post(url, normalizedForm);

            setform({ username: form.username, password: "" });  // Solo vaciar la contraseña
            localStorage.setItem("token", respuesta.data.tokenJWT);
            navigate("/dashboard");
        } catch (error) {
            console.log(error);
            setMensaje({ respuesta: error.response?.data?.msg || "Error desconocido", tipo: false });
            setTimeout(() => {
                setMensaje({});
            }, 5000);
    
            setform({ username: form.username, password: "" });  // Solo vaciar la contraseña, mantener el username
        }
    };
    
    

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
                    <small className="text-gray-400 block text-center text-sm">Bienvenido a tu plataforma</small>
    
                    {Object.keys(mensaje).length > 0 && (
                        <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                    )}
    
                    <form onSubmit={handleSubmit} className="mt-8">
                        <div className="mb-5">
                            <label className="block text-base font-sans text-[#6b6999] mb-2">
                                Nombre de Usuario
                            </label>
                            <input
                                type="text"
                                placeholder="Ingresa tu nombre de usuario"
                                className="block w-full rounded-full border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-2 px-3 text-gray-500"
                                name="username"
                                onChange={handleChange}
                                value={form.name}
                            />
                        </div>
    
                        <div className="mb-5">
                            <label className="block text-base font-sans text-[#6b6999] mb-2">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                placeholder="**********"
                                className="block w-full rounded-full border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-2 px-3 text-gray-500"
                                name="password"
                                onChange={handleChange}
                                value={form.password}
                            />
                        </div>
    
                        <div className="flex items-center mb-4">
                            <input type="checkbox" className="mr-2" />
                            <p>Recordarme</p>
                        </div>
    
                        <button className="py-2 w-full bg-gray-500 text-slate-300 border hover:scale-105 duration-300 hover:bg-customBlue hover:text-white rounded-full">
                            Iniciar Sesión
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
