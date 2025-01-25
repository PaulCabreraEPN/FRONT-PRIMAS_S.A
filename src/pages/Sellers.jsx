import React from 'react'
import Tabla from '../components/Tabla'

const Sellers = () => {

    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Lista de Vendedores</h1>
            <hr className='my-4' />
            <p className='mb-8'>En este módulo encontrarás todos los vendedores</p>
            <Tabla/>
        </div>
    )
}

export default Sellers