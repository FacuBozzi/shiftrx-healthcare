import { cookies } from 'next/headers';

export const USER_COOKIE_KEY = 'shiftrx-active-user';

export function getSelectedUserId() {
  const cookieStore = cookies();
  return cookieStore.get(USER_COOKIE_KEY)?.value;
}

export function resolveSelectedUserId(fallbackUserId: string) {
  return getSelectedUserId() ?? fallbackUserId;
}

export async function setSelectedUserId(userId: string) {
  'use server';
  const cookieStore = cookies();
  cookieStore.set(USER_COOKIE_KEY, userId, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
}
