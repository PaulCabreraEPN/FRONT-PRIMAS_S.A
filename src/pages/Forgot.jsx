import { Link } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';
import Mensaje from '../context/alerts/Mensaje';

const Forgot = () => {
    const [mail, setMail] = useState({});
    const [mensaje, setMensaje] = useState({})
    const handleChange = (e) => {
        setMail({
            ...mail,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const url = `${backUrl}/recovery-password-admin`
            const respuesta = await axios.post(url, mail)
            setMensaje({ respuesta: respuesta.data.msg, tipo: true })
            setMail("")
        } catch (error) {
            setMensaje({ respuesta: error.response.data.msg, tipo: false })
        }
    }


    return (
        <>
            <div className="flex h-screen">


                <div className="bg-white flex justify-center items-center w-1/2">

                    <div className="md:w-4/5 sm:w-full">
                        {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
                        <div className='flex'>
                            <div className="hidden sm:block bg-[url('/images/mainlogo.png')] bg-no-repeat bg-center bg-contain h-48 w-48 sm:h-14 sm:w-12">
                            </div>
                            <h1 className="text-5xl font-semibold mb-2 text-left uppercase" style={{ color: '#2c308a' }}>
                                PRIMA S.A.
                            </h1>

                        </div>
                        <small className="text-gray-400 block mb-5 text-sm">Bienvenido a tu plataforma</small>
                        <h1 className="text-3xl font-semibold mb-2 text-center uppercase  text-gray-500">Perdiste tu contraseña !!!</h1>
                        <small className="text-gray-400 block my-4 text-sm">No te preocupes, porfavor llena tu email</small>


                        <form onSubmit={handleSubmit}>

                            <div className="mb-1">
                                <label className="mb-2 block text-sm font-semibold">Email</label>
                                <input type="email" placeholder="Prima@example.com" className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                    name='email'
                                    onChange={handleChange} />
                            </div>

                            <div className="mb-3">
                                <button className="bg-gray-600 text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white">Enviar emaiil
                                </button>
                            </div>

                        </form>

                        <div className="mt-5 text-xs border-b-2 py-4 ">
                        </div>

                        <div className="mt-3 text-sm flex justify-between items-center">
                            <p>Si ya tienes una cuenta puedes ir al inicio de sesion </p>
                            <Link to="/login" className="py-2 px-5 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Login</Link>

                        </div>

                    </div>

                </div>

                {/* Segunda mitad: Imagen */}
                <div
                    className="w-7/12 hidden sm:block bg-[url('/images/atlaslogin.jpg')] bg-no-repeat bg-cover bg-center"
                ></div>

            </div>
        </>
    )
}
