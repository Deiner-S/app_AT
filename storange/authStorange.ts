import * as SecureStore from 'expo-secure-store'


export type AuthTokens = {
  access: string
  refresh: string
}
const TOKEN_KEY = 'auth_token'

export async function getToken(): Promise<AuthTokens | null> {
  const stored = await SecureStore.getItemAsync(TOKEN_KEY)
  return stored ? (JSON.parse(stored) as AuthTokens) : null
}

export async function saveToken(authTokens: AuthTokens): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, JSON.stringify(authTokens))
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY)
}
