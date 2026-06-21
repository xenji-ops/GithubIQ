'use client';

import { motion } from 'motion/react';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import type { CareerRecommendations as CareerRecommendationsType } from '@/types/analysis';

interface Props {
  data: CareerRecommendationsType;
}

export default function CareerRecommendations({ data }: Props) {
  return (
    <section id="career">
      <SectionHeader
        title="Career Match"
        description="Skill distribution mapped against industry engineering roles."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.paths.map((path, i) => (
          <motion.div
            key={path.title}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className="h-full"
          >
            <GlassCard className={`h-full ${i === 0 ? 'border-[#333] bg-[#0F0F0F]' : ''}`} hover={true}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base opacity-70">{path.icon}</span>
                  <h3 className="text-xs font-semibold text-white tracking-tight">{path.title}</h3>
                </div>
                {i === 0 && (
                  <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-white text-black font-semibold rounded">
                    Best
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex-1 h-1 rounded-full bg-[#111] overflow-hidden">
                  <motion.div className="h-full rounded-full bg-[#EDEDED]" initial={{ width: 0 }} whileInView={{ width: `${path.confidence}%` }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 + i * 0.04 }} />
                </div>
                <span className="text-[11px] font-mono text-[#71717A]">{path.confidence}%</span>
              </div>

              <p className="text-[11px] text-[#52525B] mb-3 leading-relaxed line-clamp-2">{path.description}</p>

              {path.matchingSkills.length > 0 && (
                <div className="mb-2.5">
                  <p className="text-[9px] uppercase tracking-wider font-semibold text-[#3F3F46] mb-1.5">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {path.matchingSkills.slice(0, 4).map((skill) => (
                      <span key={skill} className="px-1.5 py-0.5 rounded text-[10px] bg-[#111] text-[#71717A] border border-[#1A1A1A]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {path.missingSkills.length > 0 && (
                <div>
                  <p className="text-[9px] uppercase tracking-wider font-semibold text-[#3F3F46] mb-1.5">Learn</p>
                  <div className="flex flex-wrap gap-1">
                    {path.missingSkills.slice(0, 3).map((skill) => (
                      <span key={skill} className="px-1.5 py-0.5 rounded text-[10px] text-[#52525B] border border-[#1A1A1A] border-dashed">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
