import type { FastifyRequest } from 'fastify';
import { nanoid } from 'nanoid';

export function getOrCreateAnonymousId({ request }: { request: FastifyRequest }): string {
  return request.cookies?.ajs_anonymous_id || nanoid();
}
