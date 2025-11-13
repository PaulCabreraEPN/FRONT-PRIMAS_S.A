// MSW server para tests
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// handlers por defecto (vacío) — añade handlers en tests específicos
export const server = setupServer(
  // ejemplo: rest.get('/api/health', (req, res, ctx) => res(ctx.json({ ok: true })))
);

export { rest };
