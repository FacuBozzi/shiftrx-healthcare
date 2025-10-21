import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import type { PrismaClient } from '@prisma/client';

interface HireRequestBody {
  applicationId?: string;
  shiftId?: string;
}

export async function hireProvider(client: PrismaClient, applicationId: string, shiftId: string) {
  return client.$transaction(async (tx) => {
    const application = await tx.application.findUnique({
      where: { id: applicationId },
      include: {
        shift: true,
      },
    });

    if (!application) {
      throw new Error('Application not found');
    }

    if (application.shiftId !== shiftId) {
      throw new Error('Application does not belong to provided shift');
    }

    if (application.shift.status === 'HIRED') {
      throw new Error('Shift already hired');
    }

    if (application.shift.status === 'CANCELLED') {
      throw new Error('Shift has been cancelled');
    }

    const updatedShift = await tx.shift.update({
      where: { id: shiftId },
      data: {
        status: 'HIRED',
        hiredProviderId: application.userId,
      },
    });

    await tx.application.update({
      where: { id: applicationId },
      data: {
        status: 'HIRED',
      },
    });

    await tx.application.updateMany({
      where: {
        shiftId,
        id: {
          not: applicationId,
        },
      },
      data: {
        status: 'REJECTED',
      },
    });

    return updatedShift;
  });
}

export async function POST(request: Request) {
  let body: HireRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  const { applicationId, shiftId } = body;

  if (!applicationId || !shiftId) {
    return NextResponse.json({ error: 'applicationId and shiftId are required' }, { status: 400 });
  }

  try {
    const result = await hireProvider(prisma, applicationId, shiftId);

    if (process.env.NODE_ENV !== 'test') {
      revalidatePath('/');
      revalidatePath('/applications');
      revalidatePath(`/shifts/${shiftId}`);
    }

    return NextResponse.json({ ok: true, shift: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to process request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
