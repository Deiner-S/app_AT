import { createContext, useContext } from 'react'

export type AuthContextType = {
  token: string | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
)

export function useAuth() {
  return useContext(AuthContext)
}
