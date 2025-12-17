import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ChecklistItemProps {
  checkList: string;
  selected: string | null;
  setSelected: (value: string | null) => void;
  handleTakePhoto: () => void;
  photoUri?: string | null;
}

export default function ChecklistItem({
  checkList,
  selected,
  setSelected,
  handleTakePhoto,
  photoUri,
}: ChecklistItemProps) {
  return (
    
    <View style={styles.checklist_container}>
      <Text style={styles.checklistText}>{checkList}</Text>

      <View style={styles.row}>
        <Picker
          selectedValue={selected}
          onValueChange={(itemValue) => setSelected(itemValue)}
          dropdownIconColor="white"
          style={styles.picker}
        >
          <Picker.Item label="Conservação ?" value={null} />
          <Picker.Item label="Opção A" value="a" />
          <Picker.Item label="Opção B" value="b" />
          <Picker.Item label="Opção C" value="c" />
        </Picker>

        <Pressable onPress={handleTakePhoto} style={styles.button}>
          <Ionicons name="camera-outline" size={20} color="#333" />
          <Text>Foto</Text>
        </Pressable>

        {photoUri && (
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
