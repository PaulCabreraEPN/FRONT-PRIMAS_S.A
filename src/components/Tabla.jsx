import { useEffect, useState } from "react";
import { MdNoteAdd } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Mensaje from "./Alertas/Mensaje";

const Tabla = () => {
    const navigate = useNavigate()
    const [sellers, setSellers] = useState([])

    const listarSellers = async () => {
        try {
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem('token')
            const url = `${backendUrl}/sellers`
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const respuesta = await axios.get(url, options)

           
            

            setSellers(respuesta.data, ...sellers)
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        listarSellers()
    }, [])


    return (
        <>
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
                            sellers.map((seller, index) => (
                                
                                <div
                                    className="w-full p-4 flex items-center shadow-lg bg-white relative cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200"
                                    key={seller._id}
                                    onClick={() => navigate(`/dashboard/sellers/${seller.numberID}`)} // Opcional: hacer clic en todo el div
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
                                        <h1 className="text-lg">Nombre: {seller.name}</h1>
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
                                            navigate(`/dashboard/sellers/${seller.numberID}`);
                                        }}
                                    />
                                </div>
                            ))
                        }



                        
                    </div>
                    
            }
        </>

    )
}

export default Tabla