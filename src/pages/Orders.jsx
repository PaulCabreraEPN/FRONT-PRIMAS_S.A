import TablaOrders from "../components/TablaOrders";

const Orders = () => {
    return(
        <div>
            <h1 className='font-black text-4xl text-gray-500'>Lista de Pedidos</h1>
            <hr className='my-4' />
            <TablaOrders/>
        </div>
    );
}

export default Orders;