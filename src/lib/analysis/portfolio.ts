import type { PortfolioReadiness, PortfolioCheck } from '@/types/analysis';
import type { GitHubUser, GitHubRepo } from '@/types/github';

export function analyzePortfolioReadiness(
  user: GitHubUser,
  repos: GitHubRepo[],
  readmeMap: Record<string, { content: string; size: number } | null>
): PortfolioReadiness {
  const checks: PortfolioCheck[] = [];

  // 1. Professional avatar
  const hasCustomAvatar = !!user.avatar_url && !user.avatar_url.includes('identicon');
  checks.push({
    name: 'Professional Profile Picture',
    passed: hasCustomAvatar,
    suggestion: hasCustomAvatar ? 'Great profile picture!' : 'Add a professional profile picture to make a strong first impression.',
    weight: 10,
  });

  // 2. Bio quality
  const hasBio = !!user.bio && user.bio.length > 10;
  checks.push({
    name: 'Descriptive Bio',
    passed: hasBio,
    suggestion: hasBio ? 'Your bio effectively describes who you are.' : 'Add a compelling bio that highlights your skills and interests.',
    weight: 15,
  });

  // 3. Portfolio/website link
  const hasWebsite = !!user.blog && user.blog.length > 0;
  checks.push({
    name: 'Portfolio Website Link',
    passed: hasWebsite,
    suggestion: hasWebsite ? 'Portfolio link is present.' : 'Add a portfolio website or personal site link to your profile.',
    weight: 10,
  });

  // 4. Location
  const hasLocation = !!user.location;
  checks.push({
    name: 'Location Specified',
    passed: hasLocation,
    suggestion: hasLocation ? 'Location helps recruiters find you.' : 'Add your location to help recruiters and collaborators find you.',
    weight: 5,
  });

  // 5. Minimum repos
  const hasEnoughRepos = repos.length >= 5;
  checks.push({
    name: 'Sufficient Public Repositories (5+)',
    passed: hasEnoughRepos,
    suggestion: hasEnoughRepos ? `You have ${repos.length} public repositories.` : `You have only ${repos.length} repos. Aim for at least 5 quality projects.`,
    weight: 15,
  });

  // 6. README quality
  const reposWithGoodReadme = Object.values(readmeMap).filter(r => r && r.size > 500).length;
  const hasGoodReadmes = reposWithGoodReadme >= 3;
  checks.push({
    name: 'Quality READMEs (3+ repos with 500+ chars)',
    passed: hasGoodReadmes,
    suggestion: hasGoodReadmes ? `${reposWithGoodReadme} repos have detailed READMEs.` : 'Write comprehensive READMEs with setup instructions, screenshots, and feature descriptions.',
    weight: 15,
  });

  // 7. Project descriptions
  const reposWithDesc = repos.filter(r => r.description && r.description.length > 10).length;
  const hasDescriptions = reposWithDesc >= repos.length * 0.7;
  checks.push({
    name: 'Project Descriptions (70%+ repos)',
    passed: hasDescriptions,
    suggestion: hasDescriptions ? 'Most repos have descriptions.' : 'Add clear, descriptive summaries to your repositories.',
    weight: 10,
  });

  // 8. Topics/tags
  const reposWithTopics = repos.filter(r => r.topics && r.topics.length > 0).length;
  const hasTopics = reposWithTopics >= 3;
  checks.push({
    name: 'Repository Topics (3+ repos tagged)',
    passed: hasTopics,
    suggestion: hasTopics ? `${reposWithTopics} repos have topics.` : 'Add topics/tags to your repositories for better discoverability.',
    weight: 10,
  });

  // 9. Project variety
  const languages = new Set(repos.map(r => r.language).filter(Boolean));
  const hasVariety = languages.size >= 2;
  checks.push({
    name: 'Project Variety (2+ languages)',
    passed: hasVariety,
    suggestion: hasVariety ? `Projects in ${languages.size} languages show versatility.` : 'Diversify your projects across multiple languages and domains.',
    weight: 10,
  });

  // Calculate score
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earnedWeight = checks.filter(c => c.passed).reduce((sum, c) => sum + c.weight, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  // Generate recommendations
  const recommendations = checks
    .filter(c => !c.passed)
    .sort((a, b) => b.weight - a.weight)
    .map(c => c.suggestion);

  return {
    score,
    checks,
    recommendations,
  };
}
