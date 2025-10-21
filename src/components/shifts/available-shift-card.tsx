import { ReactNode } from 'react';
import { formatCurrencyFromCents } from '@/lib/formatters';
import type { ShiftWithApplications } from '@/data/shifts';
import { ShiftCard } from './shift-card';

interface AvailableShiftCardProps {
  shift: ShiftWithApplications;
  actions: ReactNode;
  accent?: 'default' | 'muted';
}

export function AvailableShiftCard({ shift, actions, accent = 'default' }: AvailableShiftCardProps) {
  return (
    <ShiftCard
      shift={shift}
      accent={accent}
      headerAction={
        <span className="text-sm font-semibold text-blue-600">
          {formatCurrencyFromCents(shift.hourlyRateCents)}/hr
        </span>
      }
      footer={actions}
    />
  );
}
