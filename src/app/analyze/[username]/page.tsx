'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'motion/react';
import Link from 'next/link';
import DeveloperOverview from '@/components/dashboard/DeveloperOverview';
import DeveloperScore from '@/components/dashboard/DeveloperScore';
import LanguageIntelligence from '@/components/dashboard/LanguageIntelligence';
import RepoQuality from '@/components/dashboard/RepoQuality';
import ContributionIntelligence from '@/components/dashboard/ContributionIntelligence';
import PortfolioReadiness from '@/components/dashboard/PortfolioReadiness';
import ResumeIntelligence from '@/components/dashboard/ResumeIntelligence';
import CareerRecommendations from '@/components/dashboard/CareerRecommendations';
import GrowthRoadmap from '@/components/dashboard/GrowthRoadmap';
import ExportShare from '@/components/dashboard/ExportShare';
import { SkeletonDashboard } from '@/components/ui/SkeletonLoader';
import type { FullAnalysisReport } from '@/types/analysis';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'score', label: 'Score' },
  { id: 'languages', label: 'Languages' },
  { id: 'repos', label: 'Repos' },
  { id: 'contributions', label: 'Activity' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'resume', label: 'Resume' },
  { id: 'career', label: 'Career' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'export', label: 'Export' },
];

export default function AnalyzePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const username = params.username as string;
  const token = searchParams.get('token');
  const [report, setReport] = useState<FullAnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    async function fetchAnalysis() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: decodeURIComponent(username), token: token || undefined }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'Analysis failed');
          return;
        }
        setReport(data);
      } catch {
        setError('Failed to connect. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, [username, token]);

  // Intersection observer for active section
  useEffect(() => {
    if (!report) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean);
    sections.forEach((section) => observer.observe(section!));

    return () => observer.disconnect();
  }, [report]);

  if (loading) {
    return (
      <div className="container-custom py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-4 h-4 border-2 border-[#333] border-t-white rounded-full animate-spin" />
          <div>
            <p className="text-sm font-medium text-white">Analyzing @{decodeURIComponent(username)}</p>
            <p className="text-xs text-[#52525B]">Fetching profile, repositories, and activity data</p>
          </div>
        </div>
        <SkeletonDashboard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-16 flex flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="ui-card p-8 max-w-sm w-full"
        >
          <div className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center mx-auto mb-4 text-lg">✕</div>
          <h2 className="text-base font-semibold text-white mb-1.5">Analysis Failed</h2>
          <p className="text-sm text-[#71717A] mb-6">{error}</p>
          <div className="flex gap-2 justify-center">
            <button onClick={() => window.location.reload()} className="btn-primary text-xs py-2 px-5">
              Try Again
            </button>
            <Link href="/" className="btn-secondary text-xs py-2 px-5 text-center">
              Go Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="relative bg-[#000] min-h-screen noise-bg">
      {/* Section Navigation — Sidebar */}
      <nav className="hidden xl:block fixed left-6 top-1/2 -translate-y-1/2 z-40">
        <div className="flex flex-col gap-1 bg-[#0A0A0A]/80 backdrop-blur-md border border-[#222] rounded-xl p-2 shadow-xl shadow-black/50">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                activeSection === item.id
                  ? 'bg-white text-black'
                  : 'text-[#888] hover:text-[#EDEDED] hover:bg-[#1A1A1A]'
              }`}
              title={item.label}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Dashboard Content */}
      <div id="dashboard-content" className="container-custom py-6 xl:pl-20 2xl:pl-40 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between pb-4 border-b border-[#1A1A1A]"
        >
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center justify-center w-7 h-7 rounded-md border border-[#222] hover:bg-[#111] hover:border-[#333] transition-all text-[#71717A]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </Link>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-white">
                {report.user.name || report.user.login}
              </h1>
              <p className="text-[11px] text-[#52525B] font-mono">
                Report generated {new Date(report.generatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Sections */}
        <DeveloperOverview user={report.user} orgs={report.orgs} />
        <DeveloperScore score={report.score} />
        <LanguageIntelligence data={report.languages} />
        <RepoQuality data={report.repoQuality} />
        <ContributionIntelligence data={report.contributions} />
        <PortfolioReadiness data={report.portfolio} />
        <ResumeIntelligence data={report.resume} />
        <CareerRecommendations data={report.career} />
        <GrowthRoadmap data={report.roadmap} />
        <ExportShare report={report} />
      </div>
    </div>
  );
}
