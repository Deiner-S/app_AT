import { useAuth } from '@/contexts/authContext'
import { Pressable, StyleSheet, Text, View } from 'react-native'

export default function Login() {
  console.log('LOGIN RENDERIZOU')
  const { login } = useAuth()

  async function handleLogin() {
    console.log('Login Efetuado')
    // await login('usuario', 'senha')
  }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handleLogin}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.text}>Entrar</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    elevation: 3, // Android sombra
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.85,
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
