import { cn } from '@/lib/utils';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'info';

interface BadgeProps {
  tone?: BadgeTone;
  label: string;
  className?: string;
}

const toneStyles: Record<BadgeTone, string> = {
  neutral: 'bg-neutral-100 text-neutral-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  info: 'bg-blue-100 text-blue-700',
};

export function Badge({ tone = 'neutral', label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        toneStyles[tone],
        className
      )}
    >
      {label}
    </span>
  );
}
