export function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toString();
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function calculateAccountAge(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const years = now.getFullYear() - created.getFullYear();
  const months = now.getMonth() - created.getMonth();
  const totalMonths = years * 12 + months;
  if (totalMonths < 12) return `${totalMonths} months`;
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  return m > 0 ? `${y}y ${m}m` : `${y} years`;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    Swift: '#F05138',
    Kotlin: '#A97BFF',
    Dart: '#00B4AB',
    Scala: '#c22d40',
    Shell: '#89e051',
    HTML: '#e34c26',
    CSS: '#563d7c',
    SCSS: '#c6538c',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    Lua: '#000080',
    R: '#198CE7',
    MATLAB: '#e16737',
    Haskell: '#5e5086',
    Elixir: '#6e4a7e',
    Clojure: '#db5855',
    Jupyter: '#DA5B0B',
    'Jupyter Notebook': '#DA5B0B',
    Dockerfile: '#384d54',
    Makefile: '#427819',
    PowerShell: '#012456',
    Perl: '#0298c3',
    Objective: '#438eff',
    Assembly: '#6E4C13',
  };
  return colors[language] || '#8b949e';
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#FFFFFF'; // Expert
  if (score >= 60) return '#10B981'; // Advanced
  if (score >= 40) return '#F59E0B'; // Intermediate
  return '#EF4444'; // Beginner
}

export function getScoreGradient(score: number): [string, string] {
  // We use solid colors in the redesign, but returning a minimal array for compatibility
  if (score >= 80) return ['#FFFFFF', '#A1A1AA'];
  if (score >= 60) return ['#10B981', '#059669'];
  if (score >= 40) return ['#F59E0B', '#D97706'];
  return ['#EF4444', '#DC2626'];
}
