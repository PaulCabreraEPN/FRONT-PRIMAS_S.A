import { useEffect, useState } from "react";
import axios from "axios";
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import StatictsBarS from "../components/Staticts/TopSellers";
import Loader from "../components/Carga";

ChartJS.register(ArcElement, Tooltip, Legend);


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
            // El backend devuelve { status, code, msg, data: { products, orders, sellers, clients } }
            const data = response.data?.data || {};
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

    const total = (counts.products ?? 0) + (counts.orders ?? 0) + (counts.sellers ?? 0) + (counts.clients ?? 0);

    // Helper to build small doughnut data per category (value vs rest)
    const doughnutData = (value, color) => ({
        labels: ['Value', 'Rest'],
        datasets: [
            {
                data: [value, Math.max(0, total - value)],
                backgroundColor: [color, '#E5E7EB'],
                borderWidth: 0,
            },
        ],
    });

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        cutout: '70%'
    };

    return (
        <>
                <div id="main-header">
                    <h1 className='font-black text-4xl text-gray-500'>Estadísticas Generales</h1>
                    <hr className='my-4' />
                </div>
                <div id="top-cards" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Card: Orders */}
            <div className="flex items-center p-4 bg-white shadow-md rounded-lg">
                <div className="flex-shrink-0 mr-4 text-blue-600">
                    <i className="fas fa-shopping-cart fa-2x"></i>
                </div>
                <div className="flex-1">
                    <h6 className="text-sm text-gray-500">Total Pedidos</h6>
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-semibold text-gray-800">{counts.orders ?? 0}</div>
                        <div className="w-16 h-16">
                            <Doughnut data={doughnutData(counts.orders ?? 0, '#2563EB')} options={doughnutOptions} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Card: Clients */}
            <div className="flex items-center p-4 bg-white shadow-md rounded-lg">
                <div className="flex-shrink-0 mr-4 text-green-600">
                    <i className="fas fa-users fa-2x"></i>
                </div>
                <div className="flex-1">
                    <h6 className="text-sm text-gray-500">Clientes Registrados</h6>
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-semibold text-gray-800">{counts.clients ?? 0}</div>
                        <div className="w-16 h-16">
                            <Doughnut data={doughnutData(counts.clients ?? 0, '#16A34A')} options={doughnutOptions} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Card: Products */}
            <div className="flex items-center p-4 bg-white shadow-md rounded-lg">
                <div className="flex-shrink-0 mr-4 text-purple-600">
                    <i className="fas fa-box fa-2x"></i>
                </div>
                <div className="flex-1">
                    <h6 className="text-sm text-gray-500">Productos Activos</h6>
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-semibold text-gray-800">{counts.products ?? 0}</div>
                        <div className="w-16 h-16">
                            <Doughnut data={doughnutData(counts.products ?? 0, '#8B5CF6')} options={doughnutOptions} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Card: Sellers */}
            <div className="flex items-center p-4 bg-white shadow-md rounded-lg">
                <div className="flex-shrink-0 mr-4 text-yellow-600">
                    <i className="fas fa-user-cog fa-2x"></i>
                </div>
                <div className="flex-1">
                    <h6 className="text-sm text-gray-500">Vendedores Activos</h6>
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-semibold text-gray-800">{counts.sellers ?? 0}</div>
                        <div className="w-16 h-16">
                            <Doughnut data={doughnutData(counts.sellers ?? 0, '#F59E0B')} options={doughnutOptions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <StatictsBarS/>
        </div>

        </>
    );
    
}

export default Main