// Setup file para Vitest + Testing Library + MSW
import '@testing-library/jest-dom';
// start the MSW server defined in server.js (node environment)
import { server } from './server';

// Levanta el server antes de todos los tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
