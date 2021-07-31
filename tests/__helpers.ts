import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import { FastifyInstance, FastifyLoggerInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
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
    async beforeAll() {
      // const port = await getPort({ port: makeRange(5000, 6000) });
      serverInstance = init();
      const app = init();

      return createMercuriusTestClient(app, {
        url: '/',
      });
    },
    async afterAll() {
      await serverInstance?.close();
    },
  };
}

function prismaTestContext() {
  const prismaBinary = join(__dirname, '..', 'node_modules', '.bin', 'prisma');
  let databaseUrl = '';
  let prismaClient: null | PrismaClient = null;

  return {
    async beforeAll() {
      // Generate the pg connection string for the test schema
      databaseUrl = `postgresql://postgres:prisma@localhost:5432/prisma?schema=test_lx`;

      // Set the required environment variable to contain the connection string
      // to our database test schema
      process.env.POSTGRES_URL = databaseUrl;

      // Run the migrations to ensure our schema has the required structure
      execSync(`export POSTGRES_URL="${databaseUrl}" && "${prismaBinary}" db push`);

      // Construct a new Prisma Client connected to the generated Postgres schema
      prismaClient = new PrismaClient({
        log: ['info', 'error', 'query', 'warn'],
      });

      return prismaClient;
    },
    async afterAll() {
      // Drop the schema after the tests have completed
      // Generate the pg connection string for the test schema
      databaseUrl = `postgresql://postgres:prisma@localhost:5432/prisma?schema=test_lx`;

      const client = new Client({
        connectionString: databaseUrl,
      });
      await client.connect();
      await client.query(`DROP SCHEMA IF EXISTS test_lx CASCADE`);
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

  beforeAll(async () => {
    const client = await graphqlCtx.beforeAll();
    const db = await prismaCtx.beforeAll();
    Object.assign(ctx, {
      client,
      db,
    });
  });

  afterAll(async () => {
    await graphqlCtx.afterAll();
    await prismaCtx.afterAll();
  });

  return ctx;
}
