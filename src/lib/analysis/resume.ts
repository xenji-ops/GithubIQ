import type { ResumeIntelligence, LanguageIntelligence, RepoQualityAnalysis, ContributionIntelligence } from '@/types/analysis';
import type { GitHubUser, GitHubRepo } from '@/types/github';

export function generateResumeIntelligence(
  user: GitHubUser,
  repos: GitHubRepo[],
  languages: LanguageIntelligence,
  repoQuality: RepoQualityAnalysis,
  contributions: ContributionIntelligence
): ResumeIntelligence {
  const strengths: ResumeIntelligence['strengths'] = [];
  const weaknesses: ResumeIntelligence['weaknesses'] = [];
  const suggestions: ResumeIntelligence['suggestions'] = [];

  // Analyze technical strengths
  if (languages.totalLanguages >= 5) {
    strengths.push({
      title: 'Polyglot Developer',
      description: `Proficient in ${languages.totalLanguages} languages including ${languages.languages.slice(0, 3).map(l => l.name).join(', ')}.`,
      icon: '🌐',
    });
  }
  if (languages.primaryLanguage) {
    strengths.push({
      title: `${languages.primaryLanguage} Specialist`,
      description: `Strong expertise in ${languages.primaryLanguage} across multiple projects.`,
      icon: '⭐',
    });
  }

  // Collaboration indicators
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  if (totalStars > 10) {
    strengths.push({
      title: 'Community Recognition',
      description: `Projects have earned ${totalStars} stars, indicating valuable contributions.`,
      icon: '🌟',
    });
  }
  if (totalForks > 5) {
    strengths.push({
      title: 'Project Influence',
      description: `${totalForks} forks demonstrate that others build upon your work.`,
      icon: '🔀',
    });
  }

  // Activity strengths
  if (contributions.longestStreak >= 14) {
    strengths.push({
      title: 'Consistent Contributor',
      description: `Maintained a ${contributions.longestStreak}-day contribution streak, showing discipline.`,
      icon: '🔥',
    });
  }
  if (repos.length >= 10) {
    strengths.push({
      title: 'Prolific Builder',
      description: `Created ${repos.length} public projects, demonstrating initiative and productivity.`,
      icon: '🚀',
    });
  }

  // Weaknesses
  if (repoQuality.averageScore < 40) {
    weaknesses.push({
      title: 'Repository Quality',
      description: 'Many repositories lack documentation, descriptions, or topics.',
      icon: '📝',
    });
  }
  if (languages.totalLanguages < 3) {
    weaknesses.push({
      title: 'Limited Language Range',
      description: 'Expanding to more languages would demonstrate versatility.',
      icon: '🔤',
    });
  }
  if (contributions.activeDays < 50) {
    weaknesses.push({
      title: 'Inconsistent Activity',
      description: 'More regular contributions would strengthen your profile for recruiters.',
      icon: '📅',
    });
  }
  const reposWithoutReadme = repoQuality.repos.filter(r => !r.hasReadme).length;
  if (reposWithoutReadme > 3) {
    weaknesses.push({
      title: 'Missing Documentation',
      description: `${reposWithoutReadme} repositories lack README files.`,
      icon: '📄',
    });
  }
  if (!user.bio || user.bio.length < 10) {
    weaknesses.push({
      title: 'Incomplete Profile',
      description: 'A compelling bio helps recruiters understand your background.',
      icon: '👤',
    });
  }

  // Per-repo suggestions
  if (repoQuality.bestProject) {
    suggestions.push({
      repo: repoQuality.bestProject.repoName,
      suggestion: `Highlight "${repoQuality.bestProject.repoName}" as your flagship project — it has the highest quality score.`,
    });
  }
  if (repoQuality.mostPopular && repoQuality.mostPopular.repoName !== repoQuality.bestProject?.repoName) {
    suggestions.push({
      repo: repoQuality.mostPopular.repoName,
      suggestion: `Feature "${repoQuality.mostPopular.repoName}" prominently — it's your most starred project (${repoQuality.mostPopular.stars} ⭐).`,
    });
  }
  for (const repo of repoQuality.repos.slice(0, 5)) {
    if (!repo.hasReadme) {
      suggestions.push({
        repo: repo.repoName,
        suggestion: `Add a detailed README to "${repo.repoName}" with screenshots, setup instructions, and usage examples.`,
      });
    }
    if (!repo.hasDescription) {
      suggestions.push({
        repo: repo.repoName,
        suggestion: `Add a clear description to "${repo.repoName}" explaining what it does and who it's for.`,
      });
    }
    if (repo.language && !repo.hasTopics) {
      suggestions.push({
        repo: repo.repoName,
        suggestion: `Add topics to "${repo.repoName}" (e.g., ${repo.language.toLowerCase()}, ${guessDomain(repo)}).`,
      });
    }
  }

  // Summary
  const summary = generateSummary(user, repos, languages, contributions, strengths, weaknesses);

  return {
    strengths: strengths.slice(0, 6),
    weaknesses: weaknesses.slice(0, 5),
    suggestions: suggestions.slice(0, 8),
    summary,
  };
}

function guessDomain(repo: { repoName: string; description: string | null }): string {
  const text = `${repo.repoName} ${repo.description || ''}`.toLowerCase();
  if (text.includes('web') || text.includes('react') || text.includes('next')) return 'web-development';
  if (text.includes('api') || text.includes('server') || text.includes('backend')) return 'api';
  if (text.includes('ml') || text.includes('ai') || text.includes('machine')) return 'machine-learning';
  if (text.includes('mobile') || text.includes('android') || text.includes('ios')) return 'mobile-development';
  if (text.includes('security') || text.includes('phish') || text.includes('crypto')) return 'cybersecurity';
  if (text.includes('data') || text.includes('analytics')) return 'data-science';
  if (text.includes('game')) return 'game-development';
  if (text.includes('cli') || text.includes('tool')) return 'developer-tools';
  return 'open-source';
}

function generateSummary(
  user: GitHubUser,
  repos: GitHubRepo[],
  languages: LanguageIntelligence,
  contributions: ContributionIntelligence,
  strengths: ResumeIntelligence['strengths'],
  weaknesses: ResumeIntelligence['weaknesses']
): string {
  const name = user.name || user.login;
  const topLangs = languages.languages.slice(0, 3).map(l => l.name).join(', ');
  const strengthCount = strengths.length;
  const weaknessCount = weaknesses.length;

  let summary = `${name} is a developer with ${repos.length} public repositories, primarily working with ${topLangs}. `;
  summary += `With ${contributions.totalContributions} contributions and a ${contributions.longestStreak}-day streak, `;
  summary += `they demonstrate a "${contributions.archetype}" coding pattern. `;

  if (strengthCount > weaknessCount) {
    summary += 'Overall, their GitHub profile shows strong technical capability and is well-positioned for professional opportunities.';
  } else if (strengthCount === weaknessCount) {
    summary += 'Their profile shows promise with clear areas for improvement that could significantly boost their professional presence.';
  } else {
    summary += 'With focused improvements to documentation and activity consistency, their profile could become significantly stronger.';
  }

  return summary;
}
