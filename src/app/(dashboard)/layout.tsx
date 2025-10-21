import { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { MainHeader } from '@/components/layout/main-header';
import { UserSwitcher } from '@/components/user-switcher';
import { ActiveUserProvider } from '@/components/active-user-context';
import { getActiveUserBundle } from '@/data/users';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const { users, activeUser } = await getActiveUserBundle();

  return (
    <AppShell>
      <ActiveUserProvider value={{ users, activeUser }}>
        <div className="flex flex-col gap-8">
          <MainHeader
            name={activeUser.name}
            rightSlot={<UserSwitcher users={users} activeUserId={activeUser.id} />}
          />
          {children}
        </div>
      </ActiveUserProvider>
    </AppShell>
  );
}
