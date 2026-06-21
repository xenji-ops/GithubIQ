'use client';

import { motion } from 'motion/react';
import SectionHeader from '@/components/ui/SectionHeader';
import type { GrowthRoadmap as GrowthRoadmapType } from '@/types/analysis';

interface Props {
  data: GrowthRoadmapType;
}

export default function GrowthRoadmap({ data }: Props) {
  return (
    <section id="roadmap">
      <SectionHeader
        title="Growth Roadmap"
        description={`Phased plan optimized for ${data.focus.toLowerCase()} development.`}
      />

      <div className="space-y-3">
        {data.phases.map((phase, i) => (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="ui-card p-4 hover:border-[#2A2A2A] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[10px] font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="text-sm font-semibold tracking-tight text-white">{phase.phase}</h3>
              </div>
              <span className="text-[10px] font-mono text-[#52525B] px-2 py-0.5 bg-[#0F0F0F] border border-[#1A1A1A] rounded">
                {phase.timeframe}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
              {phase.goals.map((goal, j) => (
                <div key={j} className="flex items-start gap-2">
                  <div className="mt-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${
                      goal.priority === 'high' ? 'bg-[#EF4444]' :
                      goal.priority === 'medium' ? 'bg-[#F59E0B]' : 'bg-[#3B82F6]'
                    }`} />
                  </div>
                  <div>
                    <p className="text-[11px] text-[#A1A1AA] leading-relaxed">{goal.task}</p>
                    <p className="text-[9px] text-[#3F3F46] uppercase tracking-wider">{goal.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
