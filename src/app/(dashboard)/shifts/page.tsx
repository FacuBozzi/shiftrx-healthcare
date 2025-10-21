import { ApplicationStatus, ShiftStatus } from '@prisma/client';
import { AvailableShiftCard } from '@/components/shifts/available-shift-card';
import { ShiftActions } from '@/components/shifts/shift-actions';
import { ShiftCard } from '@/components/shifts/shift-card';
import { Card } from '@/components/ui/card';
import { ShiftFilters } from '@/components/shifts/shift-filters';
import { getActiveUserBundle } from '@/data/users';
import { getAllShiftsForUser, type ShiftSort } from '@/data/shifts';
import { formatCurrencyFromCents } from '@/lib/formatters';

const applicationStatusValues = new Set(Object.values(ApplicationStatus));

export default async function ShiftsPage({
  searchParams,
}: {
  searchParams?: { applicationStatus?: string; minRate?: string; startDate?: string; sort?: string };
}) {
  const { activeUser } = await getActiveUserBundle();

  const statusFilter: ShiftStatus | 'ALL' = 'ALL';

  const rawApplicationStatus = searchParams?.applicationStatus?.toUpperCase();
  const applicationStatusFilter: ApplicationStatus | 'ALL' | 'NONE' =
    rawApplicationStatus === 'NONE'
      ? 'NONE'
      : rawApplicationStatus && applicationStatusValues.has(rawApplicationStatus as ApplicationStatus)
        ? (rawApplicationStatus as ApplicationStatus)
        : 'ALL';

  const minRateParam = searchParams?.minRate ? Number(searchParams.minRate) : undefined;
  const minRateCents = minRateParam && !Number.isNaN(minRateParam) ? Math.max(0, Math.round(minRateParam * 100)) : undefined;

  const startDateParam = searchParams?.startDate ? new Date(searchParams.startDate) : undefined;
  const startDate = startDateParam && !Number.isNaN(startDateParam.getTime()) ? startDateParam : undefined;

  const sortParam = (searchParams?.sort as ShiftSort | undefined) ?? 'date-asc';

  const shifts = await getAllShiftsForUser(activeUser.id, {
    status: statusFilter,
    minRateCents,
    startDate,
    sort: sortParam,
    applicationStatus: applicationStatusFilter,
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">All shifts</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Browse and apply to open opportunities. Withdraw anytime before your application is reviewed.
        </p>
      </div>

      <ShiftFilters
        applicationStatus={applicationStatusFilter}
        minRate={minRateParam && !Number.isNaN(minRateParam) ? minRateParam : undefined}
        startDate={startDate?.toISOString().slice(0, 10)}
        sort={sortParam}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {shifts.length === 0 ? (
          <Card className="text-sm text-neutral-500">No shifts match this filter.</Card>
        ) : (
          shifts.map((shift) => {
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

            const isUsersShift = userApplication?.status === 'HIRED';
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
