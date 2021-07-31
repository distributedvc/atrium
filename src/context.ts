import type { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import * as Lib from './lib';

export const prisma = new PrismaClient();

export interface Context {
  request: FastifyRequest;
  reply: FastifyReply;
  prisma: PrismaClient;
  analytics?: typeof Lib.Segment.analytics;
  correlationId: string;
}

export function createContext({
  request,
  reply,
}: {
  request: FastifyRequest;
  reply: FastifyReply;
}): Context {
  const correlationId = nanoid();

  return {
    correlationId,
    analytics: Lib.Segment.analytics,
    request,
    reply,
    prisma,
  };
}
