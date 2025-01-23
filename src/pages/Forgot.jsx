import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import Mensaje from '../context/alerts/Mensaje';

const Forgot = () => {
    // Declaraciones
    const backendUrl = import.meta.env.VITE_URL_BACKEND_API;

    const [mensaje, setMensaje] = useState({});

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
            const url = `${backendUrl}/recovery-password-admin`;
            const respuesta = await axios.post(url, normalizedForm);
            setMensaje({ respuesta: respuesta.data.msg, tipo: true });
            setForm({ username: "" }); // Resetear el formulario
        } catch (error) {
            const errorMsg =
                error.response?.data?.msg ||
                "Ocurrió un error al procesar la solicitud.";
            setMensaje({ respuesta: errorMsg, tipo: false });
        }
    };

    return (
        <div className="flex h-screen">
            {/* Segunda mitad: Imagen */}
            <div className="w-7/12 hidden sm:block bg-[url('/images/atlasrecovery.jpg')] bg-no-repeat bg-cover bg-center"></div>
            {/* Primera mitad: Formulario */}
            <div className="bg-white flex justify-center items-center w-1/2">
                <div className="md:w-1/2 sm:w-full">
                    {Object.keys(mensaje).length > 0 && (
                        <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>
                    )}

                    <div className="flex">
                        <div className="hidden sm:block bg-[url('/images/mainlogo.png')] bg-no-repeat bg-center bg-contain h-48 w-48 sm:h-14 sm:w-12"></div>
                        <h1
                            className="text-5xl font-semibold mb-2 text-left uppercase"
                            style={{ color: '#2c308a' }}
                        >
                            PRIMA S.A.
                        </h1>
                    </div>
                    <small className="text-gray-400 block mb-5 text-sm">
                        Bienvenido a tu plataforma
                    </small>
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">
                        Perdiste tu contraseña !!!
                    </h1>
                    <small className="text-gray-400 block my-4 text-sm">
                        No te preocupes, por favor ingresa tu usuario
                    </small>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-1">
                            <label className="mb-2 block text-sm font-semibold">
                                Usuario
                            </label>
                            <input
                                type="text"
                                placeholder="Ingresa tu nombre de usuario"
                                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                name="username"
                                onChange={handleChange}
                                value={form.username}
                            />
                        </div>

                        <div className="mb-3">
                            <button className="bg-gray-600 text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white">
                                Enviar email
                            </button>
                        </div>
                    </form>

                    <div className="mt-5 text-xs border-b-2 py-4 "></div>

                    <div className="mt-3 text-sm flex justify-between items-center">
                        <p>Si ya tienes una cuenta puedes ir al inicio de sesión</p>
                        <Link
                            to="/login"
                            className="py-2 px-5 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white"
                        >
                            Login
                        </Link>
                    </div>
                </div>
            </div>

            
        </div>
    );
};

export default Forgot;
