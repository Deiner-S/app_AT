// sync/SyncContext.tsx
import { createContext, ReactNode, useContext, useState } from 'react';
import Synchronizer from '@/services/synchronizerService';

// children se refere a qualquer componente react válido
type SyncProviderProps = {
  children: ReactNode;
};
export const SyncContext = createContext<any>(null);

export function SyncProvider({ children }:SyncProviderProps) {
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);

  const runSync = async () => {
    const synchronizer = await Synchronizer.build();
    await synchronizer.run();
    setLastSyncAt(Date.now()); 
  };

  return (
    <SyncContext.Provider value={{ runSync, lastSyncAt }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  return useContext(SyncContext);
}
