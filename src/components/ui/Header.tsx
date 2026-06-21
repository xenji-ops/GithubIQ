'use client';

import Link from 'next/link';
import { motion } from 'motion/react';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#1A1A1A] bg-[#000000]/90 backdrop-blur-lg"
    >
      <div className="w-full px-6 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-7 h-7 rounded-[6px] bg-white flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            GitHubIQ
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs text-[#71717A] hover:text-[#A1A1AA] transition-colors rounded-md hover:bg-[#111]"
          >
            GitHub
          </a>
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#A1A1AA] hover:text-white transition-colors rounded-md hover:bg-[#111]"
          >
            Built for Digital Heroes
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>
      </div>
    </motion.header>
  );
}
