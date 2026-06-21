import type { CareerRecommendations, CareerPath, LanguageIntelligence, RepoQualityAnalysis } from '@/types/analysis';
import type { GitHubRepo } from '@/types/github';

export function generateCareerRecommendations(
  languages: LanguageIntelligence,
  repos: GitHubRepo[],
  repoQuality: RepoQualityAnalysis
): CareerRecommendations {
  const langNames = new Set(languages.languages.map(l => l.name.toLowerCase()));
  const allText = repos.map(r => `${r.name} ${r.description || ''} ${(r.topics || []).join(' ')}`).join(' ').toLowerCase();

  const careerPaths: CareerPath[] = [];

  // Backend Developer
  const backendLangs = ['python', 'java', 'go', 'rust', 'c#', 'c++', 'ruby', 'php', 'kotlin', 'scala'];
  const backendMatch = backendLangs.filter(l => langNames.has(l));
  const backendKeywords = ['api', 'server', 'backend', 'database', 'rest', 'graphql', 'microservice'];
  const backendKwMatch = backendKeywords.filter(k => allText.includes(k));
  if (backendMatch.length > 0 || backendKwMatch.length > 0) {
    const confidence = Math.min((backendMatch.length * 15 + backendKwMatch.length * 10 + 20), 95);
    careerPaths.push({
      title: 'Backend Developer',
      confidence,
      matchingSkills: [...backendMatch.map(l => l.charAt(0).toUpperCase() + l.slice(1)), ...backendKwMatch.map(k => k.toUpperCase())],
      missingSkills: backendLangs.filter(l => !langNames.has(l)).slice(0, 3).map(l => l.charAt(0).toUpperCase() + l.slice(1)),
      description: 'Build scalable server-side applications, APIs, and microservices.',
      icon: '⚙️',
    });
  }

  // Full Stack Developer
  const frontendLangs = ['javascript', 'typescript', 'html', 'css', 'vue', 'svelte'];
  const frontendMatch = frontendLangs.filter(l => langNames.has(l));
  const fullstackKeywords = ['react', 'next', 'vue', 'angular', 'svelte', 'fullstack', 'full-stack', 'frontend', 'web'];
  const fullstackKwMatch = fullstackKeywords.filter(k => allText.includes(k));
  if ((frontendMatch.length >= 1 && backendMatch.length >= 1) || fullstackKwMatch.length >= 2) {
    const confidence = Math.min((frontendMatch.length * 10 + backendMatch.length * 10 + fullstackKwMatch.length * 8 + 20), 95);
    careerPaths.push({
      title: 'Full Stack Developer',
      confidence,
      matchingSkills: [...frontendMatch.map(l => l.charAt(0).toUpperCase() + l.slice(1)), ...fullstackKwMatch],
      missingSkills: ['Docker', 'CI/CD', 'Cloud Deployment'].filter(() => !allText.includes('docker')),
      description: 'Build end-to-end web applications, from frontend interfaces to backend services.',
      icon: '🌐',
    });
  }

  // Frontend Developer
  if (frontendMatch.length >= 1 || fullstackKwMatch.length >= 1) {
    const confidence = Math.min((frontendMatch.length * 15 + fullstackKwMatch.length * 10 + 15), 95);
    careerPaths.push({
      title: 'Frontend Developer',
      confidence,
      matchingSkills: [...frontendMatch.map(l => l.charAt(0).toUpperCase() + l.slice(1)), ...fullstackKwMatch],
      missingSkills: ['React Testing', 'Accessibility', 'Performance Optimization'].slice(0, 3),
      description: 'Create beautiful, responsive, and interactive user interfaces.',
      icon: '🎨',
    });
  }

  // AI/ML Engineer
  const mlLangs = ['python', 'r', 'julia', 'jupyter notebook'];
  const mlMatch = mlLangs.filter(l => langNames.has(l));
  const mlKeywords = ['ml', 'ai', 'machine-learning', 'deep-learning', 'tensorflow', 'pytorch', 'neural', 'model', 'data-science', 'nlp'];
  const mlKwMatch = mlKeywords.filter(k => allText.includes(k));
  if (mlMatch.length > 0 || mlKwMatch.length > 0) {
    const confidence = Math.min((mlMatch.length * 15 + mlKwMatch.length * 12 + 10), 95);
    careerPaths.push({
      title: 'AI/ML Engineer',
      confidence,
      matchingSkills: [...mlMatch.map(l => l.charAt(0).toUpperCase() + l.slice(1)), ...mlKwMatch],
      missingSkills: ['TensorFlow', 'PyTorch', 'MLOps'].filter(s => !allText.includes(s.toLowerCase())),
      description: 'Design and implement machine learning models and AI systems.',
      icon: '🤖',
    });
  }

  // DevOps Engineer
  const devopsLangs = ['shell', 'go', 'python', 'dockerfile', 'makefile', 'powershell'];
  const devopsMatch = devopsLangs.filter(l => langNames.has(l));
  const devopsKeywords = ['docker', 'kubernetes', 'ci', 'cd', 'devops', 'deploy', 'infrastructure', 'terraform', 'ansible', 'pipeline'];
  const devopsKwMatch = devopsKeywords.filter(k => allText.includes(k));
  if (devopsMatch.length >= 1 || devopsKwMatch.length >= 1) {
    const confidence = Math.min((devopsMatch.length * 10 + devopsKwMatch.length * 12 + 10), 95);
    careerPaths.push({
      title: 'DevOps Engineer',
      confidence,
      matchingSkills: [...devopsMatch.map(l => l.charAt(0).toUpperCase() + l.slice(1)), ...devopsKwMatch],
      missingSkills: ['Kubernetes', 'Terraform', 'AWS'].filter(s => !allText.includes(s.toLowerCase())),
      description: 'Bridge development and operations with automation, CI/CD, and infrastructure.',
      icon: '🔧',
    });
  }

  // Cybersecurity Analyst
  const secKeywords = ['security', 'phish', 'vulnerability', 'pentest', 'hack', 'crypto', 'encrypt', 'auth', 'firewall', 'scan'];
  const secKwMatch = secKeywords.filter(k => allText.includes(k));
  if (secKwMatch.length >= 1) {
    const confidence = Math.min((secKwMatch.length * 15 + 15), 95);
    careerPaths.push({
      title: 'Cybersecurity Analyst',
      confidence,
      matchingSkills: secKwMatch,
      missingSkills: ['OWASP', 'Penetration Testing', 'SOC'].filter(s => !allText.includes(s.toLowerCase())),
      description: 'Protect systems and data by identifying vulnerabilities and implementing security measures.',
      icon: '🛡️',
    });
  }

  // Mobile Developer
  const mobileLangs = ['swift', 'kotlin', 'dart', 'java', 'objective-c'];
  const mobileMatch = mobileLangs.filter(l => langNames.has(l));
  const mobileKeywords = ['android', 'ios', 'mobile', 'flutter', 'react-native', 'swift', 'kotlin'];
  const mobileKwMatch = mobileKeywords.filter(k => allText.includes(k));
  if (mobileMatch.length >= 1 || mobileKwMatch.length >= 1) {
    const confidence = Math.min((mobileMatch.length * 15 + mobileKwMatch.length * 10 + 10), 95);
    careerPaths.push({
      title: 'Mobile Developer',
      confidence,
      matchingSkills: [...mobileMatch.map(l => l.charAt(0).toUpperCase() + l.slice(1)), ...mobileKwMatch],
      missingSkills: ['Flutter', 'React Native', 'App Store Deployment'].filter(s => !allText.includes(s.toLowerCase())),
      description: 'Build native and cross-platform mobile applications.',
      icon: '📱',
    });
  }

  // Sort by confidence
  careerPaths.sort((a, b) => b.confidence - a.confidence);

  // Ensure at least 2 suggestions
  if (careerPaths.length === 0) {
    careerPaths.push({
      title: 'Software Developer',
      confidence: 50,
      matchingSkills: languages.languages.slice(0, 3).map(l => l.name),
      missingSkills: ['Version Control', 'Testing', 'CI/CD'],
      description: 'Build and maintain software applications across various domains.',
      icon: '💻',
    });
  }

  return {
    paths: careerPaths.slice(0, 5),
    primaryRecommendation: careerPaths[0]?.title || 'Software Developer',
  };
}
