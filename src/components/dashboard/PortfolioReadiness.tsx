'use client';

import { motion } from 'motion/react';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import ScoreGauge from '@/components/ui/ScoreGauge';
import InsightCard from '@/components/ui/InsightCard';
import type { PortfolioReadiness as PortfolioReadinessType } from '@/types/analysis';

interface Props {
  data: PortfolioReadinessType;
}

export default function PortfolioReadiness({ data }: Props) {
  return (
    <section id="portfolio">
      <SectionHeader
        title="Portfolio Audit"
        description="Profile completeness assessment based on what recruiters and hiring managers look for."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="flex flex-col items-center justify-center text-center p-6">
          <ScoreGauge score={data.score} size={140} strokeWidth={8} />
          <h3 className="mt-4 text-sm font-semibold text-white tracking-tight">Readiness</h3>
          <p className="text-[11px] text-[#52525B] mt-1 max-w-[180px]">
            Based on 9 checks that recruiters evaluate.
          </p>
        </GlassCard>

        <div className="md:col-span-2 space-y-3">
          <GlassCard>
            <h3 className="text-sm font-semibold tracking-tight text-white mb-3">Checklist</h3>
            <div className="space-y-2">
              {data.checks.map((check, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-md bg-[#0F0F0F] border border-[#1A1A1A]">
                  <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    check.passed ? 'bg-[#10B981]/15 text-[#10B981]' : 'bg-[#EF4444]/15 text-[#EF4444]'
                  }`}>
                    {check.passed ? '✓' : '✕'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium ${check.passed ? 'text-[#A1A1AA]' : 'text-white'}`}>
                      {check.name}
                    </p>
                    {!check.passed && check.suggestion && (
                      <p className="text-[11px] text-[#52525B] mt-0.5 leading-relaxed">{check.suggestion}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {data.recommendations.length > 0 && (
            <div className="space-y-2">
              {data.recommendations.slice(0, 2).map((rec, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 6 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <InsightCard type="warning" title="Action" description={rec} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
