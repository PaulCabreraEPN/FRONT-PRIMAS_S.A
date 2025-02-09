import { useEffect, useState } from "react";
import { MdNoteAdd, MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Mensaje from "./Alertas/Mensaje";
import Loader from "./Carga";

const Tabla = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false);
    const [sellers, setSellers] = useState([]);
    const [searchId, setSearchId] = useState("");

    const listarSellers = async () => {
        setIsLoading(true);
        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem('token');
            const url = `${backendUrl}/sellers`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const respuesta = await axios.get(url, options);
            setSellers(respuesta.data);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const buscarSeller = async () => {
        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem('token');
            const url = `${backendUrl}/sellers-numberid/${searchId}`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            };
            const respuesta = await axios.get(url, options);

            // Acceder directamente a respuesta.data.msg
            const seller = respuesta.data.msg;

            // Corregir la estructura del dato para que coincida con los nombres en el JSX
            setSellers([{
                _id: seller._id,
                numberID: seller.numberID,
                names: seller.name,  // Cambiar "name" a "names"
                lastNames: seller.lastNames,
                SalesCity: seller.SalesCity,
                status: seller.status
            }]);
        } catch (error) {
            console.log(error);
        }
    };



    useEffect(() => {
        listarSellers();
    }, []);

    if (isLoading) {
        return (
            <Loader />
        );
    }

    return (
        <>
            {/* Sección de búsqueda */}
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
                    onClick={listarSellers}
                    className="bg-gray-500 text-white px-4 py-2 rounded w-full sm:w-auto hover:bg-gray-600 transition"
                >
                    Mostrar Todos
                </button>
            </div>
    
            {/* Botón de registro */}
            <div className="flex justify-end mb-4 px-4">
                <button
                    onClick={() => navigate('register')}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
                >
                    <i className="fas fa-user-plus mr-2"></i>
                    Registrar Vendedor
                </button>
            </div>
    
            {/* Mensaje cuando no hay registros */}
            {sellers.length === 0 ? (
                <Mensaje tipo="error">No existen registros</Mensaje>
            ) : (
                <div className="px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {sellers.map((seller) => (
                        <div
                            key={seller._id}
                            className="w-full max-w-sm p-4 shadow-lg bg-white relative cursor-pointer 
                            hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200 rounded-lg overflow-hidden flex flex-col"
                            onClick={() => navigate(`/dashboard/sellers/${seller._id}`)}
                        >
                            {/* Imagen del vendedor */}
                            <div className="flex justify-center mb-3">
                                <img
                                    src="/images/seller.png"
                                    alt={`Imagen de ${seller.names}`}
                                    className="w-20 h-20 object-cover rounded-full"
                                />
                            </div>
    
                            {/* Detalles del vendedor */}
                            <div className="text-left px-2">
                                <p className="text-lg font-semibold"><strong>CI:</strong> {seller.numberID}</p>
                                <p className="text-lg"><strong>Nombre:</strong> {seller.names}</p>
                                <p className="text-lg"><strong>Apellidos:</strong> {seller.lastNames}</p>
                                <p className="text-lg"><strong>Ciudad:</strong> {seller.SalesCity}</p>
                            </div>
    
                            {/* Estado del vendedor */}
                            <span
                                className={`absolute top-2 right-2 text-xs font-medium px-2.5 py-0.5 rounded 
                                ${seller.status ? "bg-green-100 text-green-600 dark:bg-green-900" : "bg-red-100 text-red-600 dark:bg-red-900"}`}
                            >
                                {seller.status ? "Activo" : "Inactivo"}
                            </span>
    
                            {/* Ícono para agregar nota */}
                            <button
                                aria-label="Agregar nota"
                                className="absolute bottom-2 right-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/dashboard/sellers/${seller._id}`);
                                }}
                            >
                                <MdNoteAdd className="h-6 w-6 text-slate-800 cursor-pointer" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
    
    
    
    

};

export default Tabla;
