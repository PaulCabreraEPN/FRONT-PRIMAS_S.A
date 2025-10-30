import React from 'react';
import BarChart from './BarChart';  // Importar el gráfico de barras
import DoughnutChart from './DoughnutChart';
import LineChart from './LineChart';
 // Importar el gráfico de dona

const StatictsBarS = () => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Tarjeta 1: BarChart */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
            <div className="flex-1 flex justify-center items-center">
              <BarChart className="w-full h-full" />
            </div>
          </div>

          {/* Tarjeta 2: LineChart */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
            <div className="flex-1 flex justify-center items-center">
              <LineChart className="w-full h-full" />
            </div>
          </div>

          {/* Tarjeta 3: DoughnutChart */}
          <div className="bg-white shadow-md rounded-lg p-6 flex flex-col justify-between">
            <div className="flex-1 flex justify-center items-center">
              <DoughnutChart className="w-full h-full" />
            </div>
          </div>
        </div>
      );
};

export default StatictsBarS;

