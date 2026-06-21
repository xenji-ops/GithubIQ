import type { LanguageIntelligence, RepoQualityAnalysis, ContributionIntelligence, PortfolioReadiness, DeveloperScore, ScoreFactor } from '@/types/analysis';
import type { GitHubUser, GitHubRepo } from '@/types/github';

export function calculateDeveloperScore(
  languages: LanguageIntelligence,
  repoQuality: RepoQualityAnalysis,
  contributions: ContributionIntelligence,
  portfolio: PortfolioReadiness,
  user: GitHubUser,
  repos: GitHubRepo[]
): DeveloperScore {
  const factors: ScoreFactor[] = [];

  // 1. Repository Quality (25%)
  const repoScore = Math.min(repoQuality.averageScore, 100);
  factors.push({
    name: 'Repository Quality',
    score: Math.round(repoScore),
    maxScore: 100,
    weight: 0.25,
    details: `Average repo quality score: ${Math.round(repoScore)}/100 across ${repoQuality.repos.length} repos`,
  });

  // 2. Activity Consistency (20%)
  const activityScore = Math.min(
    (contributions.activeDays / 365) * 40 +
    (contributions.longestStreak / 30) * 30 +
    Math.min(contributions.averagePerWeek / 5, 1) * 30,
    100
  );
  factors.push({
    name: 'Activity Consistency',
    score: Math.round(activityScore),
    maxScore: 100,
    weight: 0.20,
    details: `${contributions.activeDays} active days, ${contributions.longestStreak} day streak`,
  });

  // 3. Documentation Quality (15%)
  const reposWithReadme = repoQuality.repos.filter(r => r.hasReadme).length;
  const reposWithDesc = repoQuality.repos.filter(r => r.hasDescription).length;
  const reposWithTopics = repoQuality.repos.filter(r => r.hasTopics).length;
  const total = Math.max(repoQuality.repos.length, 1);
  const docScore = Math.round(
    (reposWithReadme / total) * 40 +
    (reposWithDesc / total) * 30 +
    (reposWithTopics / total) * 30
  );
  factors.push({
    name: 'Documentation Quality',
    score: Math.min(docScore, 100),
    maxScore: 100,
    weight: 0.15,
    details: `${reposWithReadme}/${total} repos have READMEs, ${reposWithDesc}/${total} have descriptions`,
  });

  // 4. Project Diversity (15%)
  const diversityScore = Math.min(
    languages.diversityScore * 40 +
    Math.min(repos.length / 10, 1) * 30 +
    Math.min(languages.totalLanguages / 5, 1) * 30,
    100
  );
  factors.push({
    name: 'Project Diversity',
    score: Math.round(diversityScore),
    maxScore: 100,
    weight: 0.15,
    details: `${languages.totalLanguages} languages across ${repos.length} projects`,
  });

  // 5. Open Source Contribution (15%)
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const ossScore = Math.min(
    Math.min(totalStars / 50, 1) * 40 +
    Math.min(totalForks / 20, 1) * 30 +
    Math.min(repos.length / 15, 1) * 30,
    100
  );
  factors.push({
    name: 'Open Source Contribution',
    score: Math.round(ossScore),
    maxScore: 100,
    weight: 0.15,
    details: `${totalStars} total stars, ${totalForks} total forks`,
  });

  // 6. Profile Completeness (10%)
  let profileScore = 0;
  if (user.name) profileScore += 15;
  if (user.bio) profileScore += 20;
  if (user.blog) profileScore += 15;
  if (user.location) profileScore += 10;
  if (user.email) profileScore += 10;
  if (user.twitter_username) profileScore += 10;
  if (user.avatar_url && !user.avatar_url.includes('identicon')) profileScore += 20;
  factors.push({
    name: 'Profile Completeness',
    score: Math.min(profileScore, 100),
    maxScore: 100,
    weight: 0.10,
    details: `Profile ${profileScore >= 80 ? 'well' : profileScore >= 50 ? 'partially' : 'minimally'} completed`,
  });

  // Calculate overall
  const overall = Math.round(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0)
  );

  return {
    overall,
    level: getLevel(overall),
    factors,
  };
}

function getLevel(score: number): DeveloperScore['level'] {
  if (score >= 80) return 'Expert';
  if (score >= 60) return 'Advanced';
  if (score >= 35) return 'Intermediate';
  return 'Beginner';
}
