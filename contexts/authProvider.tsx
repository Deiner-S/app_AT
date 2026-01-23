import { useEffect, useState } from 'react'
import { AuthContext } from './authContext'
import { getToken, saveToken, clearToken } from '@/storange/authStorange'

type Props = {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function bootstrap() {
      const storedToken = await getToken()
      setToken(storedToken)
      setLoading(false)
    }

    bootstrap()
  }, [])

  async function login(username: string, password: string) {
    const response = await fetch('https://SEU_BACKEND/api/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      throw new Error('Login inválido')
    }

    const data = await response.json()
    await saveToken(data.access)
    setToken(data.access)
  }

  function logout() {
    clearToken()
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
