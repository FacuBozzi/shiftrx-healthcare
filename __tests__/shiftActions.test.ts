import { jest } from '@jest/globals';

const revalidatePathMock = jest.fn();

jest.mock('next/cache', () => ({
  __esModule: true,
  revalidatePath: (path: string) => revalidatePathMock(path),
}));

const prismaMock = {
  shift: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  application: {
    upsert: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  },
  $transaction: jest.fn((callback: (tx: typeof prismaMock) => Promise<unknown>) => callback(prismaMock as never)),
};

jest.mock('@/lib/prisma', () => ({
  __esModule: true,
  prisma: prismaMock,
}));

import { applyToShiftAction, withdrawApplicationAction } from '@/server/actions/shifts';
import { POST as hireHandler, hireProvider } from '@/app/api/hire/route';

function resetPrismaMock() {
  prismaMock.shift.findUnique.mockReset();
  prismaMock.shift.update.mockReset();
  prismaMock.application.upsert.mockReset();
  prismaMock.application.findUnique.mockReset();
  prismaMock.application.update.mockReset();
  prismaMock.application.updateMany.mockReset();
  prismaMock.$transaction.mockReset();
  prismaMock.$transaction.mockImplementation((callback) => callback(prismaMock as never));
}

describe('shift server actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetPrismaMock();
  });

  test('applyToShiftAction creates or updates application when shift is open', async () => {
    prismaMock.shift.findUnique.mockResolvedValue({ id: 'shift-1', status: 'OPEN' });
    prismaMock.application.upsert.mockResolvedValue({ id: 'app-1' });

    await applyToShiftAction('shift-1', 'user-1', prismaMock as never);

    expect(prismaMock.shift.findUnique).toHaveBeenCalledWith({ where: { id: 'shift-1' } });
    expect(prismaMock.application.upsert).toHaveBeenCalledWith({
      where: { shiftId_userId: { shiftId: 'shift-1', userId: 'user-1' } },
      update: { status: 'APPLIED' },
      create: { shiftId: 'shift-1', userId: 'user-1' },
    });
    expect(revalidatePathMock).not.toHaveBeenCalled();
  });

  test('applyToShiftAction throws when shift is not open', async () => {
    prismaMock.shift.findUnique.mockResolvedValue({ id: 'shift-1', status: 'HIRED' });

    await expect(applyToShiftAction('shift-1', 'user-1', prismaMock as never)).rejects.toThrow(
      'Shift is no longer open for applications'
    );
  });

  test('withdrawApplicationAction rejects when application status is not APPLIED', async () => {
    prismaMock.application.findUnique.mockResolvedValue({
      shiftId: 'shift-1',
      userId: 'user-1',
      status: 'WITHDRAWN',
    });

    await expect(withdrawApplicationAction('shift-1', 'user-1', prismaMock as never)).rejects.toThrow(
      'Only active applications can be withdrawn'
    );
  });
});

describe('hire API route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetPrismaMock();
  });

  test('returns 400 when payload is missing', async () => {
    const response = await hireHandler(new Request('http://localhost/api/hire', { method: 'POST', body: '{}'}));
    expect(response.status).toBe(400);
  });
});

describe('hireProvider helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetPrismaMock();
  });

  test('hires a provider and rejects competing applications', async () => {
    prismaMock.application.findUnique.mockResolvedValue({
      id: 'app-1',
      userId: 'user-1',
      shiftId: 'shift-1',
      shift: { id: 'shift-1', status: 'OPEN' },
    });
    prismaMock.shift.update.mockResolvedValue({ id: 'shift-1', status: 'HIRED' });

    const result = await hireProvider(prismaMock as never, 'app-1', 'shift-1');

    expect(result).toEqual({ id: 'shift-1', status: 'HIRED' });
    expect(prismaMock.application.update).toHaveBeenCalledWith({
      where: { id: 'app-1' },
      data: { status: 'HIRED' },
    });
    expect(prismaMock.application.updateMany).toHaveBeenCalledWith({
      where: { shiftId: 'shift-1', id: { not: 'app-1' } },
      data: { status: 'REJECTED' },
    });
  });

  test('throws when application is missing', async () => {
    prismaMock.application.findUnique.mockResolvedValue(null);

    await expect(hireProvider(prismaMock as never, 'missing', 'shift-1')).rejects.toThrow('Application not found');
  });
});
