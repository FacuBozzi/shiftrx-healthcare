import { ApplicationStatus, Prisma, ShiftStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export type ShiftWithApplications = Prisma.ShiftGetPayload<{
  include: { applications: true };
}>;

export async function getUpcomingShiftsForUser(userId: string) {
  return prisma.shift.findMany({
    where: {
      status: 'HIRED',
      hiredProviderId: userId,
      applications: {
        some: {
          userId,
          status: 'HIRED',
        },
      },
      startsAt: {
        gte: new Date(),
      },
    },
    include: {
      applications: true,
    },
    orderBy: {
      startsAt: 'asc',
    },
  });
}

export async function getAvailableShiftsForUser(userId: string) {
  return prisma.shift.findMany({
    where: {
      status: 'OPEN',
    },
    include: {
      applications: {
        where: { userId },
      },
    },
    orderBy: {
      startsAt: 'asc',
    },
  });
}

export async function getShiftById(shiftId: string, userId: string) {
  return prisma.shift.findUnique({
    where: { id: shiftId },
    include: {
      applications: {
        where: { userId },
      },
    },
  });
}

export async function getShiftDetailForUser(shiftId: string, userId: string) {
  const shift = await prisma.shift.findUnique({
    where: { id: shiftId },
    include: {
      applications: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!shift) {
    return null;
  }

  const userApplication = shift.applications.find((application) => application.userId === userId) ?? null;

  return {
    ...shift,
    userApplication,
  };
}

export async function getApplicationsForUser(userId: string) {
  return prisma.application.findMany({
    where: {
      userId,
    },
    include: {
      shift: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

type ShiftSort = 'date-asc' | 'date-desc' | 'rate-asc' | 'rate-desc';

interface ShiftQueryOptions {
  status?: ShiftStatus | 'ALL';
  minRateCents?: number;
  startDate?: Date;
  sort?: ShiftSort;
  applicationStatus?: ApplicationStatus | 'ALL' | 'NONE';
}

const sortMap: Record<ShiftSort, Prisma.ShiftOrderByWithRelationInput[]> = {
  'date-asc': [{ startsAt: 'asc' }, { createdAt: 'asc' }],
  'date-desc': [{ startsAt: 'desc' }, { createdAt: 'desc' }],
  'rate-asc': [{ hourlyRateCents: 'asc' }, { startsAt: 'asc' }],
  'rate-desc': [{ hourlyRateCents: 'desc' }, { startsAt: 'asc' }],
};

export async function getAllShiftsForUser(userId: string, options: ShiftQueryOptions = {}) {
  const where: Prisma.ShiftWhereInput = {};

  if (options.status && options.status !== 'ALL') {
    where.status = options.status;
  }

  if (options.minRateCents) {
    where.hourlyRateCents = { gte: options.minRateCents };
  }

  if (options.startDate) {
    where.startsAt = { gte: options.startDate };
  }

  if (options.applicationStatus && options.applicationStatus !== 'ALL') {
    if (options.applicationStatus === 'NONE') {
      where.applications = {
        none: {
          userId,
        },
      };
    } else {
      where.applications = {
        some: {
          userId,
          status: options.applicationStatus,
        },
      };
    }
  }

  const sortKey = options.sort ?? 'date-asc';
  const orderBy = sortMap[sortKey] ?? sortMap['date-asc'];

  return prisma.shift.findMany({
    where,
    include: {
      applications: {
        where: { userId },
      },
    },
    orderBy,
  });
}

export type { ShiftQueryOptions, ShiftSort };
