'use client';

import { motion } from 'motion/react';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import type { ResumeIntelligence as ResumeIntelligenceType } from '@/types/analysis';

interface Props {
  data: ResumeIntelligenceType;
}

export default function ResumeIntelligence({ data }: Props) {
  return (
    <section id="resume">
      <SectionHeader
        title="Resume Insights"
        description="Key strengths, risks, and project-specific advice extracted from your GitHub activity."
      />

      <GlassCard className="mb-4">
        <p className="text-[10px] uppercase tracking-wider font-semibold text-[#52525B] mb-2">Summary</p>
        <p className="text-sm text-[#EDEDED] leading-relaxed border-l-2 border-[#222] pl-3 py-0.5">
          {data.summary}
        </p>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-[#10B981] flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#10B981]" />
            Strengths
          </p>
          {data.strengths.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <GlassCard className="p-4" hover={true}>
                <div className="flex items-start gap-2.5">
                  <span className="text-base opacity-70 mt-0.5">{s.icon}</span>
                  <div>
                    <h4 className="text-xs font-semibold text-white tracking-tight mb-0.5">{s.title}</h4>
                    <p className="text-[11px] text-[#71717A] leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="space-y-3">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-[#F59E0B] flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-[#F59E0B]" />
            Growth Areas
          </p>
          {data.weaknesses.map((w, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <GlassCard className="p-4" hover={true}>
                <div className="flex items-start gap-2.5">
                  <span className="text-base opacity-70 mt-0.5">{w.icon}</span>
                  <div>
                    <h4 className="text-xs font-semibold text-white tracking-tight mb-0.5">{w.title}</h4>
                    <p className="text-[11px] text-[#71717A] leading-relaxed">{w.description}</p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}

          {data.suggestions.length > 0 && (
            <div className="pt-3 mt-3 border-t border-[#1A1A1A]">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[#52525B] mb-2">Project Advice</p>
              <ul className="space-y-1.5">
                {data.suggestions.slice(0, 3).map((s, i) => (
                  <li key={i} className="text-[11px] text-[#71717A] flex gap-1.5">
                    <span className="text-[#333] mt-px">→</span>
                    <span><strong className="text-[#A1A1AA] font-medium">{s.repo}</strong>: {s.suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
