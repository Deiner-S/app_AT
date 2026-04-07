import * as SecureStore from 'expo-secure-store';

import type { DashboardPayload } from '@/services/management';

const SESSION_KEY = 'dashboard_session_snapshot';

export async function getSessionStorange(): Promise<DashboardPayload | null> {
  const stored = await SecureStore.getItemAsync(SESSION_KEY);
  return stored ? (JSON.parse(stored) as DashboardPayload) : null;
}

export async function saveSessionStorange(session: DashboardPayload): Promise<void> {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session));
}

export async function clearSessionStorange(): Promise<void> {
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
