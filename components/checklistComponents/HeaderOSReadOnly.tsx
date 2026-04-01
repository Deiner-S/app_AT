import WorkOrder from "@/models/WorkOrder";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface HeaderOSReadOnlyProps {
  workOrder: WorkOrder;
}

function formatDate(value: string | undefined): string {
  if (!value) return "--";
  try {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-BR");
  } catch {
    return value;
  }
}

export default function HeaderOSReadOnly({ workOrder }: HeaderOSReadOnlyProps) {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resumo da OS</Text>

        <Text style={styles.label}>Cliente</Text>
        <Text style={styles.text}>{workOrder.client}</Text>

        <Text style={styles.label}>Ordem de servico</Text>
        <Text style={styles.text}>{workOrder.operation_code}</Text>

        <Text style={styles.label}>Problema relatado</Text>
        <Text style={styles.textLast}>{workOrder.symptoms}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados do equipamento</Text>

        <Text style={styles.label}>Chassi</Text>
        <Text style={styles.text}>{workOrder.chassi ?? "--"}</Text>

        <Text style={styles.label}>Horimetro</Text>
        <Text style={styles.text}>
          {workOrder.horimetro !== undefined && workOrder.horimetro !== null
            ? String(workOrder.horimetro)
            : "--"}
        </Text>

        <Text style={styles.label}>Modelo</Text>
        <Text style={styles.text}>{workOrder.model ?? "--"}</Text>

        <Text style={styles.label}>Data de entrada</Text>
        <Text style={styles.textLast}>{formatDate(workOrder.date_in)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 14,
  },
  section: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  sectionTitle: {
    color: "#f8fafc",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 14,
  },
  label: {
    color: "#94a3b8",
    marginBottom: 6,
    marginTop: 2,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  text: {
    color: "#e2e8f0",
    backgroundColor: "rgba(30, 41, 59, 0.82)",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    lineHeight: 20,
  },
  textLast: {
    color: "#e2e8f0",
    backgroundColor: "rgba(30, 41, 59, 0.82)",
    padding: 14,
    borderRadius: 16,
    lineHeight: 20,
  },
});
