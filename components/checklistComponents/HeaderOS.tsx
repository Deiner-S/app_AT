import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import {
  sanitizeOnlyLettersAndNumbers,
  sanitizeOnlyNumbers,
} from "@/utils/validation";

interface CabecalhoOSProps {
  client: string;
  operation_code: string;
  symptoms: string;
  chassi: string;
  setChassi: (value: string) => void;
  orimento: number;
  setOrimento: (value: string) => void;
  modelo: string;
  setModelo: (value: string) => void;
  dateFilled: Date;
  openCalendar: boolean;
  setOpen: (value: boolean) => void;
  onChange: (_event: any, selectedDate?: Date) => void;
}

export default function HeaderOS({
  client,
  operation_code,
  symptoms,
  chassi,
  setChassi,
  orimento,
  setOrimento,
  modelo,
  setModelo,
  dateFilled,
  openCalendar,
  setOpen,
  onChange,
}: CabecalhoOSProps) {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Dados da OS</Text>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Cliente</Text>
          <Text style={styles.text}>{client}</Text>
        </View>

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Ordem de servico</Text>
          <Text style={styles.text}>{operation_code}</Text>
        </View>

        <View style={styles.infoBlockLast}>
          <Text style={styles.label}>Problema relatado</Text>
          <Text style={styles.text}>{symptoms}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preenchimento</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Chassi</Text>
          <TextInput
            style={styles.input}
            placeholder="Informe o chassi"
            placeholderTextColor="#64748b"
            value={chassi}
            onChangeText={(value) => setChassi(sanitizeOnlyLettersAndNumbers(value).toUpperCase())}
            autoCapitalize="characters"
            maxLength={17}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Horimetro</Text>
          <TextInput
            style={styles.input}
            placeholder="Informe o horimetro"
            placeholderTextColor="#64748b"
            value={String(orimento ?? "")}
            onChangeText={(value) => setOrimento(sanitizeOnlyNumbers(value))}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Modelo</Text>
          <TextInput
            style={styles.input}
            placeholder="Informe o modelo"
            placeholderTextColor="#64748b"
            value={modelo}
            onChangeText={(value) => setModelo(sanitizeOnlyLettersAndNumbers(value))}
          />
        </View>

        <View>
          <Text style={styles.label}>Data</Text>
          <Pressable
            onPress={() => setOpen(true)}
            style={({ pressed }) => [styles.dateButton, pressed && styles.buttonPressed]}
          >
            <Text style={styles.dateText}>{dateFilled.toLocaleDateString("pt-BR")}</Text>
          </Pressable>
        </View>

        {openCalendar && (
          <DateTimePicker
            value={dateFilled}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}
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
  infoBlock: {
    marginBottom: 14,
  },
  infoBlockLast: {
    marginBottom: 0,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    color: "#94a3b8",
    marginBottom: 6,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  text: {
    color: "#e2e8f0",
    backgroundColor: "rgba(30, 41, 59, 0.82)",
    padding: 14,
    borderRadius: 16,
    lineHeight: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    color: "#f8fafc",
    fontSize: 16,
  },
  dateButton: {
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  dateText: {
    color: "#e2e8f0",
    fontSize: 15,
    fontWeight: "600",
  },
  buttonPressed: {
    opacity: 0.88,
  },
});
