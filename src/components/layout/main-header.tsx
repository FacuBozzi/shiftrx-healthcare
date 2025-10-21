import { BellAlertIcon } from '@heroicons/react/24/outline';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface MainHeaderProps {
  name: string;
  rightSlot?: ReactNode;
}

export function MainHeader({ name, rightSlot }: MainHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <p className="text-sm text-neutral-500">Hi, {name}</p>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-900">Welcome back</h1>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" aria-label="Notifications">
          <BellAlertIcon className="h-5 w-5" />
        </Button>
        {rightSlot}
      </div>
    </header>
  );
}
