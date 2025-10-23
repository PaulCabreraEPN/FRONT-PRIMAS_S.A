import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'
import Loader from "../components/Carga";
// Cambio reciente 

const UpdateSeller = () => {
    const [seller, setSeller] = useState({
        names: "",
        lastNames: "",
        numberID: "",
        username: "",
        email: "",
        SalesCity: "",
        PhoneNumber: "",
        role: "Seller",
        status: true,
        token: null,
        confirmEmail: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams()
    const navigate = useNavigate()

    const getSeller = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token')
            const backUrl = import.meta.env.VITE_URL_BACKEND_API
            const url = `${backUrl}/sellers/${id}`;
            const options = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const response = await axios.get(url, options);
            // Mantener el console.log para asegurar que la respuesta llegue
            const DataResponse = response.data

            const sellerData = DataResponse.data;
            // Verificar que sellerData existe antes de actualizar
            if (sellerData) {
                setSeller({
                    names: sellerData.names || "",
                    lastNames: sellerData.lastNames || "",
                    numberID: sellerData.cedula || "",
                    username: sellerData.username || "",
                    email: sellerData.email || "",
                    SalesCity: sellerData.SalesCity || "",
                    PhoneNumber: sellerData.PhoneNumber || "",
                    status: sellerData.status
                });
            }
            toast.success(response.data.data)
        } catch (error) {
            toast.error(error.response?.data?.data)
        } finally {
            setIsLoading(false);
        }
    }

    const handleChange = (e) => {
        const value = e.target.name === 'status'
            ? e.target.value === ''  // convierte el string a booleano
            : e.target.value;
        setSeller({
            ...seller,
            [e.target.name]: value
        })
    }

    // Actualización parcial (PATCH)
    const handlePartialUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const backUrl = import.meta.env.VITE_URL_BACKEND_API;
            const url = `${backUrl}/updateSeller/${id}`;
            const options = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const response = await axios.patch(url, seller, options);
            setTimeout(() => navigate("/dashboard/sellers"), 2000);
            toast.success(response.data.data)
        } catch (error) {
            toast.error(error.response?.data?.error)
            console.log(error)
        }
    };

    useEffect(() => {
        if (id) {
            getSeller();
        }
    }, [id])

    if (isLoading) {
        return (
            <Loader />
        );
    }

    return (
        <div>
             <h1 className='font-black text-4xl text-gray-500'>Actualizar Vendedor</h1>

            <hr className='my-4' />

            <div className="container mx-auto p-4">
                {/* 
                
                
                <div className="mb-4">
                    <button
                        onClick={() => navigate(`/dashboard/sellers/${id}`)}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        ← Atrás
                    </button>
                </div>
                */}
                <ToastContainer />
                <div className="bg-white flex justify-center items-start w-full pt-2 pb-4">
                    <div className="w-full md:w-11/12 lg:w-3/4 mx-auto">
                        <fieldset className="border border-gray-200 rounded-lg p-4 bg-white">
                            <legend className="px-2 text-lg font-semibold text-gray-700">Datos del Vendedor</legend>
                            <form onSubmit={handlePartialUpdate}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="names" className="mb-2 block text-sm font-semibold">Nombres:</label>
                                        <input
                                            type="text"
                                            id="names"
                                            name="names"
                                            placeholder="Ana Maria"
                                            value={seller?.names || ""}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="lastNames" className="mb-2 block text-sm font-semibold">Apellidos:</label>
                                        <input
                                            type="text"
                                            id="lastNames"
                                            name="lastNames"
                                            placeholder="Perez Rodriguez"
                                            value={seller?.lastNames || ""}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="numberID" className="mb-2 block text-sm font-semibold">N° Identificación:</label>
                                        <input
                                            type="number"
                                            id="numberID"
                                            name="numberID"
                                            placeholder="1734567897"
                                            value={seller?.numberID || ""}
                                            onChange={handleChange}
                                            disabled
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500 bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="username" className="mb-2 block text-sm font-semibold">Nombre de Usuario:</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            placeholder="usuario123"
                                            value={seller?.username || ""}
                                            onChange={handleChange}
                                            disabled
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500 bg-gray-100"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="mb-2 block text-sm font-semibold">Correo Electrónico:</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="correo@ejemplo.com"
                                            value={seller?.email || ""}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="SalesCity" className="mb-2 block text-sm font-semibold">Ciudad de Ventas:</label>
                                        <input
                                            type="text"
                                            id="SalesCity"
                                            name="SalesCity"
                                            placeholder="Quito"
                                            value={seller?.SalesCity || ""}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="PhoneNumber" className="mb-2 block text-sm font-semibold">Teléfono:</label>
                                        <input
                                            type="number"
                                            id="PhoneNumber"
                                            name="PhoneNumber"
                                            placeholder="0987654324"
                                            value={seller?.PhoneNumber || ""}
                                            onChange={handleChange}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="status" className="mb-2 block text-sm font-semibold">Estado:</label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={seller.status.toString()}
                                            onChange={(e) => setSeller({ ...seller, status: e.target.value === "true" })}
                                            className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-1 px-1.5 text-gray-500"
                                        >
                                            <option value="true">Activo</option>
                                            <option value="false">Inactivo</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <button type="submit" className="py-2 w-full block text-center bg-blue-900 text-slate-100 border rounded-xl hover:scale-100 duration-300 hover:bg-green-300 hover:text-black">
                                        {isLoading ? 'Actualizando...' : 'Actualizar'}
                                    </button>
                                </div>
                            </form>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UpdateSeller;
