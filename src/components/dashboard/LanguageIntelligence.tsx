'use client';

import { motion } from 'motion/react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import InsightCard from '@/components/ui/InsightCard';
import type { LanguageIntelligence as LanguageIntelligenceType } from '@/types/analysis';

interface Props {
  data: LanguageIntelligenceType;
}

const COLORS = ['#FFFFFF', '#D4D4D8', '#A1A1AA', '#71717A', '#52525B', '#3F3F46', '#27272A', '#18181B'];

export default function LanguageIntelligence({ data }: Props) {
  const topLanguages = data.languages.slice(0, 6);
  const barData = data.languages.slice(0, 8);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="ui-card p-2.5 shadow-xl !bg-[#111]">
          <p className="text-xs font-semibold text-white">{payload[0].name}</p>
          <p className="text-[11px] text-[#71717A]">
            {payload[0].value.toFixed(1)}% · {payload[0].payload.repoCount} repos
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="languages">
      <SectionHeader
        title="Language Stack"
        description={`Primary: ${data.primaryLanguage} · ${data.totalLanguages} languages · Diversity: ${data.diversityScore}/100`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <GlassCard className="lg:col-span-2">
          <h3 className="text-sm font-semibold tracking-tight text-white mb-4">Distribution</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717A', fontSize: 11 }} 
                  width={80}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                <Bar dataKey="percentage" radius={[0, 3, 3, 0]} barSize={16}>
                  {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div className="space-y-3">
          <GlassCard>
            <h3 className="text-sm font-semibold tracking-tight text-white mb-3">Breakdown</h3>
            <div className="h-36 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topLanguages}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={58}
                    paddingAngle={2}
                    dataKey="percentage"
                    stroke="none"
                  >
                    {topLanguages.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold text-white">{data.languages[0]?.percentage.toFixed(0)}%</span>
              </div>
            </div>
          </GlassCard>

          {data.insights.slice(0, 2).map((insight, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: 6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <InsightCard type="info" title="Stack Insight" description={insight} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
