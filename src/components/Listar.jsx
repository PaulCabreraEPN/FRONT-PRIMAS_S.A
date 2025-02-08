import { useEffect, useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import axios from 'axios';
import Mensaje from "./Alertas/Mensaje";

const Listar = () => {

    const [vendedores, setVendedores] = useState([])

    const listarVendedores = async () => {
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
            setVendedores(respuesta.data)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        listarVendedores()
    }, [])

    return (
        <>
            {
                vendedores.length === 0
                    ? <Mensaje tipo={'active'}>{'No existen registros'}</Mensaje>
                    :
                    <div className="overflow-x-auto mt-5">
                        <table className='min-w-full table-auto shadow-lg bg-white text-sm'>
                            <thead className='bg-gray-800 text-slate-400 text-xs'>
                                <tr>
                                    <th className='p-2'>N°</th>
                                    <th className='p-2'>Nombres</th>
                                    <th className='p-2'>Apellidos</th>
                                    <th className='p-2 hidden sm:table-cell'>ID</th>
                                    <th className='p-2 hidden md:table-cell'>Email</th>
                                    <th className='p-2 hidden lg:table-cell'>Usuario</th>
                                    <th className='p-2 hidden lg:table-cell'>Teléfono</th>
                                    <th className='p-2 hidden lg:table-cell'>Ciudad de Ventas</th>
                                    <th className='p-2'>Estado</th>
                                    <th className='p-2 hidden md:table-cell'>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    vendedores.map((vendedor, index) => (
                                        <tr className="border-b hover:bg-gray-300 text-center" key={vendedor._id}>
                                            <td className="p-2">{index + 1}</td>
                                            <td className="p-2">{vendedor.names}</td>
                                            <td className="p-2">{vendedor.lastNames}</td>
                                            <td className="p-2 hidden sm:table-cell">{vendedor.numberID}</td>
                                            <td className="p-2 hidden md:table-cell">{vendedor.email}</td>
                                            <td className="p-2 hidden lg:table-cell">{vendedor.username}</td>
                                            <td className="p-2 hidden lg:table-cell">{vendedor.PhoneNumber}</td>
                                            <td className="p-2 hidden lg:table-cell">{vendedor.SalesCity}</td>
                                            <td className="p-2">
                                                <span className={`bg-blue-100 text-${vendedor.status ? 'green' : 'red'}-500 text-xs font-medium mr-2 px-2.5 py-0.5 rounded`}>
                                                    {vendedor.status ? "Activo" : "Inactivo"}
                                                </span>
                                            </td>
                                            <td className="py-2 text-center hidden md:table-cell">
                                                <MdDeleteForever className="h-5 w-5 text-red-900 cursor-pointer inline-block" />
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
            }
        </>
    );
    
    
    
}

export default Listar;
