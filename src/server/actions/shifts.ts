'use server';

import { revalidatePath } from 'next/cache';
import type { PrismaClient } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const DASHBOARD_PATHS = ['/', '/applications'];

function triggerRevalidation(shiftId: string) {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  for (const path of DASHBOARD_PATHS) {
    revalidatePath(path);
  }
  revalidatePath(`/shifts/${shiftId}`);
}

export async function applyToShiftAction(
  shiftId: string,
  userId: string,
  client: PrismaClient = prisma
) {
  const shift = await client.shift.findUnique({
    where: { id: shiftId },
  });

  if (!shift) {
    throw new Error('Shift not found');
  }

  if (shift.status !== 'OPEN') {
    throw new Error('Shift is no longer open for applications');
  }

  await client.application.upsert({
    where: {
      shiftId_userId: {
        shiftId,
        userId,
      },
    },
    update: {
      status: 'APPLIED',
    },
    create: {
      shiftId,
      userId,
    },
  });

  triggerRevalidation(shiftId);
}

export async function withdrawApplicationAction(
  shiftId: string,
  userId: string,
  client: PrismaClient = prisma
) {
  const application = await client.application.findUnique({
    where: {
      shiftId_userId: {
        shiftId,
        userId,
      },
    },
  });

  if (!application) {
    throw new Error('Application not found');
  }

  if (application.status !== 'APPLIED') {
    throw new Error('Only active applications can be withdrawn');
  }

  await client.application.update({
    where: {
      shiftId_userId: {
        shiftId,
        userId,
      },
    },
    data: {
      status: 'WITHDRAWN',
    },
  });

  triggerRevalidation(shiftId);
}
