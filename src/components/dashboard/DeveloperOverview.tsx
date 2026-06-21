'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import GlassCard from '@/components/ui/GlassCard';
import type { GitHubUser, GitHubOrg } from '@/types/github';

interface Props {
  user: GitHubUser;
  orgs: GitHubOrg[];
}

export default function DeveloperOverview({ user, orgs }: Props) {
  return (
    <section id="overview" className="scroll-mt-24">
      <GlassCard className="overflow-hidden relative">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="shrink-0 relative group"
          >
            {/* Radial gradient glow on hover */}
            <div className="absolute -inset-3 rounded-xl bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-lg overflow-hidden border border-[#333] bg-[#111] relative">
              <Image src={user.avatar_url} alt={user.login} width={112} height={112} className="object-cover" priority />
            </div>
          </motion.div>

          <div className="flex-1 w-full space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                  {user.name || user.login}
                </motion.h2>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex items-center gap-3 mt-2 text-sm font-mono text-[#71717A]">
                  <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@{user.login}</a>
                  <span>·</span>
                  <span>Joined {new Date(user.created_at).getFullYear()}</span>
                </motion.div>
              </div>
              <motion.a initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} href={user.html_url} target="_blank" rel="noopener noreferrer" className="btn-secondary whitespace-nowrap text-xs py-2 px-4 h-fit">
                View GitHub
              </motion.a>
            </div>

            {user.bio && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-sm text-[#A1A1AA] max-w-2xl leading-relaxed">
                {user.bio}
              </motion.p>
            )}

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex flex-wrap gap-x-6 gap-y-3 pt-2">
              {[
                { icon: '📍', text: user.location, show: !!user.location },
                { icon: '🏢', text: user.company, show: !!user.company },
                { icon: '🔗', text: user.blog, show: !!user.blog },
                { icon: '𝕏', text: user.twitter_username ? `@${user.twitter_username}` : null, show: !!user.twitter_username },
              ].filter(i => i.show).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#71717A]">
                  <span className="opacity-70">{item.icon}</span>
                  <span className="truncate max-w-[200px]">{item.text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 mt-3 border-t border-[#222]">
              {[
                { label: 'Public Repos', value: user.public_repos },
                { label: 'Followers', value: user.followers },
                { label: 'Following', value: user.following },
                { label: 'Public Gists', value: user.public_gists },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-[10px] text-[#71717A] uppercase tracking-wider font-semibold mb-1">{stat.label}</p>
                  <p className="text-xl font-bold tracking-tight text-white">{stat.value}</p>
                </div>
              ))}
            </motion.div>

            {orgs.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="pt-3 border-t border-[#222]">
                <p className="text-[10px] text-[#71717A] uppercase tracking-wider font-semibold mb-3">Organizations</p>
                <div className="flex flex-wrap gap-2">
                  {orgs.map(org => (
                    <div key={org.id} className="w-8 h-8 rounded border border-[#333] bg-[#111] overflow-hidden" title={org.login}>
                      <Image src={org.avatar_url} alt={org.login} width={32} height={32} />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
