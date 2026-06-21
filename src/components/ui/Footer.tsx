'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#111] bg-[#000] pt-20 pb-10">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 group mb-4">
              <div className="w-6 h-6 rounded-[6px] bg-white flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-base font-bold tracking-tight text-[#EDEDED]">
                GitHubIQ
              </span>
            </Link>
            <p className="text-sm text-[#71717A] max-w-xs leading-relaxed">
              Engineering intelligence, designed for professionals. Discover how recruiters and engineering leaders see your GitHub.
            </p>
          </div>

          {/* Links Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white tracking-wide">Platform</h3>
            <Link href="/" className="text-sm text-[#71717A] hover:text-[#EDEDED] transition-colors">Analyzer</Link>
            <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer" className="text-sm text-[#71717A] hover:text-[#EDEDED] transition-colors">Digital Heroes</a>
          </div>

          {/* Connect Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-white tracking-wide">Connect</h3>
            <span className="text-sm text-[#71717A]">Adit Aggarwal</span>
            <a href="mailto:androgamer621@gmail.com" className="text-sm text-[#71717A] hover:text-[#EDEDED] transition-colors">
              androgamer621@gmail.com
            </a>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-8 border-t border-[#111] flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-[#52525B]">
            © {currentYear} GitHubIQ. All rights reserved.
          </span>
          <div className="flex gap-4">
            <span className="text-xs text-[#333] hover:text-[#555] transition-colors cursor-pointer">Privacy Policy</span>
            <span className="text-xs text-[#333] hover:text-[#555] transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
