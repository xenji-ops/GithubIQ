import { Octokit } from '@octokit/rest';
import { graphql } from '@octokit/graphql';

export function createOctokit(token?: string) {
  return new Octokit({
    auth: token || undefined,
    request: {
      timeout: 10000,
    },
  });
}

export function createGraphQLClient(token: string) {
  return graphql.defaults({
    headers: {
      authorization: `token ${token}`,
    },
  });
}

export async function checkRateLimit(octokit: Octokit) {
  const { data } = await octokit.rateLimit.get();
  return {
    remaining: data.resources.core.remaining,
    limit: data.resources.core.limit,
    resetAt: new Date(data.resources.core.reset * 1000).toISOString(),
  };
}
