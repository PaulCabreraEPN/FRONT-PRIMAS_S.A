import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Mensaje from "./Alertas/Mensaje";
import Loader from "./Carga";
import { ToastContainer, toast } from "react-toastify";

const Tabla = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [sellers, setSellers] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [statusFilter, setStatusFilter] = useState("Todos"); // Estado inicial: "Todos"

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
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Función para buscar un vendedor por cédula
    const buscarSeller = async () => {
        if (!searchId) {
            toast.warn("Ingrese una cédula válida");
            return;
        }

        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/sellers-numberid/${searchId}`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const respuesta = await axios.get(url, options);

            const seller = respuesta.data.data;
            setSellers([seller]);
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
        if (statusFilter === "Todos") return sellers;
        return sellers.filter((seller) =>
            statusFilter === "Activo" ? seller.status : !seller.status
        );
    };

    useEffect(() => {
        listarSellers();
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <ToastContainer />
            {/* Sección de búsqueda y filtros */}
            <div className="p-4 flex flex-col sm:flex-row justify-center items-center gap-4 rounded-lg mb-4 w-full">
                <input
                    type="text"
                    placeholder="Cédula vendedor"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="border p-2 rounded w-full sm:w-64 max-w-xs"
                />
                <button
                    onClick={buscarSeller}
                    className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto hover:bg-blue-600 transition"
                >
                    Buscar
                </button>
                <button
                    onClick={() => {
                        listarSellers();
                        setStatusFilter("Todos");
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto hover:bg-gray-600 transition"
                >
                    Mostrar Todos
                </button>
            </div>

            {/* Filtro de estado con botones */}
            <div className="flex justify-center gap-4 mb-4">
                {["Activo", "Inactivo"].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setStatusFilter(filter)}
                        className={`px-4 py-2 rounded-lg transition ${statusFilter === filter
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Botón de registro */}
            <div className="flex justify-end mb-4 px-4">
                <button
                    onClick={() => navigate("register")}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                >
                    <i className="fas fa-user-plus mr-2"></i>
                    Registrar Vendedor
                </button>
            </div>

            {/* Mensaje cuando no hay registros */}
            {filterSellers().length === 0 ? (
                <Mensaje tipo="error">No existen registros</Mensaje>
            ) : (
                <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 pb-10">
                    {filterSellers().map((seller) => (
                        <div
                            key={seller._id}
                            className="w-full p-6 bg-white cursor-pointer transform transition duration-300 rounded-lg overflow-hidden min-h-[190px] hover:shadow-xl hover:-translate-y-1 border-l-4 border-blue-500 shadow-lg"
                            onClick={() => navigate(`/dashboard/sellers/${seller._id}`)}
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
                    ))}
                </div>
            )}
        </>
    );
};

export default Tabla;


