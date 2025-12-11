import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  // variável temporária só para teste
  const status = "Pendente";

  return (
    <View style={styles.container}>
        <Text>Texto</Text>
        <Link href={"/proxima"}>teste</Link>
        <Pressable
        onPress={() => console.log("Card clicado!")}
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

