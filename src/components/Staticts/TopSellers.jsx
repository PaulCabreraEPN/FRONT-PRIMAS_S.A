import React, { useEffect, useRef, useState } from 'react';
import BarChart from './BarChart';
import DoughnutChart from './DoughnutChart';
import LineChart from './LineChart';

// Componente que ajusta su altura al espacio disponible en pantalla.
const StatictsBarS = () => {
  const containerRef = useRef(null);
  const [availableHeight, setAvailableHeight] = useState(null);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const isMobile = window.innerWidth < 640; // sm breakpoint
      if (isMobile) {
        // En móvil dejamos altura automática para que los componentes se apilen naturalmente
        setAvailableHeight(null);
        return;
      }
      const top = containerRef.current.getBoundingClientRect().top;
      const padding = 8; // reducir padding usado para cálculo y dar más espacio al gráfico
      const avail = Math.max(320, window.innerHeight - top - padding);
      setAvailableHeight(avail);
    };

    update();

    // Recalcular al cambiar tamaño de ventana
    window.addEventListener('resize', update);

    // Usar ResizeObserver para detectar cambios en el header / top-cards
    const headerEl = document.getElementById('main-header');
    const topCardsEl = document.getElementById('top-cards');
    const ResizeObs = window.ResizeObserver || null;
    let ro = null;
    if (ResizeObs) {
      ro = new ResizeObs(() => update());
      try {
        if (headerEl) ro.observe(headerEl);
        if (topCardsEl) ro.observe(topCardsEl);
      } catch (e) {
        // ignore
      }
    }

    return () => {
      window.removeEventListener('resize', update);
      try { if (ro) ro.disconnect(); } catch (e) {}
    };
  }, []);

  const style = availableHeight ? { height: `${availableHeight}px`, overflow: 'hidden' } : { overflow: 'hidden' };

  // Si estamos en móvil (availableHeight === null) usamos una cuadrícula apilada para evitar recortes
  const gridClass = availableHeight === null ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 h-full';

  return (
    <div ref={containerRef} style={style} className="p-4">
      <div className={gridClass}>
        {/* BarChart (fila 1, col 1) */}
        <div className="md:row-start-1 md:row-end-2 bg-white shadow-md rounded-lg p-3 min-h-0 flex items-center justify-center flex-col">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 text-center">Top 5 Vendedores</h3>
          <div className="w-full h-full min-h-0 p-2">
            <BarChart />
          </div>
        </div>

        {/* LineChart (columna derecha, ocupa 2 filas) */}
        <div className="md:row-start-1 md:row-end-3 bg-white shadow-md rounded-lg p-3 min-h-0 flex items-center justify-center flex-col">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 text-center">Ventas por Semana</h3>
          <div className="w-full h-full min-h-0 p-2">
            <LineChart />
          </div>
        </div>

        {/* Doughnut (fila 2, col 1) */}
        <div className="md:row-start-2 md:row-end-3 bg-white shadow-md rounded-lg p-3 min-h-0 flex items-center justify-center flex-col">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 text-center">Ventas por Vendedor</h3>
          <div className="w-full h-full min-h-0 p-2">
            <DoughnutChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatictsBarS;

