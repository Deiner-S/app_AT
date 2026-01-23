import { httpRequest } from '@/services/networkService'
import { clearToken, getToken, saveToken } from '@/storange/authStorange'
import { useEffect, useState } from 'react'
import { AuthContext } from './authContext'

type Props = {
  children: React.ReactNode
}

type LoginResponse = {
  access: string
  refresh: string
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
    console.log("Try request")
    const response = await httpRequest<LoginResponse>({
            method: 'POST',
            endpoint: '/api/token/',
            BASE_URL: "https://ringless-equivalently-alijah.ngrok-free.dev/gerenciador",
            body: {username,password}
    })
    
    
    if (response.access && response.refresh) {
        console.log('Token de acesso:', response.access)
        //await saveToken(response.access)
        //setToken(response.access)
    } else {
      console.log('Login inválido')
    }  
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
