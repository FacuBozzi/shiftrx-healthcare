'use client';

import { useState, useTransition } from 'react';
import type { ApplicationStatus, ShiftStatus } from '@prisma/client';
import { applyToShiftAction, withdrawApplicationAction } from '@/server/actions/shifts';
import { Button } from '@/components/ui/button';

interface ShiftActionsProps {
  shiftId: string;
  userId: string;
  shiftStatus: ShiftStatus;
  applicationStatus?: ApplicationStatus | null;
}

export function ShiftActions({ shiftId, userId, shiftStatus, applicationStatus }: ShiftActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState<ApplicationStatus | null>(null);
  const currentStatus = optimisticStatus ?? applicationStatus ?? null;

  const handleApply = () => {
    setOptimisticStatus('APPLIED');
    startTransition(async () => {
      try {
        await applyToShiftAction(shiftId, userId);
      } catch (error) {
        console.error(error);
        setOptimisticStatus(null);
      }
    });
  };

  const handleWithdraw = () => {
    setOptimisticStatus('WITHDRAWN');
    startTransition(async () => {
      try {
        await withdrawApplicationAction(shiftId, userId);
      } catch (error) {
        console.error(error);
        setOptimisticStatus(null);
      }
    });
  };

  const isApplied = currentStatus === 'APPLIED';
  const isWithdrawn = currentStatus === 'WITHDRAWN';

  const disabled = shiftStatus !== 'OPEN' || isPending;

  if (shiftStatus !== 'OPEN') {
    return (
      <Button variant="ghost" size="sm" disabled>
        Not available
      </Button>
    );
  }

  if (isApplied) {
    return (
      <Button variant="outline" size="sm" disabled={isPending} onClick={handleWithdraw}>
        {isPending ? 'Updating…' : 'Withdraw'}
      </Button>
    );
  }

  return (
    <Button variant="primary" size="sm" disabled={disabled} onClick={handleApply}>
      {isPending ? 'Submitting…' : isWithdrawn ? 'Reapply' : 'Apply'}
    </Button>
  );
}
