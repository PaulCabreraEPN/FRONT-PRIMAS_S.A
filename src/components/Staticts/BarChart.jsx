import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import Loader from '../Carga';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
    const [sales, setsales] = useState([]);
    const [names, setnames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    

    const getSellerTop = async () => {
        try {
            setIsLoading(true);
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem('token');
            const url = `${backendUrl}/statics/top-sellers`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(url, options);
            // El backend devuelve { status, code, msg, data: { sellerNames, salesCounts } }
            const data = response.data?.data || {};
            setsales(data.salesCounts || []);
            setnames(data.sellerNames || []);
        } catch (error) {
            console.log(error);
        }finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getSellerTop();
    }, []);

    // generar colores dinámicos según la cantidad de barras
    const palette = [
        'rgba(59, 130, 246, 0.8)', // blue-500
        'rgba(16, 185, 129, 0.8)', // green-500
        'rgba(139, 92, 246, 0.8)', // purple-500
        'rgba(245, 158, 11, 0.8)', // amber-500
        'rgba(239, 68, 68, 0.8)',  // red-500
    ];

    const backgroundColor = sales.map((_, i) => palette[i % palette.length]);
    const borderColor = backgroundColor.map(c => c.replace('0.8', '1'));

    const data = {
        labels: names,
        datasets: [
            {
                label: 'Pedidos generados',
                data: sales,
                backgroundColor,
                borderColor,
                borderWidth: 1.5,
            },
        ],
    };

    const options = {
        indexAxis: 'y', // horizontal bars
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Top 5 Vendedores',
            },
            legend: { display: false },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function(context) {
                        const v = context.parsed.x ?? context.parsed.y;
                        return `${v} pedidos`;
                    }
                }
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                ticks: {
                    autoSkip: false,
                },
            },
        },
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="w-full h-64 p-4">
            <div style={{ textAlign: 'center' }} className="mb-2 font-semibold">Top 5 Vendedores</div>
            <div className="w-full h-full">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
};

export default BarChart;

