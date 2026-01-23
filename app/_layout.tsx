
import { AuthProvider } from '@/contexts/authProvider'
import { SyncProvider } from '@/contexts/syncContext'
import { Slot } from 'expo-router'

export default function RootLayout() {
  return (
    <AuthProvider>
      <SyncProvider>
        <Slot/>
      </SyncProvider>
    </AuthProvider>
  )
}
