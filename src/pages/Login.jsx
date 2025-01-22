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
        <div className="flex h-screen">
            {/* Primera mitad: Formulario */}
            <div className="w-1/2 bg-customWhite flex justify-center items-center padd">
                <div className="md:w-1/2 sm:w-full">
                    <div className='flex'>
                    <div className="hidden sm:block bg-[url('/images/mainlogo.png')] bg-no-repeat bg-center bg-contain h-48 w-48 sm:h-14 sm:w-12">
                    </div>
                        <h1 className="text-5xl font-semibold mb-2 text-left uppercase" style={{ color: '#2c308a' }}>
                        PRIMA S.A.
                        </h1>
                        
                    </div>
                    <small className="text-gray-400 block mb-5 text-sm">Bienvenido a tu plataforma</small>

                    {Object.keys(mensaje).length>0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}

                    <form onSubmit={handleSubmit} className='mt-10'>
                        <div className="mb-3">
                            <label className="mb-2 block text-lg font-sans" style={{ color: '#6b6999' }}>Nombre de Usuario</label>
                            <input
                                type="text"
                                placeholder="Ingresa tu nombre de usuario"
                                className="block w-full rounded-full border border-gray-300  focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500"
                                name='username'
                                onChange={handleChange}
                                value={form.name}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-lg font-sans" style={{ color: '#6b6999' }} >Contraseña</label>
                            <input
                                type="password"
                                placeholder="**********"
                                className="block w-full rounded-full border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500"
                                name='password'
                                onChange={handleChange}
                                value={form.password}
                            />
                        </div>

                        <div className='flex'>
                            <input type="checkbox" name="" id="" className='mr-2'/>
                            <p>Recordarme</p>
                        </div>

                        <div className="my-4 border-b-2 border-b-gray-300 py-4 ">
                        <button className="py-2 w-full md:w-1/2 block text-center bg-gray-500 text-slate-300 border hover:scale-100 duration-300 hover:bg-customBlue hover:text-white rounded-full mx-auto">Iniciar Sesión</button>
                        </div>
                    </form>
                    
                    <div className="mt-5 text-xs text-center">
                        <Link
                            to="/recovery-account"
                            className="underline text-sm text-gray-400 hover:text-gray-900"
                        >
                            ¿Olvidaste tu contraseña? | Recuperar cuenta
                        </Link>
                    </div>

                </div>
            </div>

            {/* Segunda mitad: Imagen */}
            <div
                className="w-7/12 hidden sm:block bg-[url('/images/atlaslogin.jpg')] bg-no-repeat bg-cover bg-center"
            ></div>
        </div>
    );
};

export default Login;
