import Link from 'next/link';
import { AvailableShiftCard } from '@/components/shifts/available-shift-card';
import { ShiftActions } from '@/components/shifts/shift-actions';
import { UpcomingShiftCard } from '@/components/shifts/upcoming-shift-card';
import { PromoCard } from '@/components/dashboard/promo-card';
import { PerformanceCard } from '@/components/dashboard/performance-card';
import { getActiveUserBundle } from '@/data/users';
import { getAvailableShiftsForUser, getUpcomingShiftsForUser } from '@/data/shifts';

export default async function DashboardPage() {
  const { activeUser } = await getActiveUserBundle();
  const [upcomingShifts, availableShifts] = await Promise.all([
    getUpcomingShiftsForUser(activeUser.id),
    getAvailableShiftsForUser(activeUser.id),
  ]);

  const performanceMetrics = [
    {
      label: 'Performance Rating',
      value: '5.0',
      caption: 'Averaged from colleague reviews',
    },
    {
      label: 'Attendance Score',
      value: '135',
      caption: 'Points earned for on-time arrivals',
    },
    {
      label: 'Shifts Completed',
      value: String(upcomingShifts.length),
      caption: 'Confirmed upcoming assignments',
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <section className="grid gap-4 md:grid-cols-2">
        <PromoCard
          eyebrow="Bonus Time"
          title="Your first shift comes with a $50 bonus!"
          description="Book a shift now to claim your welcome reward."
          ctaLabel="Book a shift"
          href="/shifts"
        />
        <PromoCard
          eyebrow="Complete your background check"
          title="Finish your screening with KarmaCheck"
          description="We just need a few more details to get you ready."
          ctaLabel="Start now"
          href="#"
          gradient="bg-gradient-to-r from-blue-400 to-indigo-400"
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Upcoming shifts</h2>
          <Link href="/shifts" className="text-sm font-medium text-blue-600">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {upcomingShifts.length ? (
            upcomingShifts.map((shift) => <UpcomingShiftCard key={shift.id} shift={shift} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-6 text-sm text-neutral-500">
              No upcoming shifts yet. Browse open shifts to get started.
            </div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-900">Explore available shifts</h2>
          <Link href="/shifts" className="text-sm font-medium text-blue-600">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {availableShifts.length ? (
            availableShifts.slice(0, 3).map((shift, index) => (
              <AvailableShiftCard
                key={shift.id}
                shift={shift}
                accent={index === 0 ? 'muted' : 'default'}
                actions={
                  <ShiftActions
                    shiftId={shift.id}
                    userId={activeUser.id}
                    shiftStatus={shift.status}
                    applicationStatus={shift.applications[0]?.status ?? null}
                  />
                }
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-6 text-sm text-neutral-500">
              No open shifts available right now—check back soon.
            </div>
          )}
        </div>
      </section>

      <PerformanceCard
        metrics={performanceMetrics}
        message="Your rating will appear once you’ve received at least 3 reviews."
      />
    </div>
  );
}
