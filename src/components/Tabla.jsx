import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Mensaje from "./Alertas/Mensaje";
import Loader from "./Carga";
import { ToastContainer, toast } from "react-toastify";

const Tabla = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [sellers, setSellers] = useState([]);
    const [allSellers, setAllSellers] = useState([]); // lista maestra para filtros
    const [searchActive, setSearchActive] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // 2 filas de 3 columnas
    const [searchId, setSearchId] = useState("");
    const [statusFilter, setStatusFilter] = useState("Todos"); // Estado inicial: "Todos"
    const [modalOpen, setModalOpen] = useState(false);
    const [modalSeller, setModalSeller] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Clases para el badge que muestra el filtro activo (armoniza con los badges existentes)
    const getBadgeClasses = (filter) => {
        if (filter === 'Activo') return 'text-sm font-medium px-3 py-2 rounded bg-green-50 text-green-700 border border-green-100';
        if (filter === 'Inactivo') return 'text-sm font-medium px-3 py-2 rounded bg-red-50 text-red-700 border border-red-100';
        return 'text-sm font-medium px-3 py-2 rounded bg-gray-100 text-gray-800 border border-gray-200';
    };

    // Función para listar todos los vendedores
    const listarSellers = async () => {
        setIsLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/sellers`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const respuesta = await axios.get(url, options);
            setSellers(respuesta.data.data);
            setAllSellers(respuesta.data.data);
            console.debug('[Tabla] listarSellers: fetched', respuesta.data.data.length, 'sellers');
            // Al listar todos, nos aseguramos de salir del modo búsqueda
            setSearchActive(false);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Función para buscar un vendedor por cédula
    const buscarSeller = async () => {
        const cedula = String(searchId || "").trim();
        // Validación: campo vacío -> mensaje específico
        if (!cedula) {
            toast.warn("Ingrese un vendedor en el cuadro de búsqueda");
            return;
        }
        // Validación: exactamente 10 caracteres y sólo dígitos
        if (!/^[0-9]{10}$/.test(cedula)) {
            toast.warn("Ingrese una cédula válida de 10 dígitos (solo números)");
            return;
        }

        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/sellers-numberid/${cedula}`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const respuesta = await axios.get(url, options);

            const seller = respuesta.data.data;
            setSellers([seller]);
            // Activar modo búsqueda para mostrar sólo el resultado encontrado
            setSearchActive(true);
            console.debug('[Tabla] buscarSeller: found', seller ? seller._id : null, seller);
            toast.success("Vendedor encontrado");
        } catch (error) {
            const respuesta = error.response.data.msg;
            if (respuesta === "Vendedor no encontrado") {
                toast.error(error.response.data.msg);
            } else {
                toast.warn(error.response.data.msg);
            }

        }
    };

    // Función para filtrar los vendedores según el estado seleccionado
    const filterSellers = () => {
        // Si no hay filtro (Todos) devolvemos la lista maestra completa
        // Esto asegura que después de realizar una búsqueda y tener "sellers"
        // con solo el resultado, al seleccionar "Todos" se muestren todos los registros.
        if (statusFilter === "Todos") {
            // Si estamos en modo búsqueda, mostrar los resultados de la búsqueda
            if (searchActive) return sellers;
            return allSellers;
        }
        // Si hay filtro, aplicarlo también sobre la lista maestra o sobre los resultados de búsqueda
        const source = searchActive ? sellers : allSellers;
        return source.filter((seller) =>
            statusFilter === "Activo" ? seller.status : !seller.status
        );
    };

    // Filtrado en vivo: cuando el usuario escribe en el cuadro de búsqueda
    useEffect(() => {
        const term = String(searchId || "").trim();
        // Si el campo está vacío, restauramos la lista completa y desactivamos el modo búsqueda
        if (!term) {
            setSellers(allSellers);
            setSearchActive(false);
            setCurrentPage(1);
            return;
        }

        // Fuente base: respetar el filtro de estado actual
        const base = statusFilter === 'Todos'
            ? allSellers
            : allSellers.filter((seller) => statusFilter === 'Activo' ? seller.status : !seller.status);

        const lower = term.toLowerCase();
        const filtered = base.filter((s) => {
            return (
                String(s.cedula || '') .includes(term) ||
                String(s.names || '').toLowerCase().includes(lower) ||
                String(s.lastNames || '').toLowerCase().includes(lower) ||
                String(s.username || '').toLowerCase().includes(lower)
            );
        });

        setSellers(filtered);
        setSearchActive(true);
        setCurrentPage(1);
    }, [searchId, allSellers, statusFilter]);

    useEffect(() => {
        listarSellers();
    }, []);

    // Abrir modal y cargar datos del vendedor por id
    const openSellerModal = async (id) => {
        setModalOpen(true);
        setModalLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/sellers/${id}`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const respuesta = await axios.get(url, options);
            setModalSeller(respuesta.data.data);
            console.debug('[Tabla] openSellerModal: loaded', respuesta.data.data._id);
        } catch (error) {
            console.error(error);
            toast.error('Error cargando vendedor');
            setModalSeller(null);
        } finally {
            setModalLoading(false);
        }
    };

    // Eliminar vendedor desde el modal (reusa la lógica de SellerDetatill)
    const eliminarSellerFromModal = async (id) => {
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
            toast.success(respuesta.data.msg || 'Vendedor eliminado');
            setModalOpen(false);
            setModalSeller(null);
            // refrescar lista
            setTimeout(() => {
                listarSellers();
            }, 800);
        } catch (error) {
            console.error(error);
            toast.error('Error al eliminar el vendedor');
        }
    };

    // Resetear página cuando cambian sellers o el filtro
    useEffect(() => {
        setCurrentPage(1);
    }, [sellers, statusFilter]);

    // Cerrar el menú si se hace click fuera o se presiona Escape
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        const handleKey = (e) => {
            if (e.key === 'Escape') {
                setMenuOpen(false);
                setModalOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKey);
        };
    }, [menuRef]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <ToastContainer />
            {/* Cabecera: menú desplegable ☰ (izq), búsqueda + botones (centro), registrar (derecha) */}
            <div className="p-4 mb-4 w-full">
                <div className="flex items-center gap-4">

                    {/* Menú desplegable ☰ y búsqueda inmediatamente a su derecha */}
                    <div className="flex items-center gap-3">
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="p-2 rounded-md bg-white border shadow-sm hover:bg-gray-50"
                                aria-haspopup="true"
                                aria-expanded={menuOpen}
                                id="menu-button"
                            >
                                <span className="text-xl">☰</span>
                            </button>
                            {/* Menu: aparece solo cuando menuOpen = true */}
                            {menuOpen && (
                                <div className="absolute left-0 mt-2 w-64 sm:w-72 bg-white border rounded shadow-lg z-10" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                                    <button onClick={() => { setStatusFilter('Todos'); listarSellers(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">Todos</button>
                                    <button onClick={() => { setStatusFilter('Activo'); setSearchActive(false); setSellers(allSellers); setCurrentPage(1); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">Activo</button>
                                    <button onClick={() => { setStatusFilter('Inactivo'); setSearchActive(false); setSellers(allSellers); setCurrentPage(1); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">Inactivo</button>
                                </div>
                            )}
                        </div>

                            <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Cédula vendedor"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="border p-2 rounded w-44 max-w-xs"
                                aria-label="Buscar vendedor por cédula, nombre o usuario"
                            />
                            </div>

                            {/* Badge que muestra el filtro seleccionado actualmente */}
                            <div className="ml-3">
                                <span className={getBadgeClasses(statusFilter)} aria-live="polite" title={`Filtro: ${statusFilter}`}>
                                    <span className="mr-2 text-xs text-gray-500">Filtro</span>
                                    <span className="font-semibold">{statusFilter}</span>
                                </span>
                            </div>
                    </div>

                    {/* Botón Registrar a la derecha */}
                    <div className="ml-auto">
                        <button
                            onClick={() => navigate("register")}
                            className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                        >
                            <i className="fas fa-user-plus mr-2"></i>
                            Registrar Vendedor
                        </button>
                    </div>
                </div>

                {/* Modal mejorado: detalle vendedor */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                        <div className="absolute inset-0 bg-black/50 transition-opacity" onClick={() => setModalOpen(false)} />

                        <div role="dialog" aria-modal="true" className="relative z-10 w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden ring-1 ring-black/5">
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-3 border-b bg-white">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-semibold">Detalle del Vendedor</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button aria-label="Cerrar" onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-gray-800 p-2 rounded-md">✕</button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                {modalLoading ? (
                                    <div className="flex justify-center py-8"><Loader /></div>
                                ) : modalSeller ? (
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {/* Imagen */}
                                        <div className="md:w-40 flex items-center justify-center md:justify-start">
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <img src={modalSeller.image || '/images/seller.png'} alt={`Imagen ${modalSeller.names}`} className="w-36 h-36 md:w-44 md:h-44 object-cover rounded-full border-4 border-blue-600" />
                                            </div>
                                        </div>

                                        {/* Datos */}
                                        <div className="flex-1">
                                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                                                <div>
                                                    <dt className="text-xs text-gray-500">Nombres</dt>
                                                    <dd className="text-sm font-medium text-gray-800">{modalSeller.names || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs text-gray-500">Apellidos</dt>
                                                    <dd className="text-sm font-medium text-gray-800">{modalSeller.lastNames || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs text-gray-500">Cédula</dt>
                                                    <dd className="text-sm font-medium text-gray-800">{modalSeller.cedula || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs text-gray-500">Usuario</dt>
                                                    <dd className="text-sm font-medium text-gray-800">{modalSeller.username || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs text-gray-500">Email</dt>
                                                    <dd className="text-sm font-medium text-gray-800">{modalSeller.email || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs text-gray-500">Ciudad de Ventas</dt>
                                                    <dd className="text-sm font-medium text-gray-800">{modalSeller.SalesCity || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs text-gray-500">Teléfono</dt>
                                                    <dd className="text-sm font-medium text-gray-800">{modalSeller.PhoneNumber || 'N/A'}</dd>
                                                </div>
                                                <div>
                                                    <dt className="text-xs text-gray-500">Estado</dt>
                                                    <dd className="text-sm font-medium text-gray-800">{modalSeller.status ? 'Activo' : 'Inactivo'}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-center py-4 text-gray-600">No se encontraron datos</p>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-5 py-4 bg-gray-50 border-t flex items-center justify-end gap-3">
                                <button onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-md bg-white border text-sm text-gray-700 hover:bg-gray-100">Cancelar</button>
                                <button onClick={() => { if(modalSeller) navigate(`/dashboard/sellers/update/${modalSeller._id}`); }} className="px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700">Actualizar</button>
                                <button onClick={() => { if(modalSeller) eliminarSellerFromModal(modalSeller._id); }} className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700">Eliminar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Filtros de estado movidos al menú ☰ */}

            {/* (Botón de registro principal está en la cabecera) */}

            {/* Mensaje cuando no hay registros */}
            {filterSellers().length === 0 ? (
                <Mensaje tipo="error">No existen registros</Mensaje>
            ) : (
                <>
                <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 pb-10">
                    {(() => {
                        const filtered = filterSellers();
                        const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);
                            return currentItems.map((seller) => (
                            <div
                                key={seller._id}
                                className="w-full p-6 bg-white cursor-pointer transform transition duration-300 rounded-lg overflow-hidden min-h-[190px] hover:shadow-xl hover:-translate-y-1 border-l-4 border-blue-500 shadow-lg"
                                onClick={() => openSellerModal(seller._id)}
                            >
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                {/* Información del vendedor en grid para mejor distribución */}
                                <div className="flex-1 text-left">
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <p className="text-sm text-gray-800"><strong>CI:</strong> <span className="font-semibold">{seller.cedula}</span></p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-800"><strong>Nombre:</strong> <span className="font-semibold">{seller.names}</span></p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-800"><strong>Apellidos:</strong> <span className="font-semibold">{seller.lastNames}</span></p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-800"><strong>Ciudad:</strong> <span className="font-semibold">{seller.SalesCity || '-'}</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Imagen del vendedor */}
                                <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center">
                                    <img
                                        src={seller.image || "/images/seller.png"}
                                        alt={`Imagen de ${seller.names}`}
                                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-full shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Pie: estado en la parte inferior derecha con sombra */}
                            <div className="mt-4 border-t pt-3 flex items-center justify-between bg-white">
                                <div />
                                <span className={`text-sm font-medium px-3 py-1 rounded ${seller.status ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
                                    {seller.status ? "Activo" : "Inactivo"}
                                </span>
                            </div>
                        </div>
                        ));
                    })()}
                </div>

                {/* Controles de paginación */}
                {filterSellers().length > itemsPerPage && (
                    <div className="flex justify-center items-center gap-2 sm:gap-3 mt-4">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                            Anterior
                        </button>

                        <div className="flex gap-1 sm:gap-2 items-center">
                            {Array.from({ length: Math.max(1, Math.ceil(filterSellers().length / itemsPerPage)) }).map((_, idx) => {
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
                            onClick={() => setCurrentPage((p) => Math.min(Math.ceil(filterSellers().length / itemsPerPage), p + 1))}
                            disabled={currentPage === Math.ceil(filterSellers().length / itemsPerPage)}
                            className={`text-sm sm:text-base px-2 sm:px-3 py-1 rounded ${currentPage === Math.ceil(filterSellers().length / itemsPerPage) ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                        >
                            Siguiente
                        </button>
                    </div>
                )}
                </>
            )}
        </>
    );
};

export default Tabla;


