import { useAuth } from '@/contexts/authContext'
import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

export default function Index() {
  const { loged, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    )
  }

  if (loged) {
    return <Redirect href="/(stack)/homeScreen" />
  }

  return <Redirect href="/login" />
}
