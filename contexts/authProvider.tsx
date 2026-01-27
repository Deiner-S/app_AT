import { httpRequest } from '@/services/networkService'
import { clearToken, saveToken as saveTokenStorange } from '@/storange/authStorange'
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
  const [loged, setloged] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function bootstrap() {
      setLoading(false)
    }

    bootstrap()
  }, [])

  async function login(username: string, password: string){
    console.log("Try request")
    const response = await httpRequest<LoginResponse>({
            method: 'POST',
            endpoint: '/api/token/',
            BASE_URL: "https://ringless-equivalently-alijah.ngrok-free.dev/gerenciador",
            body: {username,password}
    })
    
    
    if (response.access && response.refresh) {
      console.log('Token de acesso:', response.access)
      await saveTokenStorange({
        access: response.access,
        refresh: response.refresh
      })
      setloged(true)
      return true
      
    } else {
      console.log('Login inválido')
      return false
    } 
  }

  function logout() {
    clearToken()
    return true
  }

  return (
    <AuthContext.Provider value={{ loged, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
