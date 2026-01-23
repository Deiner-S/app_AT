import { useAuth } from '@/contexts/authContext'
import { useSync } from '@/contexts/syncContext'
import { MaterialIcons } from '@expo/vector-icons'
import { Redirect, Stack } from 'expo-router'
import { ActivityIndicator, TouchableOpacity, View } from 'react-native'

export default function StackLayout() {
  console.log('StackLayout Renderizou')

  const { token, loading } = useAuth()
  const { runSync } = useSync()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  if (!token) {
    return <Redirect href="/login" />
  }

  return (
    <Stack>
      <Stack.Screen
        name="HomeScreen"
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={runSync}>
              <MaterialIcons name="sync" size={24} color="#000" />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Checklist" />
    </Stack>
  )
}
