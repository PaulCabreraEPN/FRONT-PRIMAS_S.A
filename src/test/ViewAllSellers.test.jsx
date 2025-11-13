import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

// Mock axios y exportar el mock para poder controlarlo
vi.mock('axios', () => {
  const get = vi.fn();
  return {
    default: {
      get,
    },
    __getMock: get,
  };
});

import Tabla from '../components/Tabla';
import * as axiosModule from 'axios';

describe('Tabla - listar todos los vendedores', () => {
  const getMock = axiosModule.__getMock;

  beforeEach(() => {
    getMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('llama al backend y muestra la lista de vendedores', async () => {
    const sellers = [
      {
        _id: '1',
        names: 'Juan',
        lastNames: 'Perez',
        cedula: '0102030405',
        SalesCity: 'Quito',
        username: 'juanp',
        image: '',
        status: true,
      },
      {
        _id: '2',
        names: 'Maria',
        lastNames: 'Lopez',
        cedula: '0203040506',
        SalesCity: 'Guayaquil',
        username: 'marial',
        image: '',
        status: false,
      },
    ];

    // Mock de la respuesta del endpoint /sellers
    getMock.mockResolvedValueOnce({ data: { data: sellers } });

    render(
      <MemoryRouter>
        <Tabla />
      </MemoryRouter>
    );

    // Esperar que el mock haya sido llamado y que los nombres aparezcan
    await waitFor(() => expect(getMock).toHaveBeenCalled());

    // Verificar que los nombres de los vendedores se muestran en la UI
    expect(screen.getByText(/Juan/)).toBeInTheDocument();
    expect(screen.getByText(/Maria/)).toBeInTheDocument();

    // También podemos comprobar que el estado (Activo/Inactivo) se muestra
    expect(screen.getByText(/Activo/)).toBeInTheDocument();
    expect(screen.getByText(/Inactivo/)).toBeInTheDocument();
  });
});
