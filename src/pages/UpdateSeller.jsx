import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'
import Loader from "../components/Carga";

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
                    numberID: sellerData.numberID || "",
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

    // Actualización completa (PUT)
    const handleFullUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const backUrl = import.meta.env.VITE_URL_BACKEND_API;
            const url = `${backUrl}/updateAllSellerinfo/${id}`;
            const options = {
                headers: {
                    'Content-type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const response = await axios.put(url, seller, options);
            toast.success(response.data.data)
            setTimeout(() => navigate("/dashboard/sellers"), 2000);
        } catch (error) {
            toast.error(error.response?.data?.error)
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
        <div className="container mx-auto">
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => navigate(`/dashboard/sellers/${id}`)}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full sm:w-auto"
                >
                    ← Atrás
                </button>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handlePartialUpdate}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isLoading ? "Actualizando..." : "Actualización Parcial"}
                    </button>
                    <button
                        type="button"
                        onClick={handleFullUpdate}
                        disabled={isLoading}
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        {isLoading ? "Actualizando..." : "Actualización Completa"}
                    </button>
                </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Actualizar Vendedor</h2>
            <ToastContainer />
            <form className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2">Nombres:</label>
                        <input
                            type="text"
                            id="names"
                            name="names"
                            value={seller?.names || ""}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Apellidos:</label>
                        <input
                            type="text"
                            id="lastNames"
                            name="lastNames"
                            value={seller?.lastNames || ""}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Número de Identificación:</label>
                        <input
                            type="number"
                            id="numberID"
                            name="numberID"
                            value={seller?.numberID || ""}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Nombre de Usuario:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={seller?.username || ""}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            disabled
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={seller?.email || ""}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Ciudad de Ventas:</label>
                        <input
                            type="text"
                            id="SalesCity"
                            name="SalesCity"
                            value={seller?.SalesCity || ""}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Teléfono:</label>
                        <input
                            type="number"
                            id="PhoneNumber"
                            name="PhoneNumber"
                            value={seller?.PhoneNumber || ""}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2">Estado:</label>
                        <select
                            name="status"
                            value={seller.status.toString()}
                            onChange={(e) => setSeller({...seller, status: e.target.value === "true"})}
                            className="w-full p-2 border rounded"
                        >
                            <option value="true">Activo</option>
                            <option value="false">Inactivo</option>
                        </select>
                    </div>
                </div>

                <div className="flex space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={handlePartialUpdate}
                        disabled={isLoading}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isLoading ? "Actualizando..." : "Actualización Parcial"}
                    </button>

                    <button
                        type="button"
                        onClick={handleFullUpdate}
                        disabled={isLoading}
                        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                    >
                        {isLoading ? "Actualizando..." : "Actualización Completa"}
                    </button>
                </div>

            </form>
        </div>
    );
}

export default UpdateSeller;
