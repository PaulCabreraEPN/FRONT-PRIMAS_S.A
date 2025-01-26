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
                    <table className='w-full mt-5 table-auto shadow-lg bg-white text-sm'>
                        <thead className='bg-gray-800 text-slate-400 text-xs'>
                            <tr>
                                <th className='p-2'>N°</th>
                                <th className='p-2'>Nombres</th>
                                <th className='p-2'>Apellidos</th>
                                <th className='p-2'>ID</th>
                                <th className='p-2'>Email</th>
                                <th className='p-2'>Usuario</th>
                                <th className='p-2'>Teléfono</th>
                                <th className='p-2'>Ciudad de Ventas</th>
                                <th className='p-2'>Estado</th>
                                <th className='p-2'>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                vendedores.map((vendedor, index) => (
                                    <tr className="border-b hover:bg-gray-300 text-center" key={vendedor._id}>
                                        <td>{index + 1}</td>
                                        <td>{vendedor.names}</td>
                                        <td>{vendedor.lastNames}</td>
                                        <td>{vendedor.numberID}</td>
                                        <td>{vendedor.email}</td>
                                        <td>{vendedor.username}</td>
                                        <td>{vendedor.PhoneNumber}</td>
                                        <td>{vendedor.SalesCity}</td>
                                        <td>
                                            <span className={`bg-blue-100 text-${vendedor.status ? 'green' : 'red'}-500 text-xs font-medium mr-2 px-2.5 py-0.5 rounded`}>{vendedor.status ? "Activo" : "Inactivo"}</span>
                                        </td>
                                        <td className='py-2 text-center'>
                                            <MdDeleteForever className="h-5 w-5 text-red-900 cursor-pointer inline-block" />
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
            }
        </>
    )
}

export default Listar;
