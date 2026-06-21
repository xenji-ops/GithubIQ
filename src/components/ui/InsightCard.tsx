import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface InsightCardProps {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  icon?: string;
  action?: ReactNode;
  className?: string;
}

export default function InsightCard({
  type,
  title,
  description,
  icon,
  action,
  className,
}: InsightCardProps) {
  const styles = {
    success: 'bg-[#10B981]/10 border-[#10B981]/20 text-[#10B981]',
    warning: 'bg-[#F59E0B]/10 border-[#F59E0B]/20 text-[#F59E0B]',
    info: 'bg-[#3B82F6]/10 border-[#3B82F6]/20 text-[#3B82F6]',
  };

  const defaultIcons = {
    success: '✓',
    warning: '!',
    info: 'i',
  };

  return (
    <div className={cn('p-3 rounded-lg border flex gap-2.5', styles[type], className)}>
      <div className="shrink-0 mt-0.5">
        <div className={cn(
          'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border',
          type === 'success' ? 'border-[#10B981]/30 bg-[#10B981]/10' :
          type === 'warning' ? 'border-[#F59E0B]/30 bg-[#F59E0B]/10' :
          'border-[#3B82F6]/30 bg-[#3B82F6]/10'
        )}>
          {icon || defaultIcons[type]}
        </div>
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="text-sm font-semibold tracking-tight text-white">{title}</h4>
        <p className="text-xs leading-relaxed opacity-90">{description}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
