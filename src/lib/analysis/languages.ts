import type { LanguageIntelligence, LanguageData } from '@/types/analysis';
import type { RepoLanguages } from '@/types/github';
import { getLanguageColor } from '@/lib/utils';

export function analyzeLanguages(
  repoLanguagesMap: Record<string, RepoLanguages>
): LanguageIntelligence {
  const languageTotals: Record<string, { bytes: number; repoCount: number }> = {};

  for (const [, languages] of Object.entries(repoLanguagesMap)) {
    for (const [lang, bytes] of Object.entries(languages)) {
      if (!languageTotals[lang]) {
        languageTotals[lang] = { bytes: 0, repoCount: 0 };
      }
      languageTotals[lang].bytes += bytes;
      languageTotals[lang].repoCount += 1;
    }
  }

  const totalBytes = Object.values(languageTotals).reduce((sum, l) => sum + l.bytes, 0);

  const languages: LanguageData[] = Object.entries(languageTotals)
    .map(([name, data]) => ({
      name,
      bytes: data.bytes,
      percentage: totalBytes > 0 ? Math.round((data.bytes / totalBytes) * 1000) / 10 : 0,
      color: getLanguageColor(name),
      repoCount: data.repoCount,
    }))
    .sort((a, b) => b.bytes - a.bytes);

  const totalLanguages = languages.length;
  const diversityScore = Math.min(totalLanguages / 8, 1);
  const primaryLanguage = languages[0]?.name || 'None';

  const insights = generateLanguageInsights(languages, totalLanguages, diversityScore);

  return {
    languages,
    totalLanguages,
    diversityScore,
    primaryLanguage,
    insights,
  };
}

function generateLanguageInsights(languages: LanguageData[], total: number, diversity: number): string[] {
  const insights: string[] = [];

  if (languages.length === 0) {
    insights.push('No language data available. Consider adding code to your repositories.');
    return insights;
  }

  // Primary language insight
  const top = languages[0];
  if (top.percentage > 60) {
    insights.push(`You are heavily focused on ${top.name} (${top.percentage}%). Consider diversifying to become more versatile.`);
  } else if (top.percentage > 30) {
    insights.push(`You are strongest in ${top.name} (${top.percentage}%), with a healthy spread across other languages.`);
  }

  // Top languages
  if (languages.length >= 2) {
    const topTwo = languages.slice(0, 2).map(l => l.name).join(' and ');
    insights.push(`Your primary stack revolves around ${topTwo}.`);
  }

  // Diversity
  if (diversity >= 0.8) {
    insights.push(`Excellent language diversity with ${total} languages! You are a polyglot developer.`);
  } else if (diversity >= 0.5) {
    insights.push(`Good diversity with ${total} languages. You are comfortable with multiple tech stacks.`);
  } else if (total < 3) {
    insights.push('Consider exploring more languages to broaden your skill set.');
  }

  // Specific suggestions
  const langNames = languages.map(l => l.name.toLowerCase());
  if (!langNames.includes('typescript') && langNames.includes('javascript')) {
    insights.push('Consider adding more TypeScript projects to demonstrate type-safe development.');
  }
  if (!langNames.includes('python') && !langNames.includes('javascript') && !langNames.includes('typescript')) {
    insights.push('Consider learning Python or JavaScript — they are among the most in-demand languages.');
  }
  if (langNames.includes('python') && !langNames.includes('jupyter notebook')) {
    insights.push('If you are interested in data science, consider adding Jupyter Notebook projects.');
  }

  return insights.slice(0, 5);
}
