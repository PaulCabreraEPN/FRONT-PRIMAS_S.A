import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock axios
vi.mock('axios', () => {
  const get = vi.fn();
  const patch = vi.fn();
  return {
    default: {
      get,
      patch,
    },
    __getMock: get,
    __patchMock: patch,
  };
});

// Mock react-router hooks (useParams + useNavigate)
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  const navigate = vi.fn();
  return {
    ...actual,
    useNavigate: () => navigate,
    useParams: () => ({ id: 'abc123' }),
    __navigateMock: navigate,
  };
});

import UpdateProduct from '../pages/UpdateProducts';
import * as axiosModule from 'axios';

describe('Página de actualización de producto', () => {
  const getMock = axiosModule.__getMock;

  beforeEach(() => {
    getMock.mockReset();
  });

  afterEach(() => vi.clearAllMocks());

  it('obtiene el producto y completa los campos del formulario', async () => {
    const productData = {
      product_name: 'Test Product',
      measure: 'u',
      price: '123.45',
      stock: '10',
      imgUrl: '',
      reference: 'REF-1',
      description: 'Este es un producto de prueba con suficiente longitud para la validación.'
    };

    getMock.mockResolvedValueOnce({ data: { data: productData } });

    render(<UpdateProduct />);

    // Esperar a que el get haya sido llamado
    await waitFor(() => expect(getMock).toHaveBeenCalled());

    // Verificar que los campos se llenaron con la data mockeada
    const nameInput = screen.getByPlaceholderText('Nombre del producto');
    const priceInput = screen.getByPlaceholderText('0.00');
    const stockInput = screen.getByPlaceholderText('0');
    const description = screen.getByPlaceholderText('Descripción del producto');

    await waitFor(() => {
      expect(nameInput).toHaveValue(productData.product_name);
      expect(priceInput).toHaveValue(String(productData.price));
      expect(stockInput).toHaveValue(String(productData.stock));
      expect(description).toHaveValue(productData.description);
    });
  });
});
