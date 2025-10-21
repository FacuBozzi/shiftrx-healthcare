import { prisma } from '@/lib/prisma';
import { resolveSelectedUserId } from '@/lib/user-session';

export async function getAllUsers() {
  return prisma.user.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
  });
}

export async function getActiveUserBundle() {
  const users = await getAllUsers();

  if (users.length === 0) {
    throw new Error('No users available');
  }

  const fallbackUser = users[0];
  const selectedUserId = resolveSelectedUserId(fallbackUser.id);
  const activeUser = users.find((user) => user.id === selectedUserId) ?? fallbackUser;

  return {
    users,
    activeUser,
  };
}
