'use server';

import { revalidatePath } from 'next/cache';
import { setSelectedUserId } from '@/lib/user-session';

const PATHS_TO_REFRESH = ['/', '/applications'];

export async function changeActiveUserAction(userId: string) {
  await setSelectedUserId(userId);
  for (const path of PATHS_TO_REFRESH) {
    revalidatePath(path);
  }
  revalidatePath('/', 'layout');
}
