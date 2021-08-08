import path from 'path';
import { applyMiddleware } from 'graphql-middleware';
import { declarativeWrappingPlugin, makeSchema } from 'nexus';
import * as types from './graphql';
import * as middlewares from './middlewares';

export const schema = applyMiddleware(
  makeSchema({
    types,
    plugins: [declarativeWrappingPlugin({ disable: true })],
    outputs: {
      schema: path.join(__dirname, '/generated/schema.graphql'),
      typegen: path.join(__dirname, '/generated/nexus.ts'),
    },
    contextType: {
      module: require.resolve('./context'),
      export: 'Context',
    },
    sourceTypes: {
      modules: [
        {
          module: require.resolve('.prisma/client/index.d.ts'),
          alias: 'prisma',
        },
      ],
    },
  }),

  middlewares.loggerMiddleware
);
