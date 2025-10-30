import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import Loader from '../Carga';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
    const [sales, setsales] = useState([]);
    const [days, setdays] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getWeeklySales = async () => {
        try {
            setIsLoading(true);
            const backendUrl = import.meta.env.VITE_URL_BACKEND_API;
            const token = localStorage.getItem('token');
            const url = `${backendUrl}/statics/orders-by-week`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.get(url, options);
            // El backend devuelve { status, code, msg, data: { weekDays, salesByDay } }
            const data = response.data?.data || {};

            setsales(data.salesByDay || []);
            setdays(data.weekDays || []);
        } catch (error) {
            console.log(error);
        }finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getWeeklySales();
    }, []);

    const data = {
        labels: days,
        datasets: [
            {
                label: 'Pedidos generados',
                data: sales,
                fill: false, // sin relleno
                backgroundColor: 'rgba(14,165,233,0.12)',
                borderColor: 'rgba(14,165,233,1)',
                borderWidth: 3,
                tension: 0.4, // curva suave
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: 'rgba(14,165,233,1)',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: false,
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            },
            legend: { display: false },
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    drawBorder: false,
                    color: 'rgba(0,0,0,0.06)',
                    borderDash: [6, 6],
                },
                ticks: {
                    color: '#374151',
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: true,
                    drawBorder: false,
                    color: 'rgba(0,0,0,0.06)',
                    borderDash: [6, 6],
                },
                ticks: {
                    color: '#374151',
                },
            },
        },
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="w-full h-64 p-4">
            <div style={{ textAlign: 'center' }} className="mb-2 font-semibold">Ventas Semana</div>
            <div className="w-full h-full">
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

export default LineChart;
