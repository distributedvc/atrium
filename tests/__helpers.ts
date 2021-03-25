import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { nanoid } from 'nanoid';
import { join } from 'path';
import { Client } from 'pg';
import { createMercuriusTestClient } from 'mercurius-integration-testing';
import init from '../src/app';
import { TestContext } from './types.d';

function graphqlTestContext() {
  let serverInstance: FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse,
    FastifyLoggerInstance
  > | null = null;
  return {
    async before() {
      // const port = await getPort({ port: makeRange(5000, 6000) });
      serverInstance = init();
      const app = init();

      return createMercuriusTestClient(app, {
        url: '/',
      });
    },
    async after() {
      await serverInstance?.close();
    },
  };
}

function prismaTestContext() {
  const prismaBinary = join(__dirname, '..', 'node_modules', '.bin', 'prisma');
  let schema = '';
  let databaseUrl = '';
  let prismaClient: null | PrismaClient = null;
  return {
    async before() {
      // Generate a unique schema identifier for this test context
      schema = `test_${nanoid()}`;
      // Generate the pg connection string for the test schema
      databaseUrl = `postgres://postgres:prisma@localhost:5432/prisma?schema=${schema}`;
      // Set the required environment variable to contain the connection string
      // to our database test schema
      process.env.POSTGRES_URL = databaseUrl;

      // Run the migrations to ensure our schema has the required structure
      execSync(`"${prismaBinary}" migrate deploy`, {
        env: {
          ...process.env,
          POSTGRES_URL: databaseUrl,
        },
      });
      // Construct a new Prisma Client connected to the generated Postgres schema
      prismaClient = new PrismaClient();
      return prismaClient;
    },
    async after() {
      // Drop the schema after the tests have completed
      const client = new Client({
        connectionString: databaseUrl,
      });
      await client.connect();
      await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
      await client.end();
      // Release the Prisma Client connection
      await prismaClient?.$disconnect();
    },
  };
}

export function createTestContext(): TestContext {
  const ctx = {} as TestContext;
  const graphqlCtx = graphqlTestContext();
  const prismaCtx = prismaTestContext();
  beforeEach(async () => {
    const client = await graphqlCtx.before();
    const db = await prismaCtx.before();
    Object.assign(ctx, {
      client,
      db,
    });
  });
  afterEach(async () => {
    await graphqlCtx.after();
    await prismaCtx.after();
  });
  return ctx;
}
