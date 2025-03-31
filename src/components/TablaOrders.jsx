import axios from "axios";
import { useEffect, useState } from "react";
import Mensaje from "./Alertas/Mensaje";
import { toast, ToastContainer } from "react-toastify";
import Loader from "./Carga";
import { useNavigate } from "react-router-dom";
import { MdNoteAdd } from "react-icons/md";

const TablaOrders = () => {
    // Estados
    const [isLoading, setIsLoading] = useState(false);
    const [searchId, setSearchId] = useState("");
    const [orders, setOrders] = useState([]);
    const [orderStates, setOrderStates] = useState({});
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentStateFilter, setCurrentStateFilter] = useState("all"); // Filtro de estado
    
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
            const data = response.data;

            setOrders(data);
            
            // Actualizar estados de los pedidos
            const newOrderStates = {};
            data.forEach(order => {
                newOrderStates[order._id] = order.status;
            });
            setOrderStates(newOrderStates);
            setFilteredOrders(data);  // Inicialmente, todas las órdenes están filtradas
            
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
        if (!searchId) {
            toast.warn("Ingrese un código de Orden válido");
            return;
        }
        try {
            setIsLoading(true);
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/orders/${searchId}`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(url, options);
            setOrders([response.data]);
            toast.success("Orden encontrada");

            // Actualizar el estado del pedido buscado
            setOrderStates({ [response.data._id]: response.data.status });
            setFilteredOrders([response.data]);
            
        } catch (error) {
            toast.error("Orden no encontrada");
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar pedidos al iniciar
    useEffect(() => {
        getOrders();
    }, []);

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
        if (state === "all") {
            setFilteredOrders(orders);  // Mostrar todas las órdenes
        } else {
            const filtered = orders.filter(order => orderStates[order._id] === state);
            setFilteredOrders(filtered);
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="p-4">
            <ToastContainer />
            {/* Barra de búsqueda */}
            <div className="p-4 text-center rounded-lg mb-4 flex flex-col sm:flex-row items-center gap-2 justify-center">
                <input
                    type="text"
                    placeholder="Código de Orden"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="border p-2 rounded w-full sm:w-auto"
                />
                <button onClick={searchOrders} className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto">Buscar</button>
                <button onClick={getOrders} className="bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto">Mostrar Todos</button>
            </div>

            {/* Filtro por estado */}
            <div className="flex justify-center gap-4 mb-4">
                {["all", "Pendiente", "En proceso", "Enviado", "Cancelado"].map((state) => (
                    <button
                        key={state}
                        onClick={() => filterByState(state)}
                        className={`px-4 py-2 rounded-lg transition-colors ${currentStateFilter === state
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        {state === "all" ? "Todos" : state}
                    </button>
                ))}
            </div>

            {filteredOrders.length === 0 ? (
                <Mensaje tipo={'error'}>{'No existen registros'}</Mensaje>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3">
                    {filteredOrders.map((order) => (
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
            )}
        </div>
    );
};

export default TablaOrders;
