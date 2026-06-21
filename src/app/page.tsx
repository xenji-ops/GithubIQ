'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';

export default function HomePage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = username.trim().replace(/^@/, '');
    if (!clean) return;
    setLoading(true);
    router.push(`/analyze/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="bg-[#000] min-h-screen text-[#EDEDED] font-sans noise-bg">
      {/* Hero Section */}
      <section className="relative">
        <div className="radial-glow absolute inset-0 pointer-events-none" />
        <div className="container-custom pt-32 pb-32 md:pt-40 md:pb-40 relative flex justify-center">
          <div className="max-w-3xl flex flex-col items-center text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-4xl md:text-6xl font-bold tracking-[-0.04em] leading-[1.08] mb-5"
            >
              Discover how recruiters<br className="hidden md:block" />
              see your GitHub.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-base md:text-lg text-[#71717A] max-w-md mb-8 leading-relaxed"
            >
              Analyze repository quality, contribution patterns, language diversity, and career fit — all from a single GitHub username.
            </motion.p>

            <motion.form 
              onSubmit={handleAnalyze}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col sm:flex-row gap-2 max-w-md w-full"
            >
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525B] font-mono text-[13px] select-none">github.com/</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="w-full bg-[#0A0A0A] border border-[#222] text-white pl-[100px] pr-4 py-2.5 rounded-lg text-sm transition-all focus:border-[#444] focus:shadow-[0_0_0_3px_rgba(255,255,255,0.03)] outline-none placeholder:text-[#3F3F46]"
                  id="github-username-input"
                />
              </div>
              <button
                type="submit"
                disabled={!username.trim() || loading}
                className="btn-primary whitespace-nowrap"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing…
                  </>
                ) : 'Analyze Profile'}
              </button>
            </motion.form>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-4 flex items-center gap-3 text-xs text-[#52525B]"
            >
              <span>Try:</span>
              {['torvalds', 'gaearon', 'sindresorhus'].map((name) => (
                <button
                  key={name}
                  onClick={() => setUsername(name)}
                  className="font-mono text-[#71717A] hover:text-white transition-colors"
                >
                  {name}
                </button>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features — Outcome-focused */}
      <section className="border-t border-[#111]">
        <div className="container-custom section-py">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left intro */}
            <div className="lg:col-span-4 lg:pr-4 text-center lg:text-left">
              <h2 className="text-2xl font-bold tracking-tight mb-3 text-white">
                Beyond star counts.
              </h2>
              <p className="text-sm text-[#71717A] leading-relaxed">
                We parse your entire public profile — repos, commits, languages, and activity rhythms — to generate insights that actually matter for your career.
              </p>
            </div>
            
            {/* Feature grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'Evaluate Repository Quality',
                  desc: 'Scores each repo on documentation, licensing, community signals, and maintenance activity.',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  ),
                },
                {
                  title: 'Find Your Developer Archetype',
                  desc: 'Streak analysis, active days, and commit cadence reveal how you actually work.',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 20V10M12 20V4M6 20v-6" />
                    </svg>
                  ),
                },
                {
                  title: 'Discover Your Strongest Projects',
                  desc: 'Identifies hidden gems and top projects recruiters would notice first.',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ),
                },
                {
                  title: 'Generate Career Insights',
                  desc: 'Maps your skills to engineering roles with confidence scores and growth paths.',
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ),
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl p-6 md:p-8 group hover:bg-[#0F0F0F] transition-all hover:border-[#333]"
                >
                  <div className="w-8 h-8 rounded-md bg-[#111] border border-[#1A1A1A] flex items-center justify-center mb-4 text-[#71717A] group-hover:text-white group-hover:border-[#333] transition-all mx-auto lg:mx-0">
                    {feature.icon}
                  </div>
                  <h3 className="text-[15px] font-semibold text-white mb-1.5 tracking-tight text-center lg:text-left">{feature.title}</h3>
                  <p className="text-[13px] text-[#52525B] leading-relaxed text-center lg:text-left">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="border-t border-[#111]">
        <div className="container-custom section-py">
          <div className="text-center max-w-lg mx-auto mb-12">
            <h2 className="text-2xl font-bold tracking-tight mb-3">10 sections. One report.</h2>
            <p className="text-sm text-[#71717A]">Every analysis generates a comprehensive profile covering all aspects of your engineering presence.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              'Developer Score',
              'Language Stack',
              'Repo Quality',
              'Activity Patterns',
              'Portfolio Audit',
              'Resume Builder',
              'Career Matching',
              'Growth Roadmap',
              'Contribution Map',
              'PDF Export',
            ].map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="px-4 py-3.5 rounded-lg bg-[#0A0A0A] border border-[#1A1A1A] text-center text-[13px] text-[#A1A1AA] font-medium hover:border-[#333] hover:text-white transition-all cursor-default"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[#111]">
        <div className="container-custom section-py">
          <div className="flex flex-col items-center text-center max-w-md mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Ready to see your profile?</h2>
            <p className="text-sm text-[#71717A] mb-6">Takes 15 seconds. Completely free.</p>
            <button
              onClick={() => {
                const input = document.getElementById('github-username-input');
                input?.focus();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="btn-primary"
            >
              Start Analysis
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
