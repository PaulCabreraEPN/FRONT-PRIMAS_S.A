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
      const top = containerRef.current.getBoundingClientRect().top;
      const padding = 24; // espacio extra inferior
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

  return (
    <div ref={containerRef} style={style} className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-6 h-full">
        {/* BarChart (fila 1, col 1) */}
        <div className="md:row-start-1 md:row-end-2 bg-white shadow-md rounded-lg p-4 min-h-0 flex items-center justify-center">
          <div className="w-full h-full min-h-0 p-4">
            <BarChart />
          </div>
        </div>

        {/* LineChart (columna derecha, ocupa 2 filas) */}
        <div className="md:row-start-1 md:row-end-3 bg-white shadow-md rounded-lg p-4 min-h-0 flex items-center justify-center">
          <div className="w-full h-full min-h-0 p-4">
            <LineChart />
          </div>
        </div>

        {/* Doughnut (fila 2, col 1) */}
        <div className="md:row-start-2 md:row-end-3 bg-white shadow-md rounded-lg p-4 min-h-0 flex items-center justify-center">
          <div className="w-full h-full min-h-0 p-4">
            <DoughnutChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatictsBarS;

