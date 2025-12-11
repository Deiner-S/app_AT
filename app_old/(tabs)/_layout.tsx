import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from "expo-router";
export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
          backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#25292e',
        },
      }}
    >
    <Tabs.Screen
      name="form"
      options={{
        title: 'Form',
        tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'settings-sharp' : 'settings-outline'} color={color} size={24} />),
      }}/>

    <Tabs.Screen
      name="teste"
      options={{
        title: 'Teste',
        tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'search-sharp' : 'search-outline'} color={color} size={24} />),
      }}/>

    <Tabs.Screen
      name="index"
      options={{
        title: 'Home',
        tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />),
      }}/>
    </Tabs>
  );
}
