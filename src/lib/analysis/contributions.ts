import type { ContributionIntelligence } from '@/types/analysis';
import type { GitHubEvent, ContributionCalendar, GitHubRepo } from '@/types/github';

export function analyzeContributions(
  events: GitHubEvent[],
  calendar: ContributionCalendar | null,
  repos: GitHubRepo[]
): ContributionIntelligence {
  // Build heatmap from calendar or events
  const heatmapData: { date: string; count: number; level: number }[] = [];
  const monthlyMap: Record<string, number> = {};
  const weekdayMap: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let totalContributions = 0;
  let activeDays = 0;
  let longestStreak = 0;
  let currentStreak = 0;
  let tempStreak = 0;

  if (calendar) {
    totalContributions = calendar.totalContributions;
    for (const week of calendar.weeks) {
      for (const day of week.contributionDays) {
        const count = day.contributionCount;
        const level = count === 0 ? 0 : count <= 3 ? 1 : count <= 6 ? 2 : count <= 9 ? 3 : 4;
        heatmapData.push({ date: day.date, count, level });

        if (count > 0) {
          activeDays++;
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }

        const d = new Date(day.date);
        const monthKey = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + count;
        weekdayMap[dayNames[d.getDay()]] += count;
      }
    }
    // Current streak from the end
    const allDays = calendar.weeks.flatMap(w => w.contributionDays).reverse();
    currentStreak = 0;
    for (const day of allDays) {
      if (day.contributionCount > 0) currentStreak++;
      else break;
    }
  } else {
    // Fallback: use events and repo push dates
    const eventDates: Record<string, number> = {};
    for (const event of events) {
      const dateStr = event.created_at.split('T')[0];
      eventDates[dateStr] = (eventDates[dateStr] || 0) + 1;
    }

    // Also count recent repo pushes
    for (const repo of repos) {
      if (repo.pushed_at) {
        const dateStr = repo.pushed_at.split('T')[0];
        eventDates[dateStr] = (eventDates[dateStr] || 0) + 1;
      }
    }

    // Generate heatmap for last 365 days
    const now = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = eventDates[dateStr] || 0;
      const level = count === 0 ? 0 : count <= 3 ? 1 : count <= 6 ? 2 : count <= 9 ? 3 : 4;
      heatmapData.push({ date: dateStr, count, level });
      totalContributions += count;
      if (count > 0) {
        activeDays++;
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }

      const monthKey = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + count;
      weekdayMap[dayNames[d.getDay()]] += count;
    }

    currentStreak = 0;
    for (let i = heatmapData.length - 1; i >= 0; i--) {
      if (heatmapData[i].count > 0) currentStreak++;
      else break;
    }
  }

  const monthlyActivity = Object.entries(monthlyMap).map(([month, contributions]) => ({ month, contributions }));
  const weekdayActivity = dayNames.map(day => ({ day, contributions: weekdayMap[day] }));

  const mostActiveDay = weekdayActivity.reduce((a, b) => a.contributions > b.contributions ? a : b).day;
  const mostActiveMonth = monthlyActivity.length > 0
    ? monthlyActivity.reduce((a, b) => a.contributions > b.contributions ? a : b).month
    : 'N/A';

  const averagePerDay = activeDays > 0 ? Math.round((totalContributions / 365) * 10) / 10 : 0;
  const averagePerWeek = Math.round(averagePerDay * 7 * 10) / 10;

  // Determine archetype
  const { archetype, archetypeDescription, activityPattern } = determineArchetype(
    activeDays, longestStreak, averagePerDay, totalContributions, weekdayActivity
  );

  const insights = generateContributionInsights(
    totalContributions, activeDays, longestStreak, currentStreak, archetype, averagePerWeek
  );

  return {
    totalContributions,
    activeDays,
    longestStreak,
    currentStreak,
    averagePerDay,
    averagePerWeek,
    mostActiveDay,
    mostActiveMonth,
    activityPattern,
    archetype,
    archetypeDescription,
    insights,
    monthlyActivity,
    weekdayActivity,
    heatmapData,
  };
}

function determineArchetype(
  activeDays: number,
  longestStreak: number,
  avgPerDay: number,
  total: number,
  weekdayActivity: { day: string; contributions: number }[]
): { archetype: string; archetypeDescription: string; activityPattern: string } {
  const weekendContribs = (weekdayActivity.find(d => d.day === 'Sat')?.contributions || 0) +
    (weekdayActivity.find(d => d.day === 'Sun')?.contributions || 0);
  const weekdayContribs = weekdayActivity
    .filter(d => d.day !== 'Sat' && d.day !== 'Sun')
    .reduce((sum, d) => sum + d.contributions, 0);
  const weekendRatio = total > 0 ? weekendContribs / total : 0;

  if (avgPerDay >= 3 && longestStreak >= 30) {
    return {
      archetype: 'Coding Machine',
      archetypeDescription: 'Extremely consistent with high daily output. You live and breathe code.',
      activityPattern: 'High frequency, high consistency',
    };
  }
  if (longestStreak >= 14 && activeDays >= 150) {
    return {
      archetype: 'Consistent Contributor',
      archetypeDescription: 'You maintain a steady coding habit with regular contributions throughout the year.',
      activityPattern: 'Steady and reliable',
    };
  }
  if (weekendRatio > 0.5) {
    return {
      archetype: 'Weekend Warrior',
      archetypeDescription: 'Most of your coding happens on weekends. You likely have a day job or studies.',
      activityPattern: 'Weekend-heavy',
    };
  }
  if (total > 100 && activeDays < 60) {
    return {
      archetype: 'Sprint Developer',
      archetypeDescription: 'You code in intense bursts with gaps in between. Project-focused approach.',
      activityPattern: 'Burst activity',
    };
  }
  if (weekdayContribs > weekendContribs * 3) {
    return {
      archetype: 'Professional Coder',
      archetypeDescription: 'Your contributions are primarily during weekdays, suggesting professional development work.',
      activityPattern: 'Weekday-focused',
    };
  }
  if (total < 50) {
    return {
      archetype: 'Emerging Developer',
      archetypeDescription: 'You are at the beginning of your coding journey. Keep building and learning!',
      activityPattern: 'Getting started',
    };
  }
  return {
    archetype: 'Project-Focused Developer',
    archetypeDescription: 'You contribute when working on specific projects, with natural breaks between them.',
    activityPattern: 'Project-driven',
  };
}

function generateContributionInsights(
  total: number, activeDays: number, longestStreak: number,
  currentStreak: number, archetype: string, avgPerWeek: number
): string[] {
  const insights: string[] = [];

  if (total > 500) {
    insights.push(`Impressive! ${total} contributions show strong dedication to coding.`);
  } else if (total > 100) {
    insights.push(`${total} contributions demonstrate active engagement with development.`);
  } else {
    insights.push(`With ${total} contributions, there's room to increase your coding activity.`);
  }

  if (longestStreak >= 30) {
    insights.push(`Your ${longestStreak}-day streak shows exceptional consistency and discipline.`);
  } else if (longestStreak >= 7) {
    insights.push(`A ${longestStreak}-day streak is a good start. Try to build longer streaks for better visibility.`);
  }

  if (currentStreak > 0) {
    insights.push(`You're on a ${currentStreak}-day active streak right now. Keep it going!`);
  }

  if (avgPerWeek < 3) {
    insights.push('Try to contribute at least 3-5 times per week for better GitHub visibility.');
  }

  insights.push(`Your coding style aligns with the "${archetype}" pattern.`);

  return insights.slice(0, 5);
}
