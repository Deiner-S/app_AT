import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ChecklistItemProps {
  checkList: string;
  selected: string | null;
  setSelected?: (value: string | null) => void;
  handleTakePhoto: () => void;
  photoAttached?: boolean;
  readOnlyStatus?: boolean;
  photoButtonLabel?: string;
}

export default function ChecklistBox({
  checkList,
  selected,
  setSelected,
  handleTakePhoto,
  photoAttached,
  readOnlyStatus = false,
  photoButtonLabel = "Foto",
}: ChecklistItemProps) {
  const statusLabel =
    selected === "1" ? "Bom" :
    selected === "2" ? "Medio" :
    selected === "3" ? "Ruim" :
    "Nao informado";

  return (
    <View style={styles.container}>
      <Text style={styles.checklistText}>{checkList}</Text>

      <View style={styles.row}>
        {readOnlyStatus ? (
          <View style={styles.statusBadge}>
            <Text style={styles.statusLabel}>{statusLabel}</Text>
          </View>
        ) : (
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={selected}
              onValueChange={(itemValue) => setSelected?.(itemValue)}
              dropdownIconColor="#cbd5e1"
              style={styles.picker}
            >
              <Picker.Item label="Conservacao?" value={null} />
              <Picker.Item label="Bom" value="1" />
              <Picker.Item label="Medio" value="2" />
              <Picker.Item label="Ruim" value="3" />
            </Picker>
          </View>
        )}

        <Pressable onPress={handleTakePhoto} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Ionicons name="camera-outline" size={20} color="#e2e8f0" />
          <Text style={styles.buttonText}>{photoButtonLabel}</Text>
        </Pressable>

        {photoAttached && selected != null ? (
          <Ionicons
            style={styles.photoAttachedIcon}
            name="checkmark-circle"
            size={26}
            color="#22c55e"
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: "rgba(148, 163, 184, 0.12)",
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: "rgba(15, 23, 42, 0.82)",
    overflow: "hidden",
    padding: 16,
    marginBottom: 12,
  },
  checklistText: {
    fontSize: 16,
    color: "#f8fafc",
    fontWeight: "700",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
  },
  pickerWrap: {
    flex: 1,
    minWidth: 190,
    borderRadius: 16,
    backgroundColor: "rgba(30, 41, 59, 0.86)",
    overflow: "hidden",
  },
  picker: {
    color: "#e2e8f0",
  },
  statusBadge: {
    minWidth: 130,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(14, 165, 233, 0.14)",
  },
  statusLabel: {
    color: "#bae6fd",
    fontWeight: "700",
    textAlign: "center",
  },
  button: {
    marginLeft: "auto",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(30, 41, 59, 0.86)",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 184, 0.12)",
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonText: {
    color: "#e2e8f0",
    fontWeight: "600",
  },
  photoAttachedIcon: {
    marginLeft: 2,
  },
});
