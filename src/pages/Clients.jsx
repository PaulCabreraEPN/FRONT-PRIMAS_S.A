import React from 'react'
import ClientList from '../components/TablaClients'




const Clients = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Lista de Clientes</h1>

            <hr className='my-4' />
            <h5 className="font-semibold text-lg text-gray-400">Este módulo permite al administrador gestionar clientes</h5>
            
            <ClientList/>
        </div>
    )
}

export default Clients