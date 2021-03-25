import path from 'path';
import { applyMiddleware } from 'graphql-middleware';
import { declarativeWrappingPlugin, makeSchema } from 'nexus';
import { nexusSchemaPrisma } from 'nexus-plugin-prisma/schema';
import * as types from './graphql';
import * as middlewares from './middlewares';

export const schema = applyMiddleware(
  makeSchema({
    types,
    plugins: [
      nexusSchemaPrisma({
        experimentalCRUD: true,
        paginationStrategy: 'prisma',
      }),
      declarativeWrappingPlugin({ disable: true }),
    ],
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
