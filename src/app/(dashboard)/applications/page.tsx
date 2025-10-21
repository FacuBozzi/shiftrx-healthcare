import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ShiftActions } from '@/components/shifts/shift-actions';
import { getActiveUserBundle } from '@/data/users';
import { getApplicationsForUser } from '@/data/shifts';
import { formatShiftDateSummary, formatShiftTimeRange } from '@/lib/formatters';

const statusToneMap: Record<string, 'neutral' | 'success' | 'warning' | 'info'> = {
  APPLIED: 'info',
  WITHDRAWN: 'warning',
  REJECTED: 'warning',
  HIRED: 'success',
};

export default async function ApplicationsPage() {
  const { activeUser } = await getActiveUserBundle();
  const applications = await getApplicationsForUser(activeUser.id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Applications</h1>
        <p className="mt-2 text-sm text-neutral-500">
          Track the status of every shift you’ve applied to. Withdraw directly from this view if your plans
          change.
        </p>
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card className="text-sm text-neutral-500">You haven’t applied to any shifts yet.</Card>
        ) : (
          applications.map((application) => (
            <Card key={application.id} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-neutral-900">{application.shift.title}</h2>
                    <Badge
                      tone={statusToneMap[application.status] ?? 'neutral'}
                      label={application.status.toLowerCase().replace(/^\w/, (c) => c.toUpperCase())}
                    />
                  </div>
                  <p className="mt-1 text-sm text-neutral-500">{application.shift.facilityName}</p>
                  <p className="mt-1 text-xs text-neutral-400">{application.shift.location}</p>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <ShiftActions
                    shiftId={application.shiftId}
                    userId={activeUser.id}
                    shiftStatus={application.shift.status}
                    applicationStatus={application.status}
                  />
                  <Link href={`/shifts/${application.shiftId}`} className="text-blue-600 hover:underline">
                    View
                  </Link>
                </div>
              </div>
              <div className="grid gap-3 text-sm text-neutral-600 sm:grid-cols-2">
                <div>
                  <span className="text-xs font-medium uppercase text-neutral-400">Date</span>
                  <p className="mt-1">{formatShiftDateSummary(application.shift.startsAt, application.shift.endsAt)}</p>
                </div>
                <div>
                  <span className="text-xs font-medium uppercase text-neutral-400">Time</span>
                  <p className="mt-1">{formatShiftTimeRange(application.shift.startsAt, application.shift.endsAt)}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
