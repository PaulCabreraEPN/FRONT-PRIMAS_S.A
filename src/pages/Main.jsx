import { useEffect, useState } from "react";
import axios from "axios";
import StatictsBarS from "../components/Staticts/TopSellers";
import Loader from "../components/Carga";


const Main = () => {
    
    const [counts, setCounts] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    

    const getAllCount = async() => {
        try {
            setIsLoading(true);
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem("token");
            const url = `${backendUrl}/statics/count`;
            const options = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(url, options);
            const data = response.data;
            setCounts(data);
            
        } catch (error) {
            console.log(error);
        }finally {
            setIsLoading(false);
        }
    }

    useEffect(()=>{
        getAllCount()
    },[])

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
        <h1 className='font-black text-4xl text-gray-500'>Estadísticas Generales</h1>
        <hr className='my-4' />
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr", // Dos columnas iguales
                gap: "20px", // Espaciado entre elementos
            }}
        >
            
            <div className="card text-center p-5 bg-white shadow-md rounded-lg">
                <i className="fas fa-shopping-cart fa-2x mb-2 "></i>
                <h5>Total Pedidos</h5>
                <p className="fs-4">{counts.orders}</p>
            </div>
            <div className="card text-center p-5 bg-white shadow-md rounded-lg">
                <i className="fas fa-users fa-2x mb-2"></i>
                <h5>Clientes Registrados</h5>
                <p className="fs-4">{counts.clients}</p>
            </div>
            <div className="card text-center p-5 bg-white shadow-md rounded-lg">
                <i className="fas fa-box fa-2x mb-2"></i>
                <h5>Productos Activos</h5>
                <p className="fs-4">{counts.products}</p>
            </div>
            <div className="card text-center p-5 bg-white shadow-md rounded-lg">
                <i className="fas fa-user-cog fa-2x mb-2"></i>
                <h5>Vendedores Activos</h5>
                <p className="fs-4">{counts.sellers}</p>
            </div>
        </div>
        <div>
            <StatictsBarS/>
        </div>

        </>
    );
    
}

export default Main