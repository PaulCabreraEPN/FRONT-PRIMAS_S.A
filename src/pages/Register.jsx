import axios from "axios";
import { useState } from "react";
import Mensaje from "../context/alerts/Mensaje";



export const Register = () => {
    const [form, setForm] = useState({
        "names": "",
        "lastNames": "",
        "numberID": "",
        "email": "",
        "SalesCity": "",
        "PhoneNumber": "",
        "role": "Seller",
        "status": true
    });

    const [mensaje, setMensaje] = useState("")

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token')
            const backUrl = import.meta.env.VITE_URL_BACKEND
            const url = `${backUrl}/register`;
            const options = {
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const formData = { role: "Seller",status: true ,...form};
            const response = await axios.post(url,formData,options)
            setMensaje({respuesta: respuesta.data.msg, tipo: true})
        } catch (error) {
            const mensajeError = error.response?.data?.msg || error.response?.data || 'Error en el registro'
            setMensaje({respuesta: mensajeError, tipo: false})
        }
    }
    
    return(
        <div className="flex h-screen">
            <div className="bg-white flex justify-center items-center w-1/2">
                <div className="md:w-4/5 sm:w-full">
                {Object.keys(mensaje).length > 0 && <Mensaje tipo={mensaje.tipo}>{mensaje.respuesta}</Mensaje>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="names" className="mb-2 block text-sm font-semibold">Nombres: </label>
                            <input type="text" id="names" name="names" placeholder="Ana Maria"
                            value={form.names || ""} onChange={handleChange}
                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="lastNames" className="mb-2 block text-sm font-semibold">Apellidos: </label>
                            <input type="text" id="lastNames" name="lastNames" placeholder="Perez Rodriguez"
                            value={form.lastNames || ""} onChange={handleChange}
                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="numberID" className="mb-2 block text-sm font-semibold">N. Identificacion: </label>
                            <input type="number" id="numberID" name="numberID" placeholder="1734567897"
                            value={form.numberID || ""} onChange={handleChange}
                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="mb-2 block text-sm font-semibold">Correo Electronico: </label>
                            <input type="email" id="email" name="email" placeholder="Prima@example.com"
                            value={form.email || ""} onChange={handleChange}
                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="SalesCity" className="mb-2 block text-sm font-semibold">Ciudad de Venta: </label>
                            <input type="text" id="SalesCity" name="SalesCity" placeholder="Ibarra"
                            value={form.SalesCity || ""} onChange={handleChange}
                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="PhoneNumber" className="mb-2 block text-sm font-semibold">Telefono: </label>
                            <input type="number" id="PhoneNumber" name="PhoneNumber" placeholder="0987654324"
                            value={form.PhoneNumber || ""} onChange={handleChange}
                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                            />
                        </div>
                        <div className="mb-3">
                            <button className="py-2 w-full block text-center bg-blue-900 text-slate-100 border rounded-xl hover:scale-100 duration-300 hover:bg-green-300 hover:text-black">Registrar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="w-1/2 h-screen bg-[url('/images/atlaslogin.jpg')] 
            bg-no-repeat bg-cover bg-center sm:block hidden
            ">
            </div>
        </div>
    )
}
