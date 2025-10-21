import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export type ShiftWithApplications = Prisma.ShiftGetPayload<{
  include: { applications: true };
}>;

export async function getUpcomingShiftsForUser(userId: string) {
  return prisma.shift.findMany({
    where: {
      status: 'HIRED',
      hiredProviderId: userId,
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

export async function getAllShiftsForUser(userId: string) {
  return prisma.shift.findMany({
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
