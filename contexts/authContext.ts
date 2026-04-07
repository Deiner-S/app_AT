import type { DashboardPayload } from '@/services/management';
import { createContext, useContext } from 'react'

export type AuthContextType = {
  loged:boolean
  loading: boolean
  session: DashboardPayload | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  revalidateSession: () => Promise<DashboardPayload | null>
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
)

export function useAuth() {
  return useContext(AuthContext)
}
