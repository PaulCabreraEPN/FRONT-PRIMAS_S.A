import React from 'react'
import { useNavigate } from 'react-router-dom'
import Tabla from '../components/Tabla'
import Listar from '../components/Listar'


const Sellers = () => {
    const navigate = useNavigate()
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Lista de Vendedores</h1>

            <hr className='my-4' />
            
            <h5 className="font-semibold text-lg text-gray-400">Este módulo permite al administrador visualizar los vendedores</h5>
            <hr className='my-4' />

            <Tabla/>
        </div>
    )
}

export default Sellers