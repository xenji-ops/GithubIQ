export interface ScoreFactor {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  details: string;
}

export interface DeveloperScore {
  overall: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  factors: ScoreFactor[];
}

export interface LanguageData {
  name: string;
  bytes: number;
  percentage: number;
  color: string;
  repoCount: number;
}

export interface LanguageIntelligence {
  languages: LanguageData[];
  totalLanguages: number;
  diversityScore: number;
  primaryLanguage: string;
  insights: string[];
}

export interface RepoQualityScore {
  repoName: string;
  repoUrl: string;
  description: string | null;
  score: number;
  stars: number;
  forks: number;
  watchers: number;
  hasReadme: boolean;
  readmeLength: number;
  hasDescription: boolean;
  hasTopics: boolean;
  topicCount: number;
  hasLicense: boolean;
  lastUpdated: string;
  language: string | null;
  factors: { name: string; score: number; maxScore: number }[];
}

export interface RepoQualityAnalysis {
  repos: RepoQualityScore[];
  averageScore: number;
  bestProject: RepoQualityScore | null;
  mostPopular: RepoQualityScore | null;
  hiddenGem: RepoQualityScore | null;
}

export interface ContributionIntelligence {
  totalContributions: number;
  activeDays: number;
  longestStreak: number;
  currentStreak: number;
  averagePerDay: number;
  averagePerWeek: number;
  mostActiveDay: string;
  mostActiveMonth: string;
  activityPattern: string;
  archetype: string;
  archetypeDescription: string;
  insights: string[];
  monthlyActivity: { month: string; contributions: number }[];
  weekdayActivity: { day: string; contributions: number }[];
  heatmapData: { date: string; count: number; level: number }[];
}

export interface PortfolioCheck {
  name: string;
  passed: boolean;
  suggestion: string;
  weight: number;
}

export interface PortfolioReadiness {
  score: number;
  checks: PortfolioCheck[];
  recommendations: string[];
}

export interface ResumeIntelligence {
  strengths: { title: string; description: string; icon: string }[];
  weaknesses: { title: string; description: string; icon: string }[];
  suggestions: { repo: string; suggestion: string }[];
  summary: string;
}

export interface CareerPath {
  title: string;
  confidence: number;
  matchingSkills: string[];
  missingSkills: string[];
  description: string;
  icon: string;
}

export interface CareerRecommendations {
  paths: CareerPath[];
  primaryRecommendation: string;
}

export interface RoadmapPhase {
  phase: string;
  timeframe: string;
  goals: { task: string; priority: 'high' | 'medium' | 'low'; category: string }[];
}

export interface GrowthRoadmap {
  phases: RoadmapPhase[];
  focus: string;
}

export interface FullAnalysisReport {
  user: import('./github').GitHubUser;
  orgs: import('./github').GitHubOrg[];
  score: DeveloperScore;
  languages: LanguageIntelligence;
  repoQuality: RepoQualityAnalysis;
  contributions: ContributionIntelligence;
  portfolio: PortfolioReadiness;
  resume: ResumeIntelligence;
  career: CareerRecommendations;
  roadmap: GrowthRoadmap;
  generatedAt: string;
}
