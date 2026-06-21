'use client';

import { motion } from 'motion/react';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import ScoreGauge from '@/components/ui/ScoreGauge';
import type { DeveloperScore as DeveloperScoreType } from '@/types/analysis';

interface Props {
  score: DeveloperScoreType;
}

export default function DeveloperScore({ score }: Props) {
  return (
    <section id="score">
      <SectionHeader
        title="Developer Intelligence Score"
        description="Multi-factor engineering assessment"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <GlassCard className="flex flex-col items-center justify-center text-center p-8">
          <ScoreGauge score={score.overall} size={200} />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4"
          >
            <span className={`inline-block px-3 py-1 rounded text-xs font-semibold tracking-wider uppercase border ${
              score.level === 'Expert' ? 'border-white text-white bg-white/10' :
              score.level === 'Advanced' ? 'border-[#10B981] text-[#10B981] bg-[#10B981]/10' :
              score.level === 'Intermediate' ? 'border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/10' :
              'border-[#EF4444] text-[#EF4444] bg-[#EF4444]/10'
            }`}>
              {score.level} Level
            </span>
          </motion.div>
        </GlassCard>

        <div className="md:col-span-2 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {score.factors.map((factor, i) => (
              <motion.div key={factor.name} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <GlassCard className="h-full p-4" hover={true}>
                  <div className="flex justify-between items-end mb-2">
                    <h4 className="text-sm font-semibold tracking-tight text-white">{factor.name}</h4>
                    <span className="text-xs font-mono text-[#A1A1AA]">{Math.round((factor.score / factor.maxScore) * 100)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#111] rounded-full overflow-hidden mb-2">
                    <motion.div className="h-full bg-white" initial={{ width: 0 }} whileInView={{ width: `${(factor.score / factor.maxScore) * 100}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 + i * 0.05, ease: 'easeOut' }} />
                  </div>
                  <p className="text-[11px] text-[#71717A] leading-relaxed line-clamp-2">{factor.details}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
