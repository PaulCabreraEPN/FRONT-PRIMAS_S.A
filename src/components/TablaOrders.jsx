import axios from "axios";
import React from 'react';
import { useEffect, useState, useRef } from "react";
import Mensaje from "./Alertas/Mensaje";
import { toast, ToastContainer } from "react-toastify";
import Loader from "./Carga";
import { useNavigate } from "react-router-dom";
import { MdNoteAdd } from "react-icons/md";

const TablaOrders = () => {
    // Estados subidos
    const [isLoading, setIsLoading] = useState(false);
    const [searchId, setSearchId] = useState("");
    const [orders, setOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]); // lista maestra
    const [orderStates, setOrderStates] = useState({});
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Mostrar 4 items por página
    const [currentStateFilter, setCurrentStateFilter] = useState("all"); // Filtro de estado
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    
    const navigate = useNavigate();

    // Función para obtener pedidos
    const getOrders = async () => {
        try {
            setIsLoading(true);
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/orders`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(url, options);
            // Acceder a las órdenes según la estructura del backend
            const ordersArray = Array.isArray(response.data.data) ? response.data.data : [];
            setOrders(ordersArray);
            setAllOrders(ordersArray);
            // Actualizar estados de los pedidos
            const newOrderStates = {};
            ordersArray.forEach(order => {
                newOrderStates[order._id] = order.status;
            });
            setOrderStates(newOrderStates);
            setFilteredOrders(ordersArray);  // Inicialmente, todas las órdenes están filtradas
            setCurrentPage(1);
            
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Función para cambiar el estado del pedido
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const backUrl = import.meta.env.VITE_URL_BACKEND_API;
            const url = `${backUrl}/orders/update/state/${orderId}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const formData = { status: newStatus };

            const response = await axios.patch(url, formData, options);
            toast.success(response.data.msg);

            // Actualizar el estado local solo si la petición fue exitosa
            setOrderStates(prevState => ({
                ...prevState,
                [orderId]: newStatus
            }));

        } catch (error) {
            toast.error(error.response?.data?.msg);
        }
    };

    // Función para buscar un pedido por ID
    const searchOrders = async () => {
        const code = String(searchId || "").trim();
        // Validación: campo vacío
        if (!code) {
            toast.warn("Ingrese un pedido en el cuadro de búsqueda");
            return;
        }
        // Validación: exactamente 24 caracteres alfanuméricos
        if (!/^[a-zA-Z0-9]{24}$/.test(code)) {
            toast.warn("Ingrese un código de Orden válido de 24 caracteres (letras y números)");
            return;
        }
        try {
            setIsLoading(true);
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/orders/${code}`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(url, options);
            // Acceder a la orden según la estructura del backend
            if (response.data && response.data.status === "success" && response.data.data) {
                setOrders([response.data.data]);
                setCurrentPage(1);
                toast.success(response.data.msg || "Orden encontrada");
                // Actualizar el estado del pedido buscado
                setOrderStates({ [response.data.data._id]: response.data.data.status });
                setFilteredOrders([response.data.data]);
            } else {
                setOrders([]);
                setOrders([]);
                setFilteredOrders([]);
                setCurrentPage(1);
                toast.warn(response.data.msg || "Orden no encontrada");
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || "Orden no encontrada");
            setOrders([]);
            setFilteredOrders([]);
            setCurrentPage(1);
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar pedidos al iniciar
    useEffect(() => {
        getOrders();
    }, []);

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

    // Función para asignar color según el estado
    const getStatusColor = (status) => {
        switch (status) {
            case "Pendiente":
                return "bg-yellow-200 text-black-800 border-yellow-400";
            case "En proceso":
                return "bg-blue-200 text-blue-800 border-blue-400";
            case "Enviado":
                return "bg-green-200 text-green-800 border-green-400";
            case "Cancelado":
                return "bg-red-200 text-red-800 border-red-400";
            default:
                return "bg-gray-200 text-gray-800 border-gray-400";
        }
    };

    // Clases para el badge que muestra el estado seleccionado (igual alto que el input: py-2)
    const getStateBadgeClasses = (state) => {
        switch (state) {
            case 'Pendiente':
                return 'text-sm font-medium px-3 py-2 rounded bg-yellow-50 text-yellow-700 border border-yellow-100';
            case 'En proceso':
                return 'text-sm font-medium px-3 py-2 rounded bg-blue-50 text-blue-700 border border-blue-100';
            case 'Enviado':
                return 'text-sm font-medium px-3 py-2 rounded bg-green-50 text-green-700 border border-green-100';
            case 'Cancelado':
                return 'text-sm font-medium px-3 py-2 rounded bg-red-50 text-red-700 border border-red-100';
            default:
                return 'text-sm font-medium px-3 py-2 rounded bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    // Filtrar las órdenes según el estado seleccionado
    const filterByState = (state) => {
        setCurrentStateFilter(state);
        const source = Array.isArray(allOrders) && allOrders.length ? allOrders : orders;
        const filtered = source.filter(order => orderStates[order._id] === state);
        setFilteredOrders(filtered);
        setCurrentPage(1);
    };

    // Filtrado en vivo: cuando el usuario escribe en el input searchId
    useEffect(() => {
        const term = String(searchId || "").trim();
        // Si no hay término, restauramos según el filtro de estado actual
        if (!term) {
            if (currentStateFilter === 'all') {
                setFilteredOrders(allOrders);
            } else {
                const base = Array.isArray(allOrders) && allOrders.length ? allOrders : orders;
                setFilteredOrders(base.filter(o => orderStates[o._id] === currentStateFilter));
            }
            setCurrentPage(1);
            return;
        }

        const lower = term.toLowerCase();
        const base = currentStateFilter === 'all' ? (Array.isArray(allOrders) ? allOrders : orders) : (Array.isArray(allOrders) && allOrders.length ? allOrders.filter(o => orderStates[o._id] === currentStateFilter) : orders.filter(o => orderStates[o._id] === currentStateFilter));

        const filtered = (base || []).filter((o) => {
            const codeMatch = String(o._id || '').includes(term);
            const sellerName = (o.seller && ((o.seller.names || '') + ' ' + (o.seller.lastNames || ''))) || '';
            const sellerMatch = sellerName.toLowerCase().includes(lower);
            const clientName = (o.customer && (o.customer.Name || o.customer.name || '')) || '';
            const clientMatch = clientName.toLowerCase().includes(lower);
            return codeMatch || sellerMatch || clientMatch;
        });

        setFilteredOrders(filtered);
        setCurrentPage(1);
    }, [searchId, allOrders, currentStateFilter, orderStates, orders]);

    // Detectar si el área de contenido es desplazable y marcarla con la clase `has-scroll`
    useEffect(() => {
        const nodes = Array.from(document.querySelectorAll('.orders-scroll-area'));
        const onResize = () => {
            nodes.forEach((n) => {
                if (!n) return;
                if (n.scrollHeight > n.clientHeight) n.classList.add('has-scroll');
                else n.classList.remove('has-scroll');
            });
        };

        // Comprobar inicialmente
        onResize();

        // Añadir listeners para mantener actualizado el estado
        window.addEventListener('resize', onResize);
        nodes.forEach((n) => n.addEventListener('scroll', onResize));

        return () => {
            window.removeEventListener('resize', onResize);
            nodes.forEach((n) => n.removeEventListener('scroll', onResize));
        };
    }, [filteredOrders, currentPage]);

    if (isLoading) {
        return <Loader />;
    }

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    // Paginación truncada helper (máx botones visibles: 5)
    const getPagination = (totalPages, current, maxButtons = 5) => {
        if (totalPages <= maxButtons) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const pages = [];
        const side = Math.floor((maxButtons - 3) / 2); // para maxButtons=5 => side=1
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
            {/* estilos locales para ocultar scrollbar por defecto y mostrarlo en hover
                y para mostrar un indicador fino (gradiente) cuando el contenido sea desplazable */}
            <style>{`
                .orders-scroll-area { scrollbar-width: none; -ms-overflow-style: none; position: relative; }
                .orders-scroll-area::-webkit-scrollbar { width: 6px; }
                .orders-scroll-area::-webkit-scrollbar-thumb { background-color: rgba(0,0,0,0.22); border-radius: 6px; }
                .orders-scroll-area:not(:hover)::-webkit-scrollbar { width: 0; }
                .orders-scroll-area:not(:hover) { scrollbar-width: none; }

                /* Indicador fino en el lateral para hint de scroll */
                .orders-scroll-area.has-scroll::before {
                    content: '';
                    position: absolute;
                    right: 6px;
                    top: 12px;
                    height: calc(100% - 24px);
                    width: 6px;
                    border-radius: 9999px;
                    background: linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.06));
                    pointer-events: none;
                    opacity: 0.9;
                }
            `}</style>
            <ToastContainer />
            {/* Cabecera: menú desplegable (izq), búsqueda (centro) */}
            <div className="p-4 mb-1 w-full">
                <div className="flex items-center gap-4">

                    <div className="flex items-center gap-3">
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen((v) => !v)}
                                className="p-2 rounded-md bg-white border shadow-sm hover:bg-gray-50"
                                aria-haspopup="true"
                                aria-expanded={menuOpen}
                                id="menu-button-orders"
                            >
                                <span className="text-xl">☰</span>
                            </button>
                            {menuOpen && (
                                <div className="absolute left-0 mt-2 w-56 bg-white border rounded shadow-lg z-10" role="menu" aria-orientation="vertical" aria-labelledby="menu-button-orders">
                                    <button onClick={async () => { setCurrentStateFilter('all'); await getOrders(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">Todos</button>
                                    <button onClick={async () => { setCurrentStateFilter('Pendiente'); setFilteredOrders(orders.filter(o => orderStates[o._id] === 'Pendiente')); setCurrentPage(1); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">Pendiente</button>
                                    <button onClick={async () => { setCurrentStateFilter('En proceso'); setFilteredOrders(orders.filter(o => orderStates[o._id] === 'En proceso')); setCurrentPage(1); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">En proceso</button>
                                    <button onClick={async () => { setCurrentStateFilter('Enviado'); setFilteredOrders(orders.filter(o => orderStates[o._id] === 'Enviado')); setCurrentPage(1); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">Enviado</button>
                                    <button onClick={async () => { setCurrentStateFilter('Cancelado'); setFilteredOrders(orders.filter(o => orderStates[o._id] === 'Cancelado')); setCurrentPage(1); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-gray-100" role="menuitem">Cancelado</button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Consultar una órden"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="border p-2 rounded w-64 max-w-xs"
                                aria-label="Buscar orden por código, vendedor o cliente"
                            />
                        </div>

                        {/* Badge que muestra el filtro de estado actual */}
                        <div className="ml-3">
                            <span className={getStateBadgeClasses(currentStateFilter)} aria-live="polite" title={`Estado: ${currentStateFilter === 'all' ? 'Todos' : currentStateFilter}`}>
                                <span className="mr-2 text-xs text-gray-500">Estado</span>
                                <span className="font-semibold">{currentStateFilter === 'all' ? 'Todos' : currentStateFilter}</span>
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Nota: los filtros de estado están disponibles desde el menú desplegable en la cabecera */}

            {filteredOrders.length === 0 ? (
                <div className="text-center p-4">
                    <p className="text-gray-500">No hay pedidos disponibles</p>
                </div>
            ) : (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
                    {currentItems.map((order) => (
                        <div key={order._id} className="bg-white shadow-lg rounded-lg p-2 border-l-4 border-blue-500 flex flex-col" style={{ height: '13.7rem' }}>
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Órden #{order._id.slice(-6)}</h3>
                                <MdNoteAdd
                                    className="h-7 w-7 text-slate-800 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/dashboard/orders/${order._id}`);
                                    }}
                                />
                            </div>
                            
                            <div className="mt-2 flex-1 overflow-auto pr-2 orders-scroll-area">
                                <p className="text-gray-700">Cliente: {order.customer.Name}</p>
                                <p className="font-bold text-green-600">Total: ${order.totalWithTax.toFixed(2)}</p>

                                <div className="mt-3">
                                    <p><strong>Vendedor:</strong> {order.seller?.names} {order.seller?.lastNames}</p>
                                    <p className="mt-2 font-semibold">Productos:</p>
                                    <ul className="list-disc pl-5 text-sm text-gray-700">
                                        {order.products.map((prod) => (
                                            <li key={prod.productId}>
                                                {prod.quantity}x {prod.productDetails.product_name} (${prod.productDetails.price})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Pie: select al final de la tarjeta (mantiene visibilidad, sin posicionamiento absoluto) */}
                            <div className="mt-2 mt-auto flex items-center justify-end">
                                <select
                                    className={`text-sm font-semibold border rounded-md px-3 py-1 transition ${getStatusColor(orderStates[order._id])}`}
                                    value={orderStates[order._id] || "Pendiente"}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En proceso">En proceso</option>
                                    <option value="Enviado">Enviado</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 sm:gap-3 mt-4">
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
                )}
                </>
            )}
        </>
    );
};

export default TablaOrders;
