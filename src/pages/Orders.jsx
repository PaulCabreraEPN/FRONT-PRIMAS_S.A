import TablaOrders from "../components/TablaOrders";

const Orders = () => {
    return(
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Lista de Ordenes</h1>
            <hr className='my-4' />
            <h5 className="font-semibold text-lg text-gray-400">Este módulo permite al administrador visualizar las órdenes</h5>
            <hr className='my-4' />

            <TablaOrders/>
        </div>
    );
}

export default Orders;