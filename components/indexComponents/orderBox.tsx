import WorkOrder from "@/models/WorkOrder";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface OsCardProps {
  item: WorkOrder
}

export default function OsCard({ item }: OsCardProps) {
  const navigation = useNavigation<any>();
  return (
      <Pressable    
        onPress={() => navigation.navigate('Check list', { workOrder: item})}
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressablePressed,
          pressed && { transform: [{ scale: 0.97 }] },
        ]}>
      
        <View style={styles.row}>         
          <Text style={[styles.text, styles.operationCode]}>OS - {item.operation_code}</Text>      
          <Text
            style={[
              styles.status,
              item.status === 'Pendente'
                ? styles.statusPendente
                : styles.statusFinalizado,
            ]}
            >{item.status}
          </Text>         
        </View>

      </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  pressablePressed: {
    opacity: 0.85,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  text: {
    color: '#1c1c1e',
  },

  operationCode: {
    fontSize: 16,
    fontWeight: '600',
  },

  status: {
    fontSize: 14,
    fontWeight: '500',
  },

  statusPendente: {
    color: '#e53935',
  },

  statusFinalizado: {
    color: '#43a047',
  },
});
