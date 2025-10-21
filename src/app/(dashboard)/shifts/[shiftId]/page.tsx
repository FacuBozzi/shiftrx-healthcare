import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShiftActions } from "@/components/shifts/shift-actions";
import { getActiveUserBundle } from "@/data/users";
import { getShiftDetailForUser } from "@/data/shifts";
import {
  formatCurrencyFromCents,
  formatShiftDate,
  formatShiftDateSummary,
  formatShiftTimeRange,
} from "@/lib/formatters";

export default async function ShiftDetailPage({
  params,
}: {
  params: { shiftId: string };
}) {
  const { activeUser } = await getActiveUserBundle();
  const shift = await getShiftDetailForUser(params.shiftId, activeUser.id);

  if (!shift) {
    notFound();
  }

  const applicants = shift.applications.length;
  const isUserHired = shift.hiredProviderId === activeUser.id;

  const actionContent =
    shift.status === "OPEN" ? (
      <ShiftActions
        shiftId={shift.id}
        userId={activeUser.id}
        shiftStatus={shift.status}
        applicationStatus={shift.userApplication?.status ?? null}
      />
    ) : isUserHired ? (
      <Button variant="secondary" size="sm" disabled>
        Confirmed
      </Button>
    ) : (
      <Button variant="ghost" size="sm" disabled>
        Filled
      </Button>
    );

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link
            href="/shifts"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600"
          >
            <ArrowLeftIcon className="h-4 w-4" /> Back to shifts
          </Link>
        </Button>
        <span className="text-sm text-neutral-400">
          {applicants} applicant{applicants === 1 ? "" : "s"}
        </span>
      </div>

      <Card className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-blue-500">
              {shift.facilityName}
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-neutral-900">
              {shift.title}
            </h1>
            <p className="mt-3 text-sm text-neutral-500">{shift.location}</p>
          </div>
          <div className="flex flex-col items-end gap-2 text-right text-sm">
            <span className="text-2xl font-semibold text-blue-600">
              {formatCurrencyFromCents(shift.hourlyRateCents)} / hr
            </span>
            {actionContent}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-sm text-neutral-600">
            <div className="text-xs font-medium uppercase text-neutral-400">
              Date
            </div>
            <div className="mt-2 text-base font-semibold text-neutral-900">
              {formatShiftDate(shift.startsAt)}
            </div>
            <div className="mt-1 text-sm text-neutral-500">
              {formatShiftDateSummary(shift.startsAt, shift.endsAt)}
            </div>
          </div>
          <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-sm text-neutral-600">
            <div className="text-xs font-medium uppercase text-neutral-400">
              Shift hours
            </div>
            <div className="mt-2 text-base font-semibold text-neutral-900">
              {formatShiftTimeRange(shift.startsAt, shift.endsAt)}
            </div>
            <div className="mt-1 text-sm text-neutral-500">
              {shift.status === "HIRED" && isUserHired
                ? "You are confirmed for this shift"
                : "Local timezone"}
            </div>
          </div>
          <div className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 text-sm text-neutral-600">
            <div className="text-xs font-medium uppercase text-neutral-400">
              Status
            </div>
            <div className="mt-2 text-base font-semibold text-neutral-900">
              {shift.status}
            </div>
            <div className="mt-1 text-sm text-neutral-500">
              {shift.status === "OPEN"
                ? "Accepting applications"
                : isUserHired
                  ? "Assigned to you"
                  : "No longer available"}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Shift overview
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-600">
            {shift.description ??
              "Assist the onsite pharmacist team with patient consultations, prescription verification, and inventory management. Collaborate with technicians to ensure timely fulfillment for walk-in and scheduled patients."}
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900">
            Facility notes
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-600">
            <li>
              Arrive 15 minutes early to complete handoff with the morning team.
            </li>
            <li>Dress code: navy scrubs with badge visible at all times.</li>
            <li>
              Lunch provided onsite; break schedule coordinated with lead
              pharmacist.
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
