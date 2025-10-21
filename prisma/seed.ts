import { PrismaClient, ApplicationStatus, ShiftStatus } from '@prisma/client';

const prisma = new PrismaClient();

const hours = (date: Date, startHour: number, durationHours: number) => {
  const start = new Date(date);
  start.setHours(startHour, 0, 0, 0);

  const end = new Date(start);
  end.setHours(end.getHours() + durationHours);

  return { start, end };
};

async function main() {
  await prisma.application.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.user.deleteMany();

  const peter = await prisma.user.create({
    data: {
      name: 'Peter Parker',
      email: 'peter.parker@example.com',
    },
  });

  const gwen = await prisma.user.create({
    data: {
      name: 'Gwen Stacy',
      email: 'gwen.stacy@example.com',
    },
  });

  const miles = await prisma.user.create({
    data: {
      name: 'Miles Morales',
      email: 'miles.morales@example.com',
    },
  });

  const { start: shiftAStart, end: shiftAEnd } = hours(
    new Date('2025-10-22T00:00:00-05:00'),
    9,
    8
  );
  const { start: shiftBStart, end: shiftBEnd } = hours(
    new Date('2025-11-05T00:00:00-05:00'),
    9,
    8
  );

  const greenValleyMorning = await prisma.shift.create({
    data: {
      title: 'Upcoming Shift',
      description:
        'Assist with daily prescription fills, patient counseling, and inventory checks at a busy neighborhood pharmacy.',
      facilityName: 'Green Valley Pharmacy',
      location: '123 Main Street, Springfield, IL 62704',
      startsAt: shiftAStart,
      endsAt: shiftAEnd,
      hourlyRateCents: 7200,
      status: ShiftStatus.HIRED,
      hiredProviderId: peter.id,
    },
  });

  const greenValleyFollowUp = await prisma.shift.create({
    data: {
      title: 'Upcoming Shift',
      description:
        'Cover the afternoon rush, manage immunizations, and oversee pharmacy technicians.',
      facilityName: 'Green Valley Pharmacy',
      location: '123 Main Street, Springfield, IL 62704',
      startsAt: shiftBStart,
      endsAt: shiftBEnd,
      hourlyRateCents: 7200,
      status: ShiftStatus.HIRED,
      hiredProviderId: peter.id,
    },
  });

  const { start: exploreAStart, end: exploreAEnd } = hours(
    new Date('2025-10-28T00:00:00-05:00'),
    9,
    8
  );
  const { start: exploreBStart, end: exploreBEnd } = hours(
    new Date('2025-10-30T00:00:00-05:00'),
    14,
    6
  );
  const { start: exploreCStart, end: exploreCEnd } = hours(
    new Date('2025-11-12T00:00:00-05:00'),
    8,
    10
  );

  const springfieldTech = await prisma.shift.create({
    data: {
      title: 'Pharmacy Technician',
      description:
        'Support pharmacists with order entry, patient intake, and prescription handoffs.',
      facilityName: 'Springfield Clinic Pharmacy',
      location: 'Springfield, IL · 2340 miles away',
      startsAt: exploreAStart,
      endsAt: exploreAEnd,
      hourlyRateCents: 7500,
      status: ShiftStatus.OPEN,
    },
  });

  const mercyNight = await prisma.shift.create({
    data: {
      title: 'Evening Pharmacist',
      description:
        'Lead closing shift operations, ensure medication reconciliation, and monitor compounding logs.',
      facilityName: 'Mercy General Hospital',
      location: 'Chicago, IL · 1975 miles away',
      startsAt: exploreBStart,
      endsAt: exploreBEnd,
      hourlyRateCents: 8200,
      status: ShiftStatus.OPEN,
    },
  });

  await prisma.shift.create({
    data: {
      title: 'Weekend Pharmacist',
      description:
        'Provide weekend coverage for inpatient rounds, consult on dosing recommendations, and manage controlled substances.',
      facilityName: 'Riverview Medical Center',
      location: 'Cleveland, OH · 1800 miles away',
      startsAt: exploreCStart,
      endsAt: exploreCEnd,
      hourlyRateCents: 8800,
      status: ShiftStatus.OPEN,
    },
  });

  await prisma.application.createMany({
    data: [
      {
        shiftId: greenValleyMorning.id,
        userId: peter.id,
        status: ApplicationStatus.HIRED,
      },
      {
        shiftId: greenValleyFollowUp.id,
        userId: peter.id,
        status: ApplicationStatus.HIRED,
      },
      {
        shiftId: springfieldTech.id,
        userId: peter.id,
        status: ApplicationStatus.APPLIED,
      },
      {
        shiftId: mercyNight.id,
        userId: gwen.id,
        status: ApplicationStatus.APPLIED,
      },
      {
        shiftId: greenValleyFollowUp.id,
        userId: miles.id,
        status: ApplicationStatus.REJECTED,
      },
    ],
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
