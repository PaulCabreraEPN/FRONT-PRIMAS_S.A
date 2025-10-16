import axios from "axios";
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
    const [orderStates, setOrderStates] = useState({});
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6; // Mantener consistencia con TablaProducts
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

    // Filtrar las órdenes según el estado seleccionado
    const filterByState = (state) => {
        setCurrentStateFilter(state);
        const filtered = orders.filter(order => orderStates[order._id] === state);
        setFilteredOrders(filtered);
        setCurrentPage(1);
    };

    if (isLoading) {
        return <Loader />;
    }

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="p-4">
            <ToastContainer />
            {/* Cabecera: menú desplegable (izq), búsqueda (centro) */}
            <div className="p-4 mb-4 w-full">
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
                                placeholder="Código de Orden"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                className="border p-2 rounded w-44 max-w-xs"
                            />
                            <button onClick={searchOrders} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Buscar</button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Nota: los filtros de estado están disponibles desde el menú desplegable en la cabecera */}

            {filteredOrders.length === 0 ? (
                <Mensaje tipo={'error'}>{'No existen registros'}</Mensaje>
            ) : (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
                    {currentItems.map((order) => (
                        <div key={order._id} className="bg-white shadow-lg rounded-lg p-4 border-l-4 border-blue-500 relative">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Orden #{order._id.slice(-6)}</h3>
                                <MdNoteAdd
                                    className="h-7 w-7 text-slate-800 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/dashboard/orders/${order._id}`);
                                    }}
                                />
                            </div>
                            
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

                            {/* Select alineado en la esquina inferior derecha */}
                            <div className="absolute bottom-4 right-4">
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
                            {Array.from({ length: totalPages }).map((_, idx) => {
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
        </div>
    );
};

export default TablaOrders;
