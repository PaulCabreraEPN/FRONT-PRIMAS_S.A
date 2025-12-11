import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Mensaje from '../context/alerts/Mensaje';

const Forgot = () => {
    // Declaraciones
    const backendUrl = import.meta.env.VITE_URL_BACKEND_API;

    const [mensaje, setMensaje] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Crear un useState para el formulario
    const [form, setForm] = useState({
        username: "",
    });

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Normalizar valores vacíos
        const normalizedForm = {
            username: form.username.trim(),
        };

        // Validar que el campo no esté vacío
        if (!normalizedForm.username) {
            setMensaje({
                respuesta: "Por favor, ingresa tu nombre de usuario.",
                tipo: false,
            });
            return;
        }

        try {
            setIsLoading(true);
            const url = `${backendUrl}/recovery-password-admin`;
            const respuesta = await axios.post(url, normalizedForm);

            // El backend puede devolver status: 'success' o 'warning' (entre otros)
            const respStatus = respuesta.data?.status ?? 'success';
            const respMsg = respuesta.data?.msg || "Operación completada.";
            const emailDetails = respuesta.data?.info?.emailDetails;

            // Añadir detalle del envío de correo si el backend lo proporciona
            let fullMsg = respMsg;
            if (emailDetails) {
                const sent = typeof emailDetails.sent === 'boolean' ? (emailDetails.sent ? 'enviado' : 'no enviado') : '';
                const detailMsg = emailDetails.message ? `detalle: ${emailDetails.message}` : '';
                const extra = [sent, detailMsg].filter(Boolean).join(' - ');
                if (extra) fullMsg = `${fullMsg} (${extra})`;
            }

            // Mostrar mensaje: tipo true sólo si es 'success'
            setMensaje({ respuesta: fullMsg, tipo: respStatus === 'success' });

            // Si fue éxito completo, limpiar formulario
            if (respStatus === 'success') {
                setForm({ username: "" });
            }
        } catch (error) {
            const errorMsg =
                error.response?.data?.msg ||
                "Ocurrió un error al procesar la solicitud.";
            setMensaje({ respuesta: errorMsg, tipo: false });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row h-screen">
            {/* Imagen lateral solo en pantallas grandes */}
            <div className="hidden sm:block sm:w-1/2 bg-[url('/images/atlasrecovery.jpg')] bg-no-repeat bg-cover bg-center h-full"></div>
            {/* Contenedor del formulario */}
            <div className="w-full sm:w-1/2 flex justify-center items-center bg-customWhite p-6 h-full">
                <div className="w-full max-w-md p-6 rounded-lg sm:rounded-none sm:shadow-none">
                    
                    <h1 className="text-3xl font-semibold mt-6 text-center uppercase text-[#652A8C]">
                        ¿Perdiste tu contraseña?
                    </h1>
                    <small className="text-gray-400 block my-4 text-center text-sm">
                        No te preocupes, por favor ingresa tu usuario
                    </small>
                    
                    {Object.keys(mensaje).length > 0 && (
                        <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                    )}
                    
                    <form onSubmit={handleSubmit} className="mt-4">
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
                                value={form.username}
                            />
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`py-2 w-full ${isLoading ? 'bg-gray-400 cursor-wait' : 'bg-gray-500 hover:scale-105 hover:bg-[#7626acc2] hover:text-white'} text-slate-300 border rounded-full duration-300`}
                        >
                            {isLoading ? 'Enviando...' : 'Enviar email'}
                        </button>
                    </form>
                    
                    <div className="mt-5 text-xs border-b-2 py-4"></div>
                    
                    <div className="mt-3 text-sm flex justify-between items-center text-gray-500">
                        <p>Si ya tienes una cuenta, puedes ir al inicio de sesión</p>
                        <Link to="/login" className="py-2 px-5 bg-gray-500 text-slate-300 border rounded-full hover:scale-110 duration-300 hover:bg-customBlue hover:text-white">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
            
            
        </div>
    );
    
};

export default Forgot;
