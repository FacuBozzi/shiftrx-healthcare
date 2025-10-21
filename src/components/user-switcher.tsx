'use client';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { type ChangeEvent, useTransition } from 'react';
import type { User } from '@prisma/client';
import { changeActiveUserAction } from '@/server/actions/users';
import { cn } from '@/lib/utils';

interface UserSwitcherProps {
  users: User[];
  activeUserId: string;
}

export function UserSwitcher({ users, activeUserId }: UserSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const userId = event.target.value;
    startTransition(async () => {
      await changeActiveUserAction(userId);
    });
  };

  return (
    <label className="relative inline-flex items-center gap-3 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-neutral-200">
      <span className="text-sm font-medium text-neutral-500">Viewing</span>
      <select
        name="activeUserId"
        className={cn(
          'appearance-none bg-transparent pr-6 text-sm font-semibold text-neutral-900 focus:outline-none',
          isPending && 'opacity-60'
        )}
        value={activeUserId}
        onChange={handleChange}
        disabled={isPending}
      >
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
    </label>
  );
}
