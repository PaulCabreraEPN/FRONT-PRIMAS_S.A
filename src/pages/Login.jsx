import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Mensaje from '../context/alerts/Mensaje';

const Login = () => {
    //Declarciones
    const frontendUrl = import.meta.env.VITE_URL_FRONTEND;
    const backendUrl = import.meta.env.VITE_URL_BACKEND;
    const [mensaje, setMensaje] = useState({})
    const navigate = useNavigate()

    //Crear un use state
    const [form, setform] = useState({
        username:"",
        password:""
    });
    
    //Setear valores 
    const handeChange = (e) => {
        setform({
            ...form,
            [e.target.name]:e.target.value
        });
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = `${backendUrl}/login-admin`
            const respuesta = await axios.post(url,form)
            console.log(respuesta);
            navigate('/dashboard')
        } catch (error) {
            setMensaje({respuesta:error.response.data.msg,tipo:false})
            setTimeout(() => {
                setMensaje({})
            },5000);
            setform({})
        }
    }

    return (
        <div className="flex h-screen">
            {/* Primera mitad: Formulario */}
            <div className="w-1/2 bg-white flex justify-center items-center padd">
                <div className="md:w-3/5 sm:w-full">
                    <div className='flex'>
                    <div className="hidden sm:block bg-[url('/images/mainlogo.png')] bg-no-repeat bg-center bg-contain h-48 w-48 sm:h-14 sm:w-12">
  {/* Aquí puedes agregar otros elementos si los necesitas */}
</div>
                        <h1 className="text-5xl font-semibold mb-2 text-center uppercase text-gray-500">
                        PRIMA S.A.
                        </h1>
                        
                    </div>
                    <small className="text-gray-400 block mb-5 text-sm">Bienvenido a tu plataforma</small>

                    {Object.keys(mensaje).length>0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="mb-2 block text-lg font-semibold">Nombre de Usuario</label>
                            <input
                                type="text"
                                placeholder="Ingresa tu nombre de usuario"
                                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500"
                                name='username'
                                onChange={handeChange}
                                value={form.name}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="mb-2 block text-lg font-semibold">Contraseña</label>
                            <input
                                type="password"
                                placeholder="********************"
                                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-2 text-gray-500"
                                name='password'
                                onChange={handeChange}
                                value={form.password}
                            />
                        </div>

                        <div className='flex'>
                            <input type="checkbox" name="" id="" className='mr-2'/>
                            <p>Recordarme</p>
                        </div>

                        <div className="my-4 border-b-2 py-4">
                        <button className="py-2 w-full block text-center bg-gray-500 text-slate-300 border rounded-xl hover:scale-100 duration-300 hover:bg-gray-900 hover:text-white">Iniciar Sesión</button>
                        </div>
                    </form>
                    
                    <div className="mt-5 text-xs ">
                        <Link
                            to="/forgot/id"
                            className="underline text-sm text-gray-400 hover:text-gray-900"
                        >
                            Forgot your password?
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
