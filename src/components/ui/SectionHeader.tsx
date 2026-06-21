import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: string;
  badge?: string;
  className?: string;
  children?: ReactNode;
}

export default function SectionHeader({ title, description, badge, className, children }: SectionHeaderProps) {
  return (
    <div className={cn('mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4', className)}>
      <div className="space-y-1">
        {badge && <span className="inline-block px-2 py-1 rounded text-[10px] font-medium tracking-wider uppercase bg-[#111] text-[#A1A1AA] border border-[#222]">{badge}</span>}
        <h2 className="text-lg font-semibold tracking-tight text-white">
          {title}
        </h2>
        {description && <p className="text-sm text-[#71717A] max-w-2xl leading-relaxed">{description}</p>}
      </div>
      {children && <div>{children}</div>}
    </div>
  );
}
