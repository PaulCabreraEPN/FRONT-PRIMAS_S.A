// DoughnutChart.js
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
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
            const data = response.data;
            setnames(data.names);
            setsales(data.totalSales);
            
            
        } catch (error) {
            console.log(error);
        }finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getSellerTop();
    }, []);

    const doughnutData = {
        labels: names,
        datasets: [
            {
                label: 'Pedidos generados $',
                data: sales,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 205, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 71, 0.6)',
                    'rgba(255, 165, 0, 0.6)',
                    'rgba(0, 255, 255, 0.6)',
                    'rgba(128, 0, 128, 0.6)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 99, 71)',
                    'rgb(255, 165, 0)',
                    'rgb(0, 255, 255)',
                    'rgb(128, 0, 128)',
                ],
                borderWidth: 1.5,
            },
        ],
    };

    const doughnutOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Ventas generadas',
            },
            tooltip: {
                enabled: true,
            },
        },
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="w-full h-full p-10">
            <h1 style={{ textAlign: 'center' }}>Ingresos por Vendedor</h1>
            <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
    );
};

export default DoughnutChart;
