import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {ToastContainer, toast} from 'react-toastify'

const Register = () => {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        "names": "",
        "lastNames": "",
        "numberID": "",
        "email": "",
        "SalesCity": "",
        "PhoneNumber": "",
        "role": "Seller",
        "status": false
    });


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
            const backUrl = import.meta.env.VITE_URL_BACKEND_API
            const url = `${backUrl}/register`;
            const options = {
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const formData = { role: "Seller",status: false ,...form};
            const response = await axios.post(url,formData,options)
            console.log(response);
            toast.success(response.data.msg)
            setTimeout(() => {
                navigate('/dashboard/sellers')
            },2000)
        } catch (error) {
            toast.error(error.response?.data?.msg)
        }
    }
    
    return(
        <div className="flex">
            <div className="bg-white flex justify-center items-center w-full">
                <div className="md:w-1/2">
                    <div className="flex justify-end mb-4">
                        <button 
                            onClick={() => navigate('/dashboard/sellers')}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            <i className="fas fa-arrow-left mr-2"></i>
                            Atrás
                        </button>
                    </div>
                    <ToastContainer />
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
        </div>
    )
}

export default Register

