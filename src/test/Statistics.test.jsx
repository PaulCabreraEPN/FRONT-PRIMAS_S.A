import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock de axios y de componentes pesados (Doughnut y TopSellers)
vi.mock('axios', () => ({ default: { get: vi.fn() } }));
vi.mock('react-chartjs-2', () => ({ Doughnut: () => <div data-testid="doughnut" /> }));
vi.mock('../components/Staticts/TopSellers', () => ({ default: () => <div data-testid="top-sellers" /> }));

import axios from 'axios';
import Main from '../pages/Main';
import { MemoryRouter } from 'react-router-dom';

describe('Main - Estadísticas (fetch inicial)', () => {
  const getMock = axios.get;

  beforeEach(() => {
    getMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('hace fetch inicial y renderiza los contadores y subcomponentes mockeados', async () => {
    getMock.mockResolvedValueOnce({ data: { data: { orders: 5, clients: 10, products: 20, sellers: 3 } } });

    render(
      <MemoryRouter>
        <Main />
      </MemoryRouter>
    );

    // Esperar a que los contadores aparezcan
    await waitFor(() => {
      expect(screen.getByText(/Total Pedidos/i)).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      // Verificar subcomponentes mockeados
      const doughnuts = screen.getAllByTestId('doughnut');
      expect(doughnuts.length).toBeGreaterThan(0);
      expect(screen.getByTestId('top-sellers')).toBeInTheDocument();
    });
  });
});
