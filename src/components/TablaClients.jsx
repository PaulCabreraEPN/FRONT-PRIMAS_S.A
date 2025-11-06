import axios from "axios";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Loader from "./Carga";
import { useNavigate } from "react-router-dom";

const ClientList = () => {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [allClients, setAllClients] = useState([]); // lista maestra
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 2 filas de 3 columnas
    const [searchRuc, setSearchRuc] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalClient, setModalClient] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

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
            setAllClients(arr);
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

    // Abrir modal y cargar información del cliente por RUC
    const openClientModal = async (ruc) => {
        setModalOpen(true);
        setModalLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem('token');
            const url = `${backendUrl}/clients/${ruc}`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(url, options);
            setModalClient(response.data.data);
        } catch (error) {
            console.error(error);
            toast.error('Error al cargar cliente');
            setModalClient(null);
        } finally {
            setModalLoading(false);
        }
    };

    // Eliminar cliente desde el modal
    const eliminarClientFromModal = async (id) => {
        const confirmDelete = window.confirm('¿Seguro que deseas eliminar este cliente?');
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem('token');
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const url = `${backendUrl}/clients/delete/${id}`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.delete(url, options);
            toast.success('Cliente eliminado con éxito');
            setModalOpen(false);
            setModalClient(null);
            setTimeout(() => fetchClients(), 800);
        } catch (error) {
            console.error(error);
            toast.error('Error al eliminar el cliente');
        }
    };

    // Resetear la página cuando cambian los clientes
    useEffect(() => {
        setCurrentPage(1);
    }, [clients]);

    // Filtrado en vivo: mientras se escribe en el input searchRuc (filtra por RUC o nombre)
    useEffect(() => {
        const term = String(searchRuc || "").trim();
        if (!term) {
            setClients(allClients);
            setCurrentPage(1);
            return;
        }

        const lower = term.toLowerCase();
        const filtered = (Array.isArray(allClients) ? allClients : []).filter((c) => {
            const ruc = String(c.Ruc || c.ruc || '');
            const name = String(c.Name || c.name || '').toLowerCase();
            return ruc.includes(term) || name.includes(lower);
        });

        setClients(filtered);
        setCurrentPage(1);
    }, [searchRuc, allClients]);

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
                                placeholder="Ingrese RUC o nombre"
                                value={searchRuc}
                                onChange={(e) => setSearchRuc(e.target.value)}
                                className="border p-2 rounded w-44 max-w-xs"
                                aria-label="Buscar cliente por RUC o nombre"
                            />
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
                            onClick={() => openClientModal(client.Ruc || client.ruc)}
                        >
                            <h2 className="text-xl font-bold text-gray-800 whitespace-normal break-words">
                                {client.Name || client.name}
                            </h2>
                            <p className="text-sm text-gray-800 whitespace-normal break-words"><strong>RUC:</strong> <span className="font-semibold">{client.Ruc || client.ruc}</span></p>
                            <p className="text-sm text-gray-800 whitespace-normal break-words"><strong>Dirección:</strong> <span className="font-semibold">{client.Address || client.address}</span></p>
                            <p className="text-sm text-gray-800 whitespace-normal break-words"><strong>Teléfono:</strong> <span className="font-semibold">{client.telephone}</span></p>
                            <p className="text-sm text-gray-800 whitespace-normal break-words"><strong>Email:</strong> <span className="font-semibold">{client.email}</span></p>
                            <p className="text-sm text-gray-800 whitespace-normal break-words"><strong>Estado:</strong> <span className="font-semibold">{client.state}</span></p>
                        </div>
                        ));
                    })()}
                </div>

                {/* Modal: detalle cliente */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setModalOpen(false)} />
                        <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden ring-1 ring-black/5">
                            <div className="flex items-center justify-between px-5 py-3 border-b bg-white">
                                <h3 className="text-lg font-semibold">Detalle del Cliente</h3>
                                <button aria-label="Cerrar" onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-800 p-2 rounded-md">✕</button>
                            </div>

                            <div className="p-5">
                                {modalLoading ? (
                                    <div className="flex justify-center py-8"><Loader /></div>
                                ) : modalClient ? (
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="md:w-40 flex items-center justify-center md:justify-start">
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <img src={modalClient.image || '/images/seller.png'} alt={`Imagen ${modalClient.Name || modalClient.name}`} className="w-36 h-36 md:w-44 md:h-44 object-cover rounded-full border-4 border-blue-600" />
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                                <div>
                                                    <dt className="text-xs text-gray-500">Nombre</dt>
                                                    <dd className="text-sm font-medium text-gray-800">{modalClient.Name || modalClient.name || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs text-gray-500">RUC</dt>
                                                    <dd className="text-sm font-medium text-gray-800">{modalClient.Ruc || modalClient.ruc || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs text-gray-500">Dirección</dt>
                                                    <dd className="text-sm font-medium text-gray-800">{modalClient.Address || modalClient.address || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs text-gray-500">Teléfono</dt>
                                                    <dd className="text-sm font-medium text-gray-800">{modalClient.telephone || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs text-gray-500">Email</dt>
                                                    <dd className="text-sm font-medium text-gray-800">{modalClient.email || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs text-gray-500">Estado</dt>
                                                    <dd className="text-sm font-medium text-gray-800">{modalClient.state || 'N/A'}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-center py-4 text-gray-600">No se encontraron datos</p>
                                )}
                            </div>

                            <div className="px-5 py-4 bg-gray-50 border-t flex items-center justify-end gap-3">
                                <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-md bg-white border text-sm text-gray-700 hover:bg-gray-100">Cancelar</button>
                                <button onClick={() => { if(modalClient) navigate(`/dashboard/clients/update/${modalClient.Ruc || modalClient.ruc}`); }} className="px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700">Actualizar</button>
                                <button onClick={() => { if(modalClient) eliminarClientFromModal(modalClient._id || modalClient.id); }} className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700">Eliminar</button>
                            </div>
                        </div>
                    </div>
                )}

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
