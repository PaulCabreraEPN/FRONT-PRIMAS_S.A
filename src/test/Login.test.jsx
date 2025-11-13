import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock de AuthProvider: exporta un named mock para poder acceder desde el test
vi.mock('../context/AuthProvider', () => {
  const setAuth = vi.fn();
  return {
    useAuth: () => ({ setAuth }),
    __setAuthMock: setAuth
  };
});

// Mock de react-router-dom: mantenemos el resto del módulo real y añadimos un navigate mock exportado
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  const navigate = vi.fn();
  return {
    ...actual,
    useNavigate: () => navigate,
    __navigateMock: navigate
  };
});

// Mock del servicio api: exporta el mock de post para controlarlo en tests
vi.mock('../services/api', () => {
  const post = vi.fn();
  return {
    default: {
      post
    },
    __postMock: post
  };
});

import Login from '../pages/Login';
import { MemoryRouter } from 'react-router-dom';
import * as apiModule from '../services/api';
import * as AuthModule from '../context/AuthProvider';
import * as RouterModule from 'react-router-dom';

describe('Login page', () => {
  const postMock = apiModule.__postMock;
  const setAuthMock = AuthModule.__setAuthMock;
  const navigateMock = RouterModule.__navigateMock;

  beforeEach(() => {
    postMock.mockReset();
    setAuthMock.mockReset();
    navigateMock.mockReset();
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('submits credentials and navigates on success', async () => {
    // Preparar el mock del API para devolver token
    postMock.mockResolvedValueOnce({ data: { data: { token: 'fake-token' } } });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const username = screen.getByPlaceholderText('Ingresa tu nombre de usuario');
    const password = screen.getByPlaceholderText('**********');
    const button = screen.getByRole('button', { name: /Iniciar Sesión/i });

    // Simular entrada del usuario
    fireEvent.change(username, { target: { value: ' user1 ' } }); // con espacios para probar trim
    fireEvent.change(password, { target: { value: ' password123 ' } });

    fireEvent.click(button);

    // Esperar a que llame al API y a que navegue
    await waitFor(() => {
      expect(postMock).toHaveBeenCalledWith('/login-admin', {
        username: 'user1',
        password: 'password123'
      });
    });

    await waitFor(() => {
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(setAuthMock).toHaveBeenCalledWith({ token: 'fake-token' });
      expect(navigateMock).toHaveBeenCalledWith('/dashboard');
    });
  });
});
