import React from 'react';
import BarChart from './BarChart';  // Importar el gráfico de barras
import DoughnutChart from './DoughnutChart';
import LineChart from './LineChart';
 // Importar el gráfico de dona

const StatictsBarS = () => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Columna Izquierda (2 filas) */}
          <div className="flex flex-col gap-6">
            <div className="bg-white shadow-md rounded-lg p-0 flex justify-center items-center h-auto min-h-40">
              <BarChart className="w-full h-full" />
            </div>
            <div className="bg-white shadow-md rounded-lg p-0 flex justify-center items-center h-auto min-h-40">
              <LineChart className="w-full h-full" />
            </div>
          </div>
          
          {/* Columna Derecha (1 sola fila) */}
          <div className="bg-white shadow-md rounded-lg p-0 flex justify-center items-center h-auto min-h-80">
            <DoughnutChart className="w-full h-full" />
          </div>
        </div>
      );
};

export default StatictsBarS;

