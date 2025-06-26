import React from 'react'
import TablaProducts from '../components/TablaProducts'




const Products = () => {
    return (
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Lista de Productos</h1>

            <hr className='my-4' />
            
            <TablaProducts/>
        </div>
    )
}

export default Products