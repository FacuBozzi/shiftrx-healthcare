'use client';

import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  HomeIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useActiveUser } from '@/components/active-user-context';

const navItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Shifts', href: '/shifts', icon: CalendarDaysIcon },
  { name: 'Applications', href: '/applications', icon: CheckCircleIcon },
  { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Account', href: '/account', icon: UserCircleIcon },
];

const jobTypes = ['PRN Shifts', 'Part & Full Time Jobs'] as const;

export function Sidebar() {
  const pathname = usePathname();
  const { activeUser } = useActiveUser();
  const initials = activeUser.name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <aside className="flex h-full w-72 flex-col border-r border-neutral-200 bg-white px-6 py-8">
      <div className="flex items-center gap-2 text-xl font-semibold text-blue-700">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-lg">
          SR
        </span>
        ShiftRx
      </div>

      <div className="mt-8 grid grid-cols-1 gap-2 rounded-2xl bg-neutral-50 p-2">
        {jobTypes.map((label, index) => {
          const isActive = index === 0;
          return (
            <button
              key={label}
              className={cn(
                'rounded-xl px-4 py-2 text-left text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              )}
              type="button"
            >
              {label}
            </button>
          );
        })}
      </div>

      <nav className="mt-10 space-y-2 text-sm font-medium">
        {navItems.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={name}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2 transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
              )}
            >
              <Icon className="h-5 w-5" />
              {name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-600">
            {initials}
          </span>
          <span className="flex-grow">
            <span className="block text-neutral-800">{activeUser.name}</span>
            <span className="block text-xs text-neutral-400">{activeUser.email}</span>
          </span>
        </button>
        <button
          type="button"
          className="mt-2 w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-neutral-400 hover:text-neutral-600"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
