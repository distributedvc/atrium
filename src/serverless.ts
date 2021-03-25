import type { VercelRequest, VercelResponse } from '@vercel/node';

import init from './app';

const app = init();

module.exports = async function serve(req: VercelRequest, res: VercelResponse): Promise<void> {
  await app.ready();
  app.server.emit('request', req, res);
};
