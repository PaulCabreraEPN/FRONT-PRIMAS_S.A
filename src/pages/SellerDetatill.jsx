import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Carga";
import { ToastContainer, toast } from "react-toastify";

const SellerDetaill = () => {

    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams()
    const navigate = useNavigate()

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
        
            const Seller = response.data.data
            
            setSeller({
                names: Seller.names,
                lastNames: Seller.lastNames,
                numberID: Seller.cedula,
                username: Seller.username,
                email: Seller.email,
                SalesCity: Seller.SalesCity,
                PhoneNumber: Seller.PhoneNumber,
                status: Seller.status

            })

        } catch (error) {
            console.log(error);
        
            
        } finally {
            setIsLoading(false);
        }
    }

    const eliminarSeller = async (id) => {
        const confirmacion = window.confirm("¿Estás seguro de que deseas eliminar este vendedor?");
        if (!confirmacion) return;

        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/deleteSellerinfo/${id}`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const respuesta = await axios.delete(url, options);
            toast.success(respuesta.data.msg);
                setTimeout(() => {
                        navigate("/dashboard/sellers");
                }, 2000); // Actualizar la lista de vendedores
        } catch (error) {
            console.error(error);
            alert("Error al eliminar el vendedor");
        }
    };


    useEffect(()=>{
        getSeller()
    },[])

    if (isLoading) {
        return (
            <Loader/>
        );
    }

    return (
        <>
            <ToastContainer />
            <div className="flex justify-end items-center mb-4">
                {/*
                <button
                    onClick={() => navigate('/dashboard/sellers')}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 w-full sm:w-auto"
                >
                    ← Atrás
                </button>
                */}
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate(`/dashboard/sellers/update/${id}`)}
                        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Actualizar
                    </button>
                    <button
                        onClick={() => eliminarSeller(id)}
                        className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
    
            <h2 className="text-2xl font-bold text-center mb-6">Perfil del Vendedor</h2>
    
            <div className="w-full max-w-screen-lg mx-auto px-4">
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <img 
                            src="/images/seller.png" 
                            alt="Seller" 
                            className="w-32 h-32 object-cover rounded-full border-4 border-blue-600"
                        />
                    </div>
                </div>
    
                <div className="space-y-4 mt-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-bold text-gray-700">Nombres:</label>
                            <p className="text-gray-800 p-2 rounded">{seller?.names || "N/A"}</p>
                        </div>
    
                        <div>
                            <label className="block font-bold text-gray-700">Apellidos:</label>
                            <p className="text-gray-800 p-2 rounded">{seller?.lastNames || "N/A"}</p>
                        </div>
    
                        <div>
                            <label className="block font-bold text-gray-700">Número de Identificación:</label>
                            <p className="text-gray-800 p-2 rounded">{seller?.numberID || "N/A"}</p>
                        </div>
    
                        <div>
                            <label className="block font-bold text-gray-700">Nombre de Usuario:</label>
                            <p className="text-gray-800 p-2 rounded">{seller?.username || "N/A"}</p>
                        </div>
    
                        <div>
                            <label className="block font-bold text-gray-700">Email:</label>
                            <p className="text-gray-800 p-2 rounded">{seller?.email || "N/A"}</p>
                        </div>
    
                        <div>
                            <label className="block font-bold text-gray-700">Ciudad de Ventas:</label>
                            <p className="text-gray-800 p-2 rounded">{seller?.SalesCity || "N/A"}</p>
                        </div>
    
                        <div>
                            <label className="block font-bold text-gray-700">Teléfono:</label>
                            <p className="text-gray-800 p-2 rounded">{seller?.PhoneNumber || "N/A"}</p>
                        </div>
    
                        <div>
                            <label className="block font-bold text-gray-700">Estado:</label>
                            <p className="text-gray-800 p-2 rounded">{seller?.status ? "Activo" : "Inactivo"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
      
}



export default SellerDetaill