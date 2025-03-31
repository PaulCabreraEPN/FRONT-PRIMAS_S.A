import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Carga";
import { ToastContainer, toast } from "react-toastify";

const ClientDetaill = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { ruc ,id} = useParams();
    const navigate = useNavigate();

    const [cliente, setCliente] = useState({});

    const obtenerCliente = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const backUrl = import.meta.env.VITE_URL_BACKEND_API;
            const url = `${backUrl}/clients/${ruc}`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(url, options);
            setCliente(response.data.data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar el cliente");
        } finally {
            setIsLoading(false);
        }
    };

    const eliminarCliente = async () => {
        const confirmDelete = window.confirm("¿Seguro que deseas eliminar este cliente?");
        if (!confirmDelete) return;
    
        try {
            const token = localStorage.getItem("token");
            const backUrl = import.meta.env.VITE_URL_BACKEND_API;
            // Cambia ruc por cliente._id si es el campo correcto
            const url = `${backUrl}/clients/delete/${cliente._id}`;  // Asegúrate de usar el _id del cliente
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
    
            await axios.delete(url, options);
            toast.success("Cliente eliminado con éxito");
            setTimeout(() => navigate("/dashboard/clients"), 2000);
        } catch (error) {
            console.error('Error details:', error.response ? error.response.data : error.message);
            toast.error(`Error al eliminar el cliente: ${error.response ? error.response.data.message : error.message}`);
        }
    };
    

    useEffect(() => {
        obtenerCliente();
    }, []);

    if (isLoading) return <Loader />;

    return (
        <>
            <ToastContainer />

            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={() => navigate("/dashboard/clients")}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                    ← Volver
                </button>

                <div className="flex gap-4">
                    <button
                        onClick={() => navigate(`/dashboard/clients/update/${cliente.Ruc || cliente.ruc}`)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Actualizar
                    </button>
                    <button
                        
                        onClick={() => eliminarCliente(ruc)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                        Eliminar
                    </button>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-center mb-6">Perfil del Cliente</h2>

            <div className="w-full max-w-screen-lg mx-auto px-4">
                <div className="space-y-4 mt-8">

                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <img
                                src="/images/seller.png"
                                alt="Seller"
                                className="w-32 h-32 object-cover rounded-full border-4 border-blue-600"
                            />
                        </div>
                    </div>






                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(cliente).map(([key, value]) => {
                            if (key === "_id") return null; // Evitar mostrar el _id
                            return (
                                <div key={key}>
                                    <label className="block font-bold text-gray-700 capitalize">{key.replace(/_/g, ' ')}:</label>
                                    <p className="text-gray-800 p-2 rounded">{value || "N/A"}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientDetaill;
