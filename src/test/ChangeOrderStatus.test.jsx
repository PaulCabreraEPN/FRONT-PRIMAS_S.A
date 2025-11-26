import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock de axios (get para carga inicial y patch para cambio de estado)
vi.mock('axios', () => ({ default: { get: vi.fn(), patch: vi.fn() } }));
import axios from 'axios';

import TablaOrders from '../components/TablaOrders';
import { MemoryRouter } from 'react-router-dom';

describe('TablaOrders - Cambio de estado', () => {
  const getMock = axios.get;
  const patchMock = axios.patch;

  beforeEach(() => {
    getMock.mockReset();
    patchMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('llama a PATCH y actualiza el select cuando se cambia el estado de una orden', async () => {
    const order = {
      _id: '0123456789abcdef01234567',
      customer: { Name: 'Cliente X' },
      totalWithTax: 123.45,
      seller: { names: 'Juan', lastNames: 'Perez' },
      products: [ { productId: 'p1', quantity: 1, productDetails: { product_name: 'Prod', price: 10 } } ],
      status: 'Pendiente'
    };

    // Mock respuesta inicial del GET /orders
    getMock.mockResolvedValueOnce({ data: { data: [order] } });
    // Mock respuesta del PATCH
    patchMock.mockResolvedValueOnce({ data: { msg: 'Estado actualizado' } });

    render(
      <MemoryRouter>
        <TablaOrders />
      </MemoryRouter>
    );

    // Esperar a que la orden se muestre
    await waitFor(() => {
      expect(screen.getByText(/Cliente: Cliente X/i)).toBeInTheDocument();
    });

    // Localizar el primer select (combobox) y verificar valor inicial
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBeGreaterThan(0);
    const select = selects[0];
    expect(select.value).toBe('Pendiente');

    // Cambiar el estado a 'Enviado'
    fireEvent.change(select, { target: { value: 'Enviado' } });

    // Esperar a que el PATCH sea llamado con la URL correcta y payload
    await waitFor(() => {
      expect(patchMock).toHaveBeenCalledWith(
        expect.stringContaining('/orders/update/state/0123456789abcdef01234567'),
        { status: 'Enviado' },
        expect.any(Object)
      );
    });

    // Finalmente, el select debe reflejar el nuevo estado
    await waitFor(() => {
      expect(select.value).toBe('Enviado');
    });
  });
});
