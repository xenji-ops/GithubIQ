'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  id?: string;
}

export default function GlassCard({ children, className, hover = true, delay = 0, id }: GlassCardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        'ui-card p-5 transition-all duration-300',
        hover && 'hover:border-[#333] hover:-translate-y-px',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
