import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClientList from '../components/TablaClients';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');

describe('DeletedClient - TablaClients', () => {
  afterEach(() => {
    vi.resetAllMocks();
    try { vi.useRealTimers(); } catch (e) { /* ignore */ }
  });

  it('elimina un cliente tras confirmar y refresca la lista', async () => {
    // Datos iniciales (lista) y detalle
    const clientsList = [
      {
        Ruc: '0123456789012',
        Name: 'Client A',
        Address: 'Address A',
        telephone: '123456',
        email: 'a@example.com',
        state: 'active'
      }
    ];

    const clientDetail = {
      Ruc: '0123456789012',
      Name: 'Client A',
      Address: 'Address A',
      telephone: '123456',
      email: 'a@example.com',
      state: 'active',
      _id: 'abc123'
    };

    // Mock de axios.get para distintos endpoints
    axios.get.mockImplementation((url) => {
      if (String(url).endsWith('/clients')) {
        return Promise.resolve({ data: { data: clientsList } });
      }
      if (String(url).includes('/clients/')) {
        return Promise.resolve({ data: { status: 'success', data: clientDetail } });
      }
      return Promise.resolve({ data: {} });
    });

    axios.delete.mockResolvedValue({ data: { msg: 'Cliente eliminado' } });

    // Confirm dialog: aceptar
    window.confirm = vi.fn(() => true);

    // Render component inside router
    render(
      <MemoryRouter>
        <ClientList />
      </MemoryRouter>
    );

    // Esperar que se renderice la tarjeta del cliente
    const card = await screen.findByText('Client A');
    expect(card).toBeInTheDocument();

    // Abrir modal clickeando la tarjeta
    fireEvent.click(card);

    // Esperar a que aparezca el modal con el título
    const modalTitle = await screen.findByText('Detalle del Cliente');
    expect(modalTitle).toBeInTheDocument();

    // Click en el botón Eliminar del modal
    const deleteBtn = screen.getByText('Eliminar');
    fireEvent.click(deleteBtn);

    // axios.delete debe haber sido llamado con el id del cliente
    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
    const deleteCallArg = axios.delete.mock.calls[0][0];
    expect(String(deleteCallArg)).toContain('/clients/delete/abc123');

  // Después de la eliminación, esperar que se haya re-invocado axios.get para refrescar la lista
  await waitFor(() => expect(axios.get.mock.calls.length).toBeGreaterThanOrEqual(3));
  });
});
