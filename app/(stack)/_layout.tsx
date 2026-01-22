import { useSync } from '@/contexts/syncContext';
import { MaterialIcons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import CheckList from './checklist';
import Index from './index';


const Stack = createNativeStackNavigator();
export default function StackNavigator() {

  const { runSync } = useSync();
  
  return (    
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Index}
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={runSync}>
              <MaterialIcons
                name="sync"
                size={24}
                color="#000"
                />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="Check list" component={CheckList} />
    </Stack.Navigator>    
  );
}
