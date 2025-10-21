import Link from 'next/link';
import { AvailableShiftCard } from '@/components/shifts/available-shift-card';
import { ShiftActions } from '@/components/shifts/shift-actions';
import { ShiftCard } from '@/components/shifts/shift-card';
import { Card } from '@/components/ui/card';
import { getActiveUserBundle } from '@/data/users';
import { getAllShiftsForUser } from '@/data/shifts';
import { formatCurrencyFromCents } from '@/lib/formatters';
import { cn } from '@/lib/utils';

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'OPEN' },
  { label: 'Hired', value: 'HIRED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export default async function ShiftsPage({
  searchParams,
}: {
  searchParams?: { status?: string };
}) {
  const { activeUser } = await getActiveUserBundle();
  const shifts = await getAllShiftsForUser(activeUser.id);

  const statusFilter = (searchParams?.status ?? 'all').toUpperCase();
  const filteredShifts =
    statusFilter === 'ALL'
      ? shifts
      : shifts.filter((shift) => shift.status === statusFilter);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">All shifts</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Browse and apply to open opportunities. Withdraw anytime before your application is reviewed.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filterOptions.map((option) => {
          const isActive = option.value.toUpperCase() === statusFilter;
          const href = option.value === 'all' ? '/shifts' : `/shifts?status=${option.value}`;
          return (
            <Link
              key={option.value}
              href={href}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-blue-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              )}
            >
              {option.label}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredShifts.length === 0 ? (
          <Card className="text-sm text-neutral-500">No shifts match this filter.</Card>
        ) : (
          filteredShifts.map((shift) => {
            const userApplication = shift.applications[0];
            if (shift.status === 'OPEN') {
              return (
                <AvailableShiftCard
                  key={shift.id}
                  shift={shift}
                  actions={
                    <ShiftActions
                      shiftId={shift.id}
                      userId={activeUser.id}
                      shiftStatus={shift.status}
                      applicationStatus={userApplication?.status ?? null}
                    />
                  }
                />
              );
            }

            const isUsersShift = shift.hiredProviderId === activeUser.id;
            const statusLabel =
              shift.status === 'HIRED'
                ? isUsersShift
                  ? 'Confirmed'
                  : 'Filled'
                : 'Cancelled';
            const tone = shift.status === 'CANCELLED' ? 'warning' : isUsersShift ? 'success' : 'neutral';

            return (
              <ShiftCard
                key={shift.id}
                shift={shift}
                status={{ label: statusLabel, tone }}
                headerAction={
                  <span className="text-sm font-semibold text-blue-600">
                    {formatCurrencyFromCents(shift.hourlyRateCents)}/hr
                  </span>
                }
                footer={
                  <span className="text-xs font-medium text-neutral-400">
                    {isUsersShift ? 'Managed by you' : 'Not accepting new applications'}
                  </span>
                }
              />
            );
          })
        )}
      </div>
    </div>
  );
}
