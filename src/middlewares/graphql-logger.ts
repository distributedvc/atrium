import { performance } from 'perf_hooks';
import type { GraphQLResolveInfo, GraphQLArgs, ExecutionResult } from 'graphql';
import type { Context } from '../context';

async function logRequestAndResponse(
  resolve: <TSource, TArgs, TContext = Context>(
    root: TSource,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
  ) => ExecutionResult,
  root: unknown,
  args: GraphQLArgs,
  context: Context,
  info: GraphQLResolveInfo
): Promise<ExecutionResult | never> {
  let log = context.request.log.child({ args });

  if (context.request.headers) {
    log = log.child({ headers: context.request.headers });
  }

  log.info(`Operation: ${info.parentType} name: ${info.fieldName}`);

  try {
    const t0 = performance.now();
    const response = await resolve(root, args, context, info);
    const t1 = performance.now();
    context.request.log.info(
      `Operation: ${info.parentType} name: ${info.fieldName} complete. Took ${(t1 - t0).toFixed(
        2
      )} milliseconds.'`
    );
    return response;
  } catch (error) {
    context.request.log.error(error.stack);
    throw error;
  }
}

export const loggerMiddleware = {
  Query: logRequestAndResponse,
  Mutation: logRequestAndResponse,
};
