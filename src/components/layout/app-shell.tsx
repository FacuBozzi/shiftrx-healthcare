import { ReactNode } from 'react';
import { Sidebar } from './sidebar';

interface AppShellProps {
  children: ReactNode;
  sidebarFooter?: ReactNode;
}

export function AppShell({ children, sidebarFooter }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar />
      <main className="flex-1 bg-neutral-50 px-12 py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
      {sidebarFooter}
    </div>
  );
}
