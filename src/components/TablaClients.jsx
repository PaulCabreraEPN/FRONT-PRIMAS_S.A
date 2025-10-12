import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loader from "./Carga";
import { useNavigate } from "react-router-dom";

const ClientList = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [searchRuc, setSearchRuc] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const fetchClients = async () => {
        setIsLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/clients`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(url, options);
            // Acceder a los clientes según la estructura del backend
            setClients(Array.isArray(response.data.data) ? response.data.data : []);
        } catch (error) {
            toast.error("Error al obtener los clientes");
            setClients([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchClientByRuc = async () => {
        if (!searchRuc) {
            toast.warn("Ingrese un RUC válido");
            return;
        }
        setIsLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backendUrl}/clients/${searchRuc}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            // Acceder al cliente según la estructura del backend
            if (response.data && response.data.status === "success" && response.data.data) {
                setClients([response.data.data]);
                toast.success(response.data.msg || "Cliente encontrado");
            } else {
                setClients([]);
                toast.warn(response.data.msg || "Cliente no encontrado");
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || "Cliente no encontrado");
            setClients([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initializeProducts = async () => {
            await fetchClients();
        };
        initializeProducts();
    }, []);

    return (
        <div className="p-6 min-h-screen">
            <ToastContainer />
    
            {/* Sección de búsqueda */}
            <div className="mb-6 flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
                <input
                    type="text"
                    placeholder="Ingrese RUC"
                    value={searchRuc}
                    onChange={(e) => setSearchRuc(e.target.value)}
                    className="border p-2 rounded w-full sm:w-64 max-w-xs"
                />
                <button
                    onClick={fetchClientByRuc}
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto hover:bg-blue-600 transition"
                >
                    Buscar
                </button>
                <button
                    onClick={fetchClients}
                    className="bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto hover:bg-gray-600 transition"
                >
                    Mostrar Todos
                </button>
            </div>

            {/* Botón de registro */}
            <div className="flex justify-end mb-4 px-4">
                <button
                    onClick={() => navigate("register")}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                >
                    <i className="fas fa-user-plus mr-2"></i>
                    Registrar cliente
                </button>
            </div>
    
            {/* Loader mientras carga */}
            {isLoading ? (
                <Loader />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-4">
                    {clients.map((client) => (
                        <div 
                            key={client.Ruc || client.ruc} 
                            className="w-full p-6 bg-white cursor-pointer transform transition duration-300 rounded-lg overflow-hidden min-h-[190px] hover:shadow-xl hover:-translate-y-1 border-l-4 border-blue-500 shadow-lg"
                            onClick={() => navigate(`/dashboard/clients/${client.Ruc || client.ruc}`)}
                        >
                            <h2 className="text-xl font-bold text-gray-800 whitespace-normal break-words">
                                {client.Name || client.name}
                            </h2>
                            <p className="text-sm text-gray-800 whitespace-normal break-words"><strong>RUC:</strong> <span className="font-semibold">{client.Ruc || client.ruc}</span></p>
                            <p className="text-sm text-gray-800 whitespace-normal break-words"><strong>Dirección:</strong> <span className="font-semibold">{client.Address || client.address}</span></p>
                            <p className="text-sm text-gray-800 whitespace-normal break-words"><strong>Teléfono:</strong> <span className="font-semibold">{client.telephone}</span></p>
                            <p className="text-sm text-gray-800 whitespace-normal break-words"><strong>Email:</strong> <span className="font-semibold">{client.email}</span></p>
                            <p className="text-sm text-gray-800 whitespace-normal break-words"><strong>Crédito:</strong> <span className="font-semibold">{client.credit}</span></p>
                            <p className="text-sm text-gray-800 whitespace-normal break-words"><strong>Estado:</strong> <span className="font-semibold">{client.state}</span></p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
    
    
};

export default ClientList;
