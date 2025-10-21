'use client';

import { createContext, useContext } from 'react';
import type { User } from '@prisma/client';

interface ActiveUserContextValue {
  users: User[];
  activeUser: User;
}

const ActiveUserContext = createContext<ActiveUserContextValue | undefined>(undefined);

export function ActiveUserProvider({
  value,
  children,
}: {
  value: ActiveUserContextValue;
  children: React.ReactNode;
}) {
  return <ActiveUserContext.Provider value={value}>{children}</ActiveUserContext.Provider>;
}

export function useActiveUser() {
  const context = useContext(ActiveUserContext);
  if (!context) {
    throw new Error('useActiveUser must be used within ActiveUserProvider');
  }
  return context;
}
