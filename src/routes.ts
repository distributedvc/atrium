import type { FastifyInstance } from 'fastify';
import httpErrors from 'http-errors';
import { createContext } from './context';
import { getOrCreateAnonymousId } from './utils';

export async function routes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/:name', async (request, reply) => {
    const { analytics, prisma } = createContext({ request, reply });
    const { name } = request.params as { [key: string]: string };

    if (!name) {
      return reply.send(new httpErrors.BadRequest());
    }

    const [link] = await Promise.all([
      prisma.link.findUnique({ where: { name } }),
      analytics.page({
        name,
        anonymousId: getOrCreateAnonymousId({ request }),
      }),
    ]);

    if (!link) {
      return reply.send(new httpErrors.NotFound());
    }

    return reply.redirect(301, link.url);
  });
}
