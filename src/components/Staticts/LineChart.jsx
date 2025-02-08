import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChart = () => {
    const [sales, setsales] = useState([]);
    const [days, setdays] = useState([]);

    const getWeeklySales = async () => {
        try {
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
            const data = response.data;
            console.log(data);
            
            setsales(data.salesByDay);
            setdays(data.weekDays);
        } catch (error) {
            console.log(error);
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
                fill: false,  // Esto elimina el relleno bajo la línea
                backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Color para los puntos
                borderColor: 'rgba(75, 192, 192, 1)',  // Color de la línea
                borderWidth: 2,
                tension: 0.4,  // Controla la curvatura de la línea
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Total de ventas',
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="w-full h-full p-10">
            <h1 style={{ textAlign: 'center' }}>Ventas Semana</h1>
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;
