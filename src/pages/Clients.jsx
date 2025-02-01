import React from 'react'
import ClientList from '../components/TablaClients'




const Clients = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Lista de Clientes</h1>

            <hr className='my-4' />
            
            <ClientList/>
        </div>
    )
}

export default Clients