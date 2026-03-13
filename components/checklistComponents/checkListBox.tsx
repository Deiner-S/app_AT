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
    selected === "2" ? "Médio" :
    selected === "3" ? "Ruim" :
    "Não informado";

  return (
    
    <View style={styles.checklist_container}>
      <Text style={styles.checklistText}>{checkList}</Text>

      <View style={styles.row}>
        {readOnlyStatus ? (
          <View style={styles.statusBadge}>
            <Text style={styles.statusLabel}>{statusLabel}</Text>
          </View>
        ) : (
          <Picker
            selectedValue={selected}
            onValueChange={(itemValue) => setSelected?.(itemValue)}
            dropdownIconColor="white"
            style={styles.picker}
          >
            <Picker.Item label="Conservação ?" value={null} />
            <Picker.Item label="Bom" value="1" />
            <Picker.Item label="Médio" value="2" />
            <Picker.Item label="Ruim" value="3" />
          </Picker>
        )}

        <Pressable onPress={handleTakePhoto} style={styles.button}>
          <Ionicons name="camera-outline" size={20} color="#333" />
          <Text>{photoButtonLabel}</Text>
        </Pressable>

        {photoAttached && selected != null && (
          <Ionicons
            style={{ margin: 5 }}
            name="checkmark-circle"
            size={26}
            color="green"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    checklist_container: {        
        borderColor: '#3a3f45',
        borderWidth: 1,
        borderRadius: 8,
        backgroundColor: '#2e3238',
        overflow: 'hidden',
    },
    checklistText: {
        paddingLeft: 10,
        marginBottom: 6,
        fontSize: 16,
        color: "#000",
        backgroundColor: "#fff"
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    picker: {
        color: "white",
        width: 200,
    },
    statusBadge: {
      minWidth: 120,
      marginLeft: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: "#3a3f45",
    },
    statusLabel: {
      color: "#fff",
      fontWeight: "600",
    },
    button: {
        marginLeft: "auto",
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: "#eee",
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
});
