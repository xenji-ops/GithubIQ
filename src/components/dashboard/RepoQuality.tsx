'use client';

import { motion } from 'motion/react';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import type { RepoQualityAnalysis, RepoQualityScore } from '@/types/analysis';

interface Props {
  data: RepoQualityAnalysis;
}

function RepoCard({ repo, label }: { repo: RepoQualityScore; label?: string }) {
  return (
    <GlassCard className="h-full flex flex-col" hover={true}>
      <div className="flex justify-between items-start mb-2">
        <div>
          {label && (
            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase mb-1.5 bg-[#111] text-[#71717A] border border-[#1A1A1A]">
              {label}
            </span>
          )}
          <h3 className="text-sm font-semibold tracking-tight text-white line-clamp-1">
            <a href={repo.repoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline underline-offset-4">
              {repo.repoName}
            </a>
          </h3>
        </div>
        <div className="text-right shrink-0 ml-2">
          <span className="text-lg font-bold text-white block leading-none">{repo.score}</span>
          <span className="text-[9px] text-[#52525B] uppercase tracking-widest">Score</span>
        </div>
      </div>

      <p className="text-xs text-[#71717A] line-clamp-2 mb-3 flex-1">
        {repo.description || 'No description provided.'}
      </p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-[#52525B] mb-3">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#555]" />
            {repo.language}
          </span>
        )}
        <span>★ {repo.stars}</span>
        <span>⑂ {repo.forks}</span>
      </div>

      <div className="space-y-1.5 border-t border-[#1A1A1A] pt-3">
        {repo.factors.slice(0, 3).map((factor, i) => (
          <div key={i} className="flex items-center justify-between text-[11px]">
            <span className="text-[#71717A] truncate pr-2">{factor.name}</span>
            <span className="font-mono text-[#52525B]">{factor.score}/{factor.maxScore}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export default function RepoQuality({ data }: Props) {
  if (!data.repos.length) return null;

  return (
    <section id="repos">
      <SectionHeader
        title="Repository Quality"
        description={`${data.repos.length} repositories analyzed · Average score: ${data.averageScore.toFixed(0)}/100`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {data.bestProject && (
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <RepoCard repo={data.bestProject} label="Top Quality" />
          </motion.div>
        )}
        {data.mostPopular && data.mostPopular.repoName !== data.bestProject?.repoName && (
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.06 }}>
            <RepoCard repo={data.mostPopular} label="Most Popular" />
          </motion.div>
        )}
        {data.hiddenGem && data.hiddenGem.repoName !== data.bestProject?.repoName && data.hiddenGem.repoName !== data.mostPopular?.repoName && (
          <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }}>
            <RepoCard repo={data.hiddenGem} label="Hidden Gem" />
          </motion.div>
        )}
      </div>

      {data.repos.length > 3 && (
        <GlassCard>
          <h3 className="text-sm font-semibold tracking-tight text-white mb-3">All Repositories</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1A1A1A]">
                  <th className="py-2 px-3 text-[10px] font-semibold text-[#52525B] uppercase tracking-wider">Repository</th>
                  <th className="py-2 px-3 text-[10px] font-semibold text-[#52525B] uppercase tracking-wider">Score</th>
                  <th className="py-2 px-3 text-[10px] font-semibold text-[#52525B] uppercase tracking-wider">Language</th>
                  <th className="py-2 px-3 text-[10px] font-semibold text-[#52525B] uppercase tracking-wider">Stars</th>
                  <th className="py-2 px-3 text-[10px] font-semibold text-[#52525B] uppercase tracking-wider">Updated</th>
                </tr>
              </thead>
              <tbody>
                {data.repos.map((repo) => (
                  <tr key={repo.repoName} className="border-b border-[#111] hover:bg-[#0F0F0F] transition-colors">
                    <td className="py-2 px-3">
                      <a href={repo.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-white hover:underline underline-offset-4 line-clamp-1">
                        {repo.repoName}
                      </a>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                        repo.score >= 80 ? 'bg-[#10B981]/8 text-[#10B981]' :
                        repo.score >= 60 ? 'bg-[#3B82F6]/8 text-[#3B82F6]' :
                        repo.score >= 40 ? 'bg-[#F59E0B]/8 text-[#F59E0B]' :
                        'bg-[#EF4444]/8 text-[#EF4444]'
                      }`}>
                        {repo.score}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[11px] text-[#71717A]">{repo.language || '—'}</td>
                    <td className="py-2 px-3 text-[11px] text-[#71717A]">{repo.stars}</td>
                    <td className="py-2 px-3 text-[11px] text-[#52525B] whitespace-nowrap">
                      {new Date(repo.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}
    </section>
  );
}
