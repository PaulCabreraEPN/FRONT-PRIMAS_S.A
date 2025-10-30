// DoughnutChart.js
import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import Loader from '../Carga';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
    const [sales, setsales] = useState([]);
    const [names, setnames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getSellerTop = async () => {
        try {
            setIsLoading(true);
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem('token');
            const url = `${backendUrl}/statics/sales-by-seller`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(url, options);
            // El backend devuelve { status, code, msg, data: { names, totalSales } }
            const data = response.data?.data || {};
            setnames(data.names || []);
            setsales(data.totalSales || []);
            
            
        } catch (error) {
            console.log(error);
        }finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getSellerTop();
    }, []);

    // generar paleta dinámica según la cantidad de vendedores
    const palette = [
        'rgba(59, 130, 246, 0.8)', // blue-500
        'rgba(16, 185, 129, 0.8)', // green-500
        'rgba(139, 92, 246, 0.8)', // purple-500
        'rgba(245, 158, 11, 0.8)', // amber-500
        'rgba(239, 68, 68, 0.8)',  // red-500
        'rgba(20, 184, 166, 0.8)', // teal-500
        'rgba(99, 102, 241, 0.8)', // indigo-500
    ];

    const backgroundColor = sales.map((_, i) => palette[i % palette.length]);
    const borderColor = backgroundColor.map(c => c.replace('0.8', '1'));

    const pieData = {
        labels: names,
        datasets: [
            {
                label: 'Ventas totales',
                data: sales,
                backgroundColor,
                borderColor,
                borderWidth: 1,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Ventas por Vendedor',
            },
            tooltip: { enabled: true },
            legend: { position: 'right' },
        },
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="w-full h-64 p-6">
            <div style={{ textAlign: 'center' }} className="mb-2 font-semibold">Ventas por Vendedor</div>
            <div className="w-full h-full">
                <Pie data={pieData} options={pieOptions} />
            </div>
        </div>
    );
};

export default DoughnutChart;
