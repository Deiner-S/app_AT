// sync/SyncContext.tsx
import Synchronizer from '@/services/synchronizerService';
import { createContext, ReactNode, useContext, useState } from 'react';
import { useAuth } from './authContext';

// children se refere a qualquer componente react válido
type SyncProviderProps = {
  children: ReactNode;
};
export const SyncContext = createContext<any>(null);

export function SyncProvider({ children }:SyncProviderProps) {
  const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);
  const { tokens: token } = useAuth()

  const runSync = async () => {
    try {
      if (!token) throw new Error('AUTH_TOKEN_MISSING')

      const synchronizer = await Synchronizer.build(token.access)
      await synchronizer.run()
      setLastSyncAt(Date.now())
    } catch (err) {
      console.error('Erro no sync', err)
    }
  }


  return (
    <SyncContext.Provider value={{ runSync, lastSyncAt }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSync() {
  return useContext(SyncContext);
}
