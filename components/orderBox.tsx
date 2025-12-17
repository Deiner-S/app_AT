import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface OsCardProps {
  id: number;
  osNumber: string | number;
  status: "Pendente" | "Concluída" | string;
}

export default function OsCard({ id, osNumber, status }: OsCardProps) {
  const navigation = useNavigation<any>();

  const statusColor = status === "Pendente" ? "red" : "green";

  return (
    <View>
      <Pressable
        onPress={() => navigation.navigate("Details", { id })}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressablePressed,
          pressed && { transform: [{ scale: 0.97 }] },
        ]}
      >
        <View style={styles.row}>
          <Text style={styles.text}>OS: {osNumber}</Text>
          <Text style={[styles.text, { color: statusColor }]}>
            Status: {status}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    elevation: 2,
  },
  pressablePressed: {
    opacity: 0.9,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
});
