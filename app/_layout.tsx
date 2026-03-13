
import RequestLoadingOverlay from '@/components/requestLoadingOverlay';
import { AuthProvider } from '@/contexts/authProvider';
import { RequestLoadingProvider } from '@/contexts/requestLoadingContext';
import { SyncProvider } from '@/contexts/syncContext';
import { Slot } from 'expo-router';
import 'react-native-get-random-values';
import { StyleSheet, View } from 'react-native';

export default function RootLayout() {
  return (
    <RequestLoadingProvider>
      <AuthProvider>
        <SyncProvider>
          <View style={styles.container}>
            <Slot />
            <RequestLoadingOverlay />
          </View>
        </SyncProvider>
      </AuthProvider>
    </RequestLoadingProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
