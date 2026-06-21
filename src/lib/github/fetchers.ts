import { Octokit } from '@octokit/rest';
import type { GitHubUser, GitHubRepo, GitHubEvent, GitHubOrg, RepoLanguages, ContributionCalendar } from '@/types/github';

export async function fetchUserProfile(octokit: Octokit, username: string): Promise<GitHubUser> {
  const { data } = await octokit.users.getByUsername({ username });
  return data as GitHubUser;
}

export async function fetchUserRepos(octokit: Octokit, username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const { data } = await octokit.repos.listForUser({
      username,
      per_page: perPage,
      page,
      sort: 'updated',
      type: 'owner',
    });

    repos.push(...(data as unknown as GitHubRepo[]));

    if (data.length < perPage) break;
    page++;
    if (page > 5) break; // Safety limit: 500 repos max
  }

  return repos;
}

export async function fetchRepoLanguages(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<RepoLanguages> {
  try {
    const { data } = await octokit.repos.listLanguages({ owner, repo });
    return data;
  } catch {
    return {};
  }
}

export async function fetchRepoReadme(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<{ content: string; size: number } | null> {
  try {
    const { data } = await octokit.repos.getReadme({ owner, repo });
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return { content, size: data.size };
  } catch {
    return null;
  }
}

export async function fetchUserEvents(octokit: Octokit, username: string): Promise<GitHubEvent[]> {
  try {
    const events: GitHubEvent[] = [];
    for (let page = 1; page <= 3; page++) {
      const { data } = await octokit.activity.listPublicEventsForUser({
        username,
        per_page: 100,
        page,
      });
      events.push(...(data as unknown as GitHubEvent[]));
      if (data.length < 100) break;
    }
    return events;
  } catch {
    return [];
  }
}

export async function fetchUserOrgs(octokit: Octokit, username: string): Promise<GitHubOrg[]> {
  try {
    const { data } = await octokit.orgs.listForUser({ username });
    return data as GitHubOrg[];
  } catch {
    return [];
  }
}

export async function fetchContributions(
  token: string,
  username: string
): Promise<ContributionCalendar | null> {
  if (!token) return null;

  try {
    const { graphql } = await import('@octokit/graphql');
    const graphqlWithAuth = graphql.defaults({
      headers: {
        authorization: `token ${token}`,
      },
    });

    const response = await graphqlWithAuth<{
      user: {
        contributionsCollection: {
          contributionCalendar: ContributionCalendar;
        };
      };
    }>({
      query: `query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  color
                }
              }
            }
          }
        }
      }`,
      username,
    });

    return response.user.contributionsCollection.contributionCalendar;
  } catch {
    return null;
  }
}
