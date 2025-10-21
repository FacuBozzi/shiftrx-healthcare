import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatShiftDateSummary, formatShiftTimeRange } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { ShiftWithApplications } from '@/data/shifts';

interface ShiftCardProps {
  shift: ShiftWithApplications;
  status?: {
    label: string;
    tone?: 'neutral' | 'success' | 'warning' | 'info';
  };
  footer?: ReactNode;
  headerAction?: ReactNode;
  accent?: 'default' | 'muted';
}

export function ShiftCard({ shift, status, footer, headerAction, accent = 'default' }: ShiftCardProps) {
  return (
    <Card
      className={cn(
        'flex h-full flex-col gap-4 border-neutral-200',
        accent === 'muted' && 'bg-blue-50/40 border-blue-100'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-neutral-900">{shift.title}</p>
          <div className="mt-2 space-y-2 text-sm text-neutral-600">
            <div className="flex items-center gap-2 text-neutral-500">
              <MapPinIcon className="h-4 w-4" />
              <span>{shift.facilityName}</span>
            </div>
            {shift.location && (
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="ml-6">{shift.location}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 text-sm text-neutral-500">
          {status ? <Badge tone={status.tone ?? 'neutral'} label={status.label} /> : null}
          {headerAction}
        </div>
      </div>

      <div className="space-y-3 rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600">
        <div className="flex items-center gap-2">
          <CalendarDaysIcon className="h-4 w-4 text-neutral-400" />
          <span>{formatShiftDateSummary(shift.startsAt, shift.endsAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4 text-neutral-400" />
          <span>{formatShiftTimeRange(shift.startsAt, shift.endsAt)}</span>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <Link href={`/shifts/${shift.id}`} className="text-sm font-medium text-blue-600 hover:underline">
          View details
        </Link>
        {footer}
      </div>
    </Card>
  );
}
