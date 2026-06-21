'use client';

import { motion } from 'motion/react';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import InsightCard from '@/components/ui/InsightCard';
import type { ContributionIntelligence as ContributionIntelligenceType } from '@/types/analysis';

interface Props {
  data: ContributionIntelligenceType;
}

export default function ContributionIntelligence({ data }: Props) {
  return (
    <section id="contributions">
      <SectionHeader
        title="Activity Patterns"
        description={`${data.archetype} — ${data.totalContributions.toLocaleString()} contributions across ${data.activeDays} active days.`}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Total', value: data.totalContributions.toLocaleString() },
          { label: 'Active Days', value: data.activeDays },
          { label: 'Best Streak', value: `${data.longestStreak}d` },
          { label: 'Current Streak', value: `${data.currentStreak}d` },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
            <div className="ui-card px-3 py-2.5">
              <p className="text-[11px] text-[#52525B] mb-0.5">{stat.label}</p>
              <p className="text-lg font-semibold tracking-tight text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2">
          <h3 className="text-sm font-semibold tracking-tight text-white mb-4">Contribution Map</h3>
          
          <div className="flex gap-[3px] overflow-x-auto pb-3 scrollbar-hide">
            {data.heatmapData.map((day, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-[2px] flex-shrink-0"
                style={{
                  backgroundColor: 
                    day.level === 0 ? '#111' :
                    day.level === 1 ? '#333' :
                    day.level === 2 ? '#666' :
                    day.level === 3 ? '#999' : '#FFF',
                }}
                title={`${day.date}: ${day.count} contributions`}
              />
            ))}
          </div>

          <div className="flex items-center justify-end gap-1.5 mt-2 text-[9px] text-[#52525B] uppercase tracking-wider">
            <span>Less</span>
            <div className="flex gap-0.5">
              {['#111','#333','#666','#999','#FFF'].map(c => (
                <div key={c} className="w-2 h-2 rounded-[2px]" style={{ backgroundColor: c }} />
              ))}
            </div>
            <span>More</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="ui-card p-3 text-center">
              <p className="text-[10px] text-[#52525B] uppercase tracking-wider mb-0.5">Most Active</p>
              <p className="text-sm font-semibold text-white">{data.mostActiveDay}</p>
            </div>
            <div className="ui-card p-3 text-center">
              <p className="text-[10px] text-[#52525B] uppercase tracking-wider mb-0.5">Avg / Week</p>
              <p className="text-sm font-semibold text-white">{data.averagePerWeek.toFixed(1)}</p>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-3">
          <GlassCard>
            <h3 className="text-sm font-semibold tracking-tight text-white mb-1.5">{data.archetype}</h3>
            <p className="text-xs text-[#71717A] leading-relaxed mb-3">{data.archetypeDescription}</p>
            <div className="h-1 w-full bg-[#111] rounded-full overflow-hidden">
              <motion.div className="h-full bg-white rounded-full" initial={{ width: 0 }} whileInView={{ width: '100%' }} viewport={{ once: true }} transition={{ duration: 0.8 }} />
            </div>
          </GlassCard>

          {data.insights.slice(0, 2).map((insight, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <InsightCard type="info" title="Insight" description={insight} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
