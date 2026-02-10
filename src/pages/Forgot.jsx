import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Forgot = () => {
    // Declaraciones
    const backendUrl = import.meta.env.VITE_URL_BACKEND_API;

    
    const [isLoading, setIsLoading] = useState(false);

    const validationSchema = Yup.object({
        username: Yup.string()
            .trim()
            .required('El nombre de usuario es obligatorio')
            .oneOf(['TopAdmin', 'PrimAdmin', 'AtlasPro', 'PinAtlas'], 'El nombre de usuario no es válido'),
    });

    // Manejar el envío del formulario
    const handleSubmit = async (values, { resetForm }) => {
        const normalizedForm = {
            username: values.username.trim(),
        };

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

            // Mostrar mensaje con toast según el status
            if (respStatus === 'success') {
                toast.success(fullMsg, { autoClose: 6000 });
                resetForm();
            } else if (respStatus === 'warning') {
                toast.warn(fullMsg, { autoClose: 6000 });
            } else {
                toast.error(fullMsg, { autoClose: 6000 });
            }
        } catch (error) {
            const errorMsg = error.response?.data?.msg || "Ocurrió un error al procesar la solicitud.";
            toast.error(errorMsg, { autoClose: 6000 });
        } finally {
            setIsLoading(false);
        }
    };

    const formik = useFormik({
        initialValues: {
            username: '',
        },
        validationSchema,
        onSubmit: handleSubmit,
    });

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
                    <small className="text-gray-900 block my-4 text-center text-sm">
                        No te preocupes, ingresa tu usuario
                    </small>
                    
                    <ToastContainer />
                    
                    <form onSubmit={formik.handleSubmit} className="mt-4">
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
                                onBlur={formik.handleBlur}
                                value={formik.values.username}
                            />
                            {formik.touched.username && formik.errors.username ? (
                                <div className="text-red-500 text-sm">{formik.errors.username}</div>
                            ) : null}
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`py-2 w-full ${isLoading ? 'bg-gray-400 cursor-wait' : 'bg-gray-500 hover:scale-105 hover:bg-[#7626acc2] hover:text-white'} text-slate-300 border rounded-full duration-300`}
                        >
                            {isLoading ? 'Enviando...' : 'Enviar correo de recuperación'}
                        </button>
                    </form>
                    
                    <div className="mt-6 border-t border-gray-200 pt-5"></div>

                    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
                        <p className="text-center sm:text-left">
                            Si ya tienes una cuenta, puedes ir al inicio de sesión
                        </p>
                        <Link
                            to="/login"
                            className="inline-flex items-center justify-center rounded-full px-5 py-2 font-medium bg-gray-500 text-slate-100 shadow-sm transition hover:bg-customBlue hover:text-white focus:outline-none focus:ring-2 focus:ring-customBlue whitespace-nowrap"
                        >
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            </div>
            
            
        </div>
    );
    
};

export default Forgot;
