import { NextResponse } from 'next/server';
import { createOctokit } from '@/lib/github/client';
import {
  fetchUserProfile,
  fetchUserRepos,
  fetchRepoLanguages,
  fetchRepoReadme,
  fetchUserEvents,
  fetchUserOrgs,
  fetchContributions,
} from '@/lib/github/fetchers';
import { calculateDeveloperScore } from '@/lib/analysis/scoring';
import { analyzeLanguages } from '@/lib/analysis/languages';
import { analyzeRepoQuality } from '@/lib/analysis/repos';
import { analyzeContributions } from '@/lib/analysis/contributions';
import { analyzePortfolioReadiness } from '@/lib/analysis/portfolio';
import { generateResumeIntelligence } from '@/lib/analysis/resume';
import { generateCareerRecommendations } from '@/lib/analysis/career';
import { generateGrowthRoadmap } from '@/lib/analysis/roadmap';
import type { FullAnalysisReport } from '@/types/analysis';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, token } = body as { username: string; token?: string };

    if (!username || typeof username !== 'string') {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().replace(/^@/, '');
    const finalToken = token || process.env.GITHUB_TOKEN;
    const octokit = createOctokit(finalToken);

    // Fetch core data
    let user;
    try {
      user = await fetchUserProfile(octokit, cleanUsername);
    } catch (error: unknown) {
      const statusError = error as { status?: number };
      if (statusError.status === 404) {
        return NextResponse.json(
          { error: `User "${cleanUsername}" not found` },
          { status: 404 }
        );
      }
      if (statusError.status === 403) {
        return NextResponse.json(
          { error: 'GitHub API rate limit exceeded. Please try again later or provide a GitHub token.' },
          { status: 429 }
        );
      }
      throw error;
    }

    // Fetch repos, events, orgs in parallel
    const [repos, events, orgs] = await Promise.all([
      fetchUserRepos(octokit, cleanUsername),
      fetchUserEvents(octokit, cleanUsername),
      fetchUserOrgs(octokit, cleanUsername),
    ]);

    // Fetch languages for top repos (limit to avoid rate limits)
    const topRepos = repos
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 20);

    const [languagesMap, readmeMap, contributionCalendar] = await Promise.all([
      Promise.all(
        topRepos.map(async (repo) => ({
          repo: repo.name,
          languages: await fetchRepoLanguages(octokit, cleanUsername, repo.name),
        }))
      ),
      Promise.all(
        topRepos.map(async (repo) => ({
          repo: repo.name,
          readme: await fetchRepoReadme(octokit, cleanUsername, repo.name),
        }))
      ),
      fetchContributions(finalToken || '', cleanUsername),
    ]);

    // Build language map
    const repoLanguagesMap = Object.fromEntries(
      languagesMap.map((l) => [l.repo, l.languages])
    );

    // Build readme map
    const repoReadmeMap = Object.fromEntries(
      readmeMap.map((r) => [r.repo, r.readme])
    );

    // Run all analyses
    const nonForkRepos = repos.filter(r => !r.fork);
    const languages = analyzeLanguages(repoLanguagesMap);
    const repoQuality = analyzeRepoQuality(topRepos, repoReadmeMap);
    const contributions = analyzeContributions(events, contributionCalendar, repos);
    const portfolio = analyzePortfolioReadiness(user, nonForkRepos, repoReadmeMap);
    const resume = generateResumeIntelligence(user, nonForkRepos, languages, repoQuality, contributions);
    const career = generateCareerRecommendations(languages, nonForkRepos, repoQuality);
    const score = calculateDeveloperScore(languages, repoQuality, contributions, portfolio, user, nonForkRepos);
    const roadmap = generateGrowthRoadmap(score, languages, repoQuality, contributions, portfolio);

    const report: FullAnalysisReport = {
      user,
      orgs,
      score,
      languages,
      repoQuality,
      contributions,
      portfolio,
      resume,
      career,
      roadmap,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during analysis. Please try again.' },
      { status: 500 }
    );
  }
}
