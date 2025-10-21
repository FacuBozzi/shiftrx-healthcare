import { differenceInMinutes, format } from 'date-fns';

export function formatCurrencyFromCents(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatShiftDate(startsAt: Date | string) {
  const date = typeof startsAt === 'string' ? new Date(startsAt) : startsAt;
  return format(date, 'EEE, MMM d');
}

export function formatShiftDuration(startsAt: Date | string, endsAt: Date | string) {
  const start = typeof startsAt === 'string' ? new Date(startsAt) : startsAt;
  const end = typeof endsAt === 'string' ? new Date(endsAt) : endsAt;

  const minutes = differenceInMinutes(end, start);
  const hours = minutes / 60;

  return hours % 1 === 0 ? `${hours} hrs` : `${hours.toFixed(1)} hrs`;
}

export function formatShiftDateSummary(startsAt: Date | string, endsAt: Date | string) {
  return `${formatShiftDate(startsAt)} · ${formatShiftDuration(startsAt, endsAt)}`;
}

export function formatShiftTimeRange(startsAt: Date | string, endsAt: Date | string) {
  const start = typeof startsAt === 'string' ? new Date(startsAt) : startsAt;
  const end = typeof endsAt === 'string' ? new Date(endsAt) : endsAt;

  return `${format(start, 'p')} to ${format(end, 'p')}`;
}
