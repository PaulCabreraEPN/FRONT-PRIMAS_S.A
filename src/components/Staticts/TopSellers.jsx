// StatictsBarS.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BarChart from './BarChart';  // Importar el gráfico de barras
import DoughnutChart from './DoughnutChart';
 // Importar el gráfico de dona

const StatictsBarS = () => {

    return (
        <div
            style={{
                fontFamily: 'Verdana, Geneva, Tahoma, sans-serif',
                height: '100vh',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)', // Dos columnas en pantallas grandes
                gap: '2rem', // Espacio entre los componentes
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem', // Espaciado adicional alrededor
            }}
        >
            <div style={{ width: '100%', height: '100%' }}>
                <BarChart />
            </div>
            <div style={{ width: '100%', height: '100%' }}>
                <DoughnutChart/>
            </div>
        </div>
    );
};

export default StatictsBarS;

