import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { Button, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Proxima() {
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);
    const [chassi, setChassi] = useState("");
    const [orimento, setOrimento] = useState("");
    const [modelo, setModelo] = useState("");
    const [selected, setSelected] = useState();
    const [photoUri, setPhotoUri] = useState<string | null>(null);

    const operation_code = "OS-45872";
    const symptoms = "Equipamento não liga ao pressionar o botão.";
    const client = "Empresa Atlas Tecnologia – Unidade SP";
    const checkList = "titulo checklist"
    const saveData = () => {
      console.log('Salvo')
    }


  function onChange(_event: any, selectedDate?: Date) {
    setOpen(false);
    if (selectedDate) setDate(selectedDate);
  }

  async function handleTakePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      alert("Permita o acesso à câmera para tirar fotos.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri)
      
    }
  }

  const checklistItems = [
    { id: 1, name: "Conservação" },
    { id: 2, name: "Integridade da Embalagem" },
    { id: 3, name: "Higiene Geral" },
    { id: 4, name: "Ruído / Vibração" },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['left', 'right', 'bottom']}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ flex: 1 }}>
          <View style={styles.content}>
            <Text style={{ color: "#fff", marginBottom: 6, fontSize: 14 }}>Cliente:</Text>
            <Text style={styles.text}>{client}</Text>
            <Text style={{ color: "#fff", marginBottom: 6, fontSize: 14 }}>Ordem de Serviço:</Text>
            <Text style={styles.text}>{operation_code}</Text>
            <Text style={{ color: "#fff", marginBottom: 6, fontSize: 14 }}>Problema relatado:</Text>
            <Text style={styles.text}>{symptoms}</Text>
            <TextInput
              style={styles.input}
              placeholder="Chassi"
              placeholderTextColor="#8e8e93"
              value={chassi}
              onChangeText={setChassi}
              />
            <TextInput
              style={styles.input}
              placeholder="Orimento"
              placeholderTextColor="#8e8e93"
              value={orimento}
              onChangeText={setOrimento}
              />
            <TextInput
              style={styles.input}
              placeholder="Modelo"
              placeholderTextColor="#8e8e93"
              value={modelo}
              onChangeText={setModelo}
            />
            

            <Pressable
              onPress={() => setOpen(true)}
              style={{
                backgroundColor: "#2e3238",
                padding: 12,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#3a3f45",
              }}
              >
              <Text style={{ color: "#fff" }}>
                {date.toLocaleDateString("pt-BR")}
              </Text>
            </Pressable>

            {open && (
              <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChange}
              />
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.checklist_container}>
            <Text style={{ paddingLeft: 10, color: "#0000", marginBottom: 6, fontSize: 16, backgroundColor: "#fff" }}>{checkList}</Text>
            <View style={{ 
              alignItems: "center",
              flex: 1,
              flexDirection: "row",}}>
                <Picker
                  selectedValue={selected}
                  onValueChange={(itemValue) => setSelected(itemValue)}
                  dropdownIconColor="white" // ícone da setinha
                  style={{
                    color: 'white',
                    width:200
                    
                  }}
                  >
                  <Picker.Item label="Conservação ?" value={null} />
                  <Picker.Item label="Opção A" value="a" />
                  <Picker.Item label="Opção B" value="b" />
                  <Picker.Item label="Opção C" value="c" />
                </Picker>
                <Pressable
                  onPress={handleTakePhoto}
                  style={{
                    marginLeft: "auto",
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    backgroundColor: "#eee",
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Ionicons name="camera-outline" size={20} color="#333" />
                  <Text>Foto</Text>
                </Pressable>
                    {photoUri && (                      
                      <Ionicons
                      style={{margin:5}}
                        name="checkmark-circle" 
                        size={26} 
                        color="green" 
                      />
                    )}
              </View>
          </View >

          <View style={styles.content}>
            <Button title="Salvar" onPress={saveData}></Button>
          </View>
        </View>
      </ScrollView>
  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    paddingHorizontal: 24,
    paddingTop: 32,
    
  },

  content: {
    flex:1,
    gap: 16,
    padding:6
  },
  text:{
    color: "#ccc",
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#3a3f45',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#2e3238',
    color: '#fff',
    fontSize: 16,

    // leve profundidade (suave e elegante)
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    
  },

  checklist_container: {
    borderColor: '#3a3f45',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#2e3238',
    overflow: 'hidden',
  },

  text_color:{
    color: "#ccc",
  },

  divider: {
    height: 2,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.2)", // levemente opaca
    borderRadius: 2,
    marginVertical: 12,
  },
});

