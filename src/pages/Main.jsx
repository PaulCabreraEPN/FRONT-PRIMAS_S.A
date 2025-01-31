import { useEffect, useState } from "react";
import axios from "axios";
import StatictsBarS from "../components/Staticts/TopSellers";
import StatictsDouS from "../components/Staticts/BarChart";

const Main = () => {
    
    const [counts, setCounts] = useState({})

    const getAllCount = async() => {
        try {
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
        }
    }

    useEffect(()=>{
        getAllCount()
    },[])

    return (
        <>
        
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr", // Dos columnas iguales
                gap: "20px", // Espaciado entre elementos
            }}
        >
            <div className="card text-center p-3">
                <i className="fas fa-shopping-cart fa-2x mb-2"></i>
                <h5>Total Pedidos</h5>
                <p className="fs-4">{counts.orders}</p>
            </div>
            <div className="card text-center p-3">
                <i className="fas fa-users fa-2x mb-2"></i>
                <h5>Clientes Registrados</h5>
                <p className="fs-4">{counts.clients}</p>
            </div>
            <div className="card text-center p-3">
                <i className="fas fa-box fa-2x mb-2"></i>
                <h5>Productos Activos</h5>
                <p className="fs-4">{counts.products}</p>
            </div>
            <div className="card text-center p-3">
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