import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock de axios
vi.mock('axios', () => ({
  default: { post: vi.fn() }
}));

import Forgot from '../pages/Forgot';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

describe('Página Forgot', () => {
  const postMock = axios.post;

  beforeEach(() => {
    postMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('muestra mensaje de validación cuando el usuario está vacío', async () => {
    render(
      <MemoryRouter>
        <Forgot />
      </MemoryRouter>
    );

    const button = screen.getByRole('button', { name: /Enviar email/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Por favor, ingresa tu nombre de usuario\./i)).toBeInTheDocument();
    });
  });

  it('envía request cuando username válido y muestra mensaje de éxito y limpia el input', async () => {
    postMock.mockResolvedValueOnce({ data: { msg: 'Email enviado' } });

    render(
      <MemoryRouter>
        <Forgot />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Ingresa tu nombre de usuario/i);
    fireEvent.change(input, { target: { value: 'user1' } });

    const button = screen.getByRole('button', { name: /Enviar email/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(postMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText(/Email enviado/i)).toBeInTheDocument();
      expect(input.value).toBe('');
    });
  });
});
