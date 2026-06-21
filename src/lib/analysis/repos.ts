import type { RepoQualityScore, RepoQualityAnalysis } from '@/types/analysis';
import type { GitHubRepo } from '@/types/github';

export function analyzeRepoQuality(
  repos: GitHubRepo[],
  readmeMap: Record<string, { content: string; size: number } | null>
): RepoQualityAnalysis {
  const scoredRepos: RepoQualityScore[] = repos.map((repo) => {
    const readme = readmeMap[repo.name];
    const factors: { name: string; score: number; maxScore: number }[] = [];

    // README quality (25 pts)
    let readmeScore = 0;
    const readmeLength = readme?.size || 0;
    if (readme) {
      readmeScore = 10;
      if (readmeLength > 500) readmeScore = 15;
      if (readmeLength > 1000) readmeScore = 20;
      if (readmeLength > 2000) readmeScore = 25;
    }
    factors.push({ name: 'README', score: readmeScore, maxScore: 25 });

    // Description (10 pts)
    const descScore = repo.description ? (repo.description.length > 20 ? 10 : 5) : 0;
    factors.push({ name: 'Description', score: descScore, maxScore: 10 });

    // Topics (10 pts)
    const topicScore = Math.min(repo.topics.length * 3, 10);
    factors.push({ name: 'Topics', score: topicScore, maxScore: 10 });

    // Stars (15 pts)
    const starScore = Math.min(Math.floor(Math.log2(repo.stargazers_count + 1) * 3), 15);
    factors.push({ name: 'Stars', score: starScore, maxScore: 15 });

    // Forks (10 pts)
    const forkScore = Math.min(Math.floor(Math.log2(repo.forks_count + 1) * 3), 10);
    factors.push({ name: 'Forks', score: forkScore, maxScore: 10 });

    // License (10 pts)
    const licenseScore = repo.license ? 10 : 0;
    factors.push({ name: 'License', score: licenseScore, maxScore: 10 });

    // Recent activity (20 pts)
    const lastPush = new Date(repo.pushed_at);
    const daysSinceUpdate = Math.floor((Date.now() - lastPush.getTime()) / (1000 * 60 * 60 * 24));
    let activityScore = 0;
    if (daysSinceUpdate <= 7) activityScore = 20;
    else if (daysSinceUpdate <= 30) activityScore = 15;
    else if (daysSinceUpdate <= 90) activityScore = 10;
    else if (daysSinceUpdate <= 180) activityScore = 5;
    factors.push({ name: 'Recent Activity', score: activityScore, maxScore: 20 });

    const totalScore = factors.reduce((sum, f) => sum + f.score, 0);

    return {
      repoName: repo.name,
      repoUrl: repo.html_url,
      description: repo.description,
      score: totalScore,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      hasReadme: !!readme,
      readmeLength,
      hasDescription: !!repo.description,
      hasTopics: repo.topics.length > 0,
      topicCount: repo.topics.length,
      hasLicense: !!repo.license,
      lastUpdated: repo.pushed_at,
      language: repo.language,
      factors,
    };
  });

  const sorted = [...scoredRepos].sort((a, b) => b.score - a.score);
  const averageScore = sorted.length > 0
    ? Math.round(sorted.reduce((sum, r) => sum + r.score, 0) / sorted.length)
    : 0;

  // Best Project: highest quality score
  const bestProject = sorted[0] || null;

  // Most Popular: most stars
  const mostPopular = [...scoredRepos].sort((a, b) => b.stars - a.stars)[0] || null;

  // Hidden Gem: good quality, low stars
  const hiddenGem = scoredRepos
    .filter(r => r.score >= 40 && r.stars <= 5)
    .sort((a, b) => b.score - a.score)[0] || null;

  return {
    repos: sorted,
    averageScore,
    bestProject,
    mostPopular,
    hiddenGem,
  };
}
