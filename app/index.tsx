import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Tipagem das rotas do Stack
type StackParamList = {
  Home: undefined;
  Details: { id: number }; // se quiser passar parâmetros
};

type HomeScreenNavigationProp = NativeStackNavigationProp<StackParamList, 'Home'>;

export default function Index() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const status = "Pendente";

  return (
    
    <SafeAreaView style={{ flex: 1 }}edges={['left', 'right', 'bottom']}>      
          <View style={styles.container}>              
              <Pressable
                onPress={() => navigation.navigate('Details', { id: 42 })}
                style={({ pressed }) => [           // 🔹 style agora é uma função que recebe o estado "pressed"
                  styles.Pressable,
                  pressed && styles.PressablePressed, // 🔹 aplica estilo enquanto o card está pressionado
                  pressed && { transform: [{ scale: 0.97 }] }, // 🔹 efeito de “afundar” levemente ao clicar
                ]}
              >
                <View style={styles.row}>
                  <Text style={styles.text}>OS: 72356</Text>
                  <Text style={[styles.text, { color: status === "Pendente" ? "red" : "green" }]}>
                    Status: {status}
                  </Text>
                </View>
            </Pressable>            
          </View>      
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#ffff",
    alignItems: "center",
    justifyContent:"center"
  },

  Pressable: {
    position: "absolute",
    bottom: 40,
    right: 20,
    left: 20,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  PressablePressed: {                    // 🔹 novo estilo aplicado enquanto o card está pressionado
    opacity: 0.6,                        // 🔹 reduz a opacidade para dar feedback visual
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
})

