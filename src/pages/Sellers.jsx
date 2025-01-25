import React from 'react'
import { useNavigate } from 'react-router-dom'
import Tabla from '../components/Tabla'

const Sellers = () => {
    const navigate = useNavigate()
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className='font-black text-4xl text-gray-500'>Lista de Vendedores</h1>
                <button 
                    onClick={() => navigate('register')}
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <i className="fas fa-user-plus mr-2"></i>
                    Registrar Vendedor
                </button>
            </div>
            <hr className='my-4' />
            <p className='mb-8'>En este módulo encontrarás todos los vendedores</p>
            <Tabla/>
        </div>
    )
}

export default Sellers