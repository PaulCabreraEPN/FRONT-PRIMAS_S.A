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
            <div className="p-4 text-center rounded-lg mb-4">
                <span className="mr-2"></span>
                <input
                    type="text"
                    placeholder="Cédula vendedor"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="border p-2 rounded mr-2"
                />
                <button onClick={buscarSeller} className="bg-blue-500 text-white px-4 py-2 rounded">Buscar</button>
                <button onClick={listarSellers} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Mostrar Todos</button>
            </div>

            <div className="flex justify-end items-center mb-4">

                <button
                    onClick={() => navigate('register')}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <i className="fas fa-user-plus mr-2"></i>
                    Registrar Vendedor
                </button>
            </div>

            {
                sellers.length == 0
                    ?
                    <Mensaje tipo={'error'}>{'No existen registros'}</Mensaje>
                    :

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr", // Dos columnas iguales
                            gap: "20px", // Espaciado entre elementos
                        }}

                        className="pl-3 pr-3"
                    >


                        {
                            sellers.map((seller) => (

                                <div
                                    className="w-full p-4 flex items-center shadow-lg bg-white relative cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200"
                                    key={seller._id}
                                    onClick={() => navigate(`/dashboard/sellers/${seller._id}`)} // Opcional: hacer clic en todo el div
                                >
                                    {/* Imagen del vendedor */}
                                    <img
                                        src="/images/seller.png"
                                        alt="Imagen del vendedor"
                                        className="w-24 h-24 object-cover rounded-full mr-4"
                                    />

                                    {/* Detalles del vendedor */}
                                    <div className="flex-1">
                                        <h1 className="text-lg font-semibold">Ci: {seller.numberID}</h1>
                                        <h1 className="text-lg">Nombre: {seller.names}</h1>
                                        <h1 className="text-lg">Apellidos: {seller.lastNames}</h1>
                                        <h1 className="text-lg">Ciudad: {seller.SalesCity}</h1>
                                    </div>

                                    {/* Estado del vendedor */}
                                    {
                                        seller.status ?
                                            <span className="absolute top-2 right-2 bg-blue-100 text-green-500 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900"> {"Activo"} </span>
                                            :
                                            <span className="absolute top-2 right-2 bg-blue-100 text-red-500 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900"> {"Inacativo"} </span>
                                    }


                                    {/* Ícono para agregar nota */}
                                    <MdNoteAdd
                                        className="h-7 w-7 text-slate-800 cursor-pointer ml-2"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Evitar que el clic en el ícono dispare el clic del div
                                            navigate(`/dashboard/sellers/${seller._id}`);
                                        }}
                                    />
                                </div>
                            ))
                        }




                    </div>

            }
        </>
    );
};

export default Tabla;
