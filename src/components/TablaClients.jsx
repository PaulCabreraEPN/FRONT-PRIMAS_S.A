
import React from "react";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
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
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [confirmDeleteClientId, setConfirmDeleteClientId] = useState(null);
    const [confirmDeleting, setConfirmDeleting] = useState(false);
    // Filtro por estado (menu similar a TablaOrders / TablaProducts)
    const [currentStateFilter, setCurrentStateFilter] = useState('all');
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

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

    // Cerrar menú al hacer click fuera o presionar Escape
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        const handleKey = (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKey);
        };
    }, [menuRef]);

    // Clases para badge según estado (normaliza a minúsculas)
    const getStateBadgeClasses = (state) => {
        const s = String(state || '').toLowerCase();
        switch (s) {
            case 'al día':
            case 'al dia':
                return 'text-sm font-semibold px-2 py-1 rounded bg-green-50 text-green-700 border border-green-100';
            case 'en deuda':
                return 'text-sm font-semibold px-2 py-1 rounded bg-red-50 text-red-700 border border-red-100';
            default:
                return 'text-sm font-semibold px-2 py-1 rounded bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

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

    // Solicitar confirmación visual para eliminar cliente
    const requestDeleteClient = (id) => {
        setConfirmDeleteClientId(id);
        setConfirmDeleteOpen(true);
    };

    const handleCancelDelete = () => {
        setConfirmDeleteOpen(false);
        setConfirmDeleteClientId(null);
    };

    const handleConfirmDelete = async () => {
        if (!confirmDeleteClientId) return;
        setConfirmDeleting(true);
        try {
            const token = localStorage.getItem('token');
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const url = `${backendUrl}/clients/delete/${confirmDeleteClientId}`;
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
            setConfirmDeleteOpen(false);
            setConfirmDeleteClientId(null);
            setTimeout(() => fetchClients(), 800);
        } catch (error) {
            console.error(error);
            toast.error('Error al eliminar el cliente');
        } finally {
            setConfirmDeleting(false);
        }
    };

    // Resetear la página cuando cambian los clientes
    useEffect(() => {
        setCurrentPage(1);
    }, [clients]);

    // Filtrado en vivo: mientras se escribe en el input searchRuc (filtra por RUC o nombre)
    useEffect(() => {
        const term = String(searchRuc || "").trim();
        // Si no hay término, aplicamos el filtro de estado (si existe) o mostramos todo
        if (!term) {
            if (currentStateFilter === 'all') {
                setClients(allClients);
            } else {
                const desired = String(currentStateFilter || '').toLowerCase();
                setClients(Array.isArray(allClients) ? allClients.filter(c => String(c.state || '').toLowerCase() === desired) : []);
            }
            setCurrentPage(1);
            return;
        }

        const lower = term.toLowerCase();
        let base = Array.isArray(allClients) ? allClients : [];
        if (currentStateFilter !== 'all') {
            base = base.filter(c => c.state === currentStateFilter);
        }

        const filtered = base.filter((c) => {
            const ruc = String(c.Ruc || c.ruc || '');
            const name = String(c.Name || c.name || '').toLowerCase();
            return ruc.includes(term) || name.includes(lower);
        });

        setClients(filtered);
        setCurrentPage(1);
    }, [searchRuc, allClients, currentStateFilter]);

    // Paginación truncada helper (máx botones visibles: 5)
    const getPagination = (totalPages, current, maxButtons = 5) => {
        if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = [];
        const side = Math.floor((maxButtons - 3) / 2);
        const start = Math.max(2, current - side);
        const end = Math.min(totalPages - 1, current + side);
        pages.push(1);
        if (start > 2) pages.push('...');
        for (let i = start; i <= end; i++) pages.push(i);
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
        return pages;
    };

    return (
        <>
            <ToastContainer />
    
            {/* Cabecera: búsqueda y acciones a la izquierda, registrar a la derecha */}
            <div className="p-4 mb-4 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="p-2 rounded-md bg-white border shadow-sm hover:bg-gray-50"
                                aria-haspopup="true"
                                aria-expanded={menuOpen}
                                id="menu-button-clients"
                            >
                                <span className="text-xl">☰</span>
                            </button>
                            {menuOpen && (
                                <div className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-10" role="menu" aria-orientation="vertical" aria-labelledby="menu-button-clients">
                                    <button onClick={async () => { setCurrentStateFilter('all'); await fetchClients(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">Todos</button>
                                    <button onClick={() => { const desired = 'al día'; setCurrentStateFilter(desired); setClients(Array.isArray(allClients) ? allClients.filter(c => String(c.state || '').toLowerCase() === desired.toLowerCase()) : []); setCurrentPage(1); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">al día</button>
                                    <button onClick={() => { const desired = 'en deuda'; setCurrentStateFilter(desired); setClients(Array.isArray(allClients) ? allClients.filter(c => String(c.state || '').toLowerCase() === desired.toLowerCase()) : []); setCurrentPage(1); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">en deuda</button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Consultar cliente"
                                value={searchRuc}
                                onChange={(e) => setSearchRuc(e.target.value)}
                                className="border p-2 rounded w-full sm:w-44 max-w-xs"
                                aria-label="Buscar cliente por RUC o nombre"
                            />
                        </div>

                        <div className="ml-3">
                            <span className={getStateBadgeClasses(currentStateFilter === 'all' ? '' : currentStateFilter)} aria-live="polite" title={`Estado: ${currentStateFilter === 'all' ? 'Todos' : currentStateFilter}`}>
                                <span className="mr-2 text-xs text-gray-500">Filtro</span>
                                <span className="font-semibold">{currentStateFilter === 'all' ? 'Todos' : currentStateFilter}</span>
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 sm:mt-0 sm:ml-auto">
                        <button
                            onClick={() => navigate("register")}
                            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                        >
                            <i className="fas fa-user-plus mr-2"></i>
                            Registrar Cliente
                        </button>
                    </div>
                </div>
            </div>
    
            {/* Loader mientras carga */}
            {isLoading ? (
                <Loader />
            ) : clients.length === 0 ? (
                <div className="text-center p-4">
                    <p className="text-gray-500">No hay clientes disponibles</p>
                </div>
            ) : (
                <>
                <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 pb-4">
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
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex-1 text-left">
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <p className="text-sm text-gray-800"><strong>RUC:</strong> <span className="font-semibold">{client.Ruc || client.ruc || '-'}</span></p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-800"><strong>Nombre:</strong> <span className="font-semibold">{client.Name || client.name || '-'}</span></p>
                                        </div>

                                        

                                        <div>
                                            <p className="text-sm text-gray-800"><strong>Teléfono:</strong> <span className="font-semibold">{client.telephone || client.Telefono || '-'}</span></p>
                                        </div>
                                    </div>
                                </div>

                                        <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center">
                                            <img loading="lazy" src={client.image || '/images/seller.png'} alt={`Imagen ${client.Name || client.name}`} className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full shadow-sm" />
                                        </div>
                            </div>

                            {/* Pie: estado en la parte inferior derecha con diseño igual a Tabla.jsx */}
                            <div className="mt-4 border-t pt-3 flex items-center justify-between bg-white">
                                <div />
                                <span className={getStateBadgeClasses(client.state)}>
                                    {client.state || '-'}
                                </span>
                            </div>
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
                                                    <dt className="text-sm font-medium text-gray-800">Nombre</dt>
                                                    <dd className="text-xs text-gray-500">{modalClient.Name || modalClient.name || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-800">Nombre Comercial</dt>
                                                    <dd className="text-xs text-gray-500">{modalClient.ComercialName || modalClient.comercialName || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-800">RUC</dt>
                                                    <dd className="text-xs text-gray-500">{modalClient.Ruc || modalClient.ruc || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-800">Dirección</dt>
                                                    <dd className="text-xs text-gray-500">{modalClient.Address || modalClient.address || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-800">Teléfono</dt>
                                                    <dd className="text-xs text-gray-500">{modalClient.telephone || modalClient.Telefono || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-800">Correo</dt>
                                                    <dd className="text-xs text-gray-500">{modalClient.email || modalClient.Email || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-800">Estado</dt>
                                                    <dd className="text-xs text-gray-500">{modalClient.state || 'N/A'}</dd>
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
                                <button onClick={() => { if(modalClient) requestDeleteClient(modalClient._id || modalClient.id); }} className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700">Eliminar</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Confirmación de eliminación (modal visual) */}
                {confirmDeleteOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/50" onClick={handleCancelDelete} />

                        <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z"></path></svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-1">¿Estás seguro?</h3>
                                <p className="text-sm text-gray-500 mb-4">¡No podrás revertir esto!</p>
                                <div className="flex gap-3">
                                    <button onClick={handleConfirmDelete} disabled={confirmDeleting} className={`px-4 py-2 rounded ${confirmDeleting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>Sí, eliminarlo!</button>
                                    <button onClick={handleCancelDelete} disabled={confirmDeleting} className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white">Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Controles de paginación (truncada) */}
                {Math.ceil(clients.length / itemsPerPage) > 1 && (() => {
                    const totalPages = Math.max(1, Math.ceil(clients.length / itemsPerPage));
                    return (
                        <div className="flex justify-center items-center gap-2 sm:gap-3 mt-2">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            >
                                Anterior
                            </button>

                            <div className="flex gap-1 sm:gap-2 items-center">
                                {getPagination(totalPages, currentPage, 5).map((item, idx) => {
                                    if (item === '...') return <span key={'dots-' + idx} className="px-2 text-sm text-gray-500">...</span>;
                                    const pageNum = item;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            aria-label={`Ir a la página ${pageNum}`}
                                            aria-current={currentPage === pageNum ? 'page' : undefined}
                                            className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded ${currentPage === pageNum ? 'bg-blue-700 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                            >
                                Siguiente
                            </button>
                        </div>
                    );
                })()}
                </>
            )}
        </>
    );
    
    
};

export default ClientList;
