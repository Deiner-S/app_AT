import { SyncProvider } from '@/contexts/syncContext';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <SyncProvider>
      <Stack screenOptions={{ headerShown: false }}/>
    </SyncProvider>
  );
}
