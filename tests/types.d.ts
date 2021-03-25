import type { PrismaClient } from '@prisma/client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { DocumentNode } from 'graphql';
import type { IncomingHttpHeaders } from 'http';

import { QueryOptions, GQLResponse } from 'mercurius-integration-testing';

export type TestContext = {
  client: MercuriusTestClient;
  db: PrismaClient;
};

export interface MercuriusTestClient {
  /**
   * Query function.
   *
   * @param query Query to be sent. It can be a DocumentNode or string.
   * @param queryOptions Query specific options, including:
   * - variables
   * - operationName
   * - headers
   * - cookies
   */
  query: <
    TData extends Record<string, unknown> = Record<string, any>,
    TVariables extends Record<string, unknown> | undefined = undefined
  >(
    query: TypedDocumentNode<TData, TVariables> | DocumentNode | string,
    queryOptions?: QueryOptions<TVariables>
  ) => Promise<GQLResponse<TData>>;
  /**
   * Mutation function.
   *
   * @param mutation Mutation to be sent. It can be a DocumentNode or string.
   * @param mutationOptions Query specific options, including:
   * - variables
   * - operationName
   * - headers
   * - cookies
   */
  mutate: <
    TData extends Record<string, unknown> = Record<string, any>,
    TVariables extends Record<string, unknown> | undefined = undefined
  >(
    mutation: TypedDocumentNode<TData, TVariables> | DocumentNode | string,
    mutationOptions?: QueryOptions<TVariables>
  ) => Promise<GQLResponse<TData>>;
  /**
   * Set new global headers to this test client instance.
   * @param newHeaders new Global headers to be set for the test client.
   */
  setHeaders: (newHeaders: IncomingHttpHeaders) => void;
  /**
   * Set new global cookies to this test client instance.
   * @param newCookies new Global headers to be set for the test client.
   */
  setCookies: (newCookies: Record<string, string>) => void;
  /**
   * Send a batch of queries, make sure to enable `allowBatchedQueries`.
   *
   * https://github.com/mercurius-js/mercurius#batched-queries
   *
   *
   * @param queries Queries to be sent in batch.
   * @param queryOptions Cookies | headers to be set.
   */
  batchQueries: (
    queries: {
      query: DocumentNode | string;
      variables?: Record<string, any>;
      operationName?: string;
    }[],
    queryOptions?: Pick<QueryOptions, 'cookies' | 'headers'>
  ) => Promise<GQLResponse<any>[]>;
  /**
   * Global headers added to every request in this test client.
   */
  headers: IncomingHttpHeaders;
  /**
   * Global cookies added to every request in this test client.
   */
  cookies: Record<string, string>;
  /**
   * GraphQL Subscription
   */
  subscribe: <
    TData extends Record<string, unknown> = Record<string, any>,
    TVariables extends Record<string, unknown> | undefined = undefined
  >(opts: {
    /**
     * Subscription query, can be a DocumentNode or string
     */
    query: string | DocumentNode | TypedDocumentNode<TData, TVariables>;
    /**
     * Initial payload, usually for authorization
     */
    initPayload?: (() => Record<string, any> | Promise<Record<string, any>>) | Record<string, any>;
    /**
     * Subscription data function
     */
    onData(response: GQLResponse<TData>): void;
    /**
     * Subscription specific headers
     */
    headers?: IncomingHttpHeaders;
    /**
     * Subscription specific cookies
     */
    cookies?: Record<string, string>;
    /**
     * query operationName
     */
    operationName?: string | null;
    /**
     * subscription variables
     */
    variables?: TVariables;
  }) => Promise<{
    unsubscribe: () => void;
  }>;
}
