'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ApplicationStatus } from '@prisma/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const sortOptions = [
  { value: 'date-asc', label: 'Start date ↑' },
  { value: 'date-desc', label: 'Start date ↓' },
  { value: 'rate-asc', label: 'Hourly rate ↑' },
  { value: 'rate-desc', label: 'Hourly rate ↓' },
] as const;

interface ShiftFiltersProps {
  applicationStatus: ApplicationStatus | 'ALL' | 'NONE';
  minRate?: number;
  startDate?: string;
  sort: string;
}

export function ShiftFilters({ applicationStatus, minRate, startDate, sort }: ShiftFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [applicationStatusValue, setApplicationStatusValue] = useState<ApplicationStatus | 'ALL' | 'NONE'>(
    applicationStatus
  );
  const [minRateValue, setMinRateValue] = useState<string>(minRate?.toString() ?? '');
  const [startDateValue, setStartDateValue] = useState<string>(startDate ?? '');
  const [sortValue, setSortValue] = useState<string>(sort);

  useEffect(() => {
    setApplicationStatusValue(applicationStatus);
  }, [applicationStatus]);

  useEffect(() => {
    setMinRateValue(minRate?.toString() ?? '');
  }, [minRate]);

  useEffect(() => {
    setStartDateValue(startDate ?? '');
  }, [startDate]);

  useEffect(() => {
    setSortValue(sort);
  }, [sort]);

  const hasActiveFilters = useMemo(() => {
    return (
      applicationStatusValue !== 'ALL' ||
      minRateValue.trim() !== '' ||
      startDateValue.trim() !== '' ||
      sortValue !== 'date-asc'
    );
  }, [applicationStatusValue, minRateValue, startDateValue, sortValue]);

  const buildQuery = () => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');

    if (applicationStatusValue && applicationStatusValue !== 'ALL') {
      params.set('applicationStatus', applicationStatusValue);
    } else {
      params.delete('applicationStatus');
    }

    if (minRateValue.trim()) {
      params.set('minRate', minRateValue.trim());
    } else {
      params.delete('minRate');
    }

    if (startDateValue.trim()) {
      params.set('startDate', startDateValue.trim());
    } else {
      params.delete('startDate');
    }

    if (sortValue && sortValue !== 'date-asc') {
      params.set('sort', sortValue);
    } else {
      params.delete('sort');
    }

    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(buildQuery());
  };

  const handleReset = () => {
    setApplicationStatusValue('ALL');
    setMinRateValue('');
    setStartDateValue('');
    setSortValue('date-asc');
    router.push(pathname);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
    >
      <div className="flex flex-1 flex-col gap-2">
        <label className="text-xs font-medium uppercase text-neutral-400" htmlFor="applicationStatus">
          Your application
        </label>
        <select
          id="applicationStatus"
          value={applicationStatusValue}
          onChange={(event) => setApplicationStatusValue(event.target.value as ApplicationStatus | 'ALL' | 'NONE')}
          className="h-10 rounded-lg border border-neutral-200 px-3 text-sm focus:border-blue-400 focus:outline-none"
        >
          <option value="ALL">All application statuses</option>
          <option value="NONE">No application</option>
          {Object.values(ApplicationStatus).map((value) => (
            <option key={value} value={value}>
              {value.charAt(0) + value.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <label className="text-xs font-medium uppercase text-neutral-400" htmlFor="minRate">
          Min hourly rate ($)
        </label>
        <input
          id="minRate"
          type="number"
          min="0"
          step="1"
          value={minRateValue}
          onChange={(event) => setMinRateValue(event.target.value)}
          placeholder="e.g. 70"
          className="h-10 rounded-lg border border-neutral-200 px-3 text-sm focus:border-blue-400 focus:outline-none"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <label className="text-xs font-medium uppercase text-neutral-400" htmlFor="startDate">
          Starts after
        </label>
        <input
          id="startDate"
          type="date"
          value={startDateValue}
          onChange={(event) => setStartDateValue(event.target.value)}
          className="h-10 rounded-lg border border-neutral-200 px-3 text-sm focus:border-blue-400 focus:outline-none"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <label className="text-xs font-medium uppercase text-neutral-400" htmlFor="sort">
          Sort by
        </label>
        <select
          id="sort"
          value={sortValue}
          onChange={(event) => setSortValue(event.target.value)}
          className="h-10 rounded-lg border border-neutral-200 px-3 text-sm focus:border-blue-400 focus:outline-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2 md:justify-end">
        <Button type="submit" variant="primary" size="md">
          Apply
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="md"
          className={cn('text-sm', !hasActiveFilters && 'opacity-50')}
          disabled={!hasActiveFilters}
          onClick={handleReset}
        >
          Reset
        </Button>
      </div>
    </form>
  );
}
