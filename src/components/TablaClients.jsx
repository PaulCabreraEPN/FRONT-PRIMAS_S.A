import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loader from "./Carga";
import { useNavigate } from "react-router-dom";

const ClientList = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 2 filas de 3 columnas
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
            const arr = Array.isArray(response.data.data) ? response.data.data : [];
            setClients(arr);
            setCurrentPage(1);
        } catch (error) {
            toast.error("Error al obtener los clientes");
            setClients([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchClientByRuc = async () => {
        const ruc = String(searchRuc || "").trim();
        // Validación: campo vacío
        if (!ruc) {
            toast.warn("Ingrese un cliente en el cuadro de busqueda");
            return;
        }
        // Validación: exactamente 13 dígitos y sólo números
        if (!/^[0-9]{13}$/.test(ruc)) {
            toast.warn("Ingrese un RUC válido de 13 dígitos (solo números)");
            return;
        }
        setIsLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const response = await axios.get(`${backendUrl}/clients/${ruc}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            // Acceder al cliente según la estructura del backend
            if (response.data && response.data.status === "success" && response.data.data) {
                setClients([response.data.data]);
                setCurrentPage(1);
                toast.success(response.data.msg || "Cliente encontrado");
            } else {
                setClients([]);
                toast.warn(response.data.msg || "Cliente no encontrado");
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || "Cliente no encontrado");
            setClients([]);
            setCurrentPage(1);
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

    // Resetear la página cuando cambian los clientes
    useEffect(() => {
        setCurrentPage(1);
    }, [clients]);

    return (
        <div className="p-6 min-h-screen">
            <ToastContainer />
    
            {/* Cabecera: búsqueda y acciones a la izquierda, registrar a la derecha */}
            <div className="p-4 mb-4 w-full">
                <div className="flex items-center gap-4">

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Ingrese RUC"
                                value={searchRuc}
                                onChange={(e) => setSearchRuc(e.target.value)}
                                className="border p-2 rounded w-44 max-w-xs"
                            />
                            <button
                                onClick={fetchClientByRuc}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                            >
                                Buscar
                            </button>
                            <button
                                onClick={fetchClients}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                            >
                                Mostrar Todos
                            </button>
                        </div>
                    </div>

                    <div className="ml-auto">
                        <button
                            onClick={() => navigate("register")}
                            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                        >
                            <i className="fas fa-user-plus mr-2"></i>
                            Registrar cliente
                        </button>
                    </div>
                </div>
            </div>
    
            {/* Loader mientras carga */}
            {isLoading ? (
                <Loader />
            ) : (
                <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-4">
                    {(() => {
                        const totalPages = Math.max(1, Math.ceil(clients.length / itemsPerPage));
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        const currentItems = clients.slice(startIndex, startIndex + itemsPerPage);
                        return currentItems.map((client) => (
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
                        ));
                    })()}
                </div>

                {/* Controles de paginación */}
                {clients.length > itemsPerPage && (
                    <div className="flex justify-center items-center gap-2 sm:gap-3 mt-4">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                            Anterior
                        </button>

                        <div className="flex gap-1 sm:gap-2 items-center">
                            {Array.from({ length: Math.max(1, Math.ceil(clients.length / itemsPerPage)) }).map((_, idx) => {
                                const pageNum = idx + 1;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(Math.ceil(clients.length / itemsPerPage), p + 1))}
                            disabled={currentPage === Math.ceil(clients.length / itemsPerPage)}
                            className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded ${currentPage === Math.ceil(clients.length / itemsPerPage) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                            Siguiente
                        </button>
                    </div>
                )}
                </>
            )}
        </div>
    );
    
    
};

export default ClientList;
