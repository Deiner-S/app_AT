import { useAuth } from '@/contexts/authContext'
import { Redirect, Stack } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'
import { Routes } from '../routes'

export default function StackLayout() {
  const { loged, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  if (!loged) {
    return <Redirect href={Routes.LOGIN} />
  }

  return (
    <Stack>
      <Stack.Screen name={Routes.HOME} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.ORDERS} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.CLIENTS} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.CLIENT_CREATE} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.CLIENT_DETAIL} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.CLIENT_EDIT} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.CLIENT_ADDRESS_CREATE} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.CLIENT_SERVICE_CREATE} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.EMPLOYEES} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.EMPLOYEE_DETAIL} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.CHECKLIST_ITEMS} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.CHECKLIST_ITEM_DETAIL} options={{ headerShown: false }} />
      <Stack.Screen name={Routes.CHECKLIST}options={{headerShown: false}}/>
      <Stack.Screen name={Routes.DELIVERY_CHECKLIST} options={{ title: 'Checklist de entrega' }} />
      <Stack.Screen name={Routes.MAINTENANCE} options={{ title: 'Manutenção' }} />
    </Stack>
  )
}
