import compression from 'fastify-compress';
import mercurius from 'mercurius';
import fastify from 'fastify';
import cookie from 'fastify-cookie';
import helmet from 'fastify-helmet';
import pino from 'pino';
import rateLimit from 'fastify-rate-limit';
import type { IncomingMessage, Server, ServerResponse } from 'http';
import type { FastifyInstance, FastifyRequest, FastifyReply, FastifyLoggerInstance } from 'fastify';
import type { Context } from './context';
import { createContext } from './context';
import { routes } from './routes';
import { schema } from './schema';

export default function init(): FastifyInstance {
  const app: FastifyInstance<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance> =
    fastify({
      trustProxy: true,
      logger: pino({
        level: process.env.NODE_ENV === 'staging' || !process.env.NODE_ENV ? 'debug' : 'info',
      }),
    });

  const isProduction = process.env.NODE_ENV === 'production';

  app.register(helmet, {
    ...(!isProduction && {
      contentSecurityPolicy: false,
    }),
  });

  app.register(cookie);
  app.register(compression, { inflateIfDeflated: true, encodings: ['gzip', 'deflate'] });

  app.register(rateLimit, {
    max: 200,
    timeWindow: 60 * 1000,
  });

  app.register(mercurius, {
    schema,
    queryDepth: 4,
    path: '/',
    ide: !isProduction,
    graphiql: !isProduction && 'playground',
    allowBatchedQueries: true,
    context: async (request: FastifyRequest, reply: FastifyReply): Promise<Context> => {
      return {
        ...createContext({ request, reply }),
      };
    },
  });

  app.register(routes);

  return app;
}

if (require.main === module) {
  (async () => {
    const app = init();
    await app.ready();
    app.listen(4000, (err) => {
      if (err) {
        app.log.error('Could not start the server');
        throw err;
      }
    });
  })();
}
