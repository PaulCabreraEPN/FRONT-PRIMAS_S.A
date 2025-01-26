import { useEffect, useState } from "react";
import { MdNoteAdd, MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Mensaje from "./Alertas/Mensaje";

const Tabla = () => {
    const navigate = useNavigate()
    const [sellers, setSellers] = useState([]);
    const [searchId, setSearchId] = useState("");

    const listarSellers = async () => {
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
            setSellers([respuesta.data.msg]);
        } catch (error) {
            console.log(error);
        }
    };

    const eliminarSeller = async (id) => {
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
            alert(respuesta.data.msg);
            listarSellers(); // Actualizar la lista de vendedores
        } catch (error) {
            console.error(error);
            alert("Error al eliminar el vendedor");
        }
    };

    useEffect(() => {
        listarSellers();
    }, []);

    return (
        <>
            <div className="p-4 bg-blue-100 text-center rounded-lg mb-4">
                <span className="mr-2">Digita la cédula del vendedor:</span>
                <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="border p-2 rounded mr-2"
                />
                <button onClick={buscarSeller} className="bg-blue-500 text-white px-4 py-2 rounded">Buscar</button>
                <button onClick={listarSellers} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Mostrar Todos</button>
            </div>

            {
                sellers.length === 0 ?
                    <Mensaje tipo={'error'}>{'No existen registros'}</Mensaje>
                    :
                    <div className="pl-3 pr-3 grid grid-cols-2 gap-4">
                        {sellers.map((seller) => (
                            <div
                                className="w-full p-4 flex items-center shadow-lg bg-white relative cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200"
                                key={seller._id}
                            >
                                <img src="/images/seller.png" alt="Imagen del vendedor" className="w-24 h-24 object-cover rounded-full mr-4" />
                                <div className="flex-1">
                                    <h1 className="text-sm font-semibold">Ci: {seller.numberID}</h1>
                                    <h1 className="text-sm">Nombre: {seller.names}</h1>
                                    <h1 className="text-sm">Apellidos: {seller.lastNames}</h1>
                                    <h1 className="text-sm">Ciudad: {seller.SalesCity}</h1>
                                </div>
                                {seller.status ?
                                    <span className="absolute top-2 right-2 bg-blue-100 text-green-500 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900">Activo</span>
                                    :
                                    <span className="absolute top-2 right-2 bg-blue-100 text-red-500 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900">Inactivo</span>
                                }
                                <MdNoteAdd
                                    className="h-7 w-7 text-slate-800 cursor-pointer ml-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/dashboard/sellers/update/${seller._id}`);
                                    }}
                                />
                                <MdDeleteForever
                                    className="h-7 w-7 text-red-900 cursor-pointer inline-block"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        eliminarSeller(seller._id);
                                    }}
                                />

                            </div>
                        ))}
                    </div>
            }
        </>
    );
};

export default Tabla;
