import { Button } from '@/components/ui/button';
import { formatCurrencyFromCents } from '@/lib/formatters';
import type { ShiftWithApplications } from '@/data/shifts';
import { ShiftCard } from './shift-card';

interface UpcomingShiftCardProps {
  shift: ShiftWithApplications;
}

export function UpcomingShiftCard({ shift }: UpcomingShiftCardProps) {
  return (
    <ShiftCard
      shift={shift}
      status={{ label: 'Confirmed', tone: 'success' }}
      headerAction={
        <span className="text-sm font-semibold text-blue-600">
          {formatCurrencyFromCents(shift.hourlyRateCents)}/hr
        </span>
      }
      footer={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button variant="secondary" size="sm">
            Message
          </Button>
        </div>
      }
    />
  );
}
