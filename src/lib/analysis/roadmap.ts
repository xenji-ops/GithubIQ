import type { GrowthRoadmap, RoadmapPhase, DeveloperScore, LanguageIntelligence, RepoQualityAnalysis, ContributionIntelligence, PortfolioReadiness } from '@/types/analysis';

export function generateGrowthRoadmap(
  score: DeveloperScore,
  languages: LanguageIntelligence,
  repoQuality: RepoQualityAnalysis,
  contributions: ContributionIntelligence,
  portfolio: PortfolioReadiness
): GrowthRoadmap {
  const phases: RoadmapPhase[] = [];
  const weakFactors = score.factors.sort((a, b) => (a.score / a.maxScore) - (b.score / b.maxScore));
  const focus = weakFactors[0]?.name || 'General Improvement';

  // Phase 1: First 30 Days - Quick Wins
  const phase1Goals: RoadmapPhase['goals'] = [];

  // Portfolio improvements
  const failedChecks = portfolio.checks.filter(c => !c.passed);
  for (const check of failedChecks.slice(0, 2)) {
    phase1Goals.push({
      task: check.suggestion,
      priority: 'high',
      category: 'Profile',
    });
  }

  // README improvements
  const reposWithoutReadme = repoQuality.repos.filter(r => !r.hasReadme);
  if (reposWithoutReadme.length > 0) {
    phase1Goals.push({
      task: `Add detailed README files to your top ${Math.min(reposWithoutReadme.length, 3)} repositories without them.`,
      priority: 'high',
      category: 'Documentation',
    });
  }

  // Descriptions
  const reposWithoutDesc = repoQuality.repos.filter(r => !r.hasDescription);
  if (reposWithoutDesc.length > 0) {
    phase1Goals.push({
      task: `Add descriptions to ${Math.min(reposWithoutDesc.length, 5)} repositories.`,
      priority: 'medium',
      category: 'Documentation',
    });
  }

  // Topics
  const reposWithoutTopics = repoQuality.repos.filter(r => !r.hasTopics);
  if (reposWithoutTopics.length > 0) {
    phase1Goals.push({
      task: `Add relevant topics/tags to ${Math.min(reposWithoutTopics.length, 5)} repositories.`,
      priority: 'medium',
      category: 'Discoverability',
    });
  }

  // Activity
  if (contributions.averagePerWeek < 3) {
    phase1Goals.push({
      task: 'Set a goal to make at least 3-5 contributions per week.',
      priority: 'high',
      category: 'Activity',
    });
  }

  phases.push({
    phase: 'Quick Wins',
    timeframe: '30 Days',
    goals: phase1Goals.slice(0, 6),
  });

  // Phase 2: 60 Days - Build Quality
  const phase2Goals: RoadmapPhase['goals'] = [];

  if (repoQuality.averageScore < 50) {
    phase2Goals.push({
      task: 'Improve your top 3 repositories with better documentation, tests, and CI/CD.',
      priority: 'high',
      category: 'Quality',
    });
  }

  if (languages.totalLanguages < 3) {
    const suggestedLang = getSuggestedLanguage(languages);
    phase2Goals.push({
      task: `Build a project in ${suggestedLang} to diversify your portfolio.`,
      priority: 'medium',
      category: 'Skills',
    });
  }

  phase2Goals.push({
    task: 'Build a new full-stack project with proper documentation, testing, and deployment.',
    priority: 'high',
    category: 'Projects',
  });

  phase2Goals.push({
    task: 'Contribute to 1-2 open source projects to demonstrate collaboration skills.',
    priority: 'medium',
    category: 'Open Source',
  });

  if (contributions.longestStreak < 14) {
    phase2Goals.push({
      task: 'Build a 14+ day contribution streak to show consistency.',
      priority: 'medium',
      category: 'Activity',
    });
  }

  phases.push({
    phase: 'Build Quality',
    timeframe: '60 Days',
    goals: phase2Goals.slice(0, 5),
  });

  // Phase 3: 90 Days - Level Up
  const phase3Goals: RoadmapPhase['goals'] = [];

  phase3Goals.push({
    task: 'Create a portfolio website showcasing your best projects with live demos.',
    priority: 'high',
    category: 'Portfolio',
  });

  phase3Goals.push({
    task: 'Write a technical blog post or tutorial about a project you built.',
    priority: 'medium',
    category: 'Content',
  });

  phase3Goals.push({
    task: 'Aim for 50+ contributions this month to maintain a strong activity graph.',
    priority: 'medium',
    category: 'Activity',
  });

  if (score.overall < 60) {
    phase3Goals.push({
      task: 'Re-analyze your profile with GitHubIQ to track improvement.',
      priority: 'low',
      category: 'Review',
    });
  }

  phase3Goals.push({
    task: 'Build and deploy a production-ready project with CI/CD and monitoring.',
    priority: 'high',
    category: 'Projects',
  });

  phase3Goals.push({
    task: 'Network with developers in your area of interest through open source contributions.',
    priority: 'medium',
    category: 'Community',
  });

  phases.push({
    phase: 'Level Up',
    timeframe: '90 Days',
    goals: phase3Goals.slice(0, 5),
  });

  return { phases, focus };
}

function getSuggestedLanguage(languages: LanguageIntelligence): string {
  const known = new Set(languages.languages.map(l => l.name.toLowerCase()));
  if (!known.has('python')) return 'Python';
  if (!known.has('typescript')) return 'TypeScript';
  if (!known.has('go')) return 'Go';
  if (!known.has('rust')) return 'Rust';
  return 'a new language';
}
